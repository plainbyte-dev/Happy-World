import { useState } from 'react';
import { ArrowDownRight, ArrowRight, MapPin } from 'lucide-react';
import { useSiteContent } from '@/lib/site-content-context';

type MobileMenuProps = {
  open: boolean;
  onNavigate: () => void;
  onEnquire: () => void;
};

function MobileMenu({ open, onNavigate, onEnquire }: MobileMenuProps) {
  const content = useSiteContent();
  const [tripsExpanded, setTripsExpanded] = useState(false);
  return (
    <div className={`mobile-menu ${open ? 'mobile-menu-open' : ''}`} aria-hidden={!open}>
      <div className="mobile-menu-inner">
        <p className="eyebrow text-[#c9a227]">NEPAL · SINCE 2008</p>
        <nav className="mt-12 flex flex-col gap-5" aria-label="Mobile navigation">
          {content.nav.map((item, index) =>
            item.label.trim() === 'Trips' ? (
              <div key={item.href} className="mobile-nav-trips">
                <button
                  type="button"
                  className="mobile-nav-link mobile-nav-trips-toggle"
                  onClick={() => setTripsExpanded((v) => !v)}
                  aria-expanded={tripsExpanded}
                  data-testid="button-mobile-trips"
                >
                  {item.label}
                  <ArrowDownRight size={25} strokeWidth={1.4} />
                </button>
                {tripsExpanded ? (
                  <div className="mobile-nav-trips-list">
                    {content.tripsMenu.map((category) => (
                      <a
                        key={category.key}
                        href={category.href}
                        onClick={onNavigate}
                        className="mobile-nav-trips-item"
                        data-testid={`link-mobile-trips-${category.key}`}
                      >
                        {category.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <a key={item.href} href={item.href} onClick={onNavigate} className="mobile-nav-link" data-testid={`link-mobile-${index}`}>
                {item.label}<ArrowDownRight size={25} strokeWidth={1.4} />
              </a>
            ),
          )}
        </nav>
        <button type="button" className="button-coral mt-14" onClick={onEnquire} data-testid="button-mobile-enquire">
          Start your journey <ArrowRight size={17} />
        </button>
        <div className="mt-auto flex items-center gap-4 border-t border-[#263a63] pt-5 text-sm text-[#d6d9ec]">
          <MapPin size={15} /> Kathmandu, Nepal
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
