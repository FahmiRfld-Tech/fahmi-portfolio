import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Database, MapPin, Send, Sparkles, Square } from 'lucide-react'

const scenarios = [
  {
    id: 'coast', match: /pantai|bahari|laut|beach|coast|sea|nongsa/i,
    prompt: ['Rekomendasi wisata bahari Batam?', 'Where can I explore the Batam coast?'],
    answer: [
      'Coba mulai dari kawasan Nongsa untuk suasana pesisir. Untuk sesi yang lebih santai, pilih satu titik pantai dan sisakan waktu untuk perjalanan dari penginapan. Cek akses serta kondisi setempat sebelum berangkat.',
      'Start around Nongsa for a coastal outing. For a slower day, pick one beach and leave time for the trip from your accommodation. Check local access and conditions before leaving.',
    ],
  },
  {
    id: 'day', match: /sehari|itinerary|rute|jalan|jadwal|day|plan|route|barelang/i,
    prompt: ['Rute santai satu hari di Batam', 'A relaxed one-day Batam itinerary'],
    answer: [
      'Mulai dengan sarapan di area kota, pilih satu kunjungan ke kawasan Barelang, lalu tutup hari dengan kuliner. Sisakan waktu untuk perjalanan darat dan sesuaikan rutenya dengan lokasi penginapan.',
      'Start with breakfast in the city, choose one stop in the Barelang area, and end the day with a meal. Leave time for road travel and adjust the route around where you are staying.',
    ],
  },
  {
    id: 'food', match: /kuliner|makan|food|cuisine|seafood|restaurant|restoran/i,
    prompt: ['Mau cari kuliner lokal', 'Find local food in Batam'],
    answer: [
      'Untuk mulai menjelajah kuliner, coba kawasan Nagoya atau Batam Centre. Kalau ingin makan hidangan laut, cek menu, lokasi, dan kisaran harga langsung ke tempatnya sebelum datang.',
      'Try Nagoya or Batam Centre as starting points for a food outing. If you are looking for seafood, check the menu, location, and prices directly with the restaurant before visiting.',
    ],
  },
]
const fallback = [
  'Simulasi ini mencakup tiga topik wisata Batam. Coba tanya tentang wisata bahari, rencana perjalanan satu hari, atau kuliner lokal.',
  'This simulation covers three Batam travel topics. Try asking about coastal spots, a one-day itinerary, or local food.',
]

export default function Playground({ en }) {
  const lang = Number(en)
  const reduce = useReducedMotion()
  const [input, setInput] = useState('')
  const [run, setRun] = useState(null)
  const [cursor, setCursor] = useState(0)
  const [busy, setBusy] = useState(false)
  const transcript = useRef(null)

  useEffect(() => {
    if (!run || !busy) return
    const timer = window.setTimeout(() => {
      const end = Math.min(run.answer.length, cursor + 6)
      setCursor(end)
      if (end === run.answer.length) setBusy(false)
    }, cursor === 0 ? 210 : 29)
    return () => window.clearTimeout(timer)
  }, [run, cursor, busy])

  useEffect(() => {
    if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight
  }, [cursor])

  function ask(question, choice) {
    const prompt = question.trim()
    if (!prompt || busy) return
    const scenario = choice ?? scenarios.find(item => item.match.test(prompt))
    const answer = scenario?.answer[lang] ?? fallback[lang]
    setRun({ prompt, answer, scenario })
    setCursor(reduce ? answer.length : 0)
    setBusy(!reduce)
    setInput('')
  }

  return (
    <section id="playground" tabIndex="-1" className="section playground-section" aria-labelledby="play-title">
      <div className="play-intro">
        <div className="kicker"><Sparkles size={16} /> Interactive Playground</div>
        <h2 id="play-title">{en ? 'Ask about Batam.' : 'Tanya soal Batam.'}</h2>
        <p>{en ? 'Try a streaming travel answer without leaving the portfolio.' : 'Coba respons wisata yang muncul bertahap langsung di portofolio.'}</p>
        <div className="scenario-list">
          {scenarios.map(item => <button className="key scenario" type="button" disabled={busy}
            key={item.id} onClick={() => ask(item.prompt[lang], item)}>
            <MapPin size={16} /> {item.prompt[lang]} <ArrowRight size={15} className="ml-auto" />
          </button>)}
        </div>
      </div>
      <div className="chat-shell">
        <div className="chat-header">
          <div className="chat-icon"><Sparkles size={20} /></div>
          <div><strong>Hallo Batam AI</strong><p>{en ? 'Local simulation · no API calls' : 'Simulasi lokal · tanpa panggilan API'}</p></div>
          <span className="live-dot" aria-hidden="true" />
        </div>
        <div className="transcript" ref={transcript} aria-label={en ? 'Conversation' : 'Percakapan'}>
          <AnimatePresence mode="wait">
            {run ? (
              <motion.div key={run.prompt} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="messages">
                <p className="question">{run.prompt}</p>
                <p className="answer">{run.answer.slice(0, cursor)}{busy && <span className="typing-cursor" aria-hidden="true" />}</p>
                {!busy && run.scenario && <a className="source-link" href="https://batamtes.vercel.app/" target="_blank" rel="noreferrer"><Database size={14} /> {en ? 'Open real application' : 'Buka aplikasi asli'} <ArrowRight size={14} /></a>}
              </motion.div>
            ) : <motion.div key="empty" className="chat-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MapPin size={29} /><p>{en ? 'Choose a prompt or write your own question.' : 'Pilih contoh pertanyaan atau tulis pertanyaan sendiri.'}</p>
            </motion.div>}
          </AnimatePresence>
        </div>
        <p className="sr-only" role="status">{busy ? (en ? 'Generating response' : 'Menyiapkan jawaban') : run?.answer.slice(0, cursor)}</p>
        <form className="chat-form" onSubmit={event => { event.preventDefault(); ask(input) }}>
          <input aria-label={en ? 'Your question' : 'Pertanyaan lo'} value={input} onChange={event => setInput(event.target.value)}
            maxLength={240} placeholder={en ? 'Ask about Batam…' : 'Tanya soal Batam…'} />
          {busy ? <button type="button" className="key icon-key" onClick={() => setBusy(false)} aria-label={en ? 'Stop streaming' : 'Hentikan respons'}><Square size={16} /></button>
            : <button type="submit" className="key primary icon-key" disabled={!input.trim()} aria-label={en ? 'Send question' : 'Kirim pertanyaan'}><Send size={17} /></button>}
        </form>
      </div>
    </section>
  )
}
