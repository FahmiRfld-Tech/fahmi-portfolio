import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Command, Copy, GitCommitHorizontal, Images, MapPin, Monitor, ZoomIn } from 'lucide-react'
import content from './content.json'
import { caseStudies } from './cases'
import Dialog from './Dialog'
import CommandPalette from './editorial/CommandPalette'
import { CireundeuShowcase, EditorialContact, EditorialProlog, FloatingChapterDock, HalloBatamStage, LabIndexTable, LeadershipTimeline } from './editorial/Chapters'
import { chapters, EMAIL, GITHUB, projectActions } from './editorial/content'
import { CaseDetails, External, ProjectLink, projectUrl } from './editorial/Shared'
import useSpotlights from './editorial/useSpotlights'

const [flagship] = content.projects
const community = content.projects.find(project => project.id === 'cireundeu')
const lab = content.projects.filter(project => project !== flagship && project !== community)
const batamEvidence = caseStudies.batam.find(item => item.evidence).evidence
const commitLink = batamEvidence.href

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
          <button className="key command-key" type="button" onClick={openCommand}
            aria-label={lang ? 'Open command palette' : 'Buka palet perintah'} aria-keyshortcuts="Control+K Meta+K">
            <Command size={15} aria-hidden="true" /><span>K</span>
          </button>
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
  const scrollRoot = useRef(null)
  useSpotlights(scrollRoot)
  const closeLabel = lang ? 'Close' : 'Tutup'

  useLayoutEffect(() => {
    const id = location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang ? 'en' : 'id'
    document.title = 'M Fahmi Rifaldi — ' + (lang ? 'The Editorial Engine' : 'The Editorial Engine · Portofolio')
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
    if (location.hash !== '#' + id) location.hash = id
    else if (id === 'playground') window.dispatchEvent(new HashChangeEvent('hashchange'))
    const target = document.getElementById(id)
    target?.scrollIntoView()
    target?.focus({ preventScroll: true })
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
      catch { /* The toast displays the address for manual copying. */ }
      finally { field.remove(); trigger?.focus({ preventScroll: true }) }
    }
    setToast({ success, key: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }

  const open = (type, project) => setOverlay({ type, project })
  const close = () => setOverlay(null)
  const openCommand = () => open('command')
  const commands = [
    ...chapters.map(({ id, label }, index) => ({ id, name: (index === 5 ? '' : '0' + (index + 1) + ' · ') + label[lang], keywords: label.join(' '), Icon: ArrowRight, run: () => go(id) })),
    { id: 'playground', name: lang ? 'Batam Playground' : 'Demo interaktif Batam', keywords: 'playground batam', Icon: ArrowRight, run: () => go('playground') },
    { id: 'stack', name: lang ? 'Tools & education' : 'Teknologi & pendidikan', keywords: 'stack telkom', Icon: ArrowRight, run: () => go('stack') },
    ...content.projects.map(project => ({ id: 'case-' + project.id, name: project.name[lang] + (lang ? ' · case study' : ' · studi kasus'), keywords: project.name.join(' ') + ' ' + project.stack.join(' '), Icon: Images, run: () => open('case', project) })),
    ...content.projects.map(project => ({
      id: 'live-' + project.id, name: projectActions[project.id][lang] + ' · ' + project.name[lang], keywords: 'live demo aplikasi code kode portal', Icon: ArrowUpRight,
      run: () => {
        const href = projectUrl(project, lang)
        if (href.startsWith('/')) location.assign(href)
        else window.open(href, '_blank', 'noopener,noreferrer')
      },
    })),
    { id: 'commit', name: lang ? 'Open Hallo Batam AI commit' : 'Lihat commit Hallo Batam AI', keywords: 'github commit contribution', Icon: GitCommitHorizontal, run: () => window.open(commitLink, '_blank', 'noopener,noreferrer') },
    { id: 'copy', name: lang ? 'Copy email' : 'Salin email', Icon: Copy, run: copyEmail },
    { id: 'language', name: lang ? 'Gunakan Bahasa Indonesia' : 'Switch to English', Icon: Command, run: () => setLang(1 - lang) },
  ]

  return (
    <>
      <a className="skip key" href="#main">{lang ? 'Skip to content' : 'Langsung ke konten'}</a>
      <div className="portfolio-shell">
        <div className="portfolio-scroll" ref={scrollRoot}>
          <TopBar {...{ lang, setLang, openCommand }} />
          <main className="wrap" id="main" tabIndex="-1">
            <EditorialProlog {...{ lang, openCommand }} project={flagship} evidence={batamEvidence} />
            <HalloBatamStage project={flagship} {...{ lang, open }} />
            <CireundeuShowcase project={community} {...{ lang, open }} />
            <LeadershipTimeline lang={lang} />
            <LabIndexTable projects={lab} {...{ lang, open }} />
            <EditorialContact {...{ lang, copyEmail, openCommand }} />
          </main>
          <footer className="wrap site-footer"><span>M. Fahmi Rifaldi</span><span><MapPin size={15} aria-hidden="true" /> Bandung, Indonesia</span></footer>
        </div>
        <div className="dock-lane"><FloatingChapterDock {...{ lang, scrollRoot }} /></div>
      </div>

      <AnimatePresence>
        {toast && <m.div className="toast" role="status" key={toast.key}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}>
          {toast.success && <Check size={18} aria-hidden="true" />}{toast.success ? (lang ? 'Email copied to clipboard' : 'Email disalin ke clipboard') : EMAIL}
        </m.div>}
      </AnimatePresence>
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
          <ProjectLink project={overlay.project} lang={lang} className="key primary" />
          {overlay.project.id === 'clipper' && <External href={GITHUB + '/fahmi-portfolio/tree/main/src/clipper'}>{lang ? 'Web source on GitHub' : 'Kode web di GitHub'} <ArrowUpRight size={16} aria-hidden="true" /></External>}
          {overlay.project.id === 'batam' && <External href={flagship.link + '/blob/main/docs/ARCHITECTURE.md'}>{lang ? 'Architecture document' : 'Dokumen arsitektur'} <ArrowUpRight size={16} aria-hidden="true" /></External>}
          {overlay.project.id === 'quran' && <External href={overlay.project.link}>{lang ? 'Concept documentation' : 'Dokumentasi konsep'} <ArrowUpRight size={16} aria-hidden="true" /></External>}
        </div>
      </Dialog>}
    </>
  )
}
