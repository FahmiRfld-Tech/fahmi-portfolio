import { useRef, useState } from 'react'
import { ArrowRight, Captions, GitBranch, Play, ScanLine } from 'lucide-react'
import { findClips, parseSrt } from '../clipper/selection'
import track from '../../public/clipper/sample.srt?raw'
import { Screenshot } from './Shared'
import SegmentTabs from './SegmentTabs'

const sampleCues = parseSrt(track, Infinity)
const sampleClips = findClips(sampleCues, { limit: 2 })
const seconds = (value, lang) => new Intl.NumberFormat(lang ? 'en' : 'id', { maximumFractionDigits: 1 }).format(value) + ' s'

function ClipperPreview({ lang }) {
  const [selected, setSelected] = useState(0)
  const [caption, setCaption] = useState(true)
  const clip = sampleClips[selected]
  const [time, setTime] = useState(clip.start)
  const video = useRef(null)
  const cue = sampleCues.find(item => time >= item.start && time < item.end)

  function seek(next) {
    setTime(next)
    if (video.current.readyState >= 1) video.current.currentTime = next
  }

  function select(index) {
    video.current.pause()
    seek(sampleClips[index].start)
    setSelected(index)
  }

  function play() {
    seek(clip.start)
    video.current.play().catch(() => {})
  }

  return (
    <div className="clip-scrubber">
      <div className="clip-device">
        <video ref={video} src="/clipper/sample.mp4" preload="metadata" muted playsInline
          aria-label={lang ? 'Robot camera sample in a vertical crop' : 'Contoh kamera robot dalam bingkai vertikal'}
          onLoadedMetadata={() => seek(clip.start)}
          onTimeUpdate={event => {
            const player = event.currentTarget
            if (player.currentTime >= clip.end && !player.paused) {
              player.pause()
              seek(clip.end)
            } else if (player.currentTime >= clip.start && player.currentTime <= clip.end) {
              setTime(player.currentTime)
            }
          }} />
        <span className="aspect-label">9:16</span>
        {caption && cue && <span className="device-caption" lang="en">{cue.text}</span>}
      </div>
      <div className="clip-controls">
        <p className="eyebrow">{lang ? 'Sample transcript → vertical clip' : 'Transkrip contoh → klip vertikal'}</p>
        <div className="clip-options" role="group" aria-label={lang ? 'Candidate clips' : 'Kandidat klip'}>
          {sampleClips.map(({ start, end, title }, index) => <button className="clip-candidate" key={start} type="button" aria-pressed={selected === index}
            onClick={() => select(index)}>
            <span>{seconds(start, lang)} – {seconds(end, lang)}</span><strong lang="en">{title}</strong>
          </button>)}
        </div>
        <label className="scrub-label" htmlFor="clip-time">{lang ? 'Position in source video' : 'Posisi di video sumber'} <output>{seconds(time, lang)}</output></label>
        <input id="clip-time" type="range" min={clip.start} max={clip.end} step="0.001" value={time}
          aria-valuetext={seconds(time, lang)} onChange={event => seek(event.target.valueAsNumber)} />
        <div className="actions">
          <button className="key" type="button" onClick={play}><Play size={15} aria-hidden="true" /> {lang ? 'Play clip' : 'Putar klip'}</button>
          <button className="key" type="button" aria-pressed={caption} onClick={() => setCaption(!caption)}><Captions size={16} aria-hidden="true" /> {lang ? 'Captions' : 'Subtitel'}</button>
        </div>
      </div>
    </div>
  )
}

const walkthroughs = {
  quran: [
    [['Jelajah', 'Explore'], ['Buka perjalanan belajar dan pilih jalur bertema.', 'Open the learning journey and choose a themed path.']],
    [['Tema', 'Theme'], ['Kelompokkan ayat berdasarkan tema untuk memberi konteks saat belajar.', 'Group verses by theme to give the learning session context.']],
    [['Hafalan 3D', '3D memorization'], ['Konsep di GitHub memakai lokasi sebagai pengingat urutan hafalan.', 'The documented concept uses locations as cues for the memorization sequence.']],
  ],
  rag: [
    [['Query', 'Query'], ['Django REST menerima pertanyaan wisata.', 'Django REST receives a tourism question.']],
    [['FastEmbed', 'FastEmbed'], ['Ubah pertanyaan menjadi vektor untuk pencarian semantik.', 'Convert the question into a vector for semantic retrieval.']],
    [['ChromaDB', 'ChromaDB'], ['Ambil dokumen yang paling dekat dengan pertanyaan.', 'Retrieve the documents closest to the question.']],
    [['Generasi', 'Generation'], ['Gunakan dokumen sebagai konteks jawaban dengan Groq dan fallback Gemini.', 'Use retrieved documents as answer context with Groq and a Gemini fallback.']],
  ],
}

function ProjectWalkthrough({ project, lang }) {
  const [selected, setSelected] = useState(0)
  const steps = walkthroughs[project.id]
  return (
    <div className={'project-walkthrough ' + project.id}>
      <p className="eyebrow"><GitBranch size={15} aria-hidden="true" /> {project.id === 'rag'
        ? (lang ? 'Retrieval pipeline' : 'Alur pencarian semantik')
        : (lang ? 'Learning journey' : 'Perjalanan belajar')}</p>
      <ol>
        {steps.map(([name], index) => <li key={name[0]}>
          {index > 0 && <ArrowRight className="step-arrow" size={13} aria-hidden="true" />}
          <button className="key" type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <span>0{index + 1}</span> {name[lang]}
          </button>
        </li>)}
      </ol>
      <div className="walkthrough-detail" key={selected} role="status">
        <ScanLine size={22} aria-hidden="true" />
        <p>{steps[selected][1][lang]}</p>
      </div>
    </div>
  )
}

export default function LabPreview({ project, lang, open }) {
  const interactive = project.id === 'clipper'
    ? ['Scrubber klip', 'Clip scrubber'] : ['Alur interaktif', 'Interactive flow']
  return (
    <div className="lab-interactive glass">
      <SegmentTabs label={lang ? 'Project preview' : 'Pratinjau proyek'} items={[interactive[lang], lang ? 'Screenshot' : 'Tangkapan layar']}>
        {mode => mode === 1 ? <Screenshot {...{ project, lang, open }} />
          : project.id === 'clipper' ? <ClipperPreview lang={lang} /> : <ProjectWalkthrough {...{ project, lang }} />}
      </SegmentTabs>
    </div>
  )
}
