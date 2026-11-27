import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Layers3 } from 'lucide-react'
import Playground from '../Playground'
import CommandTrigger from './CommandTrigger'
import { IdentityTrigger } from './IdentityPass'
import { HeroHeadline, HeroMetrics } from './HeroMotion'
import content from '../content.json'
import Workbench from './Workbench'
import { chapterNumber, chapters } from './content'
import { BrowserFrame, ChapterHeader, ProjectLink, Screenshot } from './Shared'

export function FloatingChapterDock({ lang, scrollRoot }) {
  const [active, setActive] = useState('prolog')
  const [retired, setRetired] = useState(false)
  const dock = useRef(null)

  useEffect(() => {
    const root = scrollRoot.current
    const targets = chapters.map(({ id }) => document.getElementById(id))
    const epilog = root.querySelector('.epilog')
    const footer = root.querySelector('.site-footer')
    const nav = dock.current
    let frame
    let activeChapter
    function sync() {
      frame = undefined
      const range = root.scrollHeight - root.clientHeight
      nav.style.setProperty('--progress', range > 0 ? Math.min(1, Math.max(0, root.scrollTop / range)) : 0)
      const readingLine = root.getBoundingClientRect().top + root.clientHeight * .38
      const found = targets.findLast(target => target.getBoundingClientRect().top <= readingLine)
      const next = found?.id ?? chapters[0].id
      if (next !== activeChapter) {
        setActive(next)
        activeChapter = next
      }
    }
    function submit() {
      if (frame === undefined) frame = requestAnimationFrame(sync)
    }
    const visibleEndSections = new Set()
    const endObserver = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) visibleEndSections.add(target)
        else visibleEndSections.delete(target)
      }
      setRetired(visibleEndSections.size > 0)
    }, { root })
    const resize = new ResizeObserver(submit)
    endObserver.observe(epilog)
    endObserver.observe(footer)
    resize.observe(root)
    resize.observe(root.querySelector('main'))
    root.addEventListener('scroll', submit, { passive: true })
    sync()
    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener('scroll', submit)
      endObserver.disconnect()
      resize.disconnect()
    }
  }, [scrollRoot])

  return (
    <nav ref={dock} className="chapter-dock glass" data-retired={retired} inert={retired} aria-label={lang ? 'Chapters' : 'Navigasi bab'}>
      <span className="dock-progress" aria-hidden="true" />
      {chapters.map(({ id, label }) => (
        <a key={id} href={'#' + id} aria-current={id === active ? 'location' : undefined}>
          {id === 'contact' ? <ArrowUpRight size={13} aria-hidden="true" /> : <span className="dock-index">{chapterNumber(id)}</span>}
          <span>{label[lang]}</span>
        </a>
      ))}
    </nav>
  )
}

export function EditorialProlog({ lang, openCommand, openIdentity, project, evidence }) {
  const metrics = [
    { number: content.metrics[2].number, label: ['Penghuni Asrama Dipimpin', 'Dormitory Residents Led'] },
    { number: content.metrics[1].number, label: ['Mahasiswa & Praktikan Dibimbing', 'Students Mentored'] },
    { number: content.metrics[0].number, label: ['Anggota Tim Lintas Disiplin', 'Cross-Functional Team Members'] },
    { number: ['4+', '4+'], label: ['Sistem Produksi & Riset AI', 'Production & AI Research Systems'] },
  ]
  return (
    <section id="prolog" className="prolog" aria-labelledby="thesis" tabIndex="-1">
      <div className="prolog-heading">
        <p className="eyebrow hero-kicker"><span className="prolog-number">{chapterNumber('prolog')}</span><i className="live-dot" aria-hidden="true" /> {lang ? 'Applied AI & Full-Stack Engineer · Multimedia Systems' : 'Rekayasa AI Terapan & Full-Stack · Sistem Multimedia'}</p>
        <HeroHeadline lang={lang} />
        <p className="narrative thesis-copy">{lang
          ? 'I build AI with verifiable answers and web products that communities can run themselves.'
          : 'Saya merancang AI dengan jawaban yang bisa diperiksa dan produk web yang bisa dikelola komunitas sendiri.'}
        </p>
        <div className="hero-actions">
          <a className="key start-link" href="#hallo-batam" data-magnetic="">{lang ? 'Read the AI case study' : 'Mulai dari studi kasus AI'} <ArrowDownRight size={17} aria-hidden="true" /></a>
          <IdentityTrigger lang={lang} onClick={openIdentity} />
          <CommandTrigger className="hero-command" lang={lang} onClick={openCommand} />
        </div>
      </div>
      <Workbench {...{ lang, project, evidence }} />
      <HeroMetrics {...{ metrics, lang }} />
    </section>
  )
}

const projectSignals = {
  batam: [
    ['2', 'Mode: teks & suara', 'Modes: text & voice'],
    ['ID / EN', 'Bahasa', 'Languages'],
    ['X-Ray', 'Kutipan sumber', 'Source citations'],
  ],
  cireundeu: [
    ['13', 'Anggota tim', 'Team members'],
    ['Feb–Jul ’26', 'Periode proyek', 'Delivery window'],
    ['CMS', 'Mandiri untuk UMKM', 'Self-service for businesses'],
  ],
}

