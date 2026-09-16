import type { UseFormReturn } from 'react-hook-form';
import { ArrowRight, Check, ChevronDown, Mail, Phone } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { EnquiryValues } from '@/lib/enquiry-schema';

type EnquirySectionProps = {
  form: UseFormReturn<EnquiryValues>;
  submitted: boolean;
  onSubmit: (values: EnquiryValues) => void;
  onSendAnother: () => void;
};

function EnquirySection({ form, submitted, onSubmit, onSendAnother }: EnquirySectionProps) {
  return (
    <section id="enquiry" className="enquiry-section px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
        <div>
          <p className="eyebrow text-[#c9a227]">CONTACT US</p>
          <h2 className="mt-5 font-display text-6xl leading-[.88] text-[#ffffff] sm:text-7xl" data-testid="text-enquiry-title">A good journey<br /><span>starts here.</span></h2>
          <p className="mt-8 max-w-[380px] text-[16px] leading-relaxed text-[#c3c9e6]">Tell us what has been tugging at you. There is no perfect brief required — just a starting point.</p>
          <div className="mt-12 space-y-4 border-t border-[#2c3e68] pt-6">
            <a href="mailto:happyworldtt@gmail.com" className="contact-line" data-testid="link-email"><Mail size={16} /> happyworldtt@gmail.com</a>
            <a href="tel:+977984-0177646" className="contact-line" data-testid="link-phone"><Phone size={16} /> +977 984-0177646</a>
          </div>
        </div>
        <div className="form-panel">
          {submitted ? (
            <div className="success-state" data-testid="status-enquiry-success">
              <span className="success-icon"><Check size={25} /></span>
              <p className="eyebrow text-[#c9a227]">MESSAGE RECEIVED</p>
              <h3 className="mt-4 font-display text-5xl leading-none text-[#ffffff]">We will be in touch.</h3>
              <p className="mt-5 max-w-[360px] text-sm leading-relaxed text-[#c3c9e6]">A real person from our Kathmandu team will write back within two working days. Until then, keep a little space in your day for daydreaming.</p>
              <button type="button" className="button-quiet mt-9" onClick={onSendAnother} data-testid="button-send-another">Send another note <ArrowRight size={16} /></button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel className="form-label">Your name</FormLabel><FormControl><input {...field} className="form-input" placeholder="How should we call you?" data-testid="input-enquiry-name" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel className="form-label">Email address</FormLabel><FormControl><input {...field} type="email" className="form-input" placeholder="you@example.com" data-testid="input-enquiry-email" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="interest" render={({ field }) => (
                  <FormItem><FormLabel className="form-label">I am drawn to</FormLabel><FormControl>
                    <div className="relative"><select {...field} className="form-input form-select" data-testid="select-enquiry-interest"><option value="">Choose a direction</option><option value="trekking">Trekking & high trails</option><option value="pilgrimage">Pilgrimage & sacred places</option><option value="heritage">Heritage & culture</option><option value="not-sure">I am not sure yet</option></select><ChevronDown size={15} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#c9a227]" /></div>
                  </FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem><FormLabel className="form-label">A little about the journey</FormLabel><FormControl><textarea {...field} className="form-input min-h-[118px] resize-y" placeholder="When are you thinking of coming? Who might be with you? What are you hoping to feel?" data-testid="textarea-enquiry-message" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="updates" render={({ field }) => (
                  <FormItem className="flex items-start gap-3 space-y-0"><FormControl><input type="checkbox" checked={field.value ?? false} onChange={field.onChange} className="form-checkbox mt-1" data-testid="checkbox-enquiry-updates" /></FormControl><FormLabel className="text-xs leading-relaxed text-[#c3c9e6]">Send me occasional notes from the trail. No noise, just good stories.</FormLabel></FormItem>
                )} />
                <button type="submit" disabled={form.formState.isSubmitting} className="button-coral w-full justify-center sm:w-auto" data-testid="button-submit-enquiry">
                  {form.formState.isSubmitting ? 'Sending…' : 'Send your enquiry'} <ArrowRight size={17} />
                </button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
}

export default EnquirySection;
