import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const BANK_DETAILS = [
  { label: "Bank Name", value: "LCL Bank France" },
  { label: "Account Name", value: "Sas Affin (Scotty Pumpkin Administration)" },
  { label: "Account Number", value: "FR10 3000 2030 3700 0007 3122 J65" },
  { label: "Bank Code (BIC)", value: "CRLYFRPP" },
];

const DEFAULT_SPUMP_PRICE_USD = 0.01;
const DEFAULT_EUR_TO_USD = 1.1;
const SPUMP_TOKEN = "AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT";

const COUNTRY_CODES = [
  { code: "+33", flag: "FR" },
  { code: "+44", flag: "UK" },
  { code: "+1", flag: "US" },
  { code: "+49", flag: "DE" },
  { code: "+92", flag: "PK" },
  { code: "+880", flag: "BD" },
  { code: "+91", flag: "IN" },
  { code: "+971", flag: "AE" },
  { code: "+966", flag: "SA" },
  { code: "+90", flag: "TR" },
];

function generateRefNo() {
  return "SP-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function BankPurchase() {
  const [isMounted, setIsMounted] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(true);
  const [calcSpumpCount, setCalcSpumpCount] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileCode: "+33",
    mobile: "",
    walletAddress: "",
    amount: "",
    receipt: null,
  });
  const [receiptName, setReceiptName] = useState("");
  const [copied, setCopied] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [refNo] = useState(() => generateRefNo());
  const [spumpPriceUsd, setSpumpPriceUsd] = useState(DEFAULT_SPUMP_PRICE_USD);
  const [eurToUsd, setEurToUsd] = useState(DEFAULT_EUR_TO_USD);
  const fileRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    async function fetchSpumpPrice() {
      try {
        const response = await fetch(
          `https://api-v3.raydium.io/mint/price?mints=${SPUMP_TOKEN}`,
          { cache: "no-store" },
        );
        if (!response.ok) return;

        const data = await response.json();
        if (data?.success === true) {
          const price = Number(
            data?.data?.AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT,
          );
          if (Number.isFinite(price) && price > 0) {
            setSpumpPriceUsd(price);
          }
        }
      } catch {
        // Keep fallback price.
      }
    }

    async function fetchEurUsdRate() {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/EUR",
          { cache: "no-store" },
        );
        if (!response.ok) return;

        const data = await response.json();
        const rate = Number(data?.rates?.USD || 0);
        if (Number.isFinite(rate) && rate > 0) {
          setEurToUsd(rate);
        }
      } catch {
        // Keep fallback FX rate.
      }
    }

    fetchSpumpPrice();
    fetchEurUsdRate();
  }, [isMounted]);

  const calcUsdAmount = calcSpumpCount
    ? (parseFloat(calcSpumpCount) * spumpPriceUsd).toFixed(2)
    : "0.00";
  const calcEurAmount = calcSpumpCount
    ? (parseFloat(calcUsdAmount) / eurToUsd).toFixed(2)
    : "0.00";
  const displaySpumpCount = calcSpumpCount ? parseInt(calcSpumpCount) : 0;

  // Auto-update form amount when currency selection or spump count changes
  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    const amount = currency === "USD" ? calcUsdAmount : calcEurAmount;
    setField("amount", amount);
  };

  // Auto-update amount when SPUMP count changes
  const handleSpumpChange = (value) => {
    setCalcSpumpCount(value);
    if (value) {
      const newUsdAmount = (parseFloat(value) * spumpPriceUsd).toFixed(2);
      const newEurAmount = (newUsdAmount / eurToUsd).toFixed(2);
      const amount = selectedCurrency === "USD" ? newUsdAmount : newEurAmount;
      setField("amount", amount);
    } else {
      setField("amount", "");
    }
  };

  function setField(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function copyField(key, val) {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setField("receipt", file);
    setReceiptName(file.name);
  }

  async function handleSubmit() {
    if (!isFormValid) return;

    setSubmitError("");
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("email", form.email);
      payload.append("name", form.fullName);
      payload.append("receipt", form.receipt);
      payload.append("referenceNo", refNo);
      payload.append("mobileCode", form.mobileCode);
      payload.append("mobile", form.mobile);
      payload.append("userAmount", String(form.amount));
      payload.append("spumpCount", String(displaySpumpCount));
      payload.append("walletAddress", form.walletAddress);

      const response = await fetch("/api/bank-transfer", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        let message = "Failed to submit bank purchase application.";
        try {
          const data = await response.json();
          if (data?.message) message = data.message;
        } catch {
          // Keep fallback message when upstream does not return JSON.
        }
        throw new Error(message);
      }

      setSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      setSubmitting(false);
      setSubmitError(error.message || "Unable to submit at the moment.");
    }
  }

  const isFormValid =
    form.fullName &&
    form.email &&
    form.mobile &&
    form.walletAddress &&
    form.amount &&
    form.receipt;

  if (submitted) {
    return (
      <section className="z-10 min-h-[60vh] px-4 py-16 flex items-center justify-center">
        <div className="relative w-full max-w-md rounded-3xl border border-emerald-400/35 bg-white/5 backdrop-blur-2xl p-8 text-center ">
          <div className="text-6xl mb-3">🎃</div>
          <h2 className="text-2xl font-black text-amber-300">
            Application Submitted!
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/60">
            Your bank transfer application has been submitted for admin
            verification. After payment clearance (up to 7 days), SPUMP tokens
            will be sent to your Solana wallet.
          </p>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">
              Reference Number
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-amber-300">
              {refNo}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-white/35">
                Amount
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                ${form.amount} USD
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-white/35">
                SPUMP
              </p>
              <p className="mt-1 text-sm font-semibold text-amber-300">
                {displaySpumpCount.toLocaleString()}
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs text-white/35">
            Thank you for your patience as we maintain security and compliance.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {showRiskModal &&
        isMounted &&
        createPortal(
          <>
            <div className="fixed inset-0 z-120 bg-black/70 backdrop-blur-sm px-4 py-8 flex items-center justify-center">
              <div className="w-full max-w-lg rounded-3xl border border-amber-400/40 bg-white px-7 py-5  mt-5!">
                <div className="text-center space-y-3">
                  <div className="text-5xl">⚠️</div>
                  <h2 className="text-2xl font-black text-primary">
                    Crypto Risk Notice
                  </h2>
                  <div className="text-left rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-secondary/80">
                    <p className="mb-2">
                      SPUMP and USFF are blockchain utility tokens and crypto
                      coins used in their ecosystems.
                    </p>
                    <p className="mb-2">
                      Cryptocurrency markets are{" "}
                      <span className="font-bold text-primary">volatile</span>{" "}
                      and involve risk. Values can rise or fall and returns are
                      not guaranteed.
                    </p>
                    <p className="mb-2">
                      These tokens do{" "}
                      <span className="font-bold text-red-500">not</span>{" "}
                      represent securities, shares, or financial instruments.
                    </p>
                    <p>
                      Ensure cryptocurrency use is{" "}
                      <span className="font-bold text-primary">
                        permitted in your jurisdiction
                      </span>
                      .
                    </p>
                  </div>
                  <p className="text-xs text-secondary/70">
                    By continuing, you confirm that you understand the risks
                    associated with digital assets.
                  </p>
                  <button
                    onClick={() => setShowRiskModal(false)}
                    className="w-full rounded-xl border border-primary bg-primary/90 px-5 py-3.5 text-sm font-bold text-white hover:bg-primary transition duration-300 cursor-pointer">
                    I Understand - Proceed
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}

      <section className="z-10 px-4 py-10 md:py-14 lg:px-10">
        <div className="mx-auto max-w-2xl space-y-6 relative">
          <div className="text-center space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              Buy SPUMP Directly
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary">
              Get SPUMP via Bank Transfer
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-7 text-secondary/80">
              Transfer to our bank account, upload your receipt, and receive
              SPUMP tokens within 7 business days.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              How It Works
            </p>
            <div className="space-y-3">
              {[
                "Transfer to our bank details listed below.",
                "Download your transfer receipt from your bank.",
                "Fill out the application form and upload your receipt.",
                "After verification and clearance (up to 7 days), SPUMP tokens are sent to your wallet.",
              ].map((text, index) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="mt-0.5 h-7 w-7 shrink-0 rounded-md border border-primary bg-primary text-white text-xs font-black flex items-center justify-center">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-secondary/80">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white bg-white/80 p-5 space-y-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-secondary">
              SPUMP Calculator
            </p>
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-indigo-300/25 bg-white/80 px-4 py-3">
                <input
                  type="number"
                  min="0"
                  value={calcSpumpCount}
                  onChange={(event) => handleSpumpChange(event.target.value)}
                  placeholder="Enter SPUMP count"
                  className="w-full bg-transparent text-secondary/80 placeholder:text-secondary/80 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCurrencySelect("USD")}
                  className={`flex-1 rounded-lg px-4 py-2 font-bold text-sm uppercase tracking-wide transition-all duration-300 ${
                    selectedCurrency === "USD"
                      ? "bg-primary border border-primary text-white"
                      : "bg-secondary border border-secondary hover:border-primary text-white hover:bg-primary"
                  }`}
                  suppressHydrationWarning>
                  USD: ${calcUsdAmount}
                </button>
                <button
                  onClick={() => handleCurrencySelect("EUR")}
                  className={`flex-1 rounded-lg px-4 py-2 font-bold text-sm uppercase tracking-wide transition-all duration-300 ${
                    selectedCurrency === "EUR"
                      ? "bg-primary border border-primary text-white"
                      : "bg-secondary border border-secondary hover:border-primary text-white hover:bg-primary"
                  }`}
                  suppressHydrationWarning>
                  EUR: €{calcEurAmount}
                </button>
              </div>
            </div>
            <p className="text-xs text-white/40" suppressHydrationWarning>
              Rate: 1 SPUMP = ${spumpPriceUsd.toFixed(6)} USD | 1 EUR = $
              {eurToUsd.toFixed(4)} USD
            </p>
          </div>

          <div className="rounded-2xl border border-amber-400/30 bg-white/80 p-6 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              Bank Transfer Details
            </p>
            <p className="text-xs text-secondary">
              Please transfer payment to the account below:
            </p>
            <div className="space-y-2">
              {BANK_DETAILS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-secondary/70">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-secondary/80 break-all">
                      {item.value}
                    </p>
                  </div>
                  <button
                    onClick={() => copyField(item.label, item.value)}
                    className="shrink-0 rounded-md border border-primary bg-primary/90 px-3 py-1 text-xs font-bold text-white hover:bg-primary">
                    {copied[item.label] ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/80 p-6 space-y-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
                Transfer Information
              </p>
              <p className="mt-1 text-xs text-secondary/80">
                Ref No:{" "}
                <span className="font-mono font-bold text-primary">
                  {refNo}
                </span>{" "}
                (System Generated)
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-widest text-secondary/80 font-bold">
                  Full Name *
                </label>
                <input
                  className="w-full rounded-lg border border-secondary/80 bg-white px-3 py-2.5 text-sm text-secondary/80 outline-none focus:border-primary"
                  placeholder="Enter your name"
                  value={form.fullName}
                  onChange={(event) => setField("fullName", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-widest text-secondary/80 font-bold">
                  Email *
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-secondary/80 bg-white px-3 py-2.5 text-sm text-secondary/80 outline-none focus:border-primary"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(event) => setField("email", event.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-widest text-secondary/80 font-bold">
                  Contact *
                </label>
                <div className="flex gap-2">
                  <select
                    value={form.mobileCode}
                    onChange={(event) =>
                      setField("mobileCode", event.target.value)
                    }
                    className="w-28 rounded-lg border border-secondary/80 bg-white px-2 py-2.5 text-sm text-secondary outline-none">
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    className="w-full rounded-lg border border-secondary/80 bg-white px-3 py-2.5 text-sm text-secondary/80 outline-none focus:border-primary"
                    placeholder="Enter contact number"
                    value={form.mobile}
                    onChange={(event) => setField("mobile", event.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-widest text-secondary/80 font-bold">
                  Solana Wallet Address *
                </label>
                <input
                  className="w-full rounded-lg border border-secondary/80 bg-white px-3 py-2.5 text-sm text-secondary/80 outline-none focus:border-primary"
                  placeholder="Enter your Solana wallet public address"
                  value={form.walletAddress}
                  onChange={(event) =>
                    setField("walletAddress", event.target.value)
                  }
                />
                <p className="mt-1 text-xs text-white/35">
                  SPUMP will be sent to this address.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-widest text-secondary/80 font-bold">
                  Transfer Amount ({selectedCurrency}) *
                </label>
                <input
                  type="number"
                  min="0"
                  disabled
                  className="w-full rounded-lg border border-secondary/80 bg-white px-3 py-2.5 text-sm text-secondary/80 outline-none cursor-not-allowed"
                  placeholder="Amount from calculator"
                  value={form.amount}
                />
                <p className="mt-1.5 text-xs text-secondary/70">
                  💡 Set amount using the SPUMP Calculator above
                </p>
                {form.amount && (
                  <div className="mt-2 rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-sm text-primary font-semibold">
                    You will receive: {displaySpumpCount.toLocaleString()} SPUMP
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[11px] uppercase tracking-widest text-secondary/80 font-bold">
                  Transfer Receipt *
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-primary  px-4 py-6 text-center ">
                  {receiptName ? (
                    <>
                      <p className="text-xl">✅</p>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {receiptName}
                      </p>
                      <p className="text-xs text-secondary/80">
                        Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl">📄</p>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        Upload Transfer Receipt
                      </p>
                      <p className="text-xs text-secondary/80">
                        PDF, JPG, JPEG, PNG
                      </p>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" />

            <button
              onClick={handleSubmit}
              disabled={!isFormValid || submitting}
              className="w-full rounded-xl border border-primary bg-primary/90 px-5 py-3.5 text-sm font-black tracking-wide text-white hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "Submitting Application..." : "SUBMIT APPLICATION"}
            </button>

            {submitError ? (
              <p className="text-center text-xs leading-6 text-red-500">
                {submitError}
              </p>
            ) : null}

            <p className="text-center text-xs leading-6 text-secondary/80">
              By submitting, you confirm your transfer details are accurate.
              SPUMP distribution is subject to bank clearance and admin
              verification.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
