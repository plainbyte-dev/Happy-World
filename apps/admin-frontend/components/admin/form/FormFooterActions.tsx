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
    <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSubmitting}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {isSubmitting && submittingStatus === 'draft' ? 'Saving…' : 'Save as Draft'}
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={isSubmitting}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isSubmitting && submittingStatus === 'published' ? 'Publishing…' : 'Publish'}
      </button>
    </div>
  );
}
