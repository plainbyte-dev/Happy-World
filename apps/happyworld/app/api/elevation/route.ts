import { NextResponse } from 'next/server';

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/elevation';
const TIMEOUT_MS = 8000;
const MAX_LOCATIONS = 50;

type LocationInput = { lat: number; lng: number };

function isValidLocation(value: unknown): value is LocationInput {
  if (!value || typeof value !== 'object') return false;
  const { lat, lng } = value as Record<string, unknown>;
  return (
    typeof lat === 'number' && Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
    typeof lng === 'number' && Number.isFinite(lng) && lng >= -180 && lng <= 180
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const locations = (body as { locations?: unknown } | null)?.locations;
  if (!Array.isArray(locations) || locations.length === 0) {
    return NextResponse.json({ success: false, error: 'Provide a non-empty "locations" array of { lat, lng }.' }, { status: 400 });
  }
  if (locations.length > MAX_LOCATIONS) {
    return NextResponse.json({ success: false, error: `Too many locations — max ${MAX_LOCATIONS} per request.` }, { status: 400 });
  }
  if (!locations.every(isValidLocation)) {
    return NextResponse.json({ success: false, error: 'Each location needs lat in [-90, 90] and lng in [-180, 180].' }, { status: 400 });
  }

  const typedLocations = locations as LocationInput[];
  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set('latitude', typedLocations.map((loc) => loc.lat).join(','));
  url.searchParams.set('longitude', typedLocations.map((loc) => loc.lng).join(','));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });

    if (res.status === 429) {
      return NextResponse.json({ success: false, error: 'Open-Meteo is rate-limiting requests right now — try again shortly.' }, { status: 429 });
    }
    if (!res.ok) {
      return NextResponse.json({ success: false, error: `Open-Meteo returned an error (${res.status}).` }, { status: 502 });
    }

    const json = (await res.json()) as { elevation?: number[] };
    if (!Array.isArray(json.elevation) || json.elevation.length !== typedLocations.length) {
      return NextResponse.json({ success: false, error: 'Open-Meteo returned an unexpected response.' }, { status: 502 });
    }

    const elevations = json.elevation.map((value) => Math.round(value));
    return NextResponse.json({ success: true, elevations });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ success: false, error: 'Open-Meteo took too long to respond.' }, { status: 504 });
    }
    return NextResponse.json({ success: false, error: 'Could not reach Open-Meteo.' }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
