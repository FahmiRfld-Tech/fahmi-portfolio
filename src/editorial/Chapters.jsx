import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Copy, ExternalLink, Minus, Plus } from 'lucide-react'
import Playground from '../Playground'
import content from '../content.json'
import StackMatrix from './StackMatrix'
import Workbench from './Workbench'
import { chapters, EMAIL, GITHUB, insights, labMeta, LINKEDIN } from './content'
import { BrowserFrame, CaseDetails, ChapterHeader, External, ProjectLink, RevealRow, Screenshot, Tags } from './Shared'

export function FloatingChapterDock({ lang, scrollRoot }) {
  const [active, setActive] = useState('prolog')
  const [retired, setRetired] = useState(false)

  useEffect(() => {
    const root = scrollRoot.current
    const targets = chapters.map(({ id }) => document.getElementById(id))
    const footer = root.querySelector('.site-footer')
    let observer
    function sync() {
      const readingLine = root.getBoundingClientRect().top + root.clientHeight * .38
      const found = targets.filter(target => target.getBoundingClientRect().top <= readingLine).at(-1)
      setActive(found?.id ?? chapters[0].id)
    }
    function observe() {
      observer?.disconnect()
      const bottom = Math.round(root.clientHeight * .62)
      observer = new IntersectionObserver(sync, { root, rootMargin: '0px 0px -' + bottom + 'px 0px' })
      targets.forEach(target => observer.observe(target))
      sync()
    }
    const footerObserver = new IntersectionObserver(([entry]) => {
      setRetired(entry.intersectionRatio >= .85)
    }, { root, threshold: .85 })
    const resize = new ResizeObserver(observe)
    footerObserver.observe(footer)
    resize.observe(root)
    return () => {
      observer?.disconnect()
      footerObserver.disconnect()
      resize.disconnect()
    }
  }, [scrollRoot])

  const current = chapters.findIndex(({ id }) => id === active)
  return (
    <nav className="chapter-dock" data-retired={retired} inert={retired} aria-label={lang ? 'Chapters' : 'Navigasi bab'}>
      <span className="dock-progress" aria-hidden="true" style={{ '--progress': (current + 1) / chapters.length }} />
      {chapters.map(({ id, label }, index) => (
        <a key={id} href={'#' + id} aria-current={id === active ? 'location' : undefined}>
          {id === 'contact' ? <ArrowUpRight size={13} aria-hidden="true" /> : <span className="dock-index">0{index + 1}</span>}
          <span>{label[lang]}</span>
        </a>
      ))}
    </nav>
  )
}

export function EditorialProlog({ lang, openCommand }) {
  const metrics = [
    { number: content.metrics[2].number, label: ['Penghuni Asrama Dipimpin', 'Dormitory Residents Led'] },
    { number: content.metrics[1].number, label: ['Mahasiswa & Praktikan Dibimbing', 'Students Mentored'] },
    { number: content.metrics[0].number, label: ['Anggota Tim Lintas Disiplin', 'Cross-Functional Team Members'] },
    { number: ['4+', '4+'], label: ['Sistem Produksi & Riset AI', 'Production & AI Research Systems'] },
  ]
  return (
    <section id="prolog" className="prolog" aria-labelledby="thesis" tabIndex="-1">
      <div className="prolog-heading">
        <p className="eyebrow hero-kicker">Multimedia Engineering &amp; Applied AI</p>
        <h1 id="thesis">{lang
          ? <>Building <em>verified</em> AI systems and <em>grounded</em> technology for people.</>
          : <>Membangun sistem AI yang <em>terverifikasi</em> dan teknologi yang <em>membumi</em> bagi manusia.</>}
        </h1>
        <p className="narrative thesis-copy">{lang
          ? 'Leading a residence community of more than 3,000 people taught me how decisions play out on the ground. I bring that habit to software, from a travel assistant with checkable sources to a portal local businesses can update themselves.'
          : 'Memimpin komunitas asrama dengan lebih dari 3.000 penghuni mengajarkan saya melihat bagaimana keputusan bekerja di lapangan. Kebiasaan itu saya bawa ke rekayasa perangkat lunak, mulai dari asisten wisata dengan sumber yang bisa diperiksa hingga portal yang bisa diperbarui pengelola UMKM.'}
        </p>
        <a className="text-link start-link" href="#hallo-batam">{lang ? 'Read the first case study' : 'Mulai dari studi kasus AI'} <ArrowDownRight size={17} aria-hidden="true" /></a>
      </div>
      <Workbench {...{ lang, openCommand }} />
      <dl className="metrics" aria-label={lang ? 'Impact in numbers' : 'Dampak dalam angka'}>
        {metrics.map(({ number, label }) => <div key={number[0]}><dt>{label[lang]}</dt><dd>{number[lang]}</dd></div>)}
      </dl>
    </section>
  )
}

