import { BsTwitterX , BsTelegram, BsLinkedin, BsGithub } from "react-icons/bs";

export default function Footer() {
  const footerLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Compliance', href: '/compliance' },
    { label: 'Legal Pack', href: '/legal-pack' },
    { label: 'Regulatory Framework', href: '/regulatory-framework' },
    { label: 'Eco Financial', href: '/eco-financial' },
  ];

  const socialLinks = [
    { Icon: BsTwitterX, href: 'https://x.com/SpumpCoin', label: 'X' },
    { Icon: BsLinkedin, href: 'https://www.linkedin.com/showcase/digital-commerce-web3-ecosystem/', label: 'LinkedIn' },
    { Icon: BsGithub, href: 'https://github.com/SPUMP-COIN', label: 'GitHub' },
    { Icon: BsTelegram, href: 'https://t.me/spump_token', label: 'Telegram' },
  ];

  return (
    <footer className="relative z-10 px-4 py-8 md:py-12 lg:px-16 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Footer Links */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
          {footerLinks.map((link, index) => (
            <div key={link.label}>
              <a 
                href={link.href}
                className="ui-link text-sm md:text-base"
              >
                {link.label}
              </a>
              {index < footerLinks.length - 1 && (
                <span className="text-purple-500/50 hidden sm:inline">•</span>
              )}
            </div>
          ))}
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-4 md:gap-6 mb-6 md:mb-8">
          {socialLinks.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="ui-icon-btn"
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-purple-200" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-xs md:text-sm text-purple-300">
          <p>© Scotty Pumpkin. Powered by Web3 and you.</p>
        </div>
      </div>
    </footer>
  );
}