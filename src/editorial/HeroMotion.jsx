import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'

const headline = [
  [<>Membangun sistem AI</>, <>yang <em>terverifikasi</em> dan</>, <>teknologi yang</>, <><em>membumi</em> bagi manusia.</>],
  [<>Building <em>verified</em> AI</>, <>systems and <em>grounded</em></>, <>technology for people.</>],
]
const domains = [
  'Applied AI Systems',
  'Multimedia Engineering',
  'Verified RAG Architecture',
  'Full-Stack Product',
  'Human-Centered UX',
]

export function HeroHeadline({ lang }) {
  return <h1 id="thesis">{headline[lang].map((line, index) =>
    <span className="headline-mask" key={index}>{index > 0 && ' '}
      <span className="headline-line" style={{ '--line': index }}>{line}</span>
    </span>)}</h1>
}

export function HeroMetrics({ metrics, lang }) {
  const [progress, setProgress] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0)
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return
    let frame
    const start = performance.now() + 280
    function step(now) {
      const elapsed = Math.min(1, Math.max(0, (now - start) / 780))
      setProgress(1 - (1 - elapsed) ** 3)
      if (elapsed < 1) frame = requestAnimationFrame(step)
    }
    function finish(event) {
      if (!event.matches) return
      cancelAnimationFrame(frame)
      setProgress(1)
    }
    frame = requestAnimationFrame(step)
    motion.addEventListener('change', finish)
    return () => {
      cancelAnimationFrame(frame)
      motion.removeEventListener('change', finish)
    }
  }, [])

  const format = new Intl.NumberFormat(lang ? 'en-US' : 'id-ID')
  return <dl className="metrics" aria-label={lang ? 'Impact in numbers' : 'Dampak dalam angka'}>
    {metrics.map(({ number, label }) => {
      const final = number[lang]
      const total = Number.parseInt(final.replace(/[.,]/g, ''), 10)
      return <div key={number[0]}><dt>{label[lang]}</dt><dd>
        <span className="sr-only">{final}</span>
        <span aria-hidden="true">{progress === 1 ? final : format.format(Math.floor(total * progress)) + (final.endsWith('+') ? '+' : '')}</span>
      </dd></div>
    })}
  </dl>
}

export function EditorialTicker({ lang }) {
  const [paused, setPaused] = useState(false)
  const Icon = paused ? Play : Pause
  return <div className="editorial-ticker" data-paused={paused}>
    <div className="ticker-window" tabIndex={0} role="region" aria-label={lang ? 'Areas of practice' : 'Bidang keahlian'}>
      <div className="ticker-track">
        <ul>{domains.map(domain => <li key={domain}>{domain}</li>)}</ul>
        <ul aria-hidden="true">{domains.map(domain => <li key={domain}>{domain}</li>)}</ul>
      </div>
    </div>
    <button className="ticker-toggle" type="button" onClick={() => setPaused(!paused)}
      aria-label={paused ? (lang ? 'Resume ticker' : 'Lanjutkan ticker') : (lang ? 'Pause ticker' : 'Jeda ticker')}>
      <Icon size={15} aria-hidden="true" />
    </button>
  </div>
}
