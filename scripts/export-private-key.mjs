// Converts devnet-authority.json (raw 64-byte array) into the base58
// string format Phantom/Solflare's "Import Private Key" expects.
//
// Usage: node scripts/export-private-key.mjs

import fs from "fs";
import bs58 from "bs58";

const secret = JSON.parse(fs.readFileSync("./devnet-authority.json", "utf8"));
const base58Key = bs58.encode(Uint8Array.from(secret));

console.log("\nPaste this into Phantom/Solflare's 'Import Private Key':\n");
console.log(base58Key);
console.log("\n(This is the SAME wallet as devnet-authority.json — just re-encoded for wallet import.)\n");
