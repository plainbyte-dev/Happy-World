'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useToast } from '../../../components/admin/Toast';
import { NEPAL_DISTRICTS } from '../../../constants/nepalDistricts';
import { api, ApiRequestError } from '../../../lib/api';
import { inputClass } from '../../../lib/formStyles';
import type { DestinationRecord } from '../../../lib/types';

export default function DestinationsPage() {
  const { showToast } = useToast();
  const [destinations, setDestinations] = useState<DestinationRecord[] | null>(null);
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [adding, setAdding] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const data = await api.get<DestinationRecord[]>('/api/admin/destinations');
      setDestinations(data);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : 'Failed to load destinations', 'error');
      setDestinations([]);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showSuggestions) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  async function lookupCoordinates(destinationName: string) {
    const trimmed = destinationName.trim();
    if (!trimmed) return;
    setLookingUp(true);
    try {
      const result = await api.get<{ lat: number; lng: number }>(
        `/api/admin/destinations/geocode?name=${encodeURIComponent(trimmed)}`,
      );
      setLat(String(result.lat));
      setLng(String(result.lng));
      showToast('Coordinates found — double-check them before saving', 'success');
    } catch (err) {
      showToast(
        err instanceof ApiRequestError ? err.message : 'Could not look up coordinates — enter them manually',
        'error',
      );
    } finally {
      setLookingUp(false);
    }
  }

  async function addDestination(destinationName: string, latValue: string, lngValue: string) {
    const trimmed = destinationName.trim();
    const latNum = Number(latValue);
    const lngNum = Number(lngValue);
    if (!trimmed) return;
    if (latValue.trim() === '' || lngValue.trim() === '' || Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      showToast('Enter a valid latitude and longitude — both are required so the destination can appear on the map', 'error');
      return;
    }
    setAdding(true);
    try {
      const created = await api.post<DestinationRecord>('/api/admin/destinations', { name: trimmed, lat: latNum, lng: lngNum });
      setDestinations((prev) => [...(prev ?? []), created].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setLat('');
      setLng('');
      setShowSuggestions(false);
      showToast('Destination added', 'success');
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : 'Failed to add destination', 'error');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string, destinationName: string) {
    if (!window.confirm(`Delete "${destinationName}"? Packages already tagged with it will keep the name, but it won't be selectable for new ones.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/destinations/${id}`);
      setDestinations((prev) => prev?.filter((d) => d._id !== id) ?? null);
      showToast('Destination deleted', 'success');
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : 'Failed to delete destination', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  const existingNames = new Set((destinations ?? []).map((d) => d.name.toLowerCase()));
  const suggestions = NEPAL_DISTRICTS.filter(
    (district) => !existingNames.has(district.toLowerCase()) && district.toLowerCase().includes(name.trim().toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Destinations</h1>
        <p className="mt-1 text-sm text-slate-500">The places packages can be tagged with, shown in the package form&apos;s destination picker.</p>
      </div>

      <div ref={containerRef} className="relative">
        <form
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            void addDestination(name, lat, lng);
          }}
          className="flex flex-wrap gap-3"
        >
          <input
            className={`${inputClass} min-w-[220px] flex-1`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search Nepal's 77 districts, or type your own"
            maxLength={60}
            autoComplete="off"
          />
          <input
            className={`${inputClass} w-32`}
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            placeholder="Latitude"
            type="number"
            step="any"
            min={-90}
            max={90}
          />
          <input
            className={`${inputClass} w-32`}
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            placeholder="Longitude"
            type="number"
            step="any"
            min={-180}
            max={180}
          />
          <button
            type="button"
            onClick={() => void lookupCoordinates(name)}
            disabled={lookingUp || !name.trim()}
            className="shrink-0 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {lookingUp ? 'Looking up…' : 'Look up coordinates'}
          </button>
          <button
            type="submit"
            disabled={adding || !name.trim()}
            className="shrink-0 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {adding ? 'Adding…' : '+ Add destination'}
          </button>
        </form>
        <p className="mt-1.5 text-xs text-slate-400">
          Latitude/longitude are required so this destination can show as a pin on the public site&apos;s map. Use
          &ldquo;Look up coordinates&rdquo; to auto-fill them from the name (via OpenStreetMap), then double-check
          before saving — or enter them manually from Google Maps (right-click a point → the coordinates are the
          first entry).
        </p>

        {showSuggestions && (
          <div className="absolute z-10 mt-1 max-h-64 w-full max-w-md overflow-y-auto rounded-md border border-slate-300 bg-white py-1 shadow-lg">
            {suggestions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-slate-400">
                {name.trim() ? 'No matching district — press "Add destination" to add it as typed.' : 'All 77 districts are already added.'}
              </p>
            ) : (
              suggestions.map((district) => (
                <button
                  key={district}
                  type="button"
                  onClick={() => {
                    setName(district);
                    setShowSuggestions(false);
                    void lookupCoordinates(district);
                  }}
                  className="block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  {district}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {destinations === null ? (
        <p className="text-sm text-slate-500">Loading destinations…</p>
      ) : destinations.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
          No destinations yet. Add your first one above.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {destinations.map((destination) => (
              <li key={destination._id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-slate-900">{destination.name}</span>
                  {destination.lat !== undefined && destination.lng !== undefined ? (
                    <span className="ml-2 text-xs text-slate-400">
                      {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                    </span>
                  ) : (
                    <span className="ml-2 text-xs text-amber-600">No coordinates — won&apos;t show on the map</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(destination._id, destination.name)}
                  disabled={deletingId === destination._id}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {deletingId === destination._id ? 'Deleting…' : 'Delete'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
