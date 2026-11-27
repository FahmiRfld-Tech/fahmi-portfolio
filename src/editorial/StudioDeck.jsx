import { ArrowLeft, ArrowRight } from 'lucide-react'
import Dialog from '../Dialog'
import { labMeta } from './content'
import { ProjectDossier, ProjectDossierActions } from './Dossiers'
import LabPreview from './LabPreview'
import ClipperInspector from './ClipperInspector'
import PromptGateSandbox from './PromptGateSandbox'
import { Tags } from './Shared'
import { useCountUp } from './HeroMotion'
import './clipper-inspector.css'

const labEntries = {
  clipper: {
    stats: [
      { value: 3, label: ['Tahap inspeksi', 'Inspection stages'] },
      { value: '9:16', label: ['Rasio ekspor', 'Export ratio'] },
    ],
    impact: [
      ['Ekspor klip vertikal dan subtitle di perangkat pengguna.', 'Export vertical clips and subtitles on the user’s device.'],
      ['Periksa pemilihan segmen, penyelarasan jeda suara, dan reframing EMA dengan data contoh.', 'Inspect segment selection, silence snapping, and EMA reframing with sample data.'],
    ],
  },
  quran: {
    stats: [
      { value: 30, label: ['Target Juz', 'Target Juz'] },
      { value: '3D', label: ['Konsep hafalan', 'Memorization concept'] },
    ],
    impact: [
      ['Prototipe web menyediakan bacaan Al-Qur’an dan jalur belajar bertema.', 'The web prototype offers Qur’an reading and themed learning paths.'],
      ['Konsep 3D memakai lokasi sebagai pengingat urutan hafalan.', 'The 3D concept uses locations as cues for recall.'],
    ],
  },
  rag: {
    stats: [
      { value: 4, label: ['Tahap alur', 'Pipeline stages'] },
      { value: 2, label: ['Jalur model', 'Model routes'] },
    ],
    impact: [
      ['Uji pencarian semantik secara terpisah dengan Django REST, FastEmbed, dan ChromaDB.', 'Test semantic retrieval in isolation with Django REST, FastEmbed, and ChromaDB.'],
      ['Bandingkan rancangan layanan Python terpisah dengan jalur PostgreSQL di produksi.', 'Compare a separate Python service with the production PostgreSQL path.'],
    ],
  },
  promptgate: {
    stats: [
      { value: 2, prefix: '<', suffix: 'ms', label: ['Overhead pada benchmark lokal', 'Local benchmark overhead'] },
      { value: 3, label: ['Preset sandbox', 'Sandbox presets'] },
    ],
    impact: [
      ['Saring prompt injection, samarkan PII, dan perbaiki sintaks JSON.', 'Screen prompt injection, mask PII, and repair JSON syntax.'],
      ['Uji aturan deterministik langsung di browser, tanpa panggilan API.', 'Exercise deterministic rules in the browser without an API call.'],
    ],
  },
}

function DeckStats({ stats, lang }) {
  const progress = useCountUp(80)
  const format = new Intl.NumberFormat(lang ? 'en-US' : 'id-ID', { useGrouping: true })
  return <dl className="studio-stat-grid">
    {stats.map(({ value, label, prefix = '', suffix = '' }) => {
      const numeric = typeof value === 'number'
      const isYear = numeric && value >= 1900 && value <= 2100 && !suffix
      const display = number => prefix + (isYear ? String(number) : format.format(number)) + suffix
      const animated = Math.max(prefix ? 1 : 0, Math.floor(value * progress))
      const final = numeric ? display(value) : Array.isArray(value) ? value[lang] : value
      return <div className="studio-stat" key={label[0]}>
        <dt>{label[lang]}</dt>
        <dd><span className="sr-only">{final}</span><span aria-hidden="true">
          {numeric && progress < 1 ? display(animated) : final}
        </span></dd>
      </div>
    })}
  </dl>
}

function LabDeckBody({ project, lang, openPreview }) {
  return <div className="studio-project">
    {project.id === 'clipper' ? <ClipperInspector lang={lang} />
      : project.id === 'promptgate' ? <PromptGateSandbox lang={lang} />
        : <LabPreview {...{ project, lang }} open={openPreview} />}
    <Tags items={project.stack} />
    <details className="studio-technical">
      <summary>{lang ? 'Technical breakdown' : 'Bedah Teknis'}</summary>
      <ProjectDossier {...{ project, lang }} />
    </details>
  </div>
}

export default function StudioDeck({ type, index, entries, lang, close, closeLabel, onChange, openPreview }) {
  const isLab = type === 'lab'
  const project = isLab ? entries[index] : null
  const entry = isLab ? labEntries[project.id] : entries[index]
  const title = isLab ? project.name[lang] : entry.role
  const organization = isLab ? labMeta[project.id][lang] : entry.org[lang]
  const period = isLab ? project.category[lang].split(' / ')[0] : entry.date[lang]
  const chapter = isLab ? (lang ? '05 / Lab' : '05 / Laboratorium') : (lang ? '04 / Leadership' : '04 / Kepemimpinan')
  const showNumber = number => String(number).padStart(2, '0')

  function advance(delta) {
    onChange((index + delta + entries.length) % entries.length)
  }

  function navigate(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (event.target.closest('input, textarea, select, [contenteditable], [role="tablist"], [role="tabpanel"]')) return
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    advance(event.key === 'ArrowLeft' ? -1 : 1)
  }

  const actions = <div className="deck-navigation" aria-label={lang ? 'Browse dossiers' : 'Telusuri dossier'}>
    <button type="button" className="key" onClick={() => advance(-1)}>
      <ArrowLeft size={16} aria-hidden="true" /> {lang ? 'Prev' : 'Sebelumnya'}
    </button>
    <span className="deck-pagination" aria-live="polite">{showNumber(index + 1)} / {showNumber(entries.length)}</span>
    <button type="button" className="key" onClick={() => advance(1)}>
      {lang ? 'Next' : 'Selanjutnya'} <ArrowRight size={16} aria-hidden="true" />
    </button>
  </div>

  return <Dialog className="studio-dossier" title={title} eyebrow={chapter} contentKey={index}
    onKeyDown={navigate} footer={actions} {...{ close, closeLabel }}
    headDetails={<div className="studio-head-details">
      <p>{organization}<span>{period}</span></p>
      <DeckStats key={index} stats={entry.stats} lang={lang} />
    </div>}>
    <div className="studio-dossier-body" key={index}>
      <ul className="studio-impact">{entry.impact.map(impact => <li key={impact[0]}>{impact[lang]}</li>)}</ul>
      {project && <><LabDeckBody {...{ project, lang, openPreview }} />
        <div className="actions studio-project-links"><ProjectDossierActions {...{ project, lang }} /></div></>}
    </div>
  </Dialog>
}
