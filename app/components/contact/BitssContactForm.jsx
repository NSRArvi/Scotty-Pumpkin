"use client";
import { useState, useEffect } from "react";

export default function BitssContactForm() {
  const [countries, setCountries] = useState([]);
  const [captcha, setCaptcha] = useState({
    token: "",
    question: "Loading challenge...",
  });
  const [blockwords, setBlockwords] = useState([]);
  const [disposableDomains, setDisposableDomains] = useState([]);
  const [protectedDomains, setProtectedDomains] = useState([]);
  const [fieldWarnings, setFieldWarnings] = useState({});
  const [formData, setFormData] = useState({
    _captcha_token: "",
    _captcha_answer: "",
    name: "",
    email: "",
    country: "",
    phone_number: "",
    subject: "",
    messages: "",
    _hp_bio_field: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    setTimestamp(Date.now());
    // Fetch live form metadata (countries, security captcha & anti-spam rules) from API
    fetch("https://bitssc.bitss.one/api/forms/frm_6bd62a01b272")
      .then((res) => res.json())
      .then((data) => {
        if (data.form?.blockwords) setBlockwords(data.form.blockwords);
        if (data.form?.disposable_domains)
          setDisposableDomains(data.form.disposable_domains);
        if (data.form?.protected_domains)
          setProtectedDomains(data.form.protected_domains);
        if (data.success && data.form?.countries) {
          setCountries(data.form.countries);
          const defaultCountry =
            data.form.countries.find(
              (c) => c.name === "United States" || c.iso2 === "US",
            ) || data.form.countries[0];
          if (defaultCountry) {
            const dial = defaultCountry.dial_code || "+1";
            const phoneFields = ["phone_number"];
            setFormData((prev) => {
              const updates = { ...prev };
              if (!prev["country"]) updates["country"] = defaultCountry.name;
              phoneFields.forEach((fId) => {
                if (!prev[fId] || prev[fId].trim() === "")
                  updates[fId] = dial + " ";
              });
              return updates;
            });
          }
        }
        if (data.form?.captcha) {
          setCaptcha(data.form.captcha);
          setFormData((prev) => ({
            ...prev,
            _captcha_token: data.form.captcha.token,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const checkSpamWarning = (fieldName, val) => {
    if (!val || typeof val !== "string") {
      setFieldWarnings((prev) => {
        if (!prev[fieldName]) return prev;
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
      return;
    }
    const cleanVal = val.toLowerCase().trim();
    if (cleanVal.length < 2) {
      setFieldWarnings((prev) => {
        if (!prev[fieldName]) return prev;
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
      return;
    }
    const isEmail = fieldName.toLowerCase().includes("email");
    let matched = null;
    if (isEmail) {
      const atIdx = cleanVal.lastIndexOf("@");
      if (atIdx !== -1) {
        const emailDomain = cleanVal.slice(atIdx + 1).trim();
        const dotIdx = emailDomain.lastIndexOf(".");
        const isComplete = dotIdx > 0 && emailDomain.length - dotIdx - 1 >= 2;
        if (isComplete) {
          const isProtected = protectedDomains.some(
            (p) => emailDomain === p || emailDomain.endsWith("." + p),
          );
          if (!isProtected && disposableDomains.length > 0) {
            const found = disposableDomains.find(
              (d) => emailDomain === d || emailDomain.endsWith("." + d),
            );
            if (found) matched = `Disposable email provider: ${found}`;
          }
        }
      }
    } else {
      if (
        /(?:\[url[=\]]|<a\s+[^>]*href|<\/a>|\[link[=\]]|<script\b)/i.test(
          cleanVal,
        )
      ) {
        matched = "HTML or BBCode link tags";
      } else if (
        /(?:https?:\/\/)?(?:t\.me|telegram\.me|wa\.me|bit\.ly|tinyurl\.com)\/[a-zA-Z0-9_\-\.\/]+/i.test(
          cleanVal,
        )
      ) {
        matched = "Suspicious redirect/messaging link";
      } else if (/(.){6,}/u.test(cleanVal)) {
        matched = "Repetitive character flood";
      }
      if (!matched && blockwords.length > 0) {
        for (let i = 0; i < blockwords.length; i++) {
          const bw = (blockwords[i] || "").toLowerCase().trim();
          if (!bw || bw.length < 2) continue;
          if (bw.startsWith(".")) {
            const escaped = bw.replace(/[.*+?^${\}()|[\]\\]/g, "\\$&");
            const tldRegex = new RegExp(
              "[a-z0-9_-]+" + escaped + "(?=[\\s\\/.,:;?!)\\\"']|$)",
              "i",
            );
            if (tldRegex.test(cleanVal)) {
              matched = blockwords[i];
              break;
            }
          } else {
            const escaped = bw.replace(/[.*+?^${\}()|[\]\\]/g, "\\$&");
            const isWord = /^[a-zA-Z0-9_]+$/.test(bw);
            const wordRegex = isWord
              ? new RegExp(
                  "(?:^|[^a-zA-Z0-9_\\u00C0-\\u024F])" +
                    escaped +
                    "(?=[^a-zA-Z0-9_\\u00C0-\\u024F]|$)",
                  "i",
                )
              : new RegExp(escaped, "i");
            if (wordRegex.test(cleanVal)) {
              matched = blockwords[i];
              break;
            }
          }
        }
      }
    }
    if (matched) {
      setFieldWarnings((prev) => ({
        ...prev,
        [fieldName]: `⚠️ Blocked pattern detected: ${matched}`,
      }));
    } else {
      setFieldWarnings((prev) => {
        if (!prev[fieldName]) return prev;
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    checkSpamWarning(name, value);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const countryObj = countries.find(
      (c) =>
        c.name?.toLowerCase() === selectedCountry?.toLowerCase() ||
        c.iso2?.toLowerCase() === selectedCountry?.toLowerCase(),
    );
    const dial = countryObj?.dial_code || "+1";
    const phoneFields = ["phone_number"];
    setFormData((prev) => {
      const updates = {
        ...prev,
        [e.target.name || "country"]: selectedCountry,
      };
      phoneFields.forEach((fId) => {
        const cleanPhone = (prev[fId] || "").trim();
        let newPhone = dial + " ";
        if (cleanPhone.startsWith("+")) {
          const match = cleanPhone.match(/^\+\d+\s*(.*)$/);
          const rest = match ? match[1] : "";
          newPhone = dial + (rest ? " " + rest : " ");
        } else if (cleanPhone) {
          newPhone = dial + " " + cleanPhone;
        }
        updates[fId] = newPhone;
      });
      return updates;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(fieldWarnings).length > 0) {
      setStatus({
        loading: false,
        message:
          "⚠️ Submission blocked: Please remove prohibited words or links from the highlighted fields.",
        error: true,
      });
      return;
    }
    setStatus({ loading: true, message: "", error: false });
    try {
      const res = await fetch(
        "https://bitssc.bitss.one/api/forms/frm_6bd62a01b272/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...formData,
            _bcf_ts: timestamp,
            _client_tz:
              typeof Intl !== "undefined" && Intl.DateTimeFormat
                ? Intl.DateTimeFormat().resolvedOptions().timeZone
                : "",
          }),
        },
      );
      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        data = null;
      }
      if (data && data.captcha) {
        setCaptcha(data.captcha);
        setFormData((prev) => ({
          ...prev,
          _captcha_token: data.captcha.token,
          _captcha_answer: "",
        }));
      }
      if (res.ok && data && data.success) {
        setStatus({
          loading: false,
          message: data.message || "Thank you! Submission received.",
          error: false,
        });
        setFormData({
          _captcha_token: "",
          _captcha_answer: "",
          name: "",
          email: "",
          country: "",
          phone_number: "",
          subject: "",
          messages: "",
          _hp_bio_field: "",
          ...(data && data.captcha
            ? { _captcha_token: data.captcha.token, _captcha_answer: "" }
            : {}),
        });
      } else {
        const errMsg =
          data && (data.message || data.error)
            ? data.message || data.error
            : res.status === 429
              ? data?.message ||
                "A message from this email address has already been received recently. Please wait before submitting again."
              : res.status >= 500
                ? `Server Error (${res.status}: ${res.statusText || "Internal Error"})`
                : "Submission failed. Please check form inputs.";
        setStatus({ loading: false, message: errMsg, error: true });
      }
    } catch (err) {
      const connErr =
        err && err.message
          ? `Connection Error: ${err.message}`
          : "Network error. Please try again.";
      setStatus({ loading: false, message: connErr, error: true });
    }
  };

  return (
    <div className="lg:w-1/2">
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Status Message */}
        {status.message && (
          <div
            className={`rounded-xl border p-4 text-sm font-medium ${
              status.error
                ? "border-black/10 bg-white text-black"
                : "border-primary bg-white text-primary"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Honeypot */}
        <input
          type="text"
          name="_hp_bio_field"
          value={formData._hp_bio_field}
          onChange={handleChange}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Name + Email */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Your Name <span className="text-primary">*</span>
            </label>

            <input
              type="text"
              name="name"
              placeholder="John Doe"
              required
              value={formData.name || ""}
              onChange={handleChange}
              style={{
                borderColor: fieldWarnings["name"] ? "#000000" : undefined,
              }}
              className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {fieldWarnings["name"] && (
              <p className="mt-1.5 text-xs font-semibold text-black">
                {fieldWarnings["name"]}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Email Address <span className="text-primary">*</span>
            </label>

            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              required
              value={formData.email || ""}
              onChange={handleChange}
              style={{
                borderColor: fieldWarnings["email"] ? "#000000" : undefined,
              }}
              className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {fieldWarnings["email"] && (
              <p className="mt-1.5 text-xs font-semibold text-black">
                {fieldWarnings["email"]}
              </p>
            )}
          </div>
        </div>

        {/* Country + Phone */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Country */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Country <span className="text-primary">*</span>
            </label>

            <select
              name="country"
              required
              value={formData.country || ""}
              onChange={handleCountryChange}
              className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select Country</option>

              {countries.map((c) => (
                <option key={c.iso2 || c.name} value={c.name}>
                  {c.flag ? `${c.flag} ` : ""}
                  {c.name}
                  {c.dial_code ? ` (${c.dial_code})` : ""}
                </option>
              ))}
            </select>

            {fieldWarnings["country"] && (
              <p className="mt-1.5 text-xs font-semibold text-black">
                {fieldWarnings["country"]}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Phone Number <span className="text-primary">*</span>
            </label>

            <input
              type="tel"
              name="phone_number"
              placeholder="+1 (555) 000-0000"
              required
              value={formData.phone_number || ""}
              onChange={handleChange}
              style={{
                borderColor: fieldWarnings["phone_number"]
                  ? "#000000"
                  : undefined,
              }}
              className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {fieldWarnings["phone_number"] && (
              <p className="mt-1.5 text-xs font-semibold text-black">
                {fieldWarnings["phone_number"]}
              </p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Subject <span className="text-primary">*</span>
          </label>

          <input
            type="text"
            name="subject"
            placeholder="Enter Subject..."
            required
            value={formData.subject || ""}
            onChange={handleChange}
            style={{
              borderColor: fieldWarnings["subject"] ? "#000000" : undefined,
            }}
            className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {fieldWarnings["subject"] && (
            <p className="mt-1.5 text-xs font-semibold text-black">
              {fieldWarnings["subject"]}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Message <span className="text-primary">*</span>
          </label>

          <textarea
            name="messages"
            placeholder="Enter your message..."
            required
            rows={5}
            value={formData.messages || ""}
            onChange={handleChange}
            style={{
              borderColor: fieldWarnings["messages"] ? "#000000" : undefined,
            }}
            className="w-full resize-none rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          {fieldWarnings["messages"] && (
            <p className="mt-1.5 text-xs font-semibold text-black">
              {fieldWarnings["messages"]}
            </p>
          )}
        </div>

        {/* Security Check */}
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <label className="mb-2 block text-sm font-semibold text-black">
            Security Check:{" "}
            <strong className="text-primary">{captcha.question}</strong>{" "}
            <span className="text-primary">*</span>
          </label>

          <input
            type="hidden"
            name="_captcha_token"
            value={formData._captcha_token || ""}
          />

          <input
            type="text"
            name="_captcha_answer"
            placeholder="Enter answer"
            required
            autoComplete="off"
            value={formData._captcha_answer || ""}
            onChange={handleChange}
            className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status.loading}
          className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status.loading ? "Sending..." : "Send Message"}
        </button>

        {/* BITSS Branding Footer */}
        <div className="border-t border-black/10 pt-6 text-center">
          <img
            src="https://bitssc.bitss.one/assets/image.png"
            alt="BITSS Cyber Security"
            className="mx-auto mb-3 h-12 w-auto object-contain"
          />

          <p className="mb-1 text-xs text-black/70 sm:text-sm">
            This form is powered by{" "}
            <strong className="text-black">BITSS Cyber Security</strong>
          </p>

          <p className="text-xs text-black/50">
            &copy; {new Date().getFullYear()} BFIN. BITSS by BFIN. All rights
            reserved.
          </p>
        </div>
      </form>
    </div>
  );
}
