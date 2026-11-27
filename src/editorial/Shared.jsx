import { ArrowUpRight, Maximize2 } from 'lucide-react'
import { caseStudies } from '../cases'
import { chapterNumber, projectActions } from './content'

export function External({ href, children, className = 'text-link', ...props }) {
  return <a className={className} href={href} rel="noopener noreferrer" target="_blank" {...props}>{children}</a>
}

export function projectUrl(project, lang) {
  return project.preview.startsWith('/') && lang ? project.preview + '?lang=en' : project.preview
}

export function ProjectLink({ project, lang, className = 'text-link', children }) {
  const href = projectUrl(project, lang)
  const label = children ?? <>{projectActions[project.id][lang]} <ArrowUpRight size={16} aria-hidden="true" /></>
  if (href.startsWith('/')) return <a className={className} href={href}>{label}</a>
  return <External href={href} className={className}>{label}</External>
}

export function Tags({ items }) {
  return <ul className="tags">{items.map(item => <li key={item}>{item}</li>)}</ul>
}

export function ChapterHeader({ chapter, category, title, children, headingId }) {
  return (
    <header className="chapter-header">
      <p className="eyebrow chapter-label"><span>{chapterNumber(chapter)}</span> / {category}</p>
      <h2 id={headingId}>{title}</h2>
      {children}
    </header>
  )
}

export function BrowserFrame({ project, children, actions }) {
  return (
    <div className={'browser-frame glass' + (project.id === 'batam' ? ' alabaster' : '')} data-project={project.id} data-spotlight="" data-tilt="">
      <div className="browser-bar">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="browser-address">{project.preview.startsWith('/') ? project.preview : new URL(project.preview).hostname}</span>
        {actions}
      </div>
      {children}
    </div>
  )
}

export function Screenshot({ project, lang, open, className = '', eager = false }) {
  return (
    <button type="button" className={'project-window ' + className} onClick={() => open('preview', project)}
      aria-label={(lang ? 'Enlarge screenshot: ' : 'Perbesar tangkapan layar: ') + project.name[lang]}>
      <img src={project.image} alt="" width={project.width} height={project.height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      <span className="enlarge-icon" aria-hidden="true"><Maximize2 size={17} /></span>
    </button>
  )
}

export function CaseDetails({ project, lang, className = '' }) {
  return (
    <dl className={'case-details ' + className}>
      {caseStudies[project.id].map(({ label, lead, copy, plain, evidence }) => (
        <div key={label[0]}>
          <dt>{label[lang]}</dt>
          <dd>
            {lead && <strong className="case-lead">{lead[lang]}</strong>}
            {copy[lang]}
            {plain && <p className="plain-translation">{plain[lang]}</p>}
            {evidence && <External href={evidence.href} className="text-link evidence-link">{evidence.label[lang]} <ArrowUpRight size={15} aria-hidden="true" /></External>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
