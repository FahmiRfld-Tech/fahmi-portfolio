import { labMeta } from './content'
import { ChapterHeader } from './Shared'
import RowDeckIndex from './RowDeckIndex'

export default function LabIndexTable({ projects, lang, open }) {
  const rows = projects.map(project => ({
    id: 'lab-' + project.id,
    title: project.name[lang],
    subtitle: labMeta[project.id][lang],
    date: project.category[lang].split(' / ')[0],
  }))
  return (
    <section id="lab" tabIndex="-1" className="chapter" aria-labelledby="lab-title">
      <ChapterHeader chapter="lab" category="Laboratory & Explorations" title={lang ? 'Lab & explorations' : 'Laboratorium & Eksplorasi'} headingId="lab-title" />
      <RowDeckIndex rows={rows} className="lab-index" rowClassName="lab-row" onOpen={index => open('lab', index)} />
    </section>
  )
}
