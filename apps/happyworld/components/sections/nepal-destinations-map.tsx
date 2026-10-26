import type { SiteContent } from '@/lib/site-content';

// Stylized, not cartographically precise — positions are a simple equirectangular
// approximation (longitude → x, latitude → y) over Nepal's real bounding box
// (80.0–88.2°E, 26.3–30.4°N) mapped onto a 400x200 viewBox, so relative placement
// between destinations is accurate even though the outline itself is illustrative.
// Add an entry here for a destination before it can appear on the map — labels
// not listed are skipped rather than guessed at.
// labelBelow flips the label to sit under its pin instead of above, used to
// de-clutter the Lumbini/Chitwan/Janakpur cluster along the southern Terai belt,
// which are genuinely close together at this scale.
const DESTINATION_COORDS: Record<string, { x: number; y: number; labelBelow?: boolean }> = {
  kathmandu: { x: 258, y: 132 },
  pokhara: { x: 190, y: 107 },
  chitwan: { x: 222, y: 142, labelBelow: true },
  lumbini: { x: 148, y: 140 },
  janakpur: { x: 286, y: 148, labelBelow: true },
  ilam: { x: 368, y: 105 },
};

function uniqueDestinationLabels(tripsMenu: SiteContent['tripsMenu']): string[] {
  const seen = new Set<string>();
  const labels: string[] = [];
  tripsMenu.forEach((category) => {
    category.destinations.forEach((destination) => {
      const key = destination.label.trim();
      const lookupKey = key.toLowerCase();
      if (!DESTINATION_COORDS[lookupKey] || seen.has(lookupKey)) return;
      seen.add(lookupKey);
      labels.push(key);
    });
  });
  return labels;
}

type NepalDestinationsMapProps = {
  tripsMenu: SiteContent['tripsMenu'];
};

function NepalDestinationsMap({ tripsMenu }: NepalDestinationsMapProps) {
  const labels = uniqueDestinationLabels(tripsMenu);
  if (labels.length === 0) return null;

  return (
    <div className="mt-12 max-w-[560px]" data-testid="map-nepal-destinations">
      <svg viewBox="0 0 400 200" className="w-full h-auto" role="img" aria-label="Map of Nepal showing our destinations">
        <path
          d="M 10,120
            C 8,105 18,92 35,82
            L 55,88 L 72,62 L 92,78 L 115,50 L 138,70 L 165,42 L 190,66
            L 215,38 L 240,60 L 268,44 L 292,64 L 318,48 L 342,66 L 365,54
            C 382,62 394,76 393,92
            C 392,106 378,116 358,124
            C 320,152 265,168 205,170
            C 145,170 90,160 50,148
            C 26,141 12,133 10,120 Z"
          fill="#1a2650"
          fillOpacity={0.06}
          stroke="#1a2650"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {labels.map((label) => {
          const point = DESTINATION_COORDS[label.toLowerCase()];
          return (
            <g key={label}>
              <circle cx={point.x} cy={point.y} r={4.5} fill="#c9a227" stroke="#faf7f0" strokeWidth={1.5} />
              <text
                x={point.x}
                y={point.labelBelow ? point.y + 19 : point.y - 11}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="#1a2650"
                fontFamily="var(--app-font-sans)"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default NepalDestinationsMap;
