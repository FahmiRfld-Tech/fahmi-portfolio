import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Braces, Check, ChevronRight,
  Code2, Command, Copy, Database, ExternalLink, Github, GraduationCap, Images, Laptop2,
  Layers3, Linkedin, Mail, MapPin, Maximize2, Monitor, Pause, Play, Search, Smartphone, Sparkles, Users,
  Volume2, VolumeX,
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
const focus = [
  { id: 'rag', name: 'RAG AI Systems', Icon: Database, text: ['Asisten AI yang menyusun jawaban dari dokumen terverifikasi dan menampilkan tautan sumber.', 'AI assistants that ground their answers in verified documents and surface source links.'] },
  { id: 'web', name: 'Full-Stack Web', Icon: Code2, text: ['Portal wisata dan sistem pengelolaan konten yang bisa dipakai pengelola usaha secara mandiri.', 'Tourism portals and content management systems that local business owners can update independently.'] },
  { id: 'ux', name: 'UI/UX Systems', Icon: Layers3, text: ['Alur antarmuka untuk navigasi produk, prototipe interaktif, dan pengalaman belajar spasial.', 'Interface flows for product navigation, interactive prototypes, and spatial learning experiences.'] },
]
const projectColors = ['violet', 'green', 'peach', 'blue']
const metricIcons = [Users, GraduationCap, Laptop2]
const tickerItems = [
  ['AI RAG Terapan', 'Applied RAG AI'], ['Arsitektur Full-Stack', 'Full-Stack Architecture'],
  ['3D Interaktif & UI/UX', 'Interactive 3D & UI/UX'], ['Telkom University', 'Telkom University'],
  ['GEMASTIK Smart City', 'GEMASTIK Smart City'],
]
const burstColors = ['#5b5bd6', '#ff5a36', '#10b981', '#0284c7', '#d97706', '#9c66db']

function Ticker({ lang }) {
  const [paused, setPaused] = useState(false)
  return (
    <div className="ticker" data-paused={paused}>
      <div className="ticker-window"><div className="ticker-track">
        {[false, true].map(copy => <div key={String(copy)} className="ticker-group" aria-hidden={copy || undefined}>
          {tickerItems.map(item => <span key={item[0]}>{item[lang]}<b aria-hidden="true">✦</b></span>)}
        </div>)}
      </div></div>
      <button type="button" className="key icon-key ticker-button" aria-pressed={paused} aria-label={lang ? 'Pause ticker' : 'Jeda ticker'} onClick={() => setPaused(value => !value)}>
        {paused ? <Play size={15} /> : <Pause size={15} />}
      </button>
    </div>
  )
}

function External({ href, children, className = '', ...props }) {
  return <a className={'key ' + className} href={href} rel="noopener noreferrer" target="_blank" {...props}>{children}</a>
}

function HeroWidget({ lang }) {
  const [selected, setSelected] = useState(0)
  const current = focus[selected]
  const reduce = useReducedMotion()
  function tilt(event) {
    if (reduce || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--tilt-x', ((event.clientX - rect.left) / rect.width - .5) * 9 + 'deg')
    event.currentTarget.style.setProperty('--tilt-y', ((event.clientY - rect.top) / rect.height - .5) * -8 + 'deg')
  }
  return (
    <motion.aside className="hero-widget" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: .15, duration: .48, ease: [.22, 1, .36, 1] }}>
      <div className="widget-inner" onPointerMove={tilt} onPointerLeave={event => {
        event.currentTarget.style.removeProperty('--tilt-x')
        event.currentTarget.style.removeProperty('--tilt-y')
      }}>
        <div className="widget-head"><span><Braces size={16} /> {lang ? 'Engineering focus' : 'Fokus engineering'}</span><span><MapPin size={13} /> Bandung, ID</span></div>
        <div className="widget-meta"><strong>Telkom University</strong><p>{lang ? 'Multimedia Engineering Technology · GPA 3.67' : 'D4 Teknologi Rekayasa Multimedia · IPK 3,67'}</p></div>
        <div className="focus-buttons" role="group" aria-label={lang ? 'Engineering focus' : 'Fokus engineering'}>
          {focus.map(({ id, Icon, name }, index) => (
            <button type="button" className="key focus-key" key={id} aria-pressed={index === selected} onClick={() => setSelected(index)}>
              <Icon size={16} /> <span>{name}</span>
            </button>
          ))}
        </div>
        <div className={'focus-screen focus-' + current.id}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.img key={current.id} src={'/projects/focus-' + current.id + '.svg'} alt="" width="342" height="116"
              initial={{ opacity: 0, y: 8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5 }}
              transition={{ duration: .16 }} />
          </AnimatePresence>
        </div>
        <p className="focus-note" aria-live="polite">{current.text[lang]}</p>
      </div>
    </motion.aside>
  )
}

