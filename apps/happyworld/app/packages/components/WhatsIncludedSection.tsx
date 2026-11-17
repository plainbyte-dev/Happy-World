import Icon from '@/components/ui/AppIcon';

type WhatsIncludedSectionProps = {
  costIncludes: string[];
  costExcludes: string[];
};

export default function WhatsIncludedSection({ costIncludes, costExcludes }: WhatsIncludedSectionProps) {
  return (
    <div>
      <span className="section-label">Cost Details</span>
      <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground mb-6">
        What&apos;s
        <span> Included</span>
      </h2>
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
    </div>
  );
}
