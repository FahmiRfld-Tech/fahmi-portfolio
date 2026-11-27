import { useEffect, useState, useSyncExternalStore } from 'react'
import { ArrowRight, ArrowUpRight, Minus, Plus } from 'lucide-react'
import { GITHUB, labMeta } from './content'
import LabPreview from './LabPreview'
import ClipperInspector from './ClipperInspector'
import { domain, impact } from './clipper-story'
import './clipper-inspector.css'
import { ChapterHeader, External, ProjectLink, Tags } from './Shared'

const desktopGallery = matchMedia('(min-width: 901px)')
function subscribeGallery(notify) {
  desktopGallery.addEventListener('change', notify)
  return () => desktopGallery.removeEventListener('change', notify)
}
const galleryIsWide = () => desktopGallery.matches

function LabPanel({ project, lang, open, desktop }) {
  const clipper = project.id === 'clipper'
  return (
    <div className="lab-preview">
      {clipper ? <ClipperInspector lang={lang} />
        : <LabPreview {...{ project, lang, open }} screenshotFirst={desktop && project.id !== 'rag'} />}
      <div className="lab-description">
        {clipper && <p className="eyebrow clipper-domain">{domain}</p>}
        <p className="narrative">{project.summary[lang]}</p>
        <p className="lab-role">{project.role[lang]}</p>
        {clipper && <dl className="clipper-impact">
          {impact.map(({ value, label }) => <div key={value[0]}><dt>{label[lang]}</dt><dd>{value[lang]}</dd></div>)}
        </dl>}
        <Tags items={project.stack} />
        <div className="actions">
          <ProjectLink project={project} lang={lang}>
            {project.id === 'rag' ? (lang ? 'View on GitHub' : 'Lihat GitHub') : (lang ? 'Open demo' : 'Buka Demo')}
            <ArrowUpRight size={16} aria-hidden="true" />
          </ProjectLink>
          {project.id === 'quran' && <External href={project.link}>GitHub <ArrowUpRight size={15} aria-hidden="true" /></External>}
          {clipper && <External href={GITHUB + '/fahmi-portfolio#multimodal-pipeline-inspector'}>{lang ? 'Architecture & commits' : 'Lihat arsitektur & commit'} <ArrowUpRight size={15} aria-hidden="true" /></External>}
          <button className="text-link" type="button" onClick={() => open('case', project)}>{lang ? 'Technical details' : 'Detail teknis'} <ArrowRight size={16} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  )
}

export default function LabIndexTable({ projects, lang, open }) {
  const desktop = useSyncExternalStore(subscribeGallery, galleryIsWide)
  const [selected, setSelected] = useState(null)
  const active = selected ?? (desktop ? projects[0].id : null)
  const current = projects.find(project => project.id === active)

  useEffect(() => {
    function sync() {
      const match = projects.find(project => location.hash === '#lab-' + project.id)
      if (match) setSelected(match.id)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [projects])

  return (
    <section id="lab" tabIndex="-1" className="chapter" aria-labelledby="lab-title">
      <ChapterHeader chapter="lab" category="Laboratory & Explorations" title={lang ? 'Lab & explorations' : 'Laboratorium & Eksplorasi'} headingId="lab-title" />
      <div className="lab-gallery">
        <ol className="lab-index">
          {projects.map((project, index) => {
            const panelId = 'lab-' + project.id + '-panel'
            const expanded = active === project.id
            const Icon = desktop ? ArrowRight : expanded ? Minus : Plus
            return (
              <li key={project.id} id={'lab-' + project.id} tabIndex={-1} className="reveal-row glass lab-row"
                data-active={expanded} data-spotlight=""
                onPointerEnter={event => { if (desktop && event.pointerType === 'mouse') setSelected(project.id) }}>
                <button className="row-trigger" type="button" id={panelId + '-trigger'}
                  aria-pressed={desktop ? expanded : undefined} aria-expanded={desktop ? undefined : expanded}
                  aria-controls={desktop ? 'lab-gallery-preview' : panelId}
                  onClick={() => setSelected(!desktop && expanded ? null : project.id)}>
                  <span className="row-number">0{index + 1}</span>
                  <span className="lab-title">{project.name[lang]}</span>
                  <span className="lab-meta">{labMeta[project.id][lang]}</span>
                  <span className="date lab-year">{project.category[lang].split(' / ')[0]}</span>
                  <Icon className="row-icon" size={18} aria-hidden="true" />
                </button>
                {!desktop && <div className="reveal-panel" data-open={expanded} id={panelId} inert={!expanded}>
                  <div className="reveal-inner"><LabPanel {...{ project, lang, open, desktop }} /></div>
                </div>}
              </li>
            )
          })}
        </ol>
        {desktop && <section id="lab-gallery-preview" className="lab-gallery-preview glass" aria-labelledby={'lab-' + current.id + '-panel-trigger'}>
          {projects.map(project => <div key={project.id} className="lab-gallery-layer" data-inactive={current.id !== project.id ? '' : undefined}
            inert={current.id !== project.id}>
            <LabPanel {...{ project, lang, open, desktop }} />
          </div>)}
        </section>}
      </div>
    </section>
  )
}
