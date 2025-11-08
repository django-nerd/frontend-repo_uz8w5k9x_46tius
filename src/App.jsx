import React, { useEffect, useMemo, useRef, useState } from 'react';
import ModeSelector from './components/ModeSelector.jsx';
import CategorySelector from './components/CategorySelector.jsx';
import QuizCard from './components/QuizCard.jsx';
import QuizControls from './components/QuizControls.jsx';

// Dataset sederhana
const DATA = {
  fruits: [
    { word: 'apel', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=400&auto=format&fit=crop' },
    { word: 'pisang', image: 'https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjI2MDI3MTd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
    { word: 'jeruk', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=400&auto=format&fit=crop' },
    { word: 'anggur', image: 'https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjI2MDI3MTd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
    { word: 'mangga', image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=400&auto=format&fit=crop' },
  ],
  numbers: [
    { word: 'satu', image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=400&auto=format&fit=crop' },
    { word: 'dua', image: 'https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjI2MDI3MTd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
    { word: 'tiga', image: 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?q=80&w=400&auto=format&fit=crop' },
    { word: 'empat', image: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=400&auto=format&fit=crop' },
    { word: 'lima', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=400&auto=format&fit=crop' },
  ],
  animals: [
    { word: 'kucing', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=400&auto=format&fit=crop' },
    { word: 'anjing', image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=400&auto=format&fit=crop' },
    { word: 'kelinci', image: 'https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjI2MDI3MTd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
    { word: 'burung', image: 'https://images.unsplash.com/photo-1501706362039-c06b2d715385?q=80&w=400&auto=format&fit=crop' },
    { word: 'ikan', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=400&auto=format&fit=crop' },
  ],
};

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'id-ID';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function App() {
  const [mode, setMode] = useState('choice'); // choice | type | speak
  const [category, setCategory] = useState('fruits');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [options, setOptions] = useState([]);
  const [typed, setTyped] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const items = DATA[category];
  const current = items[currentIndex % items.length];

  // Setup pertanyaan pilihan ganda
  useEffect(() => {
    if (mode !== 'choice') return;
    const wrongs = shuffle(items.filter((i) => i.word !== current.word)).slice(0, 3);
    const opts = shuffle([current, ...wrongs]).map((o) => o.word);
    setOptions(opts);
  }, [mode, category, currentIndex]);

  // Setup speech recognition untuk mode speak dan tombol cek suara
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'id-ID';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const said = e.results[0][0].transcript.toLowerCase().trim();
      validateAnswer(said);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  function nextQuestion() {
    setCurrentIndex((i) => i + 1);
    setFeedback('');
    setTyped('');
  }

  function validateAnswer(answer) {
    const normalized = answer.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const correct = current.word.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const ok = normalized === correct;
    setFeedback(ok ? 'Benar! 🎉' : `Salah, jawabannya: ${current.word}`);
    if (ok) setScore((s) => s + 1);
  }

  function onChoiceClick(opt) {
    validateAnswer(opt);
  }

  function onTypeSubmit(e) {
    e.preventDefault();
    validateAnswer(typed.trim());
  }

  function startListening() {
    if (!recognitionRef.current) return;
    setListening(true);
    recognitionRef.current.start();
  }

  const title = useMemo(() => {
    const map = {
      fruits: 'Tebak Nama Buah',
      numbers: 'Tebak Angka (teks)',
      animals: 'Tebak Nama Hewan',
    };
    return map[category];
  }, [category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Quiz Edukasi: Buah, Angka, Hewan</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Pilih kategori dan mode, lalu mulai menebak. Responsif di semua perangkat.</p>
          </div>
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <ModeSelector mode={mode} onChange={setMode} />
          </div>
        </header>

        <section className="mb-6">
          <CategorySelector category={category} onChange={(c) => { setCategory(c); setCurrentIndex(0); setScore(0); setFeedback(''); }} />
        </section>

        <QuizCard prompt={title} image={current.image}>
          {mode === 'choice' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onChoiceClick(opt)}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-800/70 hover:border-blue-400 hover:bg-blue-50 px-4 py-3 text-left font-medium transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {mode === 'type' && (
            <form onSubmit={onTypeSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Ketik jawaban dalam Bahasa Indonesia..."
                className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-800/70 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button type="submit" className="rounded-xl px-5 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition">Kirim</button>
            </form>
          )}

          {mode === 'speak' && (
            <div className="flex flex-col items-start sm:items-center sm:flex-row gap-3">
              <button
                onClick={startListening}
                disabled={listening}
                className={`rounded-xl px-5 py-3 font-medium transition ${listening ? 'bg-purple-300 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
              >
                {listening ? 'Mendengarkan...' : 'Mulai Bicara'}
              </button>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Ucapkan: "{current.word}"</p>
            </div>
          )}

          <QuizControls
            onNext={nextQuestion}
            onSpeak={() => speakText(current.word)}
            canSpeak={true}
            score={score}
          />

          {feedback && (
            <div className={`mt-4 text-sm font-medium ${feedback.startsWith('Benar') ? 'text-emerald-600' : 'text-rose-600'}`}>{feedback}</div>
          )}
        </QuizCard>

        <footer className="mt-10 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Dibuat untuk belajar menyenangkan. Mode suara memerlukan browser yang mendukung Web Speech API.
        </footer>
      </div>
    </div>
  );
}
