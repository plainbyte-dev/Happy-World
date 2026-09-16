import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { DURATION_VALUES } from '../../../constants/duration';
import { CATEGORY_VALUES, DESTINATION_VALUES, type PackageInput } from '../../../schemas/package.schema';
import { inputClass, labelClass } from '../../../lib/formStyles';
import { FieldError } from './FieldError';
import { ImageUploader } from './ImageUploader';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { SectionCard } from './SectionCard';

interface BasicDetailsSectionProps {
  control: Control<PackageInput>;
  register: UseFormRegister<PackageInput>;
  errors: FieldErrors<PackageInput>;
}

const DURATION_LABELS: Record<(typeof DURATION_VALUES)[number], string> = {
  '3-4': '3–4 days',
  '5-7': '5–7 days',
  '8-10': '8–10 days',
  '10-12': '10–12 days',
};

const CATEGORY_LABELS: Record<(typeof CATEGORY_VALUES)[number], string> = {
  'nepal-tours': 'Nepal Tours',
  trekking: 'Trekking',
  kailash: 'Kailash',
};

export function BasicDetailsSection({ control, register, errors }: BasicDetailsSectionProps) {
  return (
    <SectionCard title="Basic details">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input id="title" className={inputClass} {...register('title')} />
          <FieldError message={errors.title?.message} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Cover image</label>
          <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
              <ImageUploader
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] ?? '')}
                max={1}
              />
            )}
          />
          <FieldError message={errors.coverImage?.message} />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Category
          </label>
          <select id="category" className={inputClass} {...register('category')}>
            {CATEGORY_VALUES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
          <FieldError message={errors.category?.message} />
        </div>

        <div>
          <label className={labelClass}>Destinations</label>
          <Controller
            control={control}
            name="destinations"
            render={({ field }) => (
              <MultiSelectDropdown
                options={DESTINATION_VALUES}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select destinations"
              />
            )}
          />
          <FieldError message={errors.destinations?.message} />
        </div>

        <div>
          <label htmlFor="duration" className={labelClass}>
            Duration
          </label>
          <select id="duration" className={inputClass} {...register('duration')}>
            {DURATION_VALUES.map((value) => (
              <option key={value} value={value}>
                {DURATION_LABELS[value]}
              </option>
            ))}
          </select>
          <FieldError message={errors.duration?.message} />
        </div>
      </div>
    </SectionCard>
  );
}
