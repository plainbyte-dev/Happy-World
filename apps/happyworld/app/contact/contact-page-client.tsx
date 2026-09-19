'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SiteChrome from '@/components/site-chrome';
import EnquirySection from '@/components/sections/enquiry-section';
import { useSiteContent } from '@/lib/site-content-context';
import { enquirySchema, type EnquiryValues } from '@/lib/enquiry-schema';
import { buildEnquiryWhatsappUrl } from '@/lib/whatsapp';
import { submitContactEnquiry } from '@/lib/contact';
import type { SiteContent } from '@/lib/site-content';

function buildContactMethods(content: SiteContent) {
  return [
    {
      icon: Mail,
      label: 'Email',
      value: content.footer.email,
      note: 'We reply within two working days.',
      href: `mailto:${content.footer.email}`,
    },
    {
      icon: Phone,
      label: 'Call',
      value: content.footer.phone,
      note: 'Kathmandu office, GMT+5:45.',
      href: `tel:${content.footer.phone.replace(/\s+/g, '')}`,
    },
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      value: 'Message us directly',
      note: 'Fastest way to reach the team.',
      href: `https://wa.me/${content.footer.whatsapp}?text=${encodeURIComponent("Hi! I'd like to know more about your Nepal trips.")}`,
      external: true,
    },
    {
      icon: MapPin,
      label: 'Visit',
      value: 'Kathmandu, Nepal',
      note: 'By appointment — just ask.',
      href: 'https://www.google.com/maps/search/?api=1&query=Kathmandu%2C+Nepal',
      external: true,
    },
  ];
}

function ContactPageClient() {
  const content = useSiteContent();
  const contactMethods = buildContactMethods(content);
  const searchParams = useSearchParams();
  const prefillMessage = searchParams.get('message') ?? '';
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: '', email: '', interest: '', message: prefillMessage, updates: false },
  });

  const submitEnquiry = async (values: EnquiryValues) => {
    await submitContactEnquiry(values);
    window.open(buildEnquiryWhatsappUrl(content.footer.whatsapp, values), '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    form.reset();
  };

  return (
    <SiteChrome solidNav>
      <main className="site-noise overflow-hidden bg-white text-[#1a2650]">
        {/* Hero */}
        <section className="px-5 sm:px-8 lg:px-12 pt-40 pb-14 sm:pt-48 sm:pb-16">
          <div className="max-w-[1440px] mx-auto">
            <span className="section-label">Get In Touch</span>
            <h1 className="font-serif text-display-lg font-bold tracking-tighter text-foreground">
              Let's plan your
              <span> Nepal.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Questions, a custom itinerary, or you just want to talk it through first — reach us however's easiest, or send a note below.
            </p>
          </div>
        </section>

        {/* Contact methods */}
        <section className="px-5 sm:px-8 lg:px-12 pb-20 sm:pb-28">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                target={method.external ? '_blank' : undefined}
                rel={method.external ? 'noreferrer' : undefined}
                className="group bg-card border border-border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#2f5f9e]/40 hover:shadow-lg"
                data-testid={`link-contact-${method.label.toLowerCase()}`}
              >
                <div className="w-11 h-11 rounded-2xl bg-[#2f5f9e]/10 text-[#2f5f9e] flex items-center justify-center transition-colors group-hover:bg-[#2f5f9e] group-hover:text-white">
                  <method.icon size={19} />
                </div>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{method.label}</p>
                <p className="mt-1 font-serif font-bold text-lg text-foreground leading-snug">{method.value}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{method.note}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Form */}
        <EnquirySection
          form={form}
          submitted={submitted}
          onSubmit={submitEnquiry}
          onSendAnother={() => setSubmitted(false)}
        />
      </main>
    </SiteChrome>
  );
}

export default ContactPageClient;