function ProjectCard({ project, index, lang, open }) {
  return (
    <motion.article className={'project-card ' + projectColors[index] + ' project-' + project.id}
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }}
      transition={{ duration: .48, delay: index % 2 * .05 }}>
      <button className="project-window" type="button" onClick={() => open('preview', project)} aria-label={(lang ? 'Enlarge screenshot: ' : 'Perbesar screenshot: ') + project.name[lang]}>
        <span className="browser-bar">
          <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
          <span>{new URL(project.preview).hostname}</span><Maximize2 size={15} />
        </span>
        <span className="browser-body">
          <img src={project.image} alt={project.alt} width={project.width} height={project.height} loading="lazy" decoding="async" />
          <span className="frame-action"><Images size={15} /> {lang ? 'View screenshot' : 'Lihat screenshot'}</span>
        </span>
      </button>
      <div className="project-body">
        <div className="project-category">{project.category[lang]}</div>
        <h3>{project.name[lang]}</h3>
        <p>{project.summary[lang]}</p>
        <div className="tags">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
        <div className="actions">
          <button className="key primary" type="button" onClick={() => open('case', project)}>{lang ? 'Case study' : 'Studi kasus'} <ArrowUpRight size={16} /></button>
          <External href={project.preview}>{project.id === 'rag' ? 'README' : 'Demo'} <ExternalLink size={15} /></External>
          {project.id !== 'cireundeu' && <External href={project.link} className="icon-key" aria-label={'GitHub — ' + project.name[lang]}><Github size={17} /></External>}
        </div>
      </div>
    </motion.article>
  )
}

function ProjectPreview({ project, lang }) {
  const [mode, setMode] = useState('desktop')
  function toggle(next) { setMode(next) }
  return (
    <div>
      <div className="preview-controls">
        <div className="actions" role="group" aria-label={lang ? 'Screenshot display' : 'Tampilan screenshot'}>
          <button className="key" type="button" aria-pressed={mode === 'desktop'} onClick={() => toggle('desktop')}><Monitor size={17} /> {lang ? 'Wide frame' : 'Bingkai lebar'}</button>
          <button className="key" type="button" aria-pressed={mode === 'device'} onClick={() => toggle('device')}><Smartphone size={17} /> {lang ? 'Portrait crop' : 'Potongan vertikal'}</button>
        </div>
        <External href={project.preview}>{lang ? 'Open live project' : 'Buka proyek asli'} <ArrowUpRight size={16} /></External>
      </div>
      <motion.div layout className={'zoom-image ' + mode}>
        <img src={project.image} alt={project.alt} width={project.width} height={project.height} />
      </motion.div>
      <p className="preview-caption">{lang ? 'Captured from the public project page.' : 'Diambil dari halaman publik proyek.'}</p>
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
          <li key={id} id={'cmd-' + id} role="option" aria-selected={selected === i}>
            <button type="button" onPointerMove={() => setIndex(i)} onClick={() => run({ run: action })}>
              <Icon size={18} /> <span>{name}</span><ArrowRight size={16} />
            </button>
          </li>
        ))}
      </ul>
      {!matches.length && <p className="empty-search">{lang ? 'No matching commands.' : 'Perintah tidak ditemukan.'}</p>}
      <div className="command-help"><kbd>↑</kbd><kbd>↓</kbd> {lang ? 'navigate' : 'navigasi'} <kbd>↵</kbd> {lang ? 'open' : 'buka'} <kbd>esc</kbd> {lang ? 'close' : 'tutup'}</div>
    </div>
  )
}

