'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { FaqItem } from '@/lib/packages';

type FaqSectionProps = {
  faqs: FaqItem[];
};

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div>
      <span className="section-label">Questions Answered</span>
      <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground mb-10">
        Frequently
        <span> Asked</span>
      </h2>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={faq.question} className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary/30' : ''}`}>
              <button onClick={() => setOpenIdx(isOpen ? null : i)} className="w-full flex items-center gap-4 p-5 sm:p-6 text-left group" aria-expanded={isOpen}>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1 font-bold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">{faq.question}</span>
                <Icon name="ChevronDownIcon" size={18} className={`text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
              </button>

              {isOpen ? (
                <div className="px-5 sm:px-6 pb-6 pl-16 sm:pl-[4.5rem]">
                  <p className="text-sm text-foreground/70 leading-relaxed">{faq.answer}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Contact CTA */}
      <div className="mt-10 glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border-primary/20">
        <div className="flex-1">
          <p className="font-bold text-foreground mb-1">Still have questions?</p>
          <p className="text-sm text-muted-foreground">Our travel specialists are available to help you plan your trip.</p>
        </div>
        <a href="mailto:happyworldtt@gmail.com" className="btn-outline flex-shrink-0 whitespace-nowrap">
          Contact Us
        </a>
      </div>
    </div>
  );
}
