import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, Command, Copy, Github, Images,
  Linkedin, Mail, MapPin, Maximize2, Menu, Monitor, Search, ZoomIn,
} from 'lucide-react'
import content from './content.json'
import { caseStudies } from './cases'
import Dialog from './Dialog'
import Playground from './Playground'

const GITHUB = 'https://github.com/FahmiRfld-Tech'
const LINKEDIN = 'https://www.linkedin.com/in/m-fahmi-rifaldi-ba0653245/'
const EMAIL = 'fahmirifaldi253@gmail.com'
const nav = [
  ['projects', ['Proyek', 'Projects']],
  ['playground', ['Playground', 'Playground']],
  ['experience', ['Pengalaman', 'Experience']],
  ['stack', ['Teknologi', 'Technology']],
  ['contact', ['Kontak', 'Contact']],
]
const [flagship, ...otherProjects] = content.projects
const projectActions = {
  batam: ['Buka aplikasi asli', 'Open the live app'],
  cireundeu: ['Buka portal', 'Explore the portal'],
  quran: ['Lihat prototipe', 'Explore the prototype'],
  rag: ['Baca kode', 'Read the code'],
}

function External({ href, children, className = 'text-link', ...props }) {
  return <a className={className} href={href} rel="noopener noreferrer" target="_blank" {...props}>{children}</a>
}

function Tags({ items }) {
  return <ul className="tags">{items.map(item => <li key={item}>{item}</li>)}</ul>
}

function ProjectScreenshot({ project, lang, open, featured = false }) {
  return (
    <button className={'project-window' + (featured ? ' hero-frame' : '')} type="button"
      onClick={() => open('preview', project)}
      aria-label={(lang ? 'Enlarge screenshot: ' : 'Perbesar screenshot: ') + project.name[lang]}>
      <span className="browser-bar">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>{new URL(project.preview).hostname}</span><Maximize2 size={16} aria-hidden="true" />
      </span>
      <img src={project.image} alt="" width={project.width} height={project.height}
        loading={featured ? 'eager' : 'lazy'} fetchPriority={featured ? 'high' : 'auto'} decoding={featured ? 'auto' : 'async'} />
    </button>
  )
}

function Hero({ lang, open }) {
  return (
    <section className="hero" aria-labelledby="name">
      <div className="hero-copy">
        <p className="eyebrow hero-location"><MapPin size={15} /> Bandung, Indonesia</p>
        <h1 id="name">M Fahmi Rifaldi<span aria-hidden="true">.</span></h1>
        <p className="hero-lead">{content.copy.lead[lang]}</p>
        <p className="hero-bio">{content.copy.bio[lang]}</p>
        <div className="actions">
          <a className="key primary" href="#playground">{lang ? 'Try the Batam demo' : 'Coba demo wisata Batam'} <ArrowDown size={17} /></a>
          <a className="text-link" href="#contact">{lang ? 'Contact Fahmi' : 'Hubungi Fahmi'} <ArrowUpRight size={17} /></a>
        </div>
      </div>
      <figure className="hero-proof">
        <ProjectScreenshot project={flagship} lang={lang} open={open} featured />
        <figcaption>
          <div>
            <strong>Hallo Batam AI</strong>
            <p>{lang ? 'Live app capture · Asking about Nongsa beaches' : 'Cuplikan asli · Tanya tentang pantai di Nongsa'}</p>
          </div>
          <a className="text-link" href="#hallo-batam">{lang ? 'Case study' : 'Studi kasus'} <ArrowUpRight size={16} /></a>
        </figcaption>
      </figure>
    </section>
  )
}

function ProjectCard({ project, lang, open }) {
  return (
    <article className="project-card">
      <ProjectScreenshot project={project} lang={lang} open={open} />
      <div className="project-body">
        <p className="eyebrow">{project.category[lang]}</p>
        <h3>{project.name[lang]}</h3>
        <p>{project.summary[lang]}</p>
        <p className="project-role">{project.role[lang]}</p>
        <div className="actions">
          <External href={project.preview}>{projectActions[project.id][lang]} <ArrowUpRight size={16} /></External>
          <button className="text-link subtle-link" type="button" onClick={() => open('case', project)}>{lang ? 'Details' : 'Detail'}</button>
        </div>
      </div>
    </article>
  )
}

function CaseDetails({ project, lang }) {
  return (
    <dl className="case-details">
      {caseStudies[project.id].map(({ label, copy, evidence }) => (
        <div key={label[0]}>
          <dt>{label[lang]}</dt>
          <dd>{copy[lang]} {evidence && <External href={evidence.href}>{evidence.label[lang]} <ArrowUpRight size={15} /></External>}</dd>
        </div>
      ))}
    </dl>
  )
}

