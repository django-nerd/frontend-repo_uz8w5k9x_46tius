import React from 'react';

const modes = [
  { key: 'choice', label: 'Pilihan Ganda' },
  { key: 'type', label: 'Mengetik' },
  { key: 'speak', label: 'Berbicara' },
];

export default function ModeSelector({ mode, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {modes.map((m) => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition border 
            ${mode === m.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white/70 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-blue-50 hover:border-blue-400'}`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
