import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'

function EditorialAccent({ children }) {
  return <span className="headline-accent">
    <em>{children}</em>
    <svg viewBox="0 0 164 10" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength="1" d="M2 7C40 3 98 1 160 4M12 8C61 4 125 3 162 5" />
    </svg>
  </span>
}

const headline = [
  [<>Membangun sistem AI</>, <>yang <EditorialAccent>terverifikasi</EditorialAccent> dan</>, <>teknologi yang</>, <><EditorialAccent>membumi</EditorialAccent> bagi manusia.</>],
  [<>Building <EditorialAccent>verified</EditorialAccent> AI</>, <>systems and <EditorialAccent>grounded</EditorialAccent></>, <>technology for people.</>],
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

export function useCountUp(delay = 0, duration = 680) {
  const [progress, setProgress] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0)
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return
    let frame
    const start = performance.now() + delay
    function step(now) {
      const elapsed = Math.min(1, Math.max(0, (now - start) / duration))
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
  }, [delay, duration])

  return progress
}

export function HeroMetrics({ metrics, lang }) {
  const progress = useCountUp(280, 780)
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
