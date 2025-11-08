import React from 'react';
import { RefreshCw, Volume2 } from 'lucide-react';

export default function QuizControls({ onNext, onSpeak, canSpeak, score }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">Skor: <span className="font-semibold text-zinc-900 dark:text-zinc-100">{score}</span></div>
      <div className="flex gap-2">
        {canSpeak && (
          <button
            onClick={onSpeak}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition"
            title="Dengarkan pertanyaan"
          >
            <Volume2 size={16} /> Dengarkan
          </button>
        )}
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition"
          title="Soal berikutnya"
        >
          <RefreshCw size={16} /> Berikutnya
        </button>
      </div>
    </div>
  );
}
