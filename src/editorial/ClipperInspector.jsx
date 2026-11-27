import { useId, useState } from 'react'
import { AudioLines, Braces, Focus } from 'lucide-react'
import SegmentTabs from './SegmentTabs'
import { alpha, audioEnergy, deadZone, faceSamples, findSilenceSnap, frameMs, hookResult, rawBoundary, resolveSegmentIds, smoothCenters, timestamp, transcript, waveformStart } from './clipper-pipeline'

const range = resolveSegmentIds(hookResult)
const snap = findSilenceSnap(audioEnergy, waveformStart, frameMs, rawBoundary)
const smoothed = smoothCenters(faceSamples)
const chartWidth = 320
const marker = time => (time - waveformStart) * chartWidth / (audioEnergy.length * frameMs)

function ModeSwitch({ options, selected, onSelect, label }) {
  return <div role="group" aria-label={label} className="clipper-mode-switch">
    {options.map((option, index) => <button className="key" key={option} type="button" aria-pressed={selected === index}
      onClick={() => onSelect(index)}>{option}</button>)}
  </div>
}

function HookScoring({ lang }) {
  return <div className="pipeline-step hook-step">
    <p className="pipeline-badge"><Braces size={15} aria-hidden="true" /> Hook Score: 94/100 · {lang ? 'High retention contrast' : 'Kontras retensi tinggi'}</p>
    <ol className="pipeline-transcript">
      {transcript.map(row => <li key={row.id} data-selected={range.ids.includes(row.id)}>
        <div className="pipeline-code"><strong>[{row.id}]</strong><span>{timestamp(row.start)} → {timestamp(row.end)}</span></div>
        <p>{row.copy[lang]}</p>
      </li>)}
    </ol>
    <div className="pipeline-json">
      <p className="eyebrow">Structured Output Inspector</p>
      <pre><code>{JSON.stringify(hookResult, null, 2)}</code></pre>
      <p className="pipeline-code">[{range.ids[0]}..{range.ids.at(-1).slice(4)}] → {timestamp(range.start)}–{timestamp(range.end)}</p>
    </div>
  </div>
}

function AudioSnap({ lang }) {
  const [mode, setMode] = useState(0)
  const boundary = mode ? snap.cut : rawBoundary
  return <div className="pipeline-step audio-step" data-snapped={!!mode}>
    <ModeSwitch selected={mode} onSelect={setMode} label={lang ? 'Cut boundary' : 'Batas potong'}
      options={lang ? ['Raw LLM Boundary', 'VAD Silence-Snapped (+180 ms)'] : ['Batas LLM mentah', 'VAD Silence-Snapped (+180 ms)']} />
    <svg className="pipeline-wave" viewBox="0 0 320 110" aria-hidden="true">
      <rect className="wave-silence" x={marker(snap.start)} y="0" width={marker(snap.start + snap.duration) - marker(snap.start)} height="110" />
      <path d="M0 55H320" className="wave-axis" />
      {audioEnergy.map((value, index) => {
        const height = Math.max(value * 69, 3)
        return <rect key={index} className={value < 0.12 ? 'wave-quiet' : 'wave-speech'}
          x={(index + 0.5) * chartWidth / audioEnergy.length - 1.45} y={55 - height / 2} width="2.9" height={height} rx="1.5" />
      })}
      <g className="wave-marker" style={{ transform: 'translateX(' + marker(boundary) + 'px)' }}>
        <path d="M0 11V100" strokeWidth="2.4" /><circle cy="11" r="3.5" /><path d="M-4 101H4" strokeWidth="2" />
      </g>
    </svg>
    <div className="wave-axis-copy pipeline-code"><span>{timestamp(waveformStart)}</span><span>{timestamp(waveformStart + audioEnergy.length * frameMs)}</span></div>
    <p className="pipeline-state" role="status"><strong>{timestamp(boundary)}</strong> · {mode
      ? (lang ? 'Clean breath gap · ' : 'Jeda napas bersih · ') + snap.duration + ' ms (>250 ms)'
      : (lang ? 'Warning: cut intersects speech.' : 'Peringatan: batas memotong suku kata.')}</p>
    <p className="pipeline-footnote">{lang ? 'Fixture energy in 20 ms frames. The GOP policy checks for a keyframe inside the silence window before using stream-copy.' : 'Energi audio contoh dalam frame 20 ms. Kebijakan GOP memeriksa keyframe di dalam jeda sebelum memakai stream-copy.'}</p>
  </div>
}