function useSound() {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem('fahmi-sound') === 'on' } catch { return false }
  })
  const audio = useRef(null)

  function tick() {
    const Audio = window.AudioContext || window.webkitAudioContext
    if (!Audio) return
    try {
      audio.current ??= new Audio()
      const context = audio.current
      const ready = context.state === 'running' ? Promise.resolve() : context.resume()
      ready.then(() => {
        const voice = context.createOscillator()
        const gain = context.createGain()
        const now = context.currentTime
        voice.type = 'triangle'
        voice.frequency.setValueAtTime(180, now)
        voice.frequency.exponentialRampToValueAtTime(60, now + .06)
        gain.gain.setValueAtTime(.0001, now)
        gain.gain.exponentialRampToValueAtTime(.045, now + .007)
        gain.gain.exponentialRampToValueAtTime(.0001, now + .08)
        voice.connect(gain).connect(context.destination)
        voice.onended = () => { voice.disconnect(); gain.disconnect() }
        voice.start(now)
        voice.stop(now + .085)
      }).catch(() => {})
    } catch { /* Audio is optional. */ }
  }

  function toggle() {
    if (!enabled) tick()
    setEnabled(!enabled)
    try { localStorage.setItem('fahmi-sound', enabled ? 'off' : 'on') } catch { /* Storage is optional. */ }
  }

  return { enabled, tick, toggle }
}

