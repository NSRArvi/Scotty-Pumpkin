'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Navigation menu items array
  const menuItems = [
    { label: 'Buy', href: '/buy' },
    { label: 'Ecosystem', href: '/ecosystem' },
    { label: 'Market', href: 'https://bfinit.com/bfinit-ecomerce-platform' },
    { label: 'Create', href: 'https://sosay.org/' },
    { label: 'NFT Studio', href: '/nft-studio' },
    { label: 'Purchase', href: '/purchase' },
  ];

  // Prevent body scroll when mobile menu is open
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
      {/* Desktop Glassmorphic Container */}
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-purple-900/30 backdrop-blur-lg border border-purple-500/20 rounded-2xl px-4 md:px-6 py-3 md:py-4 shadow-xl relative z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-2xl md:text-4xl">
            🎃
          </div>
          <span className="text-xl md:text-2xl lg:text-3xl font-bold">Scotty Pumpkin</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="hover:text-purple-300 transition-colors text-base xl:text-lg font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <button className="px-4 lg:px-6 py-2 border-2 border-purple-300/50 rounded-lg hover:bg-purple-800/50 hover:border-purple-300 transition-all text-sm lg:text-base font-medium backdrop-blur-sm">
            Sign Up
          </button>
          <button className="px-4 lg:px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl">
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 hover:bg-purple-700/50 rounded-lg transition-colors relative z-[60]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu - Glassmorphic Design */}
          <div className="md:hidden fixed top-[88px] left-4 right-4 bottom-auto max-h-[calc(100vh-104px)] bg-purple-900/40 backdrop-blur-2xl border border-purple-500/30 rounded-2xl z-40 overflow-y-auto shadow-2xl">
            <div className="px-4 py-6 space-y-3">
              {/* Menu Items */}
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-3 px-4 hover:bg-purple-700/40 rounded-xl transition-all text-lg font-medium backdrop-blur-sm border border-transparent hover:border-purple-500/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Auth Buttons */}
              <div className="pt-4 space-y-3 border-t border-purple-500/30">
                <button className="w-full px-6 py-3 border-2 border-purple-300/50 rounded-xl hover:bg-purple-700/50 hover:border-purple-300 transition-all font-medium text-base backdrop-blur-sm">
                  Sign Up
                </button>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all font-semibold text-base shadow-lg">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}