function RagArchitectureDrawer({ project, lang }) {
  const [open, setOpen] = useState(false)
  const production = lang
    ? ['User query', 'Supabase Edge Function', 'PostgreSQL source selection', 'Verified source check', 'Grounded OpenAI response']
    : ['Pertanyaan pengguna', 'Supabase Edge Function', 'Seleksi sumber PostgreSQL', 'Cek sumber terverifikasi', 'Jawaban OpenAI berbasis sumber']
  const vector = lang
    ? ['User query', 'Embedding', 'PostgreSQL pgvector similarity search', 'Verified source check', 'Grounded LLM response']
    : ['Pertanyaan pengguna', 'Embedding', 'Pencarian kemiripan PostgreSQL pgvector', 'Cek sumber terverifikasi', 'Jawaban LLM berbasis sumber']
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
              ? 'The database audit found pgvector installed and no populated embeddings. The vector route describes a design option. The production route above follows the audited public architecture.'
              : 'Audit basis data menemukan pgvector sudah terpasang dan kolom embedding belum terisi. Alur vektor menggambarkan opsi rancangan. Alur produksi di atas mengikuti arsitektur publik yang diaudit.'}</p>
            <div className="actions">
              <External href={project.link + '/blob/main/docs/ARCHITECTURE.md'}>{lang ? 'Architecture document' : 'Dokumen arsitektur'} <ArrowUpRight size={15} aria-hidden="true" /></External>
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
      <ChapterHeader number="01" category="Applied AI & RAG Architecture" title={project.name[lang]} headingId="batam-title">
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
      <RagArchitectureDrawer project={project} lang={lang} />
    </section>
  )
}

export function CireundeuShowcase({ project, lang, open }) {
  return (
    <section id="cireundeu" tabIndex="-1" className="chapter" aria-labelledby="cireundeu-title">
      <ChapterHeader number="02" category="Community & Full-Stack Systems" title={project.name[lang]} headingId="cireundeu-title" />
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
    </section>
  )
}

export function LeadershipTimeline({ lang }) {
  return (
    <section id="experience" tabIndex="-1" className="chapter" aria-labelledby="experience-title">
      <ChapterHeader number="03" category="Leadership & Human Scale · 2024–2026" headingId="experience-title"
        title={lang ? 'Leadership that shaped how I work' : 'Kepemimpinan yang Membentuk Cara Kerja'} />
      <ol className="timeline">
        {content.roles.map(({ role, org, date }, index) => <RevealRow key={role[0]} id={'role-' + index} className="timeline-row"
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

export function LabIndexTable({ projects, lang, open }) {
  return (
    <section id="lab" tabIndex="-1" className="chapter" aria-labelledby="lab-title">
      <ChapterHeader number="04" category="Laboratory & Explorations" title={lang ? 'Lab & explorations' : 'Laboratorium & Eksplorasi'} headingId="lab-title" />
      <ol className="lab-index">
        {projects.map((project, index) => <RevealRow key={project.id} id={'lab-' + project.id} className="lab-row"
          summary={<><span className="row-number">0{index + 1}</span><span className="lab-title">{project.name[lang]}</span><span className="lab-meta">{labMeta[project.id][lang]}</span><span className="date lab-year">{project.category[lang].split(' / ')[0]}</span></>}>
          <div className="lab-preview">
            <Screenshot project={project} lang={lang} open={open} />
            <div>
              <p className="narrative">{project.summary[lang]}</p>
              <p className="lab-role">{project.role[lang]}</p>
              <Tags items={project.stack} />
              <div className="actions">
                <ProjectLink project={project} lang={lang} />
                <button className="text-link" type="button" onClick={() => open('case', project)}>{lang ? 'Technical details' : 'Detail teknis'} <ArrowRight size={16} aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </RevealRow>)}
      </ol>
    </section>
  )
}

export function EditorialContact({ lang, copyEmail, openCommand }) {
  return (
    <section id="contact" tabIndex="-1" className="chapter epilog" aria-labelledby="contact-title">
      <p className="eyebrow chapter-label">{lang ? 'Epilogue' : 'Epilog'}</p>
      <h2 id="contact-title">{lang ? 'Let’s build something people can use.' : 'Mari bangun sesuatu yang berguna.'}</h2>
      <p className="narrative">{lang
        ? 'I’m open to working together on applied AI, full-stack engineering, and multimedia systems.'
        : 'Saya terbuka untuk berkolaborasi dalam AI terapan, rekayasa full-stack, dan sistem multimedia.'}</p>
      <p className="eyebrow contact-status"><i className="live-dot" aria-hidden="true" /> {content.copy.availability[lang]}</p>
      <div className="actions contact-actions">
        <button className="key primary" type="button" onClick={copyEmail}><Copy size={16} aria-hidden="true" /> {lang ? 'Copy email' : 'Salin email'}</button>
        <External href={GITHUB}>GitHub <ExternalLink size={15} aria-hidden="true" /></External>
        <External href={LINKEDIN}>LinkedIn <ExternalLink size={15} aria-hidden="true" /></External>
        <button className="text-link contact-command" onClick={openCommand} type="button" aria-label={lang ? 'Open command palette' : 'Buka palet perintah'}><kbd>⌘ K</kbd></button>
      </div>
      <a className="email-address" href={'mailto:' + EMAIL}>{EMAIL}</a>
    </section>
  )
}
