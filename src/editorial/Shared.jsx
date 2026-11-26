import { useState } from 'react'
import { ArrowUpRight, Maximize2, Minus, Plus } from 'lucide-react'
import { caseStudies } from '../cases'
import { projectActions } from './content'

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

export function ChapterHeader({ number, category, title, children, headingId }) {
  return (
    <header className="chapter-header">
      <p className="eyebrow chapter-label"><span>{number}</span> / {category}</p>
      <h2 id={headingId}>{title}</h2>
      {children}
    </header>
  )
}

export function BrowserFrame({ project, children, actions }) {
  return (
    <div className="browser-frame" data-project={project.id} data-spotlight="">
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

export function CaseDetails({ project, lang, className = '', technicalStack }) {
  return (
    <dl className={'case-details ' + className}>
      {caseStudies[project.id].map(({ label, copy, evidence }, index) => (
        <div key={label[0]}>
          <dt>{label[lang]}</dt>
          <dd>
            {copy[lang]}
            {evidence && <External href={evidence.href}>{evidence.label[lang]} <ArrowUpRight size={15} aria-hidden="true" /></External>}
            {technicalStack && index === 2 && <Tags items={technicalStack} />}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function RevealRow({ id, className = '', summary, children, hover = true }) {
  const [pinned, setPinned] = useState(false)
  const [preview, setPreview] = useState(false)
  const open = pinned || preview
  return (
    <li className={'reveal-row ' + className} data-spotlight={className === 'timeline-row' ? '' : undefined}
      onPointerEnter={event => { if (hover && event.pointerType === 'mouse' && matchMedia('(hover: hover)').matches) setPreview(true) }}
      onPointerLeave={event => {
        if (event.pointerType === 'mouse' && !event.currentTarget.querySelector('.reveal-panel')?.contains(document.activeElement)) setPreview(false)
      }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPreview(false) }}
    >
      <button type="button" className="row-trigger" aria-expanded={open} aria-controls={id}
        onClick={() => { if (pinned) setPreview(false); setPinned(!pinned) }}>
        {summary}
        {open ? <Minus className="row-icon" size={18} aria-hidden="true" /> : <Plus className="row-icon" size={18} aria-hidden="true" />}
      </button>
      <div className="reveal-panel" data-open={open} id={id} inert={!open}>
        <div className="reveal-inner">{children}</div>
      </div>
    </li>
  )
}
