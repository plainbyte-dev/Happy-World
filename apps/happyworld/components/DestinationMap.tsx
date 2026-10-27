'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Map, { Marker, Popup, type MapRef } from 'react-map-gl/maplibre';
import { setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import destinationsData from '@/data/destinations.json';

// maplibre-gl ships its tile-processing worker as a separate ESM chunk and
// resolves its URL relative to its own bundled location by default, which
// doesn't survive Next.js/Turbopack's chunk renaming. Point it at a static copy
// in public/ instead (kept in sync by the postinstall script in package.json).
if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre-gl-worker.mjs');
}

type Category = 'trekking' | 'wildlife' | 'culture' | 'adventure';

type Destination = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  description: string;
  image: string;
  tourUrl: string;
  category: Category;
};

const destinations = destinationsData as Destination[];

// CARTO's free vector basemap — no API key required. Overridable via env if the
// site ever wants a paid/branded style instead.
const MAP_STYLE =
  process.env.NEXT_PUBLIC_MAPLIBRE_STYLE_URL || 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// AWS Open Data's Terrarium-encoded elevation tiles — also free, no API key.
const TERRAIN_TILES = ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'];

const NEPAL_VIEW = { longitude: 84.5, latitude: 28.2, zoom: 5.2, pitch: 0, bearing: 0 };
const FLY_TO_ZOOM = 9;
const FLY_TO_PITCH = 60;

const CATEGORY_LABELS: Record<Category, string> = {
  trekking: 'Trekking',
  wildlife: 'Wildlife',
  culture: 'Culture',
  adventure: 'Adventure',
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function useIsTouchDevice(): boolean {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return touch;
}

export default function DestinationMap() {
  const mapRef = useRef<MapRef>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  const [mapReady, setMapReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Destination | null>(null);

  const categories = useMemo(() => {
    const present = new Set(destinations.map((d) => d.category));
    return (Object.keys(CATEGORY_LABELS) as Category[]).filter((c) => present.has(c));
  }, []);

  const visibleDestinations = useMemo(
    () => (activeCategory === 'all' ? destinations : destinations.filter((d) => d.category === activeCategory)),
    [activeCategory],
  );

  const flyDuration = reducedMotion ? 0 : 3000;

  const flyToDestination = useCallback(
    (destination: Destination) => {
      const map = mapRef.current?.getMap();
      if (!map) return;
      map.flyTo({
        center: [destination.lng, destination.lat],
        zoom: FLY_TO_ZOOM,
        pitch: FLY_TO_PITCH,
        duration: flyDuration,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        essential: true,
      });
      setSelected(destination);
      setTooltipId(null);
    },
    [flyDuration],
  );

  const resetView = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.flyTo({
      center: [NEPAL_VIEW.longitude, NEPAL_VIEW.latitude],
      zoom: NEPAL_VIEW.zoom,
      pitch: 0,
      bearing: 0,
      duration: flyDuration,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      essential: true,
    });
    setSelected(null);
    setTooltipId(null);
  }, [flyDuration]);

  const handleMarkerActivate = useCallback(
    (destination: Destination) => {
      if (isTouch && tooltipId !== destination.id) {
        // First tap on touch: preview the name only, mirroring hover on desktop.
        setTooltipId(destination.id);
        return;
      }
      flyToDestination(destination);
    },
    [isTouch, tooltipId, flyToDestination],
  );

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.setProjection({ type: 'globe' });

    if (!map.getSource('terrain')) {
      map.addSource('terrain', {
        type: 'raster-dem',
        tiles: TERRAIN_TILES,
        tileSize: 256,
        encoding: 'terrarium',
        maxzoom: 15,
      });
    }
    map.setTerrain({ source: 'terrain', exaggeration: 1.5 });

    setMapReady(true);
  }, []);

  return (
    <div data-testid="destination-map-root">
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter destinations by category">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`map-filter-chip ${activeCategory === 'all' ? 'map-filter-chip-active' : ''}`}
          aria-pressed={activeCategory === 'all'}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`map-filter-chip ${activeCategory === category ? 'map-filter-chip-active' : ''}`}
            aria-pressed={activeCategory === category}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
        <button type="button" onClick={resetView} className="map-filter-chip map-filter-chip-reset" data-testid="button-reset-map-view">
          Reset view
        </button>
      </div>

      <div className="destination-map-frame">
        <Map
          ref={mapRef}
          mapStyle={MAP_STYLE}
          initialViewState={NEPAL_VIEW}
          style={{ width: '100%', height: '100%' }}
          onLoad={onMapLoad}
          attributionControl={{ compact: true }}
        >
          {mapReady &&
            visibleDestinations.map((destination) => (
              <Marker
                key={destination.id}
                longitude={destination.lng}
                latitude={destination.lat}
                anchor="bottom"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${destination.name}`}
                  className="destination-marker"
                  onMouseEnter={() => !isTouch && setTooltipId(destination.id)}
                  onMouseLeave={() => !isTouch && setTooltipId((current) => (current === destination.id ? null : current))}
                  onClick={() => handleMarkerActivate(destination)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      flyToDestination(destination);
                    }
                  }}
                >
                  <span className="destination-marker-pulse" aria-hidden="true" />
                  <span className="destination-marker-dot" aria-hidden="true" />
                  {tooltipId === destination.id ? (
                    <span className="destination-marker-tooltip" role="tooltip">
                      {destination.name}
                    </span>
                  ) : null}
                </div>
              </Marker>
            ))}

          {selected ? (
            <Popup
              longitude={selected.lng}
              latitude={selected.lat}
              anchor="top"
              offset={16}
              onClose={() => setSelected(null)}
              closeOnClick={false}
              className="destination-popup"
            >
              <div className="destination-popup-card">
                <div className="relative h-32 w-full overflow-hidden rounded-t-xl">
                  <AppImage src={selected.image} alt={selected.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-serif text-base font-bold text-[#1a2650]">{selected.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#56607d]">{selected.description}</p>
                  <Link href={selected.tourUrl} className="destination-popup-link">
                    View tours
                  </Link>
                </div>
              </div>
            </Popup>
          ) : null}
        </Map>
      </div>
    </div>
  );
}
