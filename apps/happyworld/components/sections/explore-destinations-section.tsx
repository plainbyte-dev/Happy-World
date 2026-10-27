import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const DestinationMap = dynamic(() => import('@/components/DestinationMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  return (
    <div className="destination-map-frame destination-map-skeleton" data-testid="destination-map-skeleton">
      <div className="destination-map-skeleton-pulse" />
    </div>
  );
}

function ExploreDestinationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="explore" className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto max-w-[1240px]">
        <span className="section-label">Where You Can Go</span>
        <h2 className="section-title mt-4" data-testid="text-explore-title">
          Explore Destinations
        </h2>
        <p className="body-large mt-6 max-w-[680px]" data-testid="text-explore-body">
          Tap into the map, spin the globe, and fly into the places we know best — each pin opens onto the trips
          built around it.
        </p>

        <div className="mt-10">{hasEntered ? <DestinationMap /> : <MapSkeleton />}</div>
      </div>
    </section>
  );
}

export default ExploreDestinationsSection;
