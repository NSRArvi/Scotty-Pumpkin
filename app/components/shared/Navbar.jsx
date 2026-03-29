'use client';

import React, { useState, useEffect } from 'react';
import logo from "@/public/assets/hero.png";
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    {
      label: 'Get SPUMP',
      dropdown: [
        { label: 'Get SPUMP Now', href: '/buy' },
        { label: 'Crypto risk warning and no obligation', href: '/risk-warning' },
      ],
    },
    {
      label: 'Ecosystem',
      dropdown: [
        { label: 'SPUMP Economic Engine', href: '/ecosystem/spump-economic-engine' },
        { label: 'A Real Utility Ecosystem', href: '/ecosystem/a-real-utility-ecosystem' },
      ],
    },
    {
      label: 'NFT',
      dropdown: [
        { label: 'Create - Mint your NFT', href: '/nft-studio' },
        { label: 'Publish your NFT', href: '/nft-studio' },
        { label: 'Purchase NFT', href: '/purchase' },
        { label: 'Create your NFT website', href: 'https://bfinit.com/bfinit-ecomerce-platform' },
        { label: 'List your NFT', href: 'https://sosay.org/spump-market' },
      ],
    },
    { label: 'Create a Shop', href: 'https://bfinit.com/bfinit-ecomerce-platform' },
    { label: 'Marketplace', href: 'https://sosay.org/spump-market' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className="relative z-50 px-4 py-4 md:px-8 lg:px-16">
      <div className="ui-shell max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 md:py-4 relative z-50">
        <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
          <Image src={logo} alt="Scotty Pumpkin" className="w-10 h-10 md:w-12 md:h-12" />
          <span className="md:text-xl lg:text-2xl font-bold">Scotty Pumpkin</span>
        </Link>
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {menuItems.map((item) => (
            <div key={item.label} className="relative group">
              {item.dropdown ? (
                <>
                  <button className="ui-nav-link flex items-center gap-1.5">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  
                  <div className="ui-shell absolute left-0 mt-0 w-56 border-purple-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                    {item.dropdown.map((subitem) => (
                      <Link
                        key={subitem.label}
                        href={subitem.href}
                        target={subitem.href.startsWith('http') ? '_blank' : undefined}
                        rel={subitem.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="block px-4 py-2.5 hover:bg-purple-700/40 text-sm font-medium transition-colors first:rounded-t-xl last:rounded-b-xl ui-link"
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className="ui-nav-link"
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        <button 
          className="md:hidden p-2 hover:bg-purple-700/50 rounded-lg transition-colors relative z-60"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="ui-shell md:hidden fixed top-22 left-4 right-4 bottom-auto max-h-[calc(100vh-104px)] border-purple-500/30 z-40 overflow-y-auto shadow-2xl">
            <div className="px-4 py-6 space-y-3">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className="w-full py-3 px-4 ui-nav-link hover:bg-purple-700/40 rounded-xl transition-all backdrop-blur-sm border border-transparent hover:border-purple-500/30 flex items-center justify-between"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openDropdown === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-purple-500/30">
                          {item.dropdown.map((subitem) => (
                            <Link
                              key={subitem.label}
                              href={subitem.href}
                              target={subitem.href.startsWith('http') ? '_blank' : undefined}
                              rel={subitem.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="block py-2.5 px-4 hover:bg-purple-700/30 rounded-lg transition-all text-base font-medium ui-link"
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
                      className="block py-3 px-4 ui-nav-link hover:bg-purple-700/40 rounded-xl transition-all backdrop-blur-sm border border-transparent hover:border-purple-500/30"
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
    </nav>
  );
}