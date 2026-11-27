import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Command, Copy, FileText, GitCommitHorizontal, Images, MapPin, Monitor, ZoomIn } from 'lucide-react'
import content from './content.json'
import { caseStudies } from './cases'
import Dialog from './Dialog'
import CommandPalette from './editorial/CommandPalette'
import CommandTrigger from './editorial/CommandTrigger'
import { CireundeuShowcase, EditorialProlog, FloatingChapterDock, HalloBatamStage, LeadershipTimeline } from './editorial/Chapters'
import { chapters, EMAIL, GITHUB, LINKEDIN, projectActions } from './editorial/content'
import { CaseDetails, External, ProjectLink, projectUrl } from './editorial/Shared'
import useSpotlights from './editorial/useSpotlights'
import { EditorialTicker } from './editorial/HeroMotion'
import EditorialContact from './editorial/EditorialContact'
import LabIndexTable from './editorial/LabIndexTable'
import Resume, { resumeLabel } from './editorial/Resume'
import { BATAM_RAG_NOTES, BATAM_UPGRADE } from './editorial/EngineeringNotes'
import './editorial/recruiter.css'

const [flagship] = content.projects
const community = content.projects.find(project => project.id === 'cireundeu')
const lab = content.projects.filter(project => project !== flagship && project !== community)
const batamEvidence = caseStudies.batam.find(item => item.evidence).evidence
const commitLink = BATAM_UPGRADE

function ProjectPreview({ project, lang }) {
  const [fullSize, setFullSize] = useState(false)
  const title = lang ? 'Screenshot display' : 'Tampilan tangkapan layar'
  return (
    <>
      <div className="preview-controls">
        <div className="actions" role="group" aria-label={title}>
          <button className="key" type="button" aria-pressed={!fullSize} onClick={() => setFullSize(false)}>
            <Monitor size={17} aria-hidden="true" /> {lang ? 'Fit to screen' : 'Pas layar'}
          </button>
          <button className="key" type="button" aria-pressed={fullSize} onClick={() => setFullSize(true)}>
            <ZoomIn size={17} aria-hidden="true" /> {lang ? 'Original size' : 'Ukuran asli'}
          </button>
        </div>
        <ProjectLink {...{ project, lang }} />
      </div>
      <div className={'zoom-image' + (fullSize ? ' original' : '')} tabIndex={fullSize ? 0 : undefined}
        role={fullSize ? 'region' : undefined} aria-label={fullSize ? title : undefined}>
        <img src={project.image} alt={project.alt[lang]} width={project.width} height={project.height} />
      </div>
      <p className="preview-caption">{lang ? 'Screenshot from the public project.' : 'Tangkapan layar proyek publik.'}
        {fullSize && (lang ? ' Scroll sideways if needed.' : ' Geser ke samping bila perlu.')}</p>
    </>
  )
}

function TopBar({ lang, setLang, openCommand }) {
  return (
    <header className="top-bar">
      <div className="wrap top-content">
        <a className="brand" href="#prolog" aria-label="M. Fahmi Rifaldi">
          <span className="monogram" aria-hidden="true">MF<span>.</span></span>
          <span className="brand-detail"><i className="live-dot" aria-hidden="true" /> M. Fahmi Rifaldi <span className="brand-location">— Bandung, ID</span></span>
        </a>
        <div className="nav-tools">
          <div className="language-switch" role="group" aria-label={lang ? 'Language' : 'Bahasa'}>
            <button type="button" aria-pressed={!lang} aria-label="Bahasa Indonesia" onClick={() => setLang(0)}>ID</button>
            <span aria-hidden="true">|</span>
            <button type="button" aria-pressed={!!lang} aria-label="English" onClick={() => setLang(1)}>EN</button>
          </div>
          <CommandTrigger className="command-key" lang={lang} onClick={openCommand} />
        </div>
      </div>
    </header>
  )
}

export default function App() {
  const [lang, setLang] = useState(() => new URLSearchParams(location.search).get('lang') === 'en' ? 1 : 0)
  const [overlay, setOverlay] = useState(null)
  const [toast, setToast] = useState(null)
  const timer = useRef(0)
  const copyAttempt = useRef(0)
  const scrollRoot = useRef(null)
  useSpotlights(scrollRoot)
  const closeLabel = lang ? 'Close' : 'Tutup'

  useLayoutEffect(() => {
    const id = location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang ? 'en' : 'id'
    const url = new URL(location.href)
    if (lang) url.searchParams.set('lang', 'en')
    else url.searchParams.delete('lang')
    if (url.href !== location.href) history.replaceState(history.state, '', url)
  }, [lang])

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.repeat) {
        event.preventDefault()
        setOverlay(current => current?.type === 'command' ? null : { type: 'command' })
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => {
      document.removeEventListener('keydown', handleShortcut)
      clearTimeout(timer.current)
    }
  }, [])

  function go(id) {
    requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (!target) return
      if (location.hash !== '#' + id) history.pushState(null, '', '#' + id)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
      // Let the lab accordion or hero trace activate before reading its layout.
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
        target.focus({ preventScroll: true })
      })
    })
  }

  async function copyText(value, kind) {
    const attempt = ++copyAttempt.current
    let success = false
    try {
      await navigator.clipboard.writeText(value)
      success = true
    } catch {
      const field = document.createElement('textarea')
      const trigger = document.activeElement
      field.value = value
      field.readOnly = true
      field.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.append(field)
      try { field.select(); success = document.execCommand('copy') }
      catch { /* The toast displays the address for manual copying. */ }
      finally { field.remove(); trigger?.focus({ preventScroll: true }) }
    }
    if (attempt !== copyAttempt.current) return
    setToast({ success, value, kind, key: attempt })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }

  const toastMessage = toast?.kind === 'draft'
    ? (toast.success ? (lang ? 'Message draft copied' : 'Draf pesan disalin') : (lang ? 'Could not copy the draft. Select the text to copy it.' : 'Draf gagal disalin. Pilih teks draf untuk menyalinnya.'))
    : (toast?.success ? (lang ? 'Email copied to clipboard' : 'Email disalin ke clipboard') : EMAIL)

  const open = (type, project) => setOverlay({ type, project })
  const close = () => setOverlay(null)
  const openCommand = () => open('command')
  const openResume = () => open('resume')
  const chapterNames = [
    ['Prolog', 'Prologue'], ['Hallo Batam AI', 'Hallo Batam AI'],
    ['Komunitas Cireundeu', 'Cireundeu Community'], ['Kepemimpinan', 'Leadership'],
    ['Laboratorium', 'Lab'], ['Epilog', 'Epilogue'],
  ]
  const chapterCommands = chapters.map(({ id, label }, index) => ({
    id, name: '0' + (index + 1) + ' · ' + chapterNames[index][lang],
    keywords: label.join(' '), Icon: ArrowRight, run: () => go(id),
  }))
  const engineering = [
    { id: 'xray', name: 'Hallo Batam AI · X-Ray Grounding', keywords: 'citation kutipan evidence', Icon: ArrowRight, run: () => go('batam-xray') },
    { id: 'multimodal', name: 'AI Video Clipper · Multimodal Inspector', keywords: 'clipforge vad ema', Icon: ArrowRight, run: () => go('lab-clipper') },
    { id: 'trace', name: lang ? 'Open Hero RAG Trace' : 'Buka RAG Trace di Hero', keywords: 'hybrid cache rrf', Icon: ArrowRight, run: () => go('rag-trace') },
    { id: 'playground', name: lang ? 'Batam Playground' : 'Demo interaktif Batam', keywords: 'playground batam', Icon: ArrowRight, run: () => go('playground') },
    { id: 'stack', name: lang ? 'Tools & education' : 'Teknologi & pendidikan', keywords: 'stack telkom', Icon: ArrowRight, run: () => go('stack') },
    ...content.projects.map(project => ({ id: 'case-' + project.id, name: project.name[lang] + (lang ? ' · case study' : ' · studi kasus'), keywords: project.name.join(' ') + ' ' + project.stack.join(' '), Icon: Images, run: () => open('case', project) })),
  ]
  const demos = [
    ...content.projects.map(project => ({
      id: 'live-' + project.id, name: projectActions[project.id][lang] + ' · ' + project.name[lang], keywords: 'live demo aplikasi code kode portal', Icon: ArrowUpRight,
      run: () => {
        const href = projectUrl(project, lang)
        if (href.startsWith('/')) location.assign(href)
        else window.open(href, '_blank', 'noopener,noreferrer')
      },
    })),
    { id: 'commit', name: lang ? 'Open Hallo Batam AI commit' : 'Lihat commit Hallo Batam AI', keywords: 'github commit contribution', Icon: GitCommitHorizontal, run: () => window.open(commitLink, '_blank', 'noopener,noreferrer') },
  ]
  const recruiter = [
    { id: 'resume', name: resumeLabel[lang], keywords: 'resume curriculum vitae ats print cetak pdf cv', Icon: FileText, run: openResume },
    { id: 'copy', name: (lang ? 'Copy email · ' : 'Salin email · ') + EMAIL, Icon: Copy, run: () => copyText(EMAIL, 'email') },
    { id: 'github', name: lang ? 'Open GitHub ↗' : 'Buka GitHub ↗', Icon: ArrowUpRight, run: () => window.open(GITHUB, '_blank', 'noopener,noreferrer') },
    { id: 'linkedin', name: lang ? 'Open LinkedIn ↗' : 'Buka LinkedIn ↗', Icon: ArrowUpRight, run: () => window.open(LINKEDIN, '_blank', 'noopener,noreferrer') },
    { id: 'language', name: lang ? 'Gunakan Bahasa Indonesia' : 'Switch to English', Icon: Command, run: () => setLang(1 - lang) },
  ]

  const groups = [
    { id: 'chapters', label: lang ? 'Chapters' : 'Navigasi Bab', commands: chapterCommands },
    { id: 'engineering', label: lang ? 'Engineering Views' : 'Inspeksi Teknis', commands: engineering },
    { id: 'recruiter', label: lang ? 'Recruiter Actions' : 'Aksi Rekruter', commands: recruiter },
    { id: 'demos', label: lang ? 'Demos & source' : 'Demo & kode sumber', commands: demos },
  ]

  return (
    <>
      <a className="skip key" href="#main">{lang ? 'Skip to content' : 'Langsung ke konten'}</a>
      <div className="portfolio-shell">
        <div className="portfolio-scroll" ref={scrollRoot}>
          <TopBar {...{ lang, setLang, openCommand }} />
          <main className="wrap" id="main" tabIndex="-1">
            <EditorialProlog {...{ lang, openCommand }} project={flagship} evidence={batamEvidence} />
            <EditorialTicker lang={lang} />
            <HalloBatamStage project={flagship} {...{ lang, open }} />
            <CireundeuShowcase project={community} {...{ lang, open }} />
            <LeadershipTimeline lang={lang} />
            <LabIndexTable projects={lab} {...{ lang, open }} />
            <EditorialContact {...{ lang, copyText, openCommand, openResume }} copied={toast?.success ? toast : null} />
          </main>
          <footer className="wrap site-footer"><span>M. Fahmi Rifaldi</span><span><MapPin size={15} aria-hidden="true" /> Bandung, Indonesia</span></footer>
        </div>
        <div className="dock-lane"><FloatingChapterDock {...{ lang, scrollRoot }} /></div>
      </div>

      <AnimatePresence>
        {toast && <m.div className="toast" role="status" key={toast.key}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
          {toast.success && <Check size={18} aria-hidden="true" />}{toastMessage}
        </m.div>}
      </AnimatePresence>
      {overlay?.type === 'command' && <Dialog key="command" className="command-dialog" title={lang ? 'Command palette' : 'Palet perintah'} {...{ closeLabel, close }}>
        <CommandPalette {...{ lang, groups, close }} />
      </Dialog>}
      {overlay?.type === 'resume' && <Dialog key="resume" className="resume-dialog" title={lang ? 'Executive resume' : 'CV eksekutif'} {...{ closeLabel, close }}>
        <Resume lang={lang} />
      </Dialog>}
      {overlay?.type === 'preview' && <Dialog key="preview" className="preview-dialog" title={overlay.project.name[lang]} {...{ closeLabel, close }}>
        <ProjectPreview project={overlay.project} lang={lang} />
      </Dialog>}
      {overlay?.type === 'case' && <Dialog key="case" title={overlay.project.name[lang]} {...{ closeLabel, close }}>
        <CaseDetails project={overlay.project} lang={lang} />
        {overlay.project.id === 'batam' && <p className="architecture-note">Vercel → Supabase Edge Function → PostgreSQL + OpenAI</p>}
        <div className="actions">
          <ProjectLink project={overlay.project} lang={lang} className="key primary" />
          {overlay.project.id === 'clipper' && <External href={GITHUB + '/fahmi-portfolio/tree/main/src/clipper'}>{lang ? 'Web source on GitHub' : 'Kode web di GitHub'} <ArrowUpRight size={16} aria-hidden="true" /></External>}
          {overlay.project.id === 'batam' && <External href={BATAM_RAG_NOTES}>{lang ? 'Architecture document' : 'Dokumen arsitektur'} <ArrowUpRight size={16} aria-hidden="true" /></External>}
          {overlay.project.id === 'quran' && <External href={overlay.project.link}>{lang ? 'Concept documentation' : 'Dokumentasi konsep'} <ArrowUpRight size={16} aria-hidden="true" /></External>}
        </div>
      </Dialog>}
    </>
  )
}
