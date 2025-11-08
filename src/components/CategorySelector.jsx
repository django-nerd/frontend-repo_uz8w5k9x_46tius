import React from 'react';

const categories = [
  { key: 'fruits', label: 'Nama Buah' },
  { key: 'numbers', label: 'Angka' },
  { key: 'animals', label: 'Nama Hewan' },
];

export default function CategorySelector({ category, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c.key}
          onClick={() => onChange(c.key)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition border 
            ${category === c.key ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white/70 dark:bg-zinc-900/70 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 hover:bg-emerald-50 hover:border-emerald-400'}`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
