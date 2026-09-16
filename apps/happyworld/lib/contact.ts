import type { EnquiryValues } from '@/lib/enquiry-schema';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://tours-travels-admin.onrender.com';

export async function submitContactEnquiry(values: EnquiryValues): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        interest: values.interest,
        message: values.message,
        updates: values.updates ?? false,
        source: 'website',
      }),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { success: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
