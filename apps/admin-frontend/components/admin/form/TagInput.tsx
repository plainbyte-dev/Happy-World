'use client';

import { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const tags = value ?? [];
  const [draft, setDraft] = useState('');

  function commit() {
    const tag = draft.trim();
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    setDraft('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-slate-300 px-2 py-1.5 focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500">
      {tags.map((tag, index) => (
        <span key={`${tag}-${index}`} className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((_, i) => i !== index))}
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
        placeholder={tags.length === 0 ? placeholder : undefined}
        className="min-w-[120px] flex-1 border-none py-0.5 text-sm outline-none"
      />
    </div>
  );
}