function FeaturedCase({ lang, open }) {
  return (
    <article className="featured-case" id="hallo-batam" tabIndex="-1">
      <div className="featured-intro">
        <p className="eyebrow">{lang ? 'Applied AI · 2026' : 'AI Terapan · 2026'}</p>
        <h3>Hallo Batam AI</h3>
        <Tags items={flagship.stack} />
        <div className="actions">
          <External href={flagship.preview} className="key">{projectActions.batam[lang]} <ArrowUpRight size={17} /></External>
          <button className="text-link" type="button" onClick={() => open('case', flagship)}>{lang ? 'Technical details' : 'Detail teknis'} <ArrowRight size={16} /></button>
        </div>
      </div>
      <CaseDetails project={flagship} lang={lang} />
    </article>
  )
}
function ProjectPreview({ project, lang }) {
  const [fullSize, setFullSize] = useState(false)
  const title = lang ? 'Screenshot display' : 'Tampilan screenshot'
  return (
    <div>
      <div className="preview-controls">
        <div className="actions" role="group" aria-label={title}>
          <button className="key" type="button" aria-pressed={!fullSize} onClick={() => setFullSize(false)}>
            <Monitor size={17} /> {lang ? 'Fit to screen' : 'Pas layar'}
          </button>
          <button className="key" type="button" aria-pressed={fullSize} onClick={() => setFullSize(true)}>
            <ZoomIn size={17} /> {lang ? 'Original size' : 'Ukuran asli'}
          </button>
        </div>
        <External href={project.preview}>{projectActions[project.id][lang]} <ArrowUpRight size={16} /></External>
      </div>
      <div className={'zoom-image' + (fullSize ? ' original' : '')} tabIndex={fullSize ? 0 : undefined}
        role={fullSize ? 'region' : undefined} aria-label={fullSize ? title : undefined}>
        <img src={project.image} alt={project.alt[lang]} width={project.width} height={project.height} />
      </div>
      <p className="preview-caption">{lang ? 'Captured from the public project page.' : 'Diambil dari halaman publik proyek.'}
        {fullSize && (lang ? ' Scroll sideways if needed.' : 'Geser ke samping bila perlu.')}</p>
    </div>
  )
}

