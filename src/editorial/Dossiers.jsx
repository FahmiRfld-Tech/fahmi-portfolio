import { ArrowUpRight, FolderGit2, Layers3, ShieldCheck, Users } from 'lucide-react'
import content from '../content.json'
import { BATAM_RAG_NOTES, CireundeuDecisions, GroundingPreview, ResearchTradeoff, RetrievalComparison } from './EngineeringNotes'
import { CaseDetails, External, ProjectLink, Tags } from './Shared'
import { GITHUB, insights } from './content'
import SegmentTabs from './SegmentTabs'
import StackMatrix from './StackMatrix'
import { domain, impact } from './clipper-story'

function RetrievalFlow({ project, lang }) {
  const paths = [
    [lang ? 'Production · lexical retrieval' : 'Produksi · pencarian leksikal', ['Filter', 'Exact cache', 'tsvector', 'Entity rerank', 'Evidence Gap']],
    [lang ? 'Vector retrieval design' : 'Rancangan pencarian vektor', ['Embedding', 'Semantic cache ≥0.94', 'Filter', 'pgvector RRF', 'Grounded JSON']],
  ]
  return <div className="dossier-flow">
    {paths.map(([label, steps]) => <section key={label}>
      <h3>{label}</h3>
      <ol className="architecture-flow">{steps.map(step => <li key={step}>{step}</li>)}</ol>
    </section>)}
    <p>{lang ? 'The corpus has no populated embeddings. Production uses lexical retrieval and exact-query caching.' : 'Embedding korpus belum terisi. Produksi memakai pencarian leksikal dan cache kueri identik.'}</p>
    <External href={project.link + '/blob/main/docs/DATABASE.md'}>{lang ? 'Database audit' : 'Audit basis data'} <ArrowUpRight size={16} aria-hidden="true" /></External>
  </div>
}

export function ProjectDossier({ project, lang, initialTab = 0 }) {
  const isBatam = project.id === 'batam'
  const isCommunity = project.id === 'cireundeu'
  const labels = [
    [Layers3, lang ? 'Engineering' : 'Teknis'],
    [FolderGit2, lang ? 'Project' : 'Proyek'],
    ...(isBatam ? [[ShieldCheck, 'X-Ray']] : []),
  ]
  const highlights = <>
    {project.role && <p className="eyebrow">{project.role[lang]}</p>}
    <p className="dossier-summary">{project.summary[lang]}</p>
    {project.plain && <p className="plain-translation">{project.plain[lang]}</p>}
    <Tags items={project.stack} />
    {project.id === 'clipper' && <>
      <p className="eyebrow">{domain}</p>
      <dl className="clipper-impact">{impact.map(({ value, label }) =>
        <div key={value[0]}><dt>{label[lang]}</dt><dd>{value[lang]}</dd></div>)}</dl>
    </>}
    {(isBatam || isCommunity) && <CaseDetails project={project} lang={lang} />}
  </>
  return <SegmentTabs initialIndex={initialTab} label={lang ? 'Case study sections' : 'Bagian studi kasus'}
    items={labels.map(([Icon, label]) => <><Icon size={16} aria-hidden="true" />{label}</>)}>
    {index => index === 1 ? highlights : index === 2 ? <GroundingPreview lang={lang} />
      : isBatam ? <><RetrievalComparison lang={lang} /><RetrievalFlow {...{ project, lang }} /></>
        : isCommunity ? <CireundeuDecisions lang={lang} />
          : <><CaseDetails project={project} lang={lang} />{project.id === 'rag' && <ResearchTradeoff lang={lang} />}</>}
  </SegmentTabs>
}

export function ProjectDossierActions({ project, lang }) {
  return <>
    <ProjectLink project={project} lang={lang} className="key primary" />
    {project.id === 'clipper' && <External href={GITHUB + '/fahmi-portfolio#multimodal-pipeline-inspector'} className="key">
      {lang ? 'Architecture & commits' : 'Arsitektur & commit'} <ArrowUpRight size={16} aria-hidden="true" />
    </External>}
    {project.id === 'batam' && <External href={BATAM_RAG_NOTES} className="key">
      {lang ? 'Architecture notes' : 'Catatan arsitektur'} <ArrowUpRight size={16} aria-hidden="true" />
    </External>}
    {project.id === 'quran' && <External href={project.link} className="key">
      {lang ? 'Concept documentation' : 'Dokumentasi konsep'} <ArrowUpRight size={16} aria-hidden="true" />
    </External>}
  </>
}

export function LeadershipDossier({ index, lang }) {
  const { org, date } = content.roles[index]
  return <div className="leadership-detail">
    <div><Users size={22} aria-hidden="true" /><strong>{org[lang]}</strong><span className="date">{date[lang]}</span></div>
    <p>{insights[index][lang]}</p>
  </div>
}

export function StackDossier({ lang, navigate }) {
  return <SegmentTabs label={lang ? 'Profile details' : 'Detail profil'} items={lang ? ['Tools', 'Education'] : ['Teknologi', 'Pendidikan']}>
    {i => i === 0 ? <StackMatrix {...{ lang, navigate }} /> : <div className="education-dossier">
      {content.info.map(item => <article key={item.title[0]} className="education-item">
        <h3>{item.title[lang]}</h3>{item.copy && <p>{item.copy[lang]}</p>}
        {!!item.tags.length && <Tags items={item.tags} />}
      </article>)}
    </div>}
  </SegmentTabs>
}
