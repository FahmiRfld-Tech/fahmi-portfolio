import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus, Plus } from 'lucide-react'
import Playground from '../Playground'
import { HeroHeadline, HeroMetrics } from './HeroMotion'
import content from '../content.json'
import StackMatrix from './StackMatrix'
import Workbench from './Workbench'
import { chapterNumber, chapters, insights } from './content'
import { BrowserFrame, CaseDetails, ChapterHeader, External, ProjectLink, RevealRow, Screenshot, Tags } from './Shared'
import { BATAM_RAG_NOTES, CireundeuDecisions, GroundingPreview, RetrievalComparison } from './EngineeringNotes'

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

export function EditorialProlog({ lang, openCommand, project, evidence }) {
  const metrics = [
    { number: content.metrics[2].number, label: ['Penghuni Asrama Dipimpin', 'Dormitory Residents Led'] },
    { number: content.metrics[1].number, label: ['Mahasiswa & Praktikan Dibimbing', 'Students Mentored'] },
    { number: content.metrics[0].number, label: ['Anggota Tim Lintas Disiplin', 'Cross-Functional Team Members'] },
    { number: ['4+', '4+'], label: ['Sistem Produksi & Riset AI', 'Production & AI Research Systems'] },
  ]
  return (
    <section id="prolog" className="prolog" aria-labelledby="thesis" tabIndex="-1">
      <div className="prolog-heading">
        <p className="eyebrow hero-kicker"><span className="prolog-number">{chapterNumber('prolog')}</span><i className="live-dot" aria-hidden="true" /> Multimedia Engineering &amp; Applied AI</p>
        <HeroHeadline lang={lang} />
        <p className="narrative thesis-copy">{lang
          ? 'Leading a residence community of more than 3,000 people taught me how decisions play out on the ground. I bring that habit to software, from a travel assistant with checkable sources to a portal local businesses can update themselves.'
          : 'Memimpin komunitas asrama dengan lebih dari 3.000 penghuni mengajarkan saya melihat bagaimana keputusan bekerja di lapangan. Kebiasaan itu saya bawa ke rekayasa perangkat lunak, mulai dari asisten wisata dengan sumber yang bisa diperiksa hingga portal yang bisa diperbarui pengelola UMKM.'}
        </p>
        <div className="hero-actions">
          <a className="key start-link" href="#hallo-batam" data-magnetic="">{lang ? 'Read the AI case study' : 'Mulai dari studi kasus AI'} <ArrowDownRight size={17} aria-hidden="true" /></a>
          <button className="key hero-command" type="button" onClick={openCommand} aria-label={lang ? 'Open command palette' : 'Buka palet perintah'}>⌘ K</button>
        </div>
      </div>
      <Workbench {...{ lang, project, evidence }} />
      <HeroMetrics {...{ metrics, lang }} />
    </section>
  )
}

