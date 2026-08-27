// lib/solanaRpc.js
//
// A resilient wrapper around Solana RPC calls, built specifically to
// squeeze more reliability out of FREE-TIER RPC providers — which have
// real limits (see Helius's own dashboard: "Free plan performance is
// limited"). This does NOT remove the underlying risk of using a free
// tier in production; it just makes single rate-limit hits recoverable
// instead of an immediate hard failure in front of a real user.
//
// If you outgrow this (frequent fallback-endpoint usage in logs, or
// mint/purchase volume climbing), that's the signal to upgrade to a
// paid plan — this is a mitigation, not a replacement for capacity.

import { Connection } from "@solana/web3.js";

// Ordered by preference — your paid/primary key first, then public
// fallbacks. Public endpoints are heavily shared and rate-limited too,
// so treat them as a last resort, not a real substitute.
const RPC_ENDPOINTS = [
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  "https://api.mainnet-beta.solana.com",
].filter(Boolean);

const RETRY_DELAYS_MS = [500, 1500, 3500]; // exponential-ish backoff between attempts on the SAME endpoint

function isRateLimitOrAccessError(err) {
  const msg = (err?.message || String(err) || "").toLowerCase();
  return msg.includes("403") || msg.includes("429") || msg.includes("forbidden") || msg.includes("rate limit") || msg.includes("too many requests");
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs `fn(connection)` against each configured RPC endpoint in order,
 * retrying the SAME endpoint a few times with backoff before moving to
 * the next one. Throws the last error if every endpoint/attempt fails.
 *
 * Usage:
 *   const balance = await withRpcFallback((connection) =>
 *     connection.getBalance(pubkey)
 *   );
 */
export async function withRpcFallback(fn) {
  let lastError;

  for (const endpoint of RPC_ENDPOINTS) {
    const connection = new Connection(endpoint, "confirmed");

    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      try {
        return await fn(connection);
      } catch (err) {
        lastError = err;

        const isLastAttemptOnThisEndpoint = attempt === RETRY_DELAYS_MS.length;
        if (!isRateLimitOrAccessError(err) || isLastAttemptOnThisEndpoint) {
          // Not a rate-limit error (some other real failure — don't
          // waste retries on it), or we've exhausted retries on this
          // endpoint — move on to the next endpoint immediately.
          break;
        }

        console.warn(
          `RPC call rate-limited on ${endpoint} (attempt ${attempt + 1}/${RETRY_DELAYS_MS.length + 1}), retrying in ${RETRY_DELAYS_MS[attempt]}ms...`
        );
        await sleep(RETRY_DELAYS_MS[attempt]);
      }
    }

    console.warn(`Falling back to next RPC endpoint after exhausting retries on ${endpoint}`);
  }

  throw lastError || new Error("All RPC endpoints failed.");
}

/**
 * Returns an object with the same shape as a real Connection (same
 * method names), but every method call is retried with backoff and,
 * if the current endpoint keeps failing, permanently switches to the
 * next endpoint for the REST of this object's lifetime — so a whole
 * transaction-building flow (getAccountInfo → getLatestBlockhash →
 * sendRawTransaction → confirmTransaction) stays on one consistent
 * endpoint at a time, instead of every call picking independently.
 *
 * Drop-in replacement for `new Connection(rpcUrl, "confirmed")` in
 * existing code — just swap the constructor call, nothing else needs
 * to change.
 *
 *   const connection = createResilientConnection(rpcUrl);
 *   const info = await connection.getAccountInfo(pubkey);   // same API
 */
export function createResilientConnection(preferredUrl) {
  const endpoints = [preferredUrl, ...RPC_ENDPOINTS].filter(
    (url, i, arr) => url && arr.indexOf(url) === i // de-dupe, drop empties
  );
  if (endpoints.length === 0) {
    throw new Error("No Solana RPC endpoint available.");
  }

  let currentIndex = 0;
  let currentConnection = new Connection(endpoints[0], "confirmed");

  async function callWithResilience(methodName, args) {
    let lastError;

    while (currentIndex < endpoints.length) {
      for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
        try {
          return await currentConnection[methodName](...args);
        } catch (err) {
          lastError = err;
          const isLastAttemptHere = attempt === RETRY_DELAYS_MS.length;

          if (!isRateLimitOrAccessError(err) || isLastAttemptHere) {
            break; // real error, or out of retries on this endpoint
          }
          console.warn(
            `[${methodName}] rate-limited on ${endpoints[currentIndex]} (attempt ${attempt + 1}), retrying in ${RETRY_DELAYS_MS[attempt]}ms...`
          );
          await sleep(RETRY_DELAYS_MS[attempt]);
        }
      }

      // Exhausted retries on this endpoint — permanently move to the
      // next one for the rest of this connection's lifetime.
      currentIndex++;
      if (currentIndex < endpoints.length) {
        console.warn(`Switching RPC endpoint: ${endpoints[currentIndex - 1]} → ${endpoints[currentIndex]}`);
        currentConnection = new Connection(endpoints[currentIndex], "confirmed");
      }
    }

    throw lastError || new Error("All RPC endpoints failed.");
  }

  // Only the methods actually used across the mint/purchase flows are
  // wrapped here — add more as needed if other Connection methods get
  // used elsewhere. Anything not listed falls through to the real
  // connection directly (no retry, but still works).
  const wrappedMethods = [
    "getAccountInfo", "getBalance", "getLatestBlockhash",
    "sendRawTransaction", "confirmTransaction", "getTokenAccountsByOwner",
    "getParsedTokenAccountsByOwner", "getSignatureStatuses", "getTokenAccountBalance",
  ];

  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (wrappedMethods.includes(prop)) {
          return (...args) => callWithResilience(prop, args);
        }
        // Fall through to the live underlying connection for anything
        // not explicitly wrapped (e.g. .rpcEndpoint, less-common methods).
        const value = currentConnection[prop];
        return typeof value === "function" ? value.bind(currentConnection) : value;
      },
    }
  );
}

// ── Simple in-memory cache for read-only lookups that don't change
// often within a single page session (e.g. "is this mint Token-2022 or
// legacy?"). Cuts down on redundant calls to the same endpoint, which
// is one of the easiest wins against a free-tier rate limit — a single
// purchase flow currently re-checks things like this more than once.
const shortLivedCache = new Map();
const CACHE_TTL_MS = 60_000;

export async function withShortCache(key, fn) {
  const cached = shortLivedCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.value;
  }
  const value = await fn();
  shortLivedCache.set(key, { value, at: Date.now() });
  return value;
}