function ScreenFeed() {
  return <svg viewBox="0 0 160 90" aria-hidden="true">
    <rect width="160" height="90" fill="#262320" />
    <path d="M0 14H160V0H0zM0 14h37v76H0z" fill="#3c3934" />
    <path d="M9 25h18m-18 9h13m-13 9h17m-17 9h11M46 24h80m-80 10h56m-56 10h94m-94 10h71m-71 10h50m-50 10h83" fill="none" stroke="#b4afa7" strokeWidth="2" strokeLinecap="round" />
    <path d="M46 24h24m-24 20h16m-16 20h11" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
    <circle cx="7" cy="7" r="2" fill="#ff4d1c" /><circle cx="14" cy="7" r="2" fill="#34d399" />
  </svg>
}

function SmartReframe({ lang }) {
  const [mode, setMode] = useState(0)
  const [frame, setFrame] = useState(10)
  const slider = useId()
  const face = faceSamples[frame]
  const width = 180 * 9 / 16
  const left = Math.max(0, Math.min(320 - width, smoothed[frame] - width / 2))
  const shift = x => ({ transform: 'translateX(' + x + 'px)' })
  return <div className="pipeline-step reframe-step" data-fallback={!!mode}>
    <ModeSwitch selected={mode} onSelect={setMode} label={lang ? 'Reframing mode' : 'Mode reframing'}
      options={lang ? ['Speaker Mode · 9:16 crop', 'Screen / Gameplay · Fallback'] : ['Mode pembicara · Crop 9:16', 'Layar / Gim · Fallback']} />
    <div className="reframe-view">
      <svg className="reframe-speaker" viewBox="0 0 320 180" aria-hidden="true">
        <rect width="320" height="180" fill="#262320" />
        <path d="M0 138H320M0 54H320M60 0V180M260 0V180" stroke="#49453e" />
        <g className="face-motion" style={shift(face)}>
          <path d="M-52 174V146Q-50 109 0 109Q50 109 52 146V174Z" fill="#706a61" />
          <ellipse cy="79" rx="22" ry="29" fill="#b4afa7" />
          <rect x="-29" y="44" width="58" height="70" rx="5" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 3" />
        </g>
        <g className="face-motion" style={shift(left)}>
          <path d="M0 0H-320V180H0ZM101.25 0H421.25V180H101.25Z" fill="#121110" fillOpacity=".43" />
          <rect x="1" y="1" width={width - 2} height="178" rx="5" fill="none" stroke="#60a5fa" strokeWidth="2" />
          <path d="M44 90h13m-6 -6v12" stroke="#60a5fa" strokeWidth="1" />
        </g>
      </svg>
      <div className="reframe-output" aria-hidden="true"><div className="reframe-blur"><ScreenFeed /></div><div className="reframe-sharp"><ScreenFeed /></div></div>
    </div>
    <p className="pipeline-state" role="status">{mode ? (lang ? '0 faces · Full 16:9 feed preserved' : '0 wajah · Gambar 16:9 utuh')
      : (lang ? 'Face Lock · 98.4%' : 'Kunci wajah · 98,4%') + ' · EMA α = ' + alpha + ' · ' + (lang ? 'Dead zone' : 'Zona toleransi') + ' ' + deadZone + ' px'}</p>
    <label className="pipeline-slider pipeline-code" htmlFor={slider}>
      <span>{lang ? 'Sample frame' : 'Frame contoh'} {frame + 1}/{faceSamples.length}</span>
      <input id={slider} type="range" min="0" max={faceSamples.length - 1} value={frame} disabled={!!mode} onChange={event => setFrame(event.target.valueAsNumber)} />
    </label>
    <p className="pipeline-footnote">{lang ? 'Synthetic face track. Slide to compare detection and the smoothed crop.' : 'Posisi wajah sintetis. Geser slider untuk membandingkan deteksi dan crop yang diperhalus.'}</p>
  </div>
}

export default function ClipperInspector({ lang }) {
  const heading = useId()
  const panels = [HookScoring, AudioSnap, SmartReframe]
  const tabs = [
    [Braces, 'Hook Scoring'],
    [AudioLines, 'VAD Audio Snap'],
    [Focus, '9:16 Smart Reframe'],
  ]
  return <section className="clipper-inspector alabaster" aria-labelledby={heading}>
    <header className="pipeline-header">
      <h3 id={heading}>Multimodal Pipeline Inspector</h3>
      <span className="pipeline-code">{lang ? 'Simulation' : 'Simulasi'}</span>
    </header>
    <SegmentTabs label="Multimodal Pipeline Inspector" keepPanels
      items={tabs.map(([Icon, label], index) => <><Icon size={14} aria-hidden="true" /><span>0{index + 1}. {label}</span></>)}>
      {index => { const Panel = panels[index]; return <Panel lang={lang} /> }}
    </SegmentTabs>
  </section>
}
