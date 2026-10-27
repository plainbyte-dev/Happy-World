'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Map, { Marker, Popup, type MapRef } from 'react-map-gl/maplibre';
import { setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// maplibre-gl ships its tile-processing worker as a separate ESM chunk and
// resolves its URL relative to its own bundled location by default, which
// doesn't survive Next.js/Turbopack's chunk renaming. Point it at a static copy
// in public/ instead (kept in sync by the postinstall script in package.json).
if (typeof window !== 'undefined') {
  setWorkerUrl('/maplibre-gl-worker.mjs');
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://happy-world-admin-backend-neon.vercel.app';

// What the backend's Destination model actually stores (apps/admin-backend/src/models/Destination.ts)
// — just a name and, for destinations added since the map shipped, coordinates. There's no
// description/image/category/tourUrl on this model, unlike the Package model, so the map's UI is
// intentionally minimal to match: a name and a generic link to browse tours, nothing invented.
type ApiDestination = {
  _id: string;
  name: string;
  lat?: number;
  lng?: number;
};

type Destination = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

// CARTO's free vector basemap — no API key required. Overridable via env if the
// site ever wants a paid/branded style instead.
const MAP_STYLE =
  process.env.NEXT_PUBLIC_MAPLIBRE_STYLE_URL || 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// AWS Open Data's Terrarium-encoded elevation tiles — also free, no API key.
const TERRAIN_TILES = ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'];

const NEPAL_VIEW = { longitude: 84.1, latitude: 28.3, zoom: 6.4, pitch: 0, bearing: 0 };
const FLY_TO_ZOOM = 9;
const FLY_TO_PITCH = 60;

async function fetchDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(`${API_BASE}/api/destinations`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data?: ApiDestination[] };
    if (!json.success || !Array.isArray(json.data)) return [];
    // Destinations added before lat/lng existed on the model won't have them —
    // skip rather than plot a marker at (0, 0) or crash on a missing value.
    return json.data
      .filter((d): d is ApiDestination & { lat: number; lng: number } => typeof d.lat === 'number' && typeof d.lng === 'number')
      .map((d) => ({ id: d._id, name: d.name, lat: d.lat, lng: d.lng }));
  } catch {
    return [];
  }
}

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
  const [destinations, setDestinations] = useState<Destination[] | null>(null);
  const [tooltipId, setTooltipId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Destination | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchDestinations().then((result) => {
      if (!cancelled) setDestinations(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-[#56607d]">
          {destinations === null
            ? 'Loading destinations…'
            : destinations.length === 0
              ? 'No destinations with coordinates yet.'
              : `${destinations.length} destination${destinations.length === 1 ? '' : 's'}`}
        </p>
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
            destinations?.map((destination) => (
              <Marker key={destination.id} longitude={destination.lng} latitude={destination.lat} anchor="bottom">
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
                <div className="p-4">
                  <p className="font-serif text-base font-bold text-[#1a2650]">{selected.name}</p>
                  <Link href="/tour-types" className="destination-popup-link">
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
