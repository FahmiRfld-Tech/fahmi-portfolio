import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowUpRight, AudioLines, Database, GitCommitHorizontal, Pause, Play, Search, ShieldCheck, Ship, Sparkles, Umbrella, Utensils, Workflow } from 'lucide-react'
import { batamExamples } from './batam-examples'
import { External } from './Shared'
import SegmentTabs from './SegmentTabs'

const icons = { beach: Umbrella, food: Utensils, ferry: Ship }
const vector = [21, 64, 43, 89, 51, 72, 34, 59, 95, 42, 66, 31, 75, 55, 86, 48]
const bandungClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})

function BandungTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let timer
    function tick() {
      const time = new Date()
      setNow(time)
      timer = window.setTimeout(tick, 60000 - time.getTime() % 60000)
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [])
  return <time dateTime={now.toISOString()}>{bandungClock.format(now)} WIB</time>
}

function SourceLinks({ example, lang }) {
  return (
    <div className="hero-sources" role="group" aria-label={lang ? 'Official references' : 'Rujukan resmi'}>
      {example.sources.map(([name, href]) => <External key={href} href={href} className="source-chip">
        <ShieldCheck size={14} aria-hidden="true" /> {name} <ArrowUpRight size={12} aria-hidden="true" />
      </External>)}
    </div>
  )
}

