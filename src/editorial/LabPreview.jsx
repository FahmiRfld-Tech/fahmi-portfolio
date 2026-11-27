import { useState } from 'react'
import { ArrowRight, GitBranch, ScanLine } from 'lucide-react'
import { Screenshot } from './Shared'
import SegmentTabs from './SegmentTabs'

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

export default function LabPreview({ project, lang, open, screenshotFirst = false }) {
  const interactive = lang ? 'Interactive flow' : 'Alur interaktif'
  const screenshot = lang ? 'Screenshot' : 'Tangkapan layar'
  const labels = screenshotFirst ? [screenshot, interactive] : [interactive, screenshot]
  return (
    <div className="lab-interactive glass">
      <SegmentTabs label={lang ? 'Project preview' : 'Pratinjau proyek'} items={labels}>
        {mode => mode === (screenshotFirst ? 0 : 1) ? <Screenshot {...{ project, lang, open }} />
          : <ProjectWalkthrough {...{ project, lang }} />}
      </SegmentTabs>
    </div>
  )
}
