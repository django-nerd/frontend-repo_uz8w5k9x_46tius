import React from 'react';

export default function QuizCard({ prompt, image, children }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-4">
          {image && (
            <img src={image} alt="" className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800" />
          )}
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{prompt}</h2>
        </div>
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
