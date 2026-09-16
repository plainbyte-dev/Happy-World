'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm, useWatch, type Path, type Resolver } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { DURATION_DAY_RANGE, type Duration } from '../../constants/duration';
import { emptyItineraryDay } from '../../lib/defaultPackageValues';
import { ApiRequestError } from '../../lib/api';
import { getErrorItineraryDayIndices, getFirstErrorPath, getServerErrorItineraryDayIndices } from '../../lib/formErrors';
import { useLocalDraft } from '../../lib/useLocalDraft';
import { packageInputSchema, type PackageInput } from '../../schemas/package.schema';
import { useToast } from './Toast';
import { BasicDetailsSection } from './form/BasicDetailsSection';
import { BestTimeToVisitSection } from './form/BestTimeToVisitSection';
import { CostSection } from './form/CostSection';
import { DescriptionSection } from './form/DescriptionSection';
import { FaqsSection } from './form/FaqsSection';
import { FormFooterActions } from './form/FormFooterActions';
import { GuideSection } from './form/GuideSection';
import { ItinerarySection } from './form/ItinerarySection';
import { TestimonialsSection } from './form/TestimonialsSection';
import { TripDetailsSection } from './form/TripDetailsSection';

interface PackageFormProps {
  draftKey: string;
  defaultValues: PackageInput;
  onSubmit: (data: PackageInput) => Promise<void>;
}

export function PackageForm({ draftKey, defaultValues, onSubmit }: PackageFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [submittingStatus, setSubmittingStatus] = useState<'draft' | 'published' | null>(null);
  const [errorDayIndices, setErrorDayIndices] = useState<number[]>([]);
  const prevDurationRef = useRef<Duration>(defaultValues.duration);
  const isFirstDurationRun = useRef(true);

  const methods = useForm<PackageInput>({
    // zodResolver infers TFieldValues from the schema's input type, where defaulted
    // fields are optional; our defaultValues always supply every field concretely,
    // so we pin the resolver to the concrete (output) PackageInput type here.
    resolver: zodResolver(packageInputSchema) as Resolver<PackageInput>,
    defaultValues,
    mode: 'onBlur',
  });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = methods;

  const { hasDraft, restore, discard, clear } = useLocalDraft(draftKey, methods);
  const { fields, append, remove } = useFieldArray({ control, name: 'itinerary' });
  const duration = useWatch({ control, name: 'duration' });

  useEffect(() => {
    if (isFirstDurationRun.current) {
      isFirstDurationRun.current = false;
      prevDurationRef.current = duration;
      return;
    }
    const prev = prevDurationRef.current;
    if (prev === duration) return;

    const { min, max } = DURATION_DAY_RANGE[duration];
    const currentCount = fields.length;

    if (currentCount > max) {
      const confirmed = window.confirm(
        `Changing to a ${duration} day package allows a maximum of ${max} days. ${currentCount - max} day(s) will be removed. Continue?`,
      );
      if (!confirmed) {
        setValue('duration', prev);
        return;
      }
      for (let i = currentCount - 1; i >= max; i -= 1) {
        remove(i);
      }
    } else if (currentCount < min) {
      const additions = Array.from({ length: min - currentCount }, (_, i) => emptyItineraryDay(currentCount + i + 1));
      append(additions);
    }
    prevDurationRef.current = duration;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  function renumberAfterChange() {
    setTimeout(() => {
      const current = methods.getValues('itinerary');
      current.forEach((_, i) => setValue(`itinerary.${i}.day`, i + 1));
    }, 0);
  }

  function handleAddDay() {
    const { max } = DURATION_DAY_RANGE[duration];
    if (fields.length >= max) return;
    append(emptyItineraryDay(fields.length + 1));
  }

  function handleRemoveDay(index: number) {
    const { min } = DURATION_DAY_RANGE[duration];
    if (fields.length <= min) return;
    remove(index);
    renumberAfterChange();
  }

  async function submitAs(status: 'draft' | 'published') {
    setValue('status', status);
    setErrorDayIndices([]);
    await handleSubmit(
      async (data) => {
        setSubmittingStatus(status);
        try {
          await onSubmit({ ...data, status });
          clear();
          showToast(status === 'published' ? 'Package published' : 'Draft saved', 'success');
          router.push('/admin/packages');
        } catch (err) {
          if (err instanceof ApiRequestError && err.fields) {
            Object.entries(err.fields).forEach(([path, message]) => {
              setError(path as Path<PackageInput>, { type: 'server', message });
            });
            setErrorDayIndices(getServerErrorItineraryDayIndices(err.fields));
          }
          showToast(err instanceof Error ? err.message : 'Something went wrong', 'error');
        } finally {
          setSubmittingStatus(null);
        }
      },
      (formErrors) => {
        setErrorDayIndices(getErrorItineraryDayIndices(formErrors));
        const firstPath = getFirstErrorPath(formErrors);
        if (firstPath) {
          const el = document.querySelector<HTMLElement>(`[name="${firstPath}"]`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el?.focus();
        }
        showToast('Please fix the highlighted fields', 'error');
      },
    )();
  }

  function handleCancel() {
    if (window.confirm('Discard unsaved changes?')) {
      clear();
      router.push('/admin/packages');
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {hasDraft && (
        <div className="flex items-center justify-between rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span>You have an unsaved draft from a previous session.</span>
          <div className="flex gap-2">
            <button type="button" onClick={restore} className="font-medium underline">
              Restore unsaved draft
            </button>
            <button type="button" onClick={discard} className="font-medium underline">
              Discard
            </button>
          </div>
        </div>
      )}

      <BasicDetailsSection control={control} register={register} errors={errors} />
      <TripDetailsSection control={control} register={register} errors={errors} />
      <BestTimeToVisitSection control={control} setValue={setValue} errors={errors} />
      <DescriptionSection control={control} register={register} errors={errors} />
      <ItinerarySection
        control={control}
        register={register}
        errors={errors}
        fields={fields}
        duration={duration}
        onAddDay={handleAddDay}
        onRemoveDay={handleRemoveDay}
        errorDayIndices={errorDayIndices}
      />
      <CostSection control={control} register={register} errors={errors} />
      <GuideSection control={control} register={register} errors={errors} />
      <TestimonialsSection control={control} register={register} errors={errors} />
      <FaqsSection control={control} register={register} errors={errors} />

      <FormFooterActions
        isSubmitting={submittingStatus !== null}
        submittingStatus={submittingStatus}
        onSaveDraft={() => void submitAs('draft')}
        onPublish={() => void submitAs('published')}
        onCancel={handleCancel}
      />
    </div>
  );
}
