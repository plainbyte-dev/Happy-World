import type { EnquiryValues } from '@/lib/enquiry-schema';

const INTEREST_LABELS: Record<string, string> = {
  trekking: 'Trekking & high trails',
  pilgrimage: 'Pilgrimage & sacred places',
  heritage: 'Heritage & culture',
  'not-sure': 'Not sure yet',
};

export function buildEnquiryWhatsappUrl(phone: string, values: EnquiryValues) {
  const lines = [
    `Hi! I'd like to enquire about a trip.`,
    '',
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    `Interested in: ${INTEREST_LABELS[values.interest] ?? values.interest}`,
    '',
    values.message,
  ];
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}
