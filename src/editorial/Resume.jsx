import { useState } from 'react'
import { Printer } from 'lucide-react'
import content from '../content.json'
import { EMAIL, GITHUB } from './content'

const portfolio = new URL(document.querySelector('link[rel=canonical]').href)
const projects = [
  ['batam', ['Pencarian terfilter, pemetaan bukti ke kutipan X-Ray, dan pengungkapan batas bukti. RRF dan cache semantik pgvector disiapkan di SQL.','Filtered search, evidence mapped to X-Ray citations, and evidence-gap disclosure. pgvector RRF and semantic caching are prepared in SQL.']],
  ['clipper', ['Ekspor video vertikal lokal. Inspector ClipForge memperagakan pemetaan ID segmen, VAD silence-snapping, dan reframing EMA 9:16.','Local vertical video export. The ClipForge inspector demonstrates segment-ID mapping, VAD silence-snapping, and EMA 9:16 reframing.']],
  ['cireundeu', ['Portal wisata, CMS mandiri UMKM, optimasi gambar di browser, dan koordinasi tim lintas fungsi 13 orang.','Tourism portal, self-service small-business CMS, browser-side image optimization, and leadership of a 13-person cross-functional team.']],
  ['promptgate', ['Middleware Python tanpa dependensi untuk menyaring prompt injection, menyamarkan PII, dan memperbaiki sintaks JSON secara deterministik.', 'Dependency-free Python middleware for prompt injection screening, PII redaction, and deterministic JSON auto-repair.']],
]

export const resumeLabel = ['Lihat / Unduh CV (PDF)', 'View / Download CV (PDF)']

export function PrintResume({ lang }) {
  return <button className="key primary" type="button" onClick={() => window.print()}>
    <Printer size={17} aria-hidden="true" /> {lang ? 'Print / Save PDF' : 'Cetak / Simpan PDF'}
  </button>
}

const filters = [
  ['all', 'Semua', 'All'], ['projects', 'Proyek', 'Projects'], ['work', 'Pengalaman', 'Experience'], ['study', 'Pendidikan', 'Education'],
]

export default function Resume({ lang }) {
  const [filter, setFilter] = useState('all')
  return <>
    <div className="resume-filters" role="group" aria-label={lang ? 'Resume filters' : 'Filter CV'}>
      {filters.map(([id, indonesian, english]) => <button type="button" className="key" key={id} aria-pressed={id === filter} onClick={() => setFilter(id)}>
        {lang ? english : indonesian}
      </button>)}
    </div>
    <article className="resume-paper" data-section={filter} aria-labelledby="resume-name">
      <header>
        <h2 id="resume-name">M. Fahmi Rifaldi</h2>
        <p className="resume-position">Applied AI &amp; Full-Stack Product Engineer</p>
        <address>
          <span>{lang ? 'Bandung, West Java, Indonesia' : 'Bandung, Jawa Barat, Indonesia'}</span>
          <a href={'mailto:' + EMAIL}>{EMAIL}</a>
          <a href={GITHUB}>github.com/FahmiRfld-Tech</a>
          <a href={portfolio.href}>{portfolio.hostname}</a>
        </address>
      </header>
      <section data-resume-part="study">
        <h3>{lang ? 'Education' : 'Pendidikan'}</h3>
        <h4>{lang ? 'Applied Bachelor’s in Multimedia Engineering Technology' : 'D4 Teknologi Rekayasa Multimedia'}</h4>
        <p>{lang ? 'Telkom University · Sep 2023 – Present · GPA 3.67 / 4.00' : 'Telkom University · Sep 2023 – sekarang · IPK 3,67 / 4,00'}</p>
      </section>
      <section data-resume-part="study">
        <h3>{lang ? 'Certifications & Training' : 'Sertifikasi & Pelatihan'}</h3>
        <p>{lang ? 'BNSP Certified Multimedia Designer' : 'Desainer Multimedia Tersertifikasi BNSP'} · Google AI Essentials · LKMM-TM</p>
      </section>
      <section data-resume-part="projects">
        <h3>{lang ? 'Core Engineering Projects' : 'Proyek Engineering Utama'}</h3>
        <ul>{projects.map(([id, detail]) => {
          const project = content.projects.find(entry => entry.id === id)
          return <li key={id}><h4>{project.name[lang]}</h4><p>{detail[lang]}</p></li>
        })}</ul>
      </section>
      <section data-resume-part="work">
        <h3>{lang ? 'Experience & Leadership' : 'Pengalaman & Kepemimpinan'}</h3>
        <ul>{content.roles.map(({ role, org, date }) => <li key={role}>
          <h4>{role}</h4>
          <p>{org[lang]} · {date[lang]}</p>
        </li>)}</ul>
      </section>
    </article>
  </>
}
