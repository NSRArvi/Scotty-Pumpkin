"use client";

import Container from "../components/shared/Container";

export default function page() {
  const field_name = [
    {
      label: "Buyer Full Name / Username",
      name: "buyer_full_name",
    },
    {
      label: "Buyer Sosay / Marketplace Username",
      name: "buyer_marketplace_username",
    },
    {
      label: "Buyer Email Address",
      name: "buyer_email",
      type: "email",
    },
    {
      label: "Buyer Public Wallet Address Used for Payment",
      name: "buyer_wallet_address",
    },
    {
      label: "Buyer Transaction Hash / Blockchain Reference",
      name: "buyer_transaction_hash",
    },
    {
      label: "Date & Time Payment Sent",
      name: "buyer_payment_datetime",
      type: "datetime-local",
    },
    {
      label: "SPUMP Amount Sent",
      name: "buyer_spump_amount",
    },
  ];
  const field_name2 = [
    {
      label: "Seller Full Name / Username",
      name: "seller_full_name",
    },
    {
      label: "Seller Sosay / Marketplace Username",
      name: "seller_marketplace_username",
    },
    {
      label: "Seller Contact Email",
      name: "seller_email",
      type: "email",
    },
    {
      label: "Seller Public Wallet Address for SPUMP Release",
      name: "seller_wallet_address",
    },
  ];
  return (
    <div className="min-h-screen w-full bg-primary-bg text-secondary">
      <Container>
        <div className="pt-16 md:pt-24 pb-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-bold tracking-[0.25em] uppercase px-3 py-1 rounded-full border border-primary text-primary">
              SPUMP Marketplace
            </span>

            <div className="flex-1 h-px bg-primary/25" />
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-5">
            Marketplace
            <br />
            <span className="text-primary">Forms</span>
          </h1>

          <p className="text-base md:text-lg text-secondary/55 max-w-2xl leading-relaxed">
            SPUMP Marketplace Payment Protection Documentation
          </p>
        </div>

        <div className="pb-20">
          <form className="space-y-10">
            <section className="border border-secondary/10 rounded-3xl overflow-hidden bg-white/40 backdrop-blur-sm">
              <div className="px-6 md:px-10 py-6 border-b border-secondary/10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-bold tracking-[0.25em] text-primary">
                    01
                  </span>

                  <div className="h-px flex-1 bg-secondary/10" />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                  1. SPUMP Marketplace Payment Protection
                </h2>

                <p className="text-primary text-sm font-semibold mt-3">
                  Transaction Registration Form
                </p>
              </div>

              <div className="px-6 md:px-10 py-10 space-y-10">
                <div>
                  <h3 className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-6">
                    BUYER INFORMATION
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {field_name.map((field) => (
                      <div key={field.name} className="space-y-3">
                        <label
                          htmlFor={field.name}
                          className="text-sm font-medium text-secondary">
                          {field.label}
                        </label>

                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type || "text"}
                          placeholder={field.label}
                          className="w-full rounded-2xl border border-secondary/10 bg-primary-bg px-5 py-4 text-sm text-secondary outline-none focus:border-primary transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-6">
                    SELLER INFORMATION
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {field_name2.map((field) => (
                      <div key={field.name} className="space-y-3">
                        <label
                          htmlFor={field.name}
                          className="text-sm font-medium text-secondary">
                          {field.label}
                        </label>

                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type || "text"}
                          placeholder={field.label}
                          className="w-full rounded-2xl border border-secondary/10 bg-primary-bg px-5 py-4 text-sm text-secondary outline-none focus:border-primary transition-all"
                        />
                      </div>
                    ))}

                    <div className="space-y-4 md:col-span-2">
                      <p className="text-sm font-medium text-secondary">
                        Seller Agrees to Use SPUMP Payment Protection
                      </p>

                      <label className="flex items-center gap-3 text-sm text-secondary">
                        <input
                          type="checkbox"
                          name="seller_agrees_payment_protection"
                          className="w-5 h-5 accent-primary text-white"
                        />
                        YES
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-6">
                    TRANSACTION DETAILS
                  </h3>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Advertisement / Listing Title",
                          name: "listing_title",
                        },
                        {
                          label: "Marketplace Advertisement Reference / URL",
                          name: "listing_reference_url",
                        },
                        {
                          label: "Agreed SPUMP Amount",
                          name: "agreed_spump_amount",
                        },
                      ].map((field) => (
                        <div key={field.name} className="space-y-3">
                          <label
                            htmlFor={field.name}
                            className="text-sm font-medium text-secondary">
                            {field.label}
                          </label>

                          <input
                            id={field.name}
                            name={field.name}
                            type="text"
                            placeholder={field.label}
                            className="w-full rounded-2xl border border-secondary/10 bg-primary-bg px-5 py-4 text-sm text-secondary outline-none focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-medium text-secondary">
                        Transaction Type
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Physical Goods",
                          "Digital Goods",
                          "Service",
                          "Rental / Accommodation",
                          "Booking",
                          "Advertising Service",
                          "Other",
                        ].map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 rounded-2xl border border-primary/20 px-5 py-4 text-sm text-secondary">
                            <input
                              type="checkbox"
                              name="transaction_type"
                              value={item}
                              className="w-5 h-5 accent-primary"
                            />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="goods_services_description"
                        className="text-sm font-medium text-secondary">
                        Description of Goods / Services
                      </label>

                      <textarea
                        id="goods_services_description"
                        name="goods_services_description"
                        rows={5}
                        placeholder="Describe Here..."
                        className="w-full rounded-2xl border border-secondary/10 bg-primary-bg px-5 py-4 text-sm text-secondary outline-none focus:border-primary transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-6">
                    DELIVERY METHOD
                  </h3>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Shipping / Courier",
                        "Digital Delivery",
                        "In-Person Delivery",
                        "Hotel / Rental Check-In",
                        "Service Completion",
                        "Other",
                      ].map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-3 rounded-2xl border border-primary/20 px-5 py-4 text-sm text-secondary">
                          <input
                            type="checkbox"
                            name="delivery_method"
                            value={item}
                            className="w-5 h-5 accent-primary"
                          />
                          {item}
                        </label>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label
                          htmlFor="expected_delivery_date"
                          className="text-sm font-medium text-secondary">
                          Expected Delivery / Completion Date
                        </label>

                        <input
                          id="expected_delivery_date"
                          name="expected_delivery_date"
                          type="date"
                          className="w-full rounded-2xl border border-secondary/10 bg-primary-bg px-5 py-4 text-sm text-secondary outline-none focus:border-primary transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label
                          htmlFor="delivery_details"
                          className="text-sm font-medium text-secondary">
                          Delivery Details
                        </label>

                        <textarea
                          id="delivery_details"
                          name="delivery_details"
                          rows={4}
                          placeholder="Type Delivery Details Here..."
                          className="w-full rounded-2xl border border-secondary/10 bg-primary-bg px-5 py-4 text-sm text-secondary outline-none focus:border-primary transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-6">
                    BUYER PAYMENT CONFIRMATION
                  </h3>

                  <div className="space-y-8">
                    <label className="flex items-start gap-3 text-sm text-secondary">
                      <input
                        type="checkbox"
                        name="buyer_payment_confirmation"
                        className="w-5 h-5 mt-0.5 accent-primary"
                      />
                      Buyer confirms payment was sent to the designated SPUMP
                      Marketplace protection wallet.
                    </label>

                    <div className="space-y-4">
                      <p className="text-sm font-medium text-secondary">
                        Attach / Upload
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Transaction Screenshot",
                          "Blockchain Explorer Link",
                          "PDF / Image Proof",
                          "Advertisement Copy",
                        ].map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 rounded-2xl border border-primary/20 px-5 py-4 text-sm text-secondary">
                            <input
                              type="checkbox"
                              name="attach_upload"
                              value={item}
                              className="w-5 h-5 accent-primary"
                            />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-primary text-xs font-bold tracking-[0.25em] uppercase mb-6">
                    MARKETPLACE STATUS
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Payment Pending",
                      "Payment Confirmed",
                      "Pending Delivery",
                      "Under Review",
                    ].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 rounded-2xl border border-primary/20 px-5 py-4 text-sm text-secondary">
                        <input
                          type="checkbox"
                          name="marketplace_status"
                          value={item}
                          className="w-5 h-5 accent-primary"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-4 rounded-2xl bg-primary text-primary-bg font-semibold text-sm hover:opacity-90 transition-all">
                Submit Form
              </button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
