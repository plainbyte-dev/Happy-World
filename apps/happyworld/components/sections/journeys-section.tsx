import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/lib/site-content-context';

function JourneysSection() {
  const content = useSiteContent();
  return (
    <section id="journeys" className="journey-section px-5 pb-28 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-[#c9a227]">WAYS IN</p>
            <h2 className="mt-3 font-display text-5xl leading-[.93] text-[#ffffff] sm:text-6xl" data-testid="text-journeys-heading">Choose a direction.</h2>
          </div>
          <p className="max-w-[285px] text-sm leading-relaxed text-[#b7bfd8]">Different routes into the same feeling: more present, more connected, more alive.</p>
        </div>
        <div className="experience-grid">
          {content.experiences.map((experience, index) => (
            <Link
              key={experience.title}
              href={experience.href}
              className={`experience-card cursor-pointer ${index === 1 ? 'experience-card-tall' : ''}`}
              data-testid={`card-experience-${index + 1}`}
            >
              <img src={experience.image} alt={`${experience.title} in Nepal`} loading="lazy" />
              <div className="experience-overlay" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-[#c9a227]">{experience.kind}</span>
                </div>
                <h3 className="mt-3 font-display text-[2.35rem] leading-none text-[#ffffff]">{experience.title}</h3>
                <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-[#dfe2f0]">{experience.detail}</p>
                <span className="experience-link mt-6" data-testid={`button-experience-${index + 1}`}>
                  Start here <ArrowRight size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default JourneysSection;
