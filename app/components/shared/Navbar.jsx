"use client";

import React, { useState, useEffect } from "react";
import logo from "@/public/assets/hero.png";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import Container from "./Container";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    { label: "Home", href: "/" },
    {
      label: "Get SPUMP",
      dropdown: [
        {
          label: " Identification Code",
          href: "/spump-identification-code",
        },
        {
          label: "General Crypto Notice",
          href: "/risk-warning",
        },
        { label: "Get SPUMP Now", href: "/buy" },
      ],
    },
    {
      label: "SPUMP Escrow",
      dropdown: [
        {
          label: "Marketplace Payment Protection Procedure",
          href: "/spump-marketplace-payment-protection-procedure",
        },
        {
          label: "Conditions of Use",
          href: "spump-marketplace-payment-protection-conditions-of-use",
        },
        {
          label: "Escrow Payment System",
          href: "/spump-escrow-payment-system",
        },
        {
          label: "Market Payment Processing Form",
          href: "/spump-marketplace-payment-protection",
        },
      ],
    },
    {
      label: "Ecosystem",
      dropdown: [
        {
          label: "SPUMP Economic Engine",
          href: "/ecosystem/spump-economic-engine",
        },
        {
          label: "SPUMP Ecosystem Notice",
          href: "/ecosystem/a-real-utility-ecosystem",
        },
      ],
    },
    {
      label: "NFT",
      dropdown: [
        { label: "Create - Mint your NFT", href: "/nft-studio" },
        { label: "Publish your NFT", href: "/nft-studio" },
        { label: "Purchase NFT", href: "/purchase" },
        {
          label: "Create your NFT website",
          href: "https://bfinit.com/bfinit-ecomerce-platform",
        },
        { label: "List your NFT", href: "https://sosay.org/spump-market" },
      ],
    },
    {
      label: "Create a Shop",
      href: "https://bfinit.com/bfinit-ecomerce-platform",
    },
    { label: "Marketplace", href: "https://sosay.org/spump-market" },
    { label: "Blogs", href: "/blogs" },
    { label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-primary-bg pt-4 sticky top-0 z-100">
      <Container>
        <section className="relative z-50 bg-white rounded-lg">
          <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 relative z-50">
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Image src={logo} alt="Scotty Pumpkin" className="w-8 h-auto" />
              <span className="md:text-xl font-bold text-secondary">
                Scotty Pumpkin
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-3 text-base">
              {menuItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.dropdown ? (
                    <>
                      <button className=" bg-white flex items-center gap-1.5 text-secondary">
                        {item.label}
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      </button>

                      <div className="absolute rounded-b-xl bg-white left-0 mt-0 w-56 border-purple-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2 z-50">
                        {item.dropdown.map((subitem) => (
                          <Link
                            key={subitem.label}
                            href={subitem.href}
                            target={
                              subitem.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              subitem.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="block px-4 py-2.5 hover:bg-primary text-sm font-medium transition-colors first:rounded-t-xl last:rounded-b-xl text-secondary hover:text-white"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-secondary"
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <button
              className="md:hidden p-2 bg-primary rounded-lg transition-colors relative "
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {isMenuOpen && (
            <>
              <div
                className="md:hidden fixed inset-0 bg-white z-40 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="ui-shell md:hidden fixed top-22 left-4 right-4 bottom-auto max-h-[calc(100vh-104px)] border-purple-500/30 z-40 overflow-y-auto">
                <div className="px-4 py-6 space-y-1">
                  {menuItems.map((item) => (
                    <div key={item.label}>
                      {item.dropdown ? (
                        <>
                          <button
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === item.label ? null : item.label,
                              )
                            }
                            className="w-full py-3 px-4 ui-nav-link hover:bg-primary text-secondary hover:text-white rounded-xl transition-all backdrop-blur-sm border border-transparent hover:border-purple-500/30 flex items-center justify-between"
                          >
                            {item.label}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                openDropdown === item.label ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {openDropdown === item.label && (
                            <div className="pl-4 mt-2 space-y-2 border-l-2 border-purple-500/30">
                              {item.dropdown.map((subitem) => (
                                <Link
                                  key={subitem.label}
                                  href={subitem.href}
                                  target={
                                    subitem.href.startsWith("http")
                                      ? "_blank"
                                      : undefined
                                  }
                                  rel={
                                    subitem.href.startsWith("http")
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className="block py-2.5 px-4 hover:bg-primary text-secondary hover:text-white rounded-lg transition-all text-base font-medium ui-link"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {subitem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className="block py-3 px-4 ui-nav-link hover:bg-primary text-secondary hover:text-white rounded-xl transition-all backdrop-blur-sm border border-transparent hover:border-purple-500/30"
                          target={
                            item.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            item.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </Container>
    </nav>
  );
}
