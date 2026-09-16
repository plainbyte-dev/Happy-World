'use client';

import { Controller, useWatch, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { PackageInput } from '../../../schemas/package.schema';
import { inputClass, labelClass } from '../../../lib/formStyles';
import { FieldError } from './FieldError';
import { ImageUploader } from './ImageUploader';
import { TagInput } from './TagInput';

interface ItineraryDayCardProps {
  index: number;
  control: Control<PackageInput>;
  register: UseFormRegister<PackageInput>;
  errors: FieldErrors<PackageInput>;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function ItineraryDayCard({
  index,
  control,
  register,
  errors,
  isOpen,
  onToggle,
  onRemove,
  canRemove,
}: ItineraryDayCardProps) {
  const title = useWatch({ control, name: `itinerary.${index}.title` });
  const dayErrors = errors.itinerary?.[index];

  function handleHeaderBlur(event: React.FocusEvent<HTMLDivElement>) {
    // relatedTarget is null when focus leaves the document entirely (e.g. the native
    // file picker opening for image upload) rather than moving to another field on the
    // page — only auto-collapse for genuine focus-to-elsewhere-on-page transitions.
    if (event.relatedTarget === null) return;
    if (!event.currentTarget.contains(event.relatedTarget as Node) && title && isOpen) {
      onToggle();
    }
  }

  return (
    <div className="rounded-md border border-slate-200" onBlur={handleHeaderBlur}>
      <div className="flex items-center justify-between gap-2 bg-slate-50 px-4 py-2.5">
        <button type="button" onClick={onToggle} className="flex flex-1 items-center gap-2 text-left text-sm font-medium text-slate-800">
          <span className="text-slate-400">{isOpen ? '▾' : '▸'}</span>
          Day {index + 1}
          {title ? ` — ${title}` : ''}
          {dayErrors && <span className="ml-1 text-xs font-normal text-red-600">has errors</span>}
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="text-xs font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          Remove day
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 border-t border-slate-200 p-4">
          <div>
            <label className={labelClass}>Activity title</label>
            <input className={inputClass} {...register(`itinerary.${index}.title`)} />
            <FieldError message={dayErrors?.title?.message} />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={3} className={inputClass} {...register(`itinerary.${index}.description`)} />
            <FieldError message={dayErrors?.description?.message} />
          </div>

          <div>
            <label className={labelClass}>Images</label>
            <Controller
              control={control}
              name={`itinerary.${index}.images`}
              render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} />}
            />
          </div>

          <div>
            <label className={labelClass}>Key activities</label>
            <Controller
              control={control}
              name={`itinerary.${index}.keyActivities`}
              render={({ field }) => (
                <TagInput value={field.value} onChange={field.onChange} placeholder="Type and press Enter" />
              )}
            />
            <FieldError message={dayErrors?.keyActivities?.message} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Accommodation</label>
              <input className={inputClass} {...register(`itinerary.${index}.accommodation`)} />
            </div>
            <div>
              <label className={labelClass}>Transportation</label>
              <input className={inputClass} {...register(`itinerary.${index}.transportation`)} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Meals included</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-sm text-slate-700">
                <input type="checkbox" {...register(`itinerary.${index}.meals.breakfast`)} />
                Breakfast
              </label>
              <label className="flex items-center gap-1.5 text-sm text-slate-700">
                <input type="checkbox" {...register(`itinerary.${index}.meals.lunch`)} />
                Lunch
              </label>
              <label className="flex items-center gap-1.5 text-sm text-slate-700">
                <input type="checkbox" {...register(`itinerary.${index}.meals.dinner`)} />
                Dinner
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
