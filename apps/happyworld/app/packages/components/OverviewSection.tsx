import Icon from '@/components/ui/AppIcon';
import type { GuideProfile } from '@/lib/packages';

type OverviewSectionProps = {
  description: string;
  highlights: string[];
  costIncludes: string[];
  costExcludes: string[];
  guide?: GuideProfile;
  heroVideo?: string;
};

export default function OverviewSection({ description, highlights, costIncludes, costExcludes, guide, heroVideo }: OverviewSectionProps) {
  const hasCosts = costIncludes.length > 0 || costExcludes.length > 0;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <span className="section-label">Trip Overview</span>
        <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground mb-4">
          About This
          <span> Trip</span>
        </h2>
        <p className="text-foreground/70 text-sm sm:text-base leading-relaxed max-w-3xl whitespace-pre-line">{description}</p>
      </div>

      {heroVideo ? (
        <div className="glass-card rounded-3xl overflow-hidden">
          <video src={heroVideo} controls className="w-full h-auto max-h-[480px] bg-black" />
        </div>
      ) : null}

      {highlights.length > 0 ? (
        <div>
          <h3 className="font-bold text-sm uppercase tracking-[0.3em] text-muted-foreground mb-5">Trip Highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-3 glass-card rounded-2xl p-4">
                <Icon name="CheckCircleIcon" size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {hasCosts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {costIncludes.length > 0 ? (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-[0.3em] text-muted-foreground mb-5">What&apos;s Included</h3>
              <ul className="flex flex-col gap-3">
                {costIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                    <Icon name="CheckIcon" size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {costExcludes.length > 0 ? (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-[0.3em] text-muted-foreground mb-5">What&apos;s Not Included</h3>
              <ul className="flex flex-col gap-3">
                {costExcludes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                    <Icon name="XMarkIcon" size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {guide ? (
        <div>
          <h3 className="font-bold text-sm uppercase tracking-[0.3em] text-muted-foreground mb-5">Meet Your Guide</h3>
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded guide photo from an arbitrary host, not a local/optimizable asset */}
            <img src={guide.photo} alt={guide.name} className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
            <div>
              <p className="font-serif text-xl font-bold text-foreground mb-2">{guide.name}</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{guide.bio}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
