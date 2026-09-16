'use client';

import { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState('');

  function commit() {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-slate-300 px-2 py-1.5 focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500">
      {value.map((tag, index) => (
        <span key={`${tag}-${index}`} className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            className="text-slate-400 hover:text-slate-700"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="min-w-[120px] flex-1 border-none py-0.5 text-sm outline-none"
      />
    </div>
  );
}
