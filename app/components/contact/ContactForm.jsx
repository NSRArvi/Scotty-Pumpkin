"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Captcha from "./Captcha";
import { smtpexpressClient } from "@/data/smtp";
import { Copyright, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Container from "../shared/Container";

const OFFICE_LOCATIONS = [
  {
    id: "fr",
    title: "Principal Entity (France / EU)",
    name: "SAS Association Familiale Fin (AFFIN)",
    address: ["8 Rue Dublin", "34200 Sete", "France"],
    mapSrc:
      "https://maps.google.com/maps?q=8%20Rue%20Dublin%2C%2034200%20Sete%2C%20France&output=embed",
    role: [
      "Group Holding and Administrative Entity",
      "Entity Management for USFRANC and Scotty Pumpkin Ecosystem: USFRANC LTD",
      "Ecosystem Operational Entity",
    ],
  },
  {
    id: "uk",
    title: "United Kingdom Entity",
    name: "USFRANC LTD",
    address: [
      "4th Floor, Silverstream House",
      "45 Fitzroy Street",
      "London, W1T 6EB",
      "United Kingdom",
    ],
    mapSrc:
      "https://maps.google.com/maps?q=4th%20Floor%20Silverstream%20House%2045%20Fitzroy%20Street%20London%20W1T%206EB%20United%20Kingdom&output=embed",
  },
];

const ContactForm = () => {
  const router = useRouter();
  const form = useRef();
  const [loader, setLoader] = useState(false);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    skypeId: "",
    subject: "",
    message: "",
    captchaInput: "",
  });

  const [captchaAnswer, setCaptchaAnswer] = useState(null);
  const [invalidCaptcha, setInvalidCaptcha] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState(false);
  const [invalidKey, setInvalidKey] = useState(false);
  const [forbiddenWords, setForbiddenWords] = useState([]);

  // Get all forbidden words list
  const fetchForbiddenWords = async () => {
    const apiUrl = "https://bitts.fr/api.php";

    try {
      const credential = await fetch("/credential.json");
      const credentialsData = await credential.json();
      if (
        !credentialsData ||
        !credentialsData.username ||
        !credentialsData.password
      ) {
        return;
      }

      const servername = window.location.hostname;
      const data = { ...credentialsData, servername };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setForbiddenWords(result ?? []);
      } else {
        setInvalidKey(true);
      }
    } catch (error) {
      console.error("Error fetching forbidden words:", error);
      setInvalidKey(true);
    }
  };

  // Get all countries name
  useEffect(() => {
    fetch("/country.json")
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error loading country data:", error));

    fetchForbiddenWords();
  }, []);

  // Handle input filed change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Check for forbidden words in message filed
  const checkForbiddenWords = (message) => {
    for (const word of forbiddenWords) {
      if (message.toLowerCase().includes(word.toLowerCase())) {
        return false;
      }
    }
    return true;
  };

  // Handle contact form submit
  const submitForm = async (event) => {
    event.preventDefault();
    setLoader(true);

    if (parseInt(formData.captchaInput, 10) !== captchaAnswer) {
      setLoader(false);
      setInvalidCaptcha(true);
      return;
    } else {
      setInvalidCaptcha(false);
    }

    if (!checkForbiddenWords(formData.message)) {
      setLoader(false);
      setInvalidMessage(true);
      return;
    } else {
      setInvalidMessage(false);
    }

    try {
      // Create a formatted message to send
      const formattedMessage = `
            Name: ${formData.name}
            <br />
            Email: ${formData.email}
            <br />
            Subject: ${formData.subject}
            <br />
            Phone: ${formData.phone}
            <br />
            Country: ${formData.country}
            <br />
            Skype ID: ${formData.skypeId}
            <br />
            Message: ${formData.message}
      `;
      // Sending an email using SMTP
      await smtpexpressClient.sendApi.sendMail({
        // Subject of the email
        subject: `Bobosoho Contact Form Submission from ${formData.name}`,
        // Body of the email
        message: `${formattedMessage}`,
        // Sender's details
        sender: {
          // Sender's name
          name: "Bobosoho",
          // Sender's email address
          email: "bfinit-9b2b98@projects.smtpexpress.com",
        },
        // Recipient's details
        recipients: {
          // Recipient's email address (obtained from the form)
          // email: `${formData.email}`,
          email: `support@bobosohomail.com`,
        },
      });

      setLoader(false);
      // Notify user of successful submission
      alert("Contact message sent. Our support team will reach you soon.");
      router.push("/");
    } catch (error) {
      setLoader(false);
      // Notify user if an error occurs during submission
      alert("Oops! Something went wrong. Please try again later.");
      // You can console.log the error to know what went wrong
      // console.log(error);
    }

    // Reset form data and captcha invalidation error message
    setInvalidCaptcha(false);
    setInvalidMessage(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
      skypeId: "",
      subject: "",
      message: "",
      captchaInput: "",
    });
  };

  return (
    <section className="bg-primary-bg">
      <Container>
        <div className="py-10 md:py-14 space-y-8">
          <div>
            <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
              <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                📜
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
                  Contact Scotty Pumpkin Team
                </p>
                <h1 className="text-5xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
                  Need Help With <span className="text-primary">SPUMP</span>,{" "}
                  <br />
                  Marketplace or Your Creator Shop?
                </h1>
              </div>
            </div>

            <div className="flex gap-5 pb-6 items-start border-b border-secondary/[0.07]">
              <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                01
              </span>
              <p className="flex-1 text-[15px] leading-[1.75] text-secondary/80 font-light m-0">
                Send us your request and our support team will reach you soon.
                We can help with account setup, technical issues, payment flow
                questions, or onboarding your shop and products into the Scotty
                ecosystem.
              </p>
            </div>

            <div className="flex gap-5 pt-6 items-start">
              <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                02
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-secondary/80">
                  Fast Support
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-secondary/80">
                  Web3 Commerce
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-primary/15 text-xs text-secondary/80">
                  Secure Handling
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row items-stretch">
            {/* Contact Form */}
            <form
              ref={form}
              onSubmit={submitForm}
              className="ui-card flex flex-col rounded-2xl p-6 md:p-8 lg:w-1/2">
              <label
                htmlFor="name"
                className="text-secondary/90 text-sm font-medium">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="mb-5 mt-2.5 block w-full rounded-xl border border-secondary/10 bg-white/90 px-4 py-3 text-secondary placeholder:text-secondary/35 backdrop-blur-xl outline-none transition-all duration-300 focus:border-primary/45 focus:bg-white"
              />

              <label
                htmlFor="email"
                className="text-secondary/90 text-sm font-medium">
                Email *
              </label>
              <input
                type="text"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="mb-5 mt-2.5 block w-full rounded-xl border border-secondary/10 bg-white/90 px-4 py-3 text-secondary placeholder:text-secondary/35 backdrop-blur-xl outline-none transition-all duration-300 focus:border-primary/45 focus:bg-white "
              />

              <label
                htmlFor="phone"
                className="text-secondary/90 text-sm font-medium">
                Phone *
              </label>
              <input
                type="number"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="mb-5 mt-2.5 block w-full rounded-xl border border-secondary/10 bg-white/90 px-4 py-3 text-secondary placeholder:text-secondary/35 backdrop-blur-xl outline-none transition-all duration-300 focus:border-primary/45 focus:bg-white "
              />

              <label
                htmlFor="country"
                className="text-secondary/90 text-sm font-medium">
                Country *
              </label>
              <select
                id="country"
                name="country"
                required
                onChange={handleChange}
                className="mb-5 mt-2.5 block w-full rounded-xl border border-secondary/30 bg-white/10 text-secondary/80 px-4 py-3 outline-none focus:border-secondary/50 focus:bg-white/15">
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              <label
                htmlFor="subject"
                className="text-secondary/90 text-sm font-medium">
                Subject/Query *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="mb-5 mt-2.5 block w-full rounded-xl border border-secondary/10 bg-white/90 px-4 py-3 text-secondary placeholder:text-secondary/35 backdrop-blur-xl outline-none transition-all duration-300 focus:border-primary/45 focus:bg-white "
              />

              <label
                htmlFor="skypeId"
                className="text-secondary/90 text-sm font-medium">
                Skype ID
              </label>
              <input
                type="text"
                id="skypeId"
                name="skypeId"
                value={formData.skypeId}
                onChange={handleChange}
                placeholder="Skype Id (optional)"
                className="mb-5 mt-2.5 block w-full rounded-xl border border-secondary/10 bg-white/90 px-4 py-3 text-secondary placeholder:text-secondary/35 backdrop-blur-xl outline-none transition-all duration-300 focus:border-primary/45 focus:bg-white "
              />

              <label
                htmlFor="message"
                className="text-secondary/90 text-sm font-medium">
                Enter Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="mb-5 mt-2.5 block w-full rounded-xl border border-secondary/10 bg-white/90 px-4 py-3 text-secondary placeholder:text-secondary/35 backdrop-blur-xl outline-none transition-all duration-300 focus:border-primary/45 focus:bg-white "
              />

              {/* Captcha Component */}
              <Captcha onCaptchaGenerated={setCaptchaAnswer} />

              <input
                type="text"
                id="captchaInput"
                name="captchaInput"
                required
                value={formData.captchaInput}
                onChange={handleChange}
                placeholder="Captcha *"
                className="mb-5 mt-2.5 block w-full rounded-xl border border-secondary/10 bg-white/90 px-4 py-3 text-secondary placeholder:text-secondary/35 backdrop-blur-xl outline-none transition-all duration-300 focus:border-primary/45 focus:bg-white"
              />

              {invalidCaptcha && (
                <p className="text-red-400 text-sm">
                  Invalid Captcha! Please try again.
                </p>
              )}
              {invalidMessage && (
                <p className="text-red-400 text-sm">
                  Your message contains forbidden words.
                </p>
              )}
              {invalidKey && (
                <p className="text-red-400 text-sm">Invalid API Key.</p>
              )}

              <button
                type="submit"
                className="bg-primary mt-6 w-full justify-center rounded-xl px-4 py-3 text-lg text-white">
                {loader ? (
                  <p className="flex items-center text-center gap-2">
                    Sending <LoaderCircle size={20} className="animate-spin" />
                  </p>
                ) : (
                  "Send Message"
                )}
              </button>

              <div className="mt-5">
                <p className="flex items-center justify-center gap-1 text-xs text-white/55">
                  <Copyright size={12} /> {new Date().getFullYear()} BFIN. BITSS
                  by BFIN. All rights reserved.
                </p>
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="/assets/logo.webp"
                    alt="bitss logo"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                  <p className="text-xs text-white/55">
                    This form is powered by bitss cyber security
                  </p>
                </div>
              </div>
            </form>

            {/* Google Maps */}
            <div className="lg:w-1/2 space-y-6">
              {OFFICE_LOCATIONS.map((office) => (
                <div
                  key={office.id}
                  className="ui-card overflow-hidden p-4 md:p-5 space-y-3">
                  <div>
                    <p className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase">
                      {office.title}
                    </p>
                    <p className="text-secondary/80 text-base font-semibold mt-1">
                      {office.name}
                    </p>
                    {office.address.map((line) => (
                      <p
                        key={`${office.id}-${line}`}
                        className="text-secondary/70 text-sm">
                        {line}
                      </p>
                    ))}

                    <div className="space-y-2">
                      <p className="text-secondary/70 text-xs font-semibold uppercase tracking-wider">
                        Role
                      </p>
                      <ul className="sp-entity-list list-disc pl-4">
                        {office?.role?.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <iframe
                    src={office.mapSrc}
                    title={`${office.name} Office Map`}
                    width="100%"
                    height="280"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full rounded-2xl border border-white/10"></iframe>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactForm;