function ProjectSignals({ project, lang, open }) {
  return <div className="project-signals">
    <ul aria-label={lang ? 'Project at a glance' : 'Proyek sekilas'}>
      {projectSignals[project.id].map(([signal, id, en]) => <li key={signal}><strong>{signal}</strong><span>{lang ? en : id}</span></li>)}
    </ul>
    <button className="key technical-trigger" type="button" aria-haspopup="dialog" onClick={() => open('case', project)}>
      {lang ? 'Technical breakdown (3)' : 'Bedah Teknis (3)'} <ArrowUpRight size={16} aria-hidden="true" />
    </button>
  </div>
}

export function HalloBatamStage({ project, lang, open }) {
  const [demo, setDemo] = useState(() => location.hash === '#playground')
  useEffect(() => {
    function sync() {
      if (location.hash !== '#playground') return
      setDemo(true)
      requestAnimationFrame(() => document.getElementById('playground')?.scrollIntoView({ behavior: 'instant' }))
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  return (
    <section id="hallo-batam" className="chapter" aria-labelledby="batam-title" tabIndex="-1">
      <span className="anchor-alias" id="projects" tabIndex="-1" />
      <ChapterHeader chapter="hallo-batam" category="Applied AI & RAG Architecture" title={project.name[lang]} headingId="batam-title">
        <p className="narrative">{lang ? 'Explore Batam with an AI guide that shows its sources.' : 'Jelajahi Batam dengan pemandu AI yang menyertakan sumber.'}</p>
      </ChapterHeader>
      <ProjectSignals {...{ project, lang, open }} />
      <BrowserFrame project={project} actions={<ProjectLink project={project} lang={lang} />}>
        <div className="stage-choices" role="group" aria-label={lang ? 'Stage view' : 'Tampilan panggung'}>
          <button type="button" aria-pressed={!demo} onClick={() => setDemo(false)}>{lang ? 'Nongsa conversation' : 'Percakapan Nongsa'}</button>
          <button type="button" aria-pressed={demo} onClick={() => setDemo(true)}>{lang ? 'Interactive demo' : 'Demo interaktif'}</button>
        </div>
        <div className="batam-capture" hidden={demo}>
          <Screenshot project={project} lang={lang} open={open} eager />
        </div>
        <div hidden={!demo}>
          <Playground lang={lang} liveUrl={project.preview} />
        </div>
      </BrowserFrame>
    </section>
  )
}

export function CireundeuShowcase({ project, lang, open }) {
  return (
    <section id="cireundeu" tabIndex="-1" className="chapter" aria-labelledby="cireundeu-title">
      <ChapterHeader chapter="cireundeu" category="Community & Full-Stack Systems" title={project.name[lang]} headingId="cireundeu-title">
        <p className="narrative">{lang ? 'A visitor portal local businesses can update themselves.' : 'Portal wisata yang bisa dikelola sendiri oleh UMKM setempat.'}</p>
      </ChapterHeader>
      <ProjectSignals {...{ project, lang, open }} />
      <BrowserFrame project={project} actions={<ProjectLink project={project} lang={lang} />}>
        <Screenshot project={project} lang={lang} open={open} className="cireundeu-capture" />
      </BrowserFrame>
    </section>
  )
}

const roleLabels = [
  ['Strategi multimedia', 'Multimedia strategy'],
  ['Pemimpin proyek Cireundeu', 'Cireundeu project lead'],
  ['Koordinator praktikum', 'Practicum coordinator'],
  ['Pimpinan asrama', 'Residence leadership'],
  ['Advokasi mahasiswa', 'Student advocacy'],
  ['Ketua Dorm Olympic', 'Dorm Olympic lead'],
]

export function LeadershipTimeline({ lang, open }) {
  return (
    <section id="experience" tabIndex="-1" className="chapter" aria-labelledby="experience-title">
      <ChapterHeader chapter="experience" category="2024–2026" headingId="experience-title"
        title={lang ? 'Leadership' : 'Kepemimpinan'} />
      <ol className="timeline">
        {content.roles.map(({ role, org, date }, index) => <li key={role[0]} className="timeline-row glass" data-spotlight="">
          <button className="row-trigger" aria-haspopup="dialog" type="button" onClick={() => open('leadership', index)}>
            <span className="row-number">0{index + 1}</span>
            <strong>{roleLabels[index][lang]}</strong>
            <span className="role-org">{org[lang]}</span>
            <span className="date">{date[lang]}</span>
            <ArrowUpRight className="row-icon" size={17} aria-hidden="true" />
          </button>
        </li>)}
      </ol>
      <div id="stack" className="chapter-actions">
        <button className="key" type="button" aria-haspopup="dialog" onClick={() => open('stack')}>
          <Layers3 size={16} aria-hidden="true" />{lang ? 'Tools & education' : 'Teknologi & pendidikan'}
        </button>
      </div>
    </section>
  )
}
