import { Printer } from 'lucide-react'
import content from '../content.json'
import { EMAIL, GITHUB } from './content'

const portfolio = 'https://fahmi-portfolio-sand.vercel.app'
const work = [
  {
    title: ['Co-Founder & Chief Executive Officer', 'Co-Founder & Chief Executive Officer'],
    place: ['Faham Visual · Studio kreatif & perangkat lunak, Bandung', 'Faham Visual · Creative & software studio, Bandung'],
  },
  {
    title: ['Magang Web & Digital', 'Web & Digital Intern'],
    place: ['Center of Excellence (CoE) GreenTech, Telkom University', 'Center of Excellence (CoE) GreenTech, Telkom University'],
  },
  {
    role: 3,
    detail: ['Memimpin komunitas asrama dengan 3.000+ penghuni.', 'Led a dormitory community of 3,000+ residents.'],
  },
  {
    role: 2,
    detail: ['Mendampingi 300+ praktikan di lima mata kuliah komputasi dan multimedia.', 'Mentored 300+ students across five computing and multimedia courses.'],
  },
  { role: 0 },
]
const projects = [
  ['batam', ['Pencarian terfilter, pemetaan bukti ke kutipan X-Ray, dan pengungkapan batas bukti. RRF dan cache semantik pgvector disiapkan di SQL.','Filtered search, evidence mapped to X-Ray citations, and evidence-gap disclosure. pgvector RRF and semantic caching are prepared in SQL.']],
  ['clipper', ['Ekspor video vertikal lokal. Inspector ClipForge memperagakan pemetaan ID segmen, VAD silence-snapping, dan reframing EMA 9:16.','Local vertical video export. The ClipForge inspector demonstrates segment-ID mapping, VAD silence-snapping, and EMA 9:16 reframing.']],
  ['cireundeu', ['Portal wisata, CMS mandiri UMKM, optimasi gambar di browser, dan koordinasi tim lintas fungsi 13 orang.','Tourism portal, self-service small-business CMS, browser-side image optimization, and leadership of a 13-person cross-functional team.']],
  ['promptgate', ['Middleware Python tanpa dependensi untuk menyaring prompt injection, menyamarkan PII, dan memperbaiki sintaks JSON secara deterministik.', 'Dependency-free Python middleware for prompt injection screening, PII redaction, and deterministic JSON auto-repair.']],
]

export const resumeLabel = ['Lihat / Unduh CV (PDF)', 'View / Download CV (PDF)']

export default function Resume({ lang }) {
  return <>
    <div className="resume-toolbar">
      <button className="key primary" type="button" onClick={() => window.print()} data-initial-focus>
        <Printer size={17} aria-hidden="true" /> {lang ? 'Print / Save PDF' : 'Cetak / Simpan PDF'}
      </button>
    </div>
    <article className="resume-paper" aria-labelledby="resume-name">
      <header>
        <h2 id="resume-name">M. Fahmi Rifaldi</h2>
        <p className="resume-position">Applied AI &amp; Full-Stack Product Engineer</p>
        <address>
          <span>{lang ? 'Bandung, West Java, Indonesia' : 'Bandung, Jawa Barat, Indonesia'}</span>
          <a href={'mailto:' + EMAIL}>{EMAIL}</a>
          <a href={GITHUB}>github.com/FahmiRfld-Tech</a>
          <a href={portfolio}>fahmi-portfolio-sand.vercel.app</a>
        </address>
      </header>
      <section>
        <h3>{lang ? 'Education' : 'Pendidikan'}</h3>
        <h4>{lang ? 'Applied Bachelor’s in Multimedia Engineering Technology' : 'D4 Teknologi Rekayasa Multimedia'}</h4>
        <p>{lang ? 'Telkom University · Sep 2023 – Present · GPA 3.67 / 4.00' : 'Telkom University · Sep 2023 – sekarang · IPK 3,67 / 4,00'}</p>
      </section>
      <section>
        <h3>{lang ? 'Certifications & Training' : 'Sertifikasi & Pelatihan'}</h3>
        <p>{lang ? 'BNSP Certified Multimedia Designer' : 'Desainer Multimedia Tersertifikasi BNSP'} · Google AI Essentials · LKMM-TM</p>
      </section>
      <section>
        <h3>{lang ? 'Core Engineering Projects' : 'Proyek Engineering Utama'}</h3>
        <ul>{projects.map(([id, detail]) => {
          const project = content.projects.find(entry => entry.id === id)
          return <li key={id}><h4>{project.name[lang]}</h4><p>{detail[lang]}</p></li>
        })}</ul>
      </section>
      <section>
        <h3>{lang ? 'Experience & Leadership' : 'Pengalaman & Kepemimpinan'}</h3>
        <ul>{work.map(({ role, title, place, detail }, index) => {
          const entry = content.roles[role]
          return <li key={index}>
            <h4>{entry ? entry.role[lang] : title[lang]}</h4>
            <p>{entry ? entry.org[lang] + ' · ' + entry.date[lang] : place[lang]}</p>
            {detail && <p>{detail[lang]}</p>}
          </li>
        })}</ul>
      </section>
    </article>
  </>
}
