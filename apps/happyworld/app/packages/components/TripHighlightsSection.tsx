import Icon from '@/components/ui/AppIcon';

type TripHighlightsSectionProps = {
  highlights: string[];
};

export default function TripHighlightsSection({ highlights }: TripHighlightsSectionProps) {
  return (
    <div>
      <span className="section-label">Trip Highlights</span>
      <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground mb-6">
        What Makes
        <span> This Trip</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {highlights.map((item) => (
          <div key={item} className="flex items-start gap-3 glass-card rounded-2xl p-4">
            <Icon name="CheckCircleIcon" size={18} className="text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