export default function App() {
  const [lang, setLang] = useState(0)
  const [overlay, setOverlay] = useState(null)
  const [toast, setToast] = useState(null)
  const sound = useSound()
  const timer = useRef(0)
  const motionReduced = useReducedMotion()
  const glowFrame = useRef(0)
  const closeLabel = lang ? 'Close' : 'Tutup'

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
      cancelAnimationFrame(glowFrame.current)
    }
  }, [])

  function go(id) {
    const target = document.getElementById(id)
    if (!target) return
    location.hash = id
    target.focus({ preventScroll: true })
  }

  async function copyEmail(event) {
    const bounds = event?.currentTarget?.getBoundingClientRect()
    const origin = bounds && { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 }
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
      try { field.select(); success = document.execCommand('copy') } catch { /* Show the address below. */ }
      finally { field.remove(); trigger?.focus({ preventScroll: true }) }
    }
    setToast({ success, origin, key: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }

  const open = (type, project) => setOverlay({ type, project })
  const commands = [
    ...nav.map(([id, names]) => ({ id, name: names[lang], Icon: ArrowDownRight, run: () => go(id) })),
    ...content.projects.map(project => ({ id: project.id, name: project.name[lang], keywords: project.name.join(' ') + ' ' + project.stack.join(' '), Icon: Images, run: () => open('case', project) })),
    { id: 'copy', name: lang ? 'Copy email' : 'Salin email', Icon: Copy, run: copyEmail },
    { id: 'language', name: lang ? 'Gunakan Bahasa Indonesia' : 'Switch to English', Icon: Command, run: () => setLang(1 - lang) },
  ]

  function followCursor(event) {
    if (motionReduced || event.pointerType === 'touch') return
    const { clientX, clientY } = event
    cancelAnimationFrame(glowFrame.current)
    glowFrame.current = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--pointer-x', clientX + 'px')
      document.documentElement.style.setProperty('--pointer-y', clientY + 'px')
    })
  }

  return (
    <div onPointerMove={followCursor} onClick={event => {
      const key = event.target.closest('button, a.key')
      if (sound.enabled && key && !key.disabled && !key.hasAttribute('data-sound-toggle')) sound.tick()
    }}>
      <a className="skip key" href="#main">{lang ? 'Skip to content' : 'Langsung ke konten'}</a>
      <header className="nav-shell">
        <div className="wrap">
          <div className="nav-bar">
            <a className="brand" href="#main"><span className="monogram">MF<span>.</span></span><span>M Fahmi Rifaldi</span></a>
            <nav aria-label={lang ? 'Main navigation' : 'Navigasi utama'}>
              {nav.slice(0, 3).map(([id, labels]) => <a key={id} href={'#' + id}>{labels[lang]}</a>)}
            </nav>
            <div className="nav-tools">
              <button className="key icon-key audio" type="button" data-sound-toggle onClick={sound.toggle} aria-pressed={sound.enabled} aria-label={lang ? 'Button sounds' : 'Suara tombol'} title={lang ? 'Button sounds' : 'Suara tombol'}>{sound.enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
              <div className="language-switch" data-lang={lang} role="group" aria-label={lang ? 'Language' : 'Bahasa'}>
                <button type="button" aria-pressed={!lang} aria-label="Bahasa Indonesia" onClick={() => setLang(0)}>ID</button>
                <button type="button" aria-pressed={!!lang} aria-label="English" onClick={() => setLang(1)}>EN</button>
              </div>
              <button className="key command-key" type="button" onClick={() => open('command')} aria-label={lang ? 'Open command palette' : 'Buka palet perintah'}><Command size={16} /><span>K</span></button>
            </div>
          </div>
        </div>
      </header>

      <main className="wrap" id="main" tabIndex="-1">
        <div className="hero">
          <motion.div className="hero-copy" initial="hide" animate="show" variants={{ show: { transition: { staggerChildren: .085 } } }}>
            {[
              <p className="availability" key="status"><span className="live-dot" />{content.copy.availability[lang]}</p>,
              <h1 key="name">M Fahmi <span>Rifaldi</span></h1>,
              <div key="bio"><p className="hero-lead">{content.copy.lead[lang]}</p><p className="hero-bio">{content.copy.bio[lang]}</p></div>,
              <div className="actions" key="actions">
                <a className="key primary" href="#projects">{lang ? 'Selected work' : 'Lihat proyek'} <ArrowDown size={17} /></a>
                <button className="key" type="button" onClick={copyEmail}><Copy size={16} /> {lang ? 'Copy email' : 'Salin email'}</button>
                <External href={LINKEDIN} className="icon-key" aria-label="LinkedIn"><Linkedin size={18} /></External>
                <External href={GITHUB} className="icon-key" aria-label="GitHub"><Github size={18} /></External>
              </div>,
            ].map(node => (
              <motion.div key={node.key} variants={{ hide: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: .46, ease: [.22, 1, .36, 1] } } }}>
                {node}
              </motion.div>
            ))}
          </motion.div>
          <HeroWidget lang={lang} />
        </div>

        <Ticker lang={lang} />

        <ul className="metrics" aria-label={lang ? 'Experience in numbers' : 'Angka pengalaman'}>
          {content.metrics.map((metric, index) => {
            const Icon = metricIcons[index]
            return <motion.li className={'metric metric-' + index} key={metric.number[0]} whileHover={{ y: -3 }}><div><Icon size={18} /><strong>{metric.number[lang]}</strong></div><span>{metric.label[lang]}</span></motion.li>
          })}
        </ul>

        <section id="projects" tabIndex="-1" className="section" aria-labelledby="projects-title">
          <div className="section-head"><div className="kicker"><Laptop2 size={16} /> {lang ? 'Selected work' : 'Portofolio'}</div>
            <h2 id="projects-title">{lang ? 'Projects in practice.' : 'Proyek pilihan.'}</h2></div>
          <div className="project-grid">
            {content.projects.map((project, index) => <ProjectCard key={project.id} {...{ project, index, lang, open }} />)}
          </div>
        </section>

        <Playground en={Boolean(lang)} />

        <section id="experience" tabIndex="-1" className="section" aria-labelledby="experience-title">
          <div className="section-head"><h2 id="experience-title">{lang ? 'Experience & leadership' : 'Pengalaman & kepemimpinan'}</h2></div>
          <ol className="timeline">
            {content.roles.map(item => <motion.li key={item.role[0]} initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }}>
              <span className="timeline-marker" aria-hidden="true" />
              <div><h3>{item.role[lang]}</h3><p>{item.org[lang]}</p></div>
              <span className="date">{item.date[lang]}</span>
            </motion.li>)}
          </ol>
        </section>

        <section id="stack" tabIndex="-1" className="section" aria-labelledby="stack-title">
          <div className="section-head"><h2 id="stack-title">{lang ? 'Tools, education & achievements' : 'Teknologi, pendidikan & pencapaian'}</h2></div>
          <div className="info-grid">
            <article className="info-card"><h3><Database size={20} /> {lang ? 'Technology' : 'Teknologi'}</h3>
              {content.stack.map(group => <div className="tag-group" key={group.title}><p>{group.title}</p><div className="tags">{group.items.map(item => <span key={item}>{item}</span>)}</div></div>)}
            </article>
            {content.info.map(item => <article className="info-card" key={item.title[0]}>
              <h3>{item.title[lang]}</h3>{item.copy && <p>{item.copy[lang]}</p>}
              {!!item.tags.length && <div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
            </article>)}
          </div>
        </section>

        <section id="contact" tabIndex="-1" className="section contact">
          <div><h2>{lang ? 'Let’s collaborate.' : 'Mari berkolaborasi.'}</h2><p>{content.copy.contact[lang]}</p></div>
          <div className="actions">
            <a className="key primary" href={'mailto:' + EMAIL}><Mail size={17} /> {lang ? 'Send email' : 'Kirim email'}</a>
            <button className="key" type="button" onClick={copyEmail}><Copy size={16} /> {lang ? 'Copy email' : 'Salin email'}</button>
            <External href={GITHUB} className="icon-key" aria-label="GitHub"><Github size={18} /></External>
            <External href={LINKEDIN} className="icon-key" aria-label="LinkedIn"><Linkedin size={18} /></External>
          </div>
        </section>
        <footer><span>M Fahmi Rifaldi</span><span><MapPin size={14} /> Bandung, Indonesia</span></footer>
      </main>
      <AnimatePresence>
        {toast && <motion.div className="toast" role="status" key={toast.key}
          initial={{ opacity: 0, y: -10, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 330, damping: 22 }}>
          {toast.success && <Check size={18} />}{toast.success ? (lang ? 'Email copied' : 'Email disalin') : EMAIL}
        </motion.div>}
      </AnimatePresence>
      {toast?.success && toast.origin && !motionReduced && (
        <div className="burst" style={{ left: toast.origin.x, top: toast.origin.y }} key={toast.key} aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => {
            const angle = i * Math.PI / 9
            const distance = 29 + (i * 13) % 51
            return <motion.i key={i} style={{ background: burstColors[i % burstColors.length], borderRadius: i % 3 ? 1 : '50%' }}
              initial={{ x: 0, y: 0, scale: .45, opacity: 1 }}
              animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, rotate: i * 23, opacity: 0 }}
              transition={{ duration: .46 + i % 4 * .035, ease: 'easeOut' }} />
          })}
        </div>
      )}
      {overlay?.type === 'command' && <Dialog key="command" className="command-dialog" title={lang ? 'Command palette' : 'Palet perintah'} closeLabel={closeLabel} close={() => setOverlay(null)}>
        <CommandPalette lang={lang} commands={commands} close={() => setOverlay(null)} />
      </Dialog>}
      {overlay?.type === 'preview' && <Dialog key="preview" className="preview-dialog" title={overlay.project.name[lang]} closeLabel={closeLabel} close={() => setOverlay(null)}>
        <ProjectPreview project={overlay.project} lang={lang} />
      </Dialog>}
      {overlay?.type === 'case' && <Dialog key="case" title={overlay.project.name[lang]} closeLabel={closeLabel} close={() => setOverlay(null)}>
        <dl className="case-details">
          {caseStudies[overlay.project.id][lang ? 'en' : 'id'].map((text, i) => (
            <div key={text}><dt>{(lang ? ['Problem', 'Architecture', 'Outcome'] : ['Masalah', 'Arsitektur', 'Hasil'])[i]}</dt><dd>{text}</dd></div>
          ))}
        </dl>
        <External href={overlay.project.preview}>{lang ? 'Explore project' : 'Buka proyek'} <ChevronRight size={16} /></External>
      </Dialog>}
    </div>
  )
}
