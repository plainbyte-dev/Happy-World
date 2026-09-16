import { ArrowRight } from 'lucide-react';
import { content } from '@/data/content';

function IntroductionSection() {
  return (
    <section id="way" className="intro-section px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
        <div>
          <p className="eyebrow text-[#b8860b]" data-testid="text-intro-kicker">{content.introduction.kicker}</p>
          <div className="mt-6 flex items-center gap-3 text-[#b8860b]">
            <span className="h-px w-16 bg-[#b8860b]" /><span className="font-mono-display text-[10px]">01 / 04</span>
          </div>
        </div>
        <div>
          <h2 className="section-title whitespace-pre-line" data-testid="text-intro-title">{content.introduction.title}</h2>
          <p className="body-large mt-8 max-w-[680px]" data-testid="text-intro-body">{content.introduction.body}</p>
          <a href="#enquiry" className="inline-link mt-10" data-testid="link-intro-enquire">Tell us what you are looking for <ArrowRight size={16} /></a>
        </div>
      </div>
    </section>
  );
}

export default IntroductionSection;
