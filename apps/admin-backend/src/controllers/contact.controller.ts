import type { Request, Response } from 'express';
import { Contact } from '../models/Contact';
import { sendSuccess } from '../utils/apiResponse';
import { sendAdminMail } from '../utils/mailer';

const CUSTOM_TRIP_SOURCE = 'custom-itinerary';

export async function createContactEnquiry(req: Request, res: Response): Promise<void> {
  const enquiry = await Contact.create(req.body);

  // Awaited (not fire-and-forget) on purpose: on Vercel, a serverless function's
  // execution can be frozen right after the response is sent, so a background
  // promise started after sendSuccess() isn't guaranteed to ever finish. A failed
  // send is still swallowed here — the enquiry is already saved either way.
  const isCustomTrip = enquiry.source === CUSTOM_TRIP_SOURCE;
  const subject = isCustomTrip ? `New custom trip request from ${enquiry.name}` : `New enquiry from ${enquiry.name}`;
  const body = [
    isCustomTrip ? 'A visitor submitted a custom trip request.' : 'A visitor submitted a contact enquiry.',
    '',
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Interested in: ${enquiry.interest}`,
    `Source: ${enquiry.source}`,
    `Wants updates: ${enquiry.updates ? 'Yes' : 'No'}`,
    '',
    'Message:',
    enquiry.message,
  ].join('\n');

  try {
    await sendAdminMail(subject, body);
  } catch (err) {
    console.error('[mailer]: failed to send admin notification', err);
  }

  sendSuccess(res, enquiry, 201);
}
