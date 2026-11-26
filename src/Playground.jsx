import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight, CalendarDays, Send, Sparkles, Square, Utensils, Waves } from 'lucide-react'
import { fallback, matchScenario, scenarios } from './playground-scenarios.js'

const icons = { food: Utensils, day: CalendarDays, coast: Waves }
const displayOrder = [scenarios[0], scenarios[2], scenarios[1]]

export default function Playground({ lang, liveUrl }) {
  const reduce = useReducedMotion()
  const [input, setInput] = useState('')
  const [run, setRun] = useState(null)
  const [cursor, setCursor] = useState(0)
  const [phase, setPhase] = useState('idle')
  const result = useRef(null)
  const inputRef = useRef(null)
  const busy = phase === 'streaming'

  useEffect(() => {
    if (!busy || !run) return
    if (reduce || cursor === run.answer.length) {
      setCursor(run.answer.length)
      setPhase('done')
      return
    }
    const timer = window.setTimeout(() => setCursor(Math.min(run.answer.length, cursor + 7)), cursor ? 32 : 220)
    return () => window.clearTimeout(timer)
  }, [busy, cursor, reduce, run])

  useEffect(() => {
    if (!run) return
    const frame = requestAnimationFrame(() => {
      const bounds = result.current.getBoundingClientRect()
      const viewport = window.visualViewport
      const visibleBottom = viewport ? viewport.height + viewport.offsetTop : window.innerHeight
      const dock = document.querySelector('.chapter-dock')?.getBoundingClientRect()
      const viewportBottom = dock && dock.bottom <= visibleBottom ? dock.top : visibleBottom
      if (phase === 'done' && (bounds.top >= viewportBottom || bounds.bottom <= (viewport?.offsetTop ?? 0))) return
      if (bounds.bottom > viewportBottom - 16) result.current.scrollIntoView({ block: 'end', behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [run, phase])

  function ask(question, selected) {
    const prompt = question.trim()
    if (!prompt || busy) return
    const scenario = selected ?? matchScenario(prompt)
    const answer = scenario?.answer[lang] ?? fallback[lang]
    setRun({ prompt, answer, lang, scenario })
    const immediate = reduce || !scenario
    setCursor(immediate ? answer.length : 0)
    setPhase(immediate ? 'done' : 'streaming')
    setInput('')
  }

  const labels = {
    idle: ['Contoh dan kolom pertanyaan siap dipakai.', 'Choose a topic or enter a question.'],
    streaming: ['Sedang menulis jawaban…', 'Writing a reply…'],
    done: ['Jawaban selesai.', 'Reply complete.'],
    stopped: ['Jawaban dihentikan.', 'Reply stopped.'],
  }
  const status = labels[phase][lang]

  return (
    <section id="playground" tabIndex="-1" className="playground-section" aria-labelledby="play-title">
      <div className="play-intro">
        <p className="eyebrow"><Sparkles size={16} /> Playground</p>
        <h2 id="play-title">{lang ? 'Try the Batam travel assistant' : 'Coba asisten wisata Batam'}</h2>
        <p>{lang ? 'Try three sample travel topics in this local simulation. The live app answers from its travel sources.' : 'Coba tiga topik perjalanan di simulasi lokal ini. Aplikasi asli menjawab dari sumber wisata yang dirujuk.'}</p>
        <a className="text-link" href={liveUrl} target="_blank" rel="noreferrer">{lang ? 'Open the live app' : 'Buka aplikasi asli'} <ArrowUpRight size={17} /></a>
      </div>
      <div className="chat-shell">
        <div className="chat-header">
          <div className="chat-icon"><Sparkles size={19} /></div>
          <div><strong>Hallo Batam AI</strong><p>{lang ? 'Local simulation' : 'Simulasi lokal'}</p></div>
        </div>
        <div className="scenario-list" role="group" aria-label={lang ? 'Sample topics' : 'Contoh topik'}>
          {displayOrder.map(item => {
            const Icon = icons[item.id]
            return <button className="key scenario" type="button" aria-disabled={busy}
              key={item.id} onClick={() => ask(item.prompt[lang], item)}>
              <Icon size={16} /> {item.label[lang]}
            </button>
          })}
        </div>
        <form className="chat-form" onSubmit={event => {
          event.preventDefault()
          if (busy || !input.trim()) return
          if (window.visualViewport?.height < window.innerHeight - 100) inputRef.current.blur()
          ask(input)
        }}>
          <input ref={inputRef} aria-label={lang ? 'Your question' : 'Pertanyaan Anda'} value={input} onChange={event => setInput(event.target.value)}
            maxLength={240} enterKeyHint="send" placeholder={lang ? 'Ask about Batam…' : 'Tanya soal Batam…'} />
          {busy ? <button type="button" className="key icon-key" onClick={() => {
            setPhase('stopped')
            inputRef.current.focus({ preventScroll: true })
          }} aria-label={lang ? 'Stop reply' : 'Hentikan respons'}><Square size={16} /></button>
            : <button type="submit" className="key primary icon-key" disabled={!input.trim()} aria-label={lang ? 'Send question' : 'Kirim pertanyaan'}><Send size={17} /></button>}
        </form>
        <div className="transcript" ref={result} aria-label={lang ? 'Conversation' : 'Percakapan'}>
          {run ? (
            <div className="messages">
              <p className="question" dir="auto">{run.prompt}</p>
              {cursor > 0 && <p className="answer" lang={run.lang ? 'en' : 'id'}>{run.answer.slice(0, cursor)}</p>}
              {(busy || phase === 'stopped') && <p className="chat-state" aria-hidden="true">{busy && <span className="typing-dot" />}{status}</p>}
            </div>
          ) : <p className="chat-empty">{labels.idle[lang]}</p>}
        </div>
        <p className="sr-only" role="status" aria-atomic="true">
          {busy || phase === 'stopped' ? status : phase === 'done' && <>
            {status} <span lang={run.lang ? 'en' : 'id'}>{run.answer}</span>
          </>}
        </p>
      </div>
    </section>
  )
}
