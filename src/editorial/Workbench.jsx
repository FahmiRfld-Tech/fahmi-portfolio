import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Check, Clock3, Command, Database, Search, ShieldCheck, Signal } from 'lucide-react'
import content from '../content.json'

const lenses = [
  { label: ['AI RAG', 'AI RAG'], target: 'hallo-batam' },
  { label: ['Komunitas', 'Community'], target: 'cireundeu' },
  { label: ['Kepemimpinan', 'Leadership'], target: 'experience' },
]

function BandungTime({ lang }) {
  const format = new Intl.DateTimeFormat(lang ? 'en-GB' : 'id-ID', {
    timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  })
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let timer
    function tick() {
      const time = new Date()
      setNow(time)
      timer = window.setTimeout(tick, 60000 - time.getTime() % 60000)
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [])
  const parts = format.formatToParts(now)
  const value = parts.filter(part => part.type === 'hour' || part.type === 'minute').map(part => part.value).join(':')
  return <span className="workbench-time"><Clock3 size={13} aria-hidden="true" /> <time dateTime={now.toISOString()}>{value} WIB</time><span>UTC+7</span></span>
}

function RagLens({ lang }) {
  return (
    <>
      <p className="workbench-label">{lang ? 'Hallo Batam AI · Example trace' : 'Hallo Batam AI · Contoh alur'}</p>
      <div className="trace">
        <div className="trace-row"><Search size={17} aria-hidden="true" /><div><span>{lang ? 'Query' : 'Pertanyaan'}</span><strong>{lang ? 'Quiet beaches in Nongsa?' : 'Pantai tenang di Nongsa?'}</strong></div></div>
        <div className="trace-row"><Database size={17} aria-hidden="true" /><div><span>pgvector similarity · {lang ? 'simulated' : 'simulasi'}</span><strong className="trace-score">{lang ? '0.89' : '0,89'}</strong></div></div>
        <div className="trace-row"><ShieldCheck size={17} aria-hidden="true" /><div><span>{lang ? 'Source check' : 'Pemeriksaan sumber'}</span><strong className="trace-verified">{lang ? 'BP Batam · Verified' : 'BP Batam · Terverifikasi'}</strong></div></div>
      </div>
      <p className="workbench-note"><span className="workbench-guardrail"><ShieldCheck size={13} aria-hidden="true" /> {lang ? 'Crowd data: unverified → disclosed' : 'Data keramaian: belum terverifikasi → diungkapkan'}</span></p>
    </>
  )
}

function CommunityLens({ lang }) {
  const portal = content.projects.find(project => project.id === 'cireundeu')
  return (
    <>
      <p className="workbench-label">Digitalisasi Cireundeu</p>
      <div className="trace">
        <div className="trace-row"><Signal size={17} aria-hidden="true" /><div><span>{lang ? 'Public portal' : 'Portal publik'}</span><a href={portal.preview} target="_blank" rel="noopener noreferrer">kampungcireundeu.kii.lat <ArrowUpRight size={13} aria-hidden="true" /></a></div></div>
        <div className="trace-row"><span className="trace-metric">13</span><div><strong>{lang ? 'Cross-functional team members' : 'Anggota tim lintas disiplin'}</strong><span>Project Manager &amp; Full-Stack Developer</span></div></div>
        <div className="trace-row"><Check size={17} aria-hidden="true" /><div><span>{lang ? 'CMS module' : 'Modul CMS'}</span><strong>{lang ? 'Self-service updates for local businesses' : 'Pembaruan konten mandiri untuk UMKM'}</strong></div></div>
      </div>
    </>
  )
}

function LeadershipLens({ lang }) {
  return (
    <>
      <p className="workbench-label">{lang ? 'Leadership in numbers' : 'Skala kepemimpinan'}</p>
      <ul className="workbench-scale">
        <li><strong>{content.metrics[2].number[lang]}</strong><span>{lang ? 'Dormitory residents managed' : 'Penghuni asrama dikelola'}</span><i aria-hidden="true" style={{ '--measure': '100%' }} /></li>
        <li><strong>{content.metrics[1].number[lang]}</strong><span>{lang ? 'Lab students mentored across 5 computing courses' : 'Mahasiswa praktikum dibimbing di 5 mata kuliah komputasi'}</span><i aria-hidden="true" style={{ '--measure': '10%' }} /></li>
      </ul>
      <p className="workbench-note"><Check size={15} aria-hidden="true" /> {lang ? 'Dorm Olympic 2025 · Event operations' : 'Dorm Olympic 2025 · Operasional acara'}</p>
    </>
  )
}

const panels = [RagLens, CommunityLens, LeadershipLens]

export default function Workbench({ lang, openCommand }) {
  const [active, setActive] = useState(0)
  const tabs = useRef([])
  function navigate(event, index) {
    const next = { ArrowLeft: (index + lenses.length - 1) % lenses.length, ArrowRight: (index + 1) % lenses.length, Home: 0, End: lenses.length - 1 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }
  const Panel = panels[active]
  return (
    <aside className="workbench" data-spotlight="" aria-label={lang ? 'Interactive workbench' : 'Workbench interaktif'}>
      <div className="workbench-top"><span className="workbench-label"><i className="live-dot" aria-hidden="true" /> Workbench</span><BandungTime lang={lang} /></div>
      <p className="workbench-status">{lang ? 'Open to Applied AI & Full-Stack' : 'Terbuka untuk AI Terapan & Full-Stack'}</p>
      <div className="workbench-tabs" role="tablist" aria-label={lang ? 'Project lenses' : 'Perspektif proyek'}>
        {lenses.map(({ label }, index) => (
          <button key={label[0]} type="button" role="tab" id={'lens-tab-' + index} aria-controls={'lens-panel-' + index}
            aria-selected={active === index} tabIndex={active === index ? 0 : -1} ref={element => { tabs.current[index] = element }}
            onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)}>
            <span aria-hidden="true">0{index + 1}.</span> {label[lang]}
          </button>
        ))}
      </div>
      {lenses.map(({ target }, index) => <div className="workbench-panel" role="tabpanel" id={'lens-panel-' + index}
        key={target} aria-labelledby={'lens-tab-' + index} hidden={active !== index} tabIndex={0}>
        {active === index && <Panel lang={lang} />}
      </div>)}
      <div className="workbench-footer">
        <a className="text-link" href={'#' + lenses[active].target}>{lang ? 'Explore this chapter' : 'Lihat bab ini'} <ArrowDownRight size={16} aria-hidden="true" /></a>
        <button className="key workbench-command" type="button" onClick={openCommand} aria-label={lang ? 'Open command palette' : 'Buka palet perintah'}><Command size={14} aria-hidden="true" /> K</button>
      </div>
    </aside>
  )
}
