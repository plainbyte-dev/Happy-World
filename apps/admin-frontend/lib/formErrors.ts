import type { FieldErrors } from 'react-hook-form';

export function getFirstErrorPath(errors: FieldErrors, prefix = ''): string | null {
  for (const key of Object.keys(errors)) {
    if (key === 'root') continue;
    const value = (errors as Record<string, unknown>)[key];
    if (!value || typeof value !== 'object') continue;
    const path = prefix ? `${prefix}.${key}` : key;
    const node = value as { message?: unknown; type?: unknown };
    if (typeof node.message === 'string' && typeof node.type !== 'undefined') {
      return path;
    }
    const nested = getFirstErrorPath(value as FieldErrors, path);
    if (nested) return nested;
  }
  return null;
}

export function getServerErrorItineraryDayIndices(fields: Record<string, string>): number[] {
  const indices = new Set<number>();
  Object.keys(fields).forEach((path) => {
    const match = /^itinerary\.(\d+)\./.exec(path);
    if (match) indices.add(Number(match[1]));
  });
  return Array.from(indices);
}

export function getErrorItineraryDayIndices(errors: FieldErrors): number[] {
  const itineraryErrors = (errors as Record<string, unknown>).itinerary;
  if (!itineraryErrors || typeof itineraryErrors !== 'object') return [];
  const indices: number[] = [];
  for (const key of Object.keys(itineraryErrors)) {
    const index = Number(key);
    if (!Number.isNaN(index)) indices.push(index);
  }
  return indices;
}