function ChatPreview({ example, text, done, lang }) {
  return (
    <div className="hero-conversation">
      <p className="hero-question"><Search size={14} aria-hidden="true" /> {example.prompt[lang]}</p>
      <div className="hero-answer">
        <span className="answer-icon"><Sparkles size={15} aria-hidden="true" /></span>
        <div>
          <strong>Hallo Batam AI</strong>
          <p className="hero-answer-text" aria-hidden={!done}>
            <span className="reply-measure" aria-hidden="true">{example.answer[lang]}</span>
            <span>{text}{!done && <span className="stream-caret" aria-hidden="true" />}</span>
          </p>
          <div className="reply-sources" data-ready={done} inert={!done}>
            <p className="answer-note"><ShieldCheck size={15} aria-hidden="true" /> {example.limit[lang]}</p>
            <SourceLinks {...{ example, lang }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function TracePreview({ example, lang, evidence }) {
  return (
    <div className="inspector">
      <p className="hero-question"><Search size={14} aria-hidden="true" /> {example.prompt[lang]}</p>
      <div className="inspector-vector">
        <span className="workbench-label"><Workflow size={14} aria-hidden="true" /> Query embedding</span>
        <span>{lang ? 'Vektor contoh terbentuk' : 'Sample vector ready'}</span>
        <div className="vector-wave" aria-hidden="true">{vector.map((height, index) => <i key={index} style={{ '--bar': height + '%' }} />)}</div>
      </div>
      <dl className="inspector-metrics">
        <div><dt>pgvector · {lang ? 'Kemiripan kosinus' : 'Cosine similarity'}</dt><dd>{example.score}</dd></div>
        <div><dt>{lang ? 'Latensi pengambilan' : 'Retrieval latency'}</dt><dd>{example.latency}<small> ms</small></dd></div>
      </dl>
      <div className="inspector-chunk">
        <p className="workbench-label"><Database size={14} aria-hidden="true" /> PostgreSQL · {lang ? 'Contoh potongan dokumen' : 'Sample document chunk'}</p>
        <p>{example.chunk[lang]}</p>
        <SourceLinks {...{ example, lang }} />
      </div>
      <External href={evidence.href} className="text-link evidence-link"><GitCommitHorizontal size={17} aria-hidden="true" /> {evidence.label[lang]} <ArrowUpRight size={14} aria-hidden="true" /></External>
    </div>
  )
}

export default function Workbench({ lang, project, evidence }) {
  const [selected, setSelected] = useState(0)
  const [position, setPosition] = useState(0)
  const [playing, setPlaying] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const cycle = useRef(null)
  const reduce = useReducedMotion()
  const example = batamExamples[selected]
  const answer = example.answer[lang]
  const done = !!reduce || position >= answer.length

  useEffect(() => {
    if (done) return
    const timer = window.setTimeout(() => setPosition(current => current + 5), 28)
    return () => window.clearTimeout(timer)
  }, [example, position, done])

  useEffect(() => {
    if (!playing) return
    function step() {
      setPosition(0)
      setSelected(current => (current + 1) % batamExamples.length)
      schedule()
    }
    function schedule() {
      window.clearTimeout(cycle.current)
      if (!document.hidden) cycle.current = window.setTimeout(step, 4500)
    }
    schedule()
    document.addEventListener('visibilitychange', schedule)
    return () => {
      window.clearTimeout(cycle.current)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [playing])

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    function respect(event) {
      if (event.matches) {
        window.clearTimeout(cycle.current)
        setPlaying(false)
        setPosition(Infinity)
      }
    }
    motion.addEventListener('change', respect)
    return () => motion.removeEventListener('change', respect)
  }, [])

  function stop() {
    window.clearTimeout(cycle.current)
    setPlaying(false)
  }

  function run(index) {
    stop()
    setPosition(0)
    setSelected(index)
  }

  const PlaybackIcon = playing ? Pause : Play

  return (
    <aside className="workbench glass alabaster" data-spotlight="" data-tilt="" onFocus={event => { if (event.target.closest('.source-chip')) stop() }} aria-label={lang ? 'Hallo Batam AI interactive demo' : 'Demo interaktif Hallo Batam AI'}>
      <div className="workbench-top">
        <div className="workbench-location">
          <p className="workbench-label"><i className="live-dot" aria-hidden="true" /> Bandung, ID <span aria-hidden="true">·</span> <BandungTime /></p>
          <External href={project.preview} className="workbench-domain">batamtes.vercel.app <ArrowUpRight size={13} aria-hidden="true" /></External>
        </div>
        <span className="workbench-demo"><AudioLines size={14} aria-hidden="true" /> {lang ? 'Local simulation' : 'Simulasi lokal'}</span>
      </div>
      <SegmentTabs onSelect={stop} label={lang ? 'Demo mode' : 'Mode demo'}
        items={[<><Sparkles size={15} aria-hidden="true" /> Live Chat</>, <><Workflow size={15} aria-hidden="true" /> RAG Trace</>]}>
        {mode => mode === 0 ? <ChatPreview {...{ example, lang, done }} text={done ? answer : answer.slice(0, position)} />
          : <TracePreview {...{ example, lang, evidence }} />}
      </SegmentTabs>
      <div className="demo-playback" data-playing={playing}>
        <button className="demo-toggle" type="button" onClick={() => playing ? stop() : setPlaying(true)}
          aria-label={playing ? (lang ? 'Pause auto-demo' : 'Jeda auto-demo') : (lang ? 'Resume auto-demo' : 'Lanjutkan auto-demo')}>
          <i className="live-dot" aria-hidden="true" /> Auto-Demo <PlaybackIcon size={14} aria-hidden="true" />
        </button>
        <div className="retrieval-pulse" key={selected} aria-hidden="true">
          {vector.slice(0, 12).map((height, index) => <i key={index} style={{ '--bar': height / 100, '--beat': index }} />)}
        </div>
      </div>
      <div className="hero-prompts" role="group" aria-label={lang ? 'Try a question' : 'Coba pertanyaan'}>
        {batamExamples.map(({ icon, prompt, short }, index) => {
          const Icon = icons[icon]
          return <button type="button" key={icon} aria-label={prompt[lang]} aria-pressed={selected === index}
            title={prompt[lang]} onClick={() => run(index)}>
            <Icon size={15} aria-hidden="true" /> {short[lang]}
          </button>
        })}
      </div>
      <p className="workbench-note">{lang ? 'Simulated responses and trace values with links to official sources.' : 'Contoh jawaban dan angka trace disimulasikan, dengan tautan ke rujukan resmi.'}</p>
      <p className="sr-only" aria-live={playing ? 'off' : 'polite'}>{done ? answer + ' ' + example.limit[lang] : (lang ? 'Writing a reply…' : 'Sedang menulis jawaban…')}</p>
    </aside>
  )
}
