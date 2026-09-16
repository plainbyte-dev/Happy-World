import type { LucideIcon } from 'lucide-react';

export type StatItem = {
  icon: LucideIcon;
  value: string;
  label: string;
};

type StatRowProps = {
  items: StatItem[];
  variant?: 'hero' | 'card';
};

function StatRow({ items, variant = 'card' }: StatRowProps) {
  return (
    <div className={`pkg-stat-row pkg-stat-row-${variant}`}>
      {items.map((item) => (
        <div key={item.label} className="pkg-stat">
          <item.icon size={variant === 'hero' ? 18 : 16} className="pkg-stat-icon" />
          <div className="pkg-stat-text">
            <span className="pkg-stat-value">{item.value}</span>
            <span className="pkg-stat-label">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatRow;
