"use client";
import { useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import BrandMark from '@/components/brand-mark';
import { content } from '@/data/content';

function SiteFooter() {
  const [tripsOpen, setTripsOpen] = useState(false);

  return (
    <footer className="footer-section px-5 pb-7 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-[#263a63] pb-14 md:grid-cols-[1.4fr_.7fr_.7fr]">
          <div>
            <div className="flex items-center gap-3"><div className="footer-logo-badge"><BrandMark /></div></div>
            <h2 className="mt-12 max-w-[450px] font-display text-5xl leading-[.92] text-[#ffffff] sm:text-6xl" data-testid="text-footer-statement">{content.footer.statement}</h2>
          </div>
          <div>
            <p className="eyebrow text-[#c9a227]">NAVIGATE</p>
            <nav className="mt-5 flex flex-col gap-3" aria-label="Footer navigation">
              {content.nav.map((item) => {
                const label = item.label.trim();
                const testId = `link-footer-${label.toLowerCase().replaceAll(' ', '-')}`;

                if (label === 'Trips') {
                  return (
                    <div key={item.href}>
                      <button
                        type="button"
                        className="footer-nav-link flex items-center gap-2"
                        onClick={() => setTripsOpen((open) => !open)}
                        aria-expanded={tripsOpen}
                        data-testid={testId}
                      >
                        {label}
                        <span aria-hidden="true">{tripsOpen ? '−' : '+'}</span>
                      </button>
                      {tripsOpen && (
                        <div className="mt-3 flex flex-col gap-3 pl-3">
                          {content.tripsMenu.map((category) => (
                            <Link
                              key={category.key}
                              href={category.href}
                              className="footer-nav-link text-[13px] text-[#b7bfd8]"
                              data-testid={`link-footer-trips-${category.key}`}
                            >
                              {category.label}
                              
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a key={item.href} href={item.href} className="footer-nav-link" data-testid={testId}>
                    {label}
                  </a>
                );
              })}
            </nav>
          </div>
          <div>
            <p className="eyebrow text-[#c9a227]">FOLLOW ALONG</p>
            <div className="mt-5 flex gap-3">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram" data-testid="link-social-instagram"><FaInstagram size={17} /></a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook" data-testid="link-social-facebook"><FaFacebook size={17} /></a>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] tracking-[.13em] text-[#8890b0] sm:flex-row">
          <span>© 2023 HAPPY WORLD · MADE IN KATHMANDU</span>
          <span>TRAVEL WITH CARE · LEAVE A LIGHT TRACE</span>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
