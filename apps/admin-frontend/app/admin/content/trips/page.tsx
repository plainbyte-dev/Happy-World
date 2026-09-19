'use client';

import { useFieldArray } from 'react-hook-form';
import { LoadError } from '../../../../components/admin/content/LoadError';
import { SaveBar } from '../../../../components/admin/content/SaveBar';
import { TripsCategoryCard } from '../../../../components/admin/content/TripsCategoryCard';
import { useSiteContentSection } from '../../../../lib/useSiteContentSection';
import { tripsMenuSchema, type TripsMenuInput } from '../../../../schemas/siteContent.schema';

export default function TripsMenuPage() {
  const { form, loading, error, saving, submit } = useSiteContentSection<TripsMenuInput>('tripsMenu', tripsMenuSchema);
  const { control, register, formState } = form;
  const { fields } = useFieldArray({ control, name: 'value' });

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  if (error) {
    return <LoadError message={error} />;
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Trips &amp; destinations</h1>
        <p className="mt-1 text-sm text-slate-500">
          The &ldquo;Trips&rdquo; mega-menu and its destination cards. Categories are fixed (Nepal Tours, Trekking, Kailash)
          since they&apos;re also the categories packages are filed under; destinations within each can be added, edited or
          removed.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <TripsCategoryCard
            key={field.id}
            control={control}
            register={register}
            errors={formState.errors}
            categoryIndex={index}
            categoryKey={field.key}
          />
        ))}
      </div>

      <SaveBar saving={saving} onSave={() => void submit()} />
    </div>
  );
}