function RagArchitectureDrawer({ project, lang }) {
  const [open, setOpen] = useState(false)
  const production = lang
    ? ['Area/category filters', 'Exact-query cache', 'tsvector ranking', 'Entity reranking', 'Grounded JSON + Evidence Gap']
    : ['Filter kawasan/kategori', 'Cache kueri identik', 'Peringkat tsvector', 'Reranking entitas', 'JSON grounded + Evidence Gap']
  const vector = lang
    ? ['Compatible embedding', 'Semantic cache ≥0.94', 'Area/category filters', 'Lexical + pgvector RRF', 'Grounded JSON']
    : ['Embedding kompatibel', 'Cache semantik ≥0,94', 'Filter kawasan/kategori', 'Lexical + RRF pgvector', 'JSON grounded']
  return (
    <div className="architecture">
      <button className="architecture-trigger" type="button" aria-expanded={open} aria-controls="rag-drawer" onClick={() => setOpen(!open)}>
        <span>{lang ? 'Inspect the RAG and retrieval architecture' : 'Bedah Alur RAG & Arsitektur Retrieval'}</span>
        {open ? <Minus size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
      </button>
      <div id="rag-drawer" className="reveal-panel" data-open={open} inert={!open}>
        <div className="reveal-inner">
          <div className="architecture-content">
            <p className="eyebrow">{lang ? 'Documented production path' : 'Alur produksi yang terdokumentasi'}</p>
            <ol className="architecture-flow">{production.map(step => <li key={step}>{step}</li>)}</ol>
            <p className="eyebrow">{lang ? 'Vector retrieval design' : 'Rancangan pencarian vektor'}</p>
            <ol className="architecture-flow vector">{vector.map(step => <li key={step}>{step}</li>)}</ol>
            <p className="narrative">{lang
              ? 'The migration adds RRF and model-matched vector cache logic. The current corpus has zero populated embeddings, so real requests use the production path above.'
              : 'Migrasi menambahkan logika RRF dan cache vektor dari model yang sama. Korpus saat ini masih memiliki nol embedding terisi, sehingga permintaan riil memakai jalur produksi di atas.'}</p>
            <div className="actions">
              <External href={BATAM_RAG_NOTES}>{lang ? 'Architecture document' : 'Dokumen arsitektur'} <ArrowUpRight size={15} aria-hidden="true" /></External>
              <External href={project.link + '/blob/main/docs/DATABASE.md'}>{lang ? 'Database audit' : 'Audit basis data'} <ArrowUpRight size={15} aria-hidden="true" /></External>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
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
        <p className="narrative">{lang
          ? 'Batam’s tourism information is scattered, so an AI answer can sound confident even when reliable data is scarce. Hallo Batam AI cites official sources and says when the evidence cannot establish a detail, such as how crowded Nongsa Beach is.'
          : 'Informasi wisata Batam tersebar di banyak situs. Jawaban AI bisa terdengar yakin padahal datanya terbatas. Hallo Batam AI menautkan rujukan resmi dan menjelaskan ketika data belum cukup, misalnya untuk memastikan keramaian di Pantai Nongsa.'}</p>
      </ChapterHeader>
      <BrowserFrame project={project} actions={<ProjectLink project={project} lang={lang} />}>
        <div className="stage-choices" role="group" aria-label={lang ? 'Stage view' : 'Tampilan panggung'}>
          <button type="button" aria-pressed={!demo} onClick={() => setDemo(false)}>{lang ? 'Nongsa conversation' : 'Percakapan Nongsa'}</button>
          <button type="button" aria-pressed={demo} onClick={() => setDemo(true)}>{lang ? 'Interactive demo' : 'Demo interaktif'}</button>
        </div>
        <div className="batam-capture" hidden={demo}>
          <Screenshot project={project} lang={lang} open={open} eager />
          <p className="stage-caption">{lang ? 'Actual conversation from Hallo Batam AI' : 'Tangkapan percakapan asli dari Hallo Batam AI'} · {project.summary[lang]}</p>
        </div>
        <div hidden={!demo}>
          <Playground lang={lang} liveUrl={project.preview} />
        </div>
      </BrowserFrame>
      <CaseDetails project={project} lang={lang} className="swiss-spec" technicalStack={[...project.stack, 'RAG']} />
      <RetrievalComparison lang={lang} />
      <GroundingPreview lang={lang} />
      <RagArchitectureDrawer project={project} lang={lang} />
    </section>
  )
}

export function CireundeuShowcase({ project, lang, open }) {
  return (
    <section id="cireundeu" tabIndex="-1" className="chapter" aria-labelledby="cireundeu-title">
      <ChapterHeader chapter="cireundeu" category="Community & Full-Stack Systems" title={project.name[lang]} headingId="cireundeu-title" />
      <div className="cireundeu-story">
        <p className="eyebrow project-role">{project.role[lang]}</p>
        <p className="narrative">{lang
          ? 'I led a 13-person cross-functional team as Project Manager and Full-Stack Developer. The public portal introduces visitors to Kampung Adat Cireundeu, while its CMS is designed so local business administrators can update their own content and assets.'
          : 'Saya memimpin 13 orang lintas disiplin sebagai Project Manager dan Full-Stack Developer. Portal memperkenalkan Kampung Adat Cireundeu kepada pengunjung, sementara CMS dirancang agar pengelola UMKM bisa memperbarui konten dan aset secara mandiri.'}</p>
      </div>
      <BrowserFrame project={project} actions={<ProjectLink project={project} lang={lang} />}>
        <Screenshot project={project} lang={lang} open={open} className="cireundeu-capture" />
      </BrowserFrame>
      <div className="chapter-actions">
        <Tags items={project.stack} />
        <button className="text-link" type="button" onClick={() => open('case', project)}>{lang ? 'Read the technical case study' : 'Baca studi kasus teknis'} <ArrowRight size={16} aria-hidden="true" /></button>
      </div>
      <CireundeuDecisions lang={lang} />
    </section>
  )
}

export function LeadershipTimeline({ lang }) {
  return (
    <section id="experience" tabIndex="-1" className="chapter" aria-labelledby="experience-title">
      <ChapterHeader chapter="experience" category="Leadership & Human Scale · 2024–2026" headingId="experience-title"
        title={lang ? 'Leadership that shaped how I work' : 'Kepemimpinan yang Membentuk Cara Kerja'} />
      <ol className="timeline">
        {content.roles.map(({ role, org, date }, index) => <RevealRow key={role[0]} id={'role-' + index} className="timeline-row" defaultOpen={index < 2}
          summary={<><span className="row-number">0{index + 1}</span><span className="row-identity"><strong>{role[lang]}</strong><span>{org[lang]}</span></span><span className="date">{date[lang]}</span></>}>
          <p className="narrative timeline-insight">{insights[index][lang]}</p>
        </RevealRow>)}
      </ol>
      <div id="stack" tabIndex="-1" className="profile-details">
        <h3>{lang ? 'Tools, education & achievements' : 'Teknologi, pendidikan & pencapaian'}</h3>
        <div className="info-grid">
          <StackMatrix lang={lang} />
          <div>{content.info.map(item => <article key={item.title[0]} className="education-item">
            <h4>{item.title[lang]}</h4>{item.copy && <p>{item.copy[lang]}</p>}
            {!!item.tags.length && <Tags items={item.tags} />}
          </article>)}</div>
        </div>
      </div>
    </section>
  )
}
