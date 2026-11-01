'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

// What the backend's Destination model stores (apps/admin-backend/src/models/Destination.ts)
// — a name, coordinates (for destinations added since the map shipped), and an optional
// admin-written description. No image/category/tourUrl on this model, unlike the Package
// model, so the popup only ever shows real admin-entered text, nothing invented.
type ApiDestination = {
  _id: string;
  name: string;
  lat?: number;
  lng?: number;
  description?: string;
};

type Destination = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
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
      .map((d) => ({ id: d._id, name: d.name, lat: d.lat, lng: d.lng, description: d.description?.trim() || undefined }));
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

export default function DestinationMap() {
  const mapRef = useRef<MapRef>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [mapReady, setMapReady] = useState(false);
  const [destinations, setDestinations] = useState<Destination[] | null>(null);
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
  }, [flyDuration]);

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
                  onClick={() => flyToDestination(destination)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      flyToDestination(destination);
                    }
                  }}
                >
                  <span className="destination-marker-pulse" aria-hidden="true" />
                  <span className="destination-marker-dot" aria-hidden="true" />
                  <span className="destination-marker-label">{destination.name}</span>
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
                  {selected.description ? (
                    <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed text-[#56607d]">{selected.description}</p>
                  ) : null}
                </div>
              </div>
            </Popup>
          ) : null}
        </Map>
      </div>
    </div>
  );
}
