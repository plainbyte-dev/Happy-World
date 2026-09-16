import { Suspense } from 'react';
import ContactPageClient from './contact-page-client';

export const metadata = {
  title: 'Contact Us',
  description: "Get in touch with Happy World Travel Tours — email, phone, or send us a message about your Nepal trip.",
  alternates: { canonical: '/contact' },
};

function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageClient />
    </Suspense>
  );
}

export default ContactPage;