function CommandPalette({ lang, commands, close }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const matches = commands.filter(item => (item.name + ' ' + (item.keywords ?? '')).toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()))
  const selected = Math.min(index, Math.max(matches.length - 1, 0))
  function run(command) {
    close()
    requestAnimationFrame(command.run)
  }
  return (
    <div>
      <div className="command-search"><Search size={21} />
        <input data-initial-focus aria-label={lang ? 'Search commands' : 'Cari perintah'} placeholder={lang ? 'Find a project or action…' : 'Cari proyek atau aksi…'}
          value={query} onChange={event => { setQuery(event.target.value); setIndex(0) }}
          role="combobox" aria-autocomplete="list" aria-expanded={Boolean(matches.length)} aria-controls="command-list"
          aria-activedescendant={matches[selected] ? 'cmd-' + matches[selected].id : undefined}
          onKeyDown={event => {
            if (!matches.length) return
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              const next = (selected + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length
              setIndex(next)
              document.getElementById('cmd-' + matches[next].id)?.scrollIntoView({ block: 'nearest' })
            } else if (event.key === 'Enter') {
              event.preventDefault()
              run(matches[selected])
            }
          }} />
      </div>
      <ul className="command-list" id="command-list" role="listbox">
        {matches.map(({ Icon, id, name, run: action }, i) => (
          <li key={id} id={'cmd-' + id} role="option" aria-selected={selected === i}
            onPointerMove={() => setIndex(i)} onClick={() => run({ run: action })}>
            <Icon size={18} /> <span>{name}</span><ArrowRight size={16} />
          </li>
        ))}
      </ul>
      {!matches.length && <p className="empty-search">{lang ? 'No matching commands.' : 'Perintah tidak ditemukan.'}</p>}
      <div className="command-help"><kbd>↑</kbd><kbd>↓</kbd> {lang ? 'navigate' : 'navigasi'} <kbd>↵</kbd> {lang ? 'open' : 'buka'} <kbd>esc</kbd> {lang ? 'close' : 'tutup'}</div>
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState(0)
  const [overlay, setOverlay] = useState(null)
  const [toast, setToast] = useState(null)
  const timer = useRef(0)
  const closeLabel = lang ? 'Close' : 'Tutup'

  useLayoutEffect(() => {
    const id = location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang ? 'en' : 'id'
    document.title = 'M Fahmi Rifaldi — ' + (lang ? 'Software Engineering Portfolio' : 'Portofolio Software Engineering')
  }, [lang])

  useEffect(() => {
    function openCommand(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOverlay(current => current?.type === 'command' ? null : { type: 'command' })
      }
    }
    document.addEventListener('keydown', openCommand)
    return () => {
      document.removeEventListener('keydown', openCommand)
      clearTimeout(timer.current)
    }
  }, [])

  function go(id) {
    const target = document.getElementById(id)
    if (!target) return
    location.hash = id
    target.scrollIntoView()
    target.focus({ preventScroll: true })
  }

  async function copyEmail() {
    let success = false
    try {
      await navigator.clipboard.writeText(EMAIL)
      success = true
    } catch {
      const field = document.createElement('textarea')
      const trigger = document.activeElement
      field.value = EMAIL
      field.readOnly = true
      field.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.append(field)
      try { field.select(); success = document.execCommand('copy') }
      catch { /* The toast displays the address if the clipboard is unavailable. */ }
      finally { field.remove(); trigger?.focus({ preventScroll: true }) }
    }
    setToast({ success, key: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }

  const open = (type, project) => setOverlay({ type, project })
  const close = () => setOverlay(null)
  const contactLabels = lang ? ['Email Fahmi', 'Copy email'] : ['Email Fahmi', 'Salin email']
  const commands = [
    ...nav.map(([id, names]) => ({ id, name: names[lang], Icon: ArrowRight, run: () => go(id) })),
    ...content.projects.map(project => ({ id: project.id, name: project.name[lang], keywords: project.name.join(' ') + ' ' + project.stack.join(' '), Icon: Images, run: () => open('case', project) })),
    { id: 'copy', name: contactLabels[1], Icon: Copy, run: copyEmail },
    { id: 'language', name: lang ? 'Gunakan Bahasa Indonesia' : 'Switch to English', Icon: Command, run: () => setLang(1 - lang) },
  ]

  return (
    <>
      <a className="skip key" href="#main">{lang ? 'Skip to content' : 'Langsung ke konten'}</a>
      <header className="nav-shell">
        <div className="wrap nav-bar">
          <a className="brand" href="#main" aria-label="M Fahmi Rifaldi"><span className="monogram" aria-hidden="true">MF<span>.</span></span><span aria-hidden="true">Fahmi Rifaldi</span></a>
          <nav className="desktop-nav" aria-label={lang ? 'Main navigation' : 'Navigasi utama'}>
            {nav.filter(([id]) => id !== 'stack').map(([id, labels]) => <a key={id} href={'#' + id}>{labels[lang]}</a>)}
          </nav>
          <div className="nav-tools">
            <div className="language-switch" data-lang={lang} role="group" aria-label={lang ? 'Language' : 'Bahasa'}>
              <button type="button" aria-pressed={!lang} aria-label="Bahasa Indonesia" onClick={() => setLang(0)}>ID</button>
              <button type="button" aria-pressed={!!lang} aria-label="English" onClick={() => setLang(1)}>EN</button>
            </div>
            <button className="key command-key" type="button" onClick={() => open('command')} aria-label={lang ? 'Open command palette' : 'Buka palet perintah'} aria-keyshortcuts="Control+K Meta+K"><Command size={15} /><span>K</span></button>
            <button className="key icon-key mobile-menu" type="button" onClick={() => open('menu')} aria-label={lang ? 'Open menu' : 'Buka menu'}><Menu size={19} /></button>
          </div>
        </div>
      </header>

      <main className="wrap" id="main" tabIndex="-1">
        <Hero {...{ lang, open }} />
        <section id="projects" tabIndex="-1" className="section projects-section" aria-labelledby="projects-title">
          <h2 id="projects-title">{lang ? 'Selected work' : 'Proyek pilihan'}</h2>
          <FeaturedCase {...{ lang, open }} />
          <div className="project-grid">
            {otherProjects.map(project => <ProjectCard key={project.id} {...{ project, lang, open }} />)}
          </div>
        </section>

        <Playground lang={lang} liveUrl={flagship.preview} />

        <section id="experience" tabIndex="-1" className="section" aria-labelledby="experience-title">
          <h2 id="experience-title">{lang ? 'Experience & leadership' : 'Pengalaman & kepemimpinan'}</h2>
          <ul className="metrics" aria-label={lang ? 'Experience in numbers' : 'Angka pengalaman'}>
            {content.metrics.map(metric => <li className="metric" key={metric.number[0]}><strong>{metric.number[lang]}</strong><span>{metric.label[lang]}</span></li>)}
          </ul>
          <ol className="timeline">
            {content.roles.map(item => <li key={item.role[0]}>
              <div><h3>{item.role[lang]}</h3><p>{item.org[lang]}</p></div>
              <span className="date">{item.date[lang]}</span>
            </li>)}
          </ol>
        </section>

        <section id="stack" tabIndex="-1" className="section" aria-labelledby="stack-title">
          <h2 id="stack-title">{lang ? 'Tools, education & achievements' : 'Teknologi, pendidikan & pencapaian'}</h2>
          <div className="info-grid">
            <div>
              <h3>{lang ? 'Technology' : 'Teknologi'}</h3>
              {content.stack.map(group => <div className="tag-group" key={group.title}><p>{group.title}</p><Tags items={group.items} /></div>)}
            </div>
            <div className="education">
              {content.info.map(item => <article key={item.title[0]}>
                <h3>{item.title[lang]}</h3>{item.copy && <p>{item.copy[lang]}</p>}
                {!!item.tags.length && <Tags items={item.tags} />}
              </article>)}
            </div>
          </div>
        </section>

        <section id="contact" tabIndex="-1" className="section contact" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow"><span className="live-dot" />{content.copy.availability[lang]}</p>
            <h2 id="contact-title">{lang ? 'Contact Fahmi' : 'Hubungi Fahmi'}</h2><p>{content.copy.contact[lang]}</p>
            <a className="text-link email-address" href={'mailto:' + EMAIL}>{EMAIL}</a>
          </div>
          <div className="actions">
            <a className="key primary" href={'mailto:' + EMAIL}><Mail size={17} /> {contactLabels[0]}</a>
            <button className="key icon-key" type="button" onClick={copyEmail} aria-label={contactLabels[1]} title={contactLabels[1]}><Copy size={17} /></button>
            <External href={GITHUB} className="key icon-key" aria-label="GitHub"><Github size={18} /></External>
            <External href={LINKEDIN} className="key icon-key" aria-label="LinkedIn"><Linkedin size={18} /></External>
          </div>
        </section>
      </main>
      <footer className="wrap"><span>M Fahmi Rifaldi</span><span><MapPin size={15} /> Bandung, Indonesia</span></footer>

      <AnimatePresence>
        {toast && <m.div className="toast" role="status" key={toast.key}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          {toast.success && <Check size={18} />}{toast.success ? (lang ? 'Email copied' : 'Email disalin') : EMAIL}
        </m.div>}
      </AnimatePresence>
      {overlay?.type === 'menu' && <Dialog key="menu" title={lang ? 'Menu' : 'Menu navigasi'} {...{ closeLabel, close }}>
        <nav className="menu-links" aria-label={lang ? 'Main navigation' : 'Navigasi utama'}>
          {nav.map(([id, labels]) => <a key={id} href={'#' + id} onClick={event => {
            event.preventDefault()
            close()
            requestAnimationFrame(() => go(id))
          }}>{labels[lang]}<ArrowRight size={17} /></a>)}
        </nav>
      </Dialog>}
      {overlay?.type === 'command' && <Dialog key="command" className="command-dialog" title={lang ? 'Command palette' : 'Palet perintah'} {...{ closeLabel, close }}>
        <CommandPalette {...{ lang, commands, close }} />
      </Dialog>}
      {overlay?.type === 'preview' && <Dialog key="preview" className="preview-dialog" title={overlay.project.name[lang]} {...{ closeLabel, close }}>
        <ProjectPreview project={overlay.project} lang={lang} />
      </Dialog>}
      {overlay?.type === 'case' && <Dialog key="case" title={overlay.project.name[lang]} {...{ closeLabel, close }}>
        <CaseDetails project={overlay.project} lang={lang} />
        {overlay.project.id === 'batam' && <p className="architecture-note">Vercel → Supabase Edge Function → PostgreSQL + OpenAI</p>}
        <div className="actions">
          <External href={overlay.project.preview} className="key primary">{projectActions[overlay.project.id][lang]} <ArrowUpRight size={16} /></External>
          {overlay.project.id === 'batam' && <External href={flagship.link + '/blob/main/docs/ARCHITECTURE.md'}>{lang ? 'Architecture document' : 'Dokumen arsitektur'} <ArrowUpRight size={16} /></External>}
          {overlay.project.id === 'quran' && <External href={overlay.project.link}>{lang ? 'Concept documentation' : 'Dokumentasi konsep'} <ArrowUpRight size={16} /></External>}
        </div>
      </Dialog>}
    </>
  )
}
