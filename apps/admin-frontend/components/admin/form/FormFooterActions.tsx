'use client';

interface FormFooterActionsProps {
  isSubmitting: boolean;
  submittingStatus: 'draft' | 'published' | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

export function FormFooterActions({
  isSubmitting,
  submittingStatus,
  onSaveDraft,
  onPublish,
  onCancel,
}: FormFooterActionsProps) {
  return (
    <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSubmitting}
        className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting && submittingStatus === 'draft' ? 'Saving…' : 'Save as Draft'}
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={isSubmitting}
        className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting && submittingStatus === 'published' ? 'Publishing…' : 'Publish'}
      </button>
    </div>
  );
}
