import { useState } from 'react'
import { ArrowUpRight, Check, Copy, FileText } from 'lucide-react'
import content from '../content.json'
import { EMAIL, GITHUB, LINKEDIN } from './content'
import SegmentTabs from './SegmentTabs'
import CommandTrigger from './CommandTrigger'
import { resumeLabel } from './Resume'
import { External } from './Shared'

const briefs = [
  {
    label: ['Posisi Full-Time / AI Engineer', 'Full-Time / AI Engineer'],
    subject: ['Peluang kerja — AI Engineer', 'Full-time AI Engineer opportunity'],
    draft: [
      'Halo Fahmi, kami sedang mencari AI Engineer untuk bergabung penuh waktu dan ingin mengenal pengalamanmu membangun produk AI. Apakah kamu tersedia untuk percakapan singkat tentang peran dan tim kami?',
      'Hi Fahmi, we’re hiring a full-time AI Engineer and would love to learn about your experience building AI products. Would you be open to a short conversation about the role and our team?',
    ],
  },
  {
    label: ['Proyek Web & Sistem AI', 'Web & AI Systems'],
    subject: ['Diskusi proyek web dan AI', 'Web and AI project inquiry'],
    draft: [
      'Halo Fahmi, saya sedang menyiapkan proyek web yang mengintegrasikan AI ke dalam alur kerja kami. Bolehkah kita membahas kebutuhan pengguna, ruang lingkup, dan jadwalnya?',
      'Hi Fahmi, I’m planning a web project that brings AI into our workflow. Could we set up a call to discuss what users need, the project scope, and the timeline?',
    ],
  },
  {
    label: ['Riset & Kolaborasi', 'Research & Collaboration'],
    subject: ['Ajakan kolaborasi riset', 'Research collaboration inquiry'],
    draft: [
      'Halo Fahmi, saya sedang mengeksplorasi topik riset di bidang AI terapan dan multimedia. Saya ingin bertukar ide dan melihat apakah ada peluang untuk mengerjakan prototipe bersama.',
      'Hi Fahmi, I’m exploring a research question in applied AI and multimedia. I’d love to compare ideas and see whether there’s an opportunity to prototype something together.',
    ],
  },
]

function QuickBrief({ lang, copied, copyText }) {
  const [selection, setSelection] = useState(0)
  const { draft, subject } = briefs[selection]
  const draftCopied = copied?.kind === 'draft' && copied.value === draft[lang]
  const DraftIcon = draftCopied ? Check : Copy
  const mail = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject[lang]) + '&body=' + encodeURIComponent(draft[lang])
  return (
    <section className="quick-brief" aria-labelledby="brief-heading">
      <h3 id="brief-heading" className="eyebrow">{lang ? 'Quick Conversation Starter' : 'Mulai Percakapan Cepat'}</h3>
      <SegmentTabs label={lang ? 'Conversation topic' : 'Topik percakapan'} onSelect={setSelection} items={briefs.map(brief => brief.label[lang])}>
        {index => <p className="brief-draft">{briefs[index].draft[lang]}</p>}
      </SegmentTabs>
      <div className="actions brief-actions">
        <button className="key brief-copy" type="button" onClick={() => copyText(draft[lang], 'draft')}>
          <DraftIcon size={15} aria-hidden="true" /> {draftCopied ? (lang ? 'Draft copied' : 'Draf disalin') : (lang ? 'Copy message draft' : 'Salin draf pesan')}
        </button>
        <a className="text-link" href={mail}>{lang ? 'Send via email' : 'Kirim via Email'} <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </section>
  )
}

export default function EditorialContact({ lang, copied, copyText, openCommand, openResume }) {
  const emailCopied = copied?.kind === 'email'
  const EmailIcon = emailCopied ? Check : Copy
  return (
    <section id="contact" tabIndex="-1" className="chapter epilog alabaster glass" aria-labelledby="contact-title">
      <div className="epilog-pitch">
        <p className="eyebrow chapter-label">06 / {lang ? 'Epilogue' : 'Epilog'}</p>
        <h2 id="contact-title">{lang ? 'Let’s build something useful.' : 'Mari bangun sesuatu yang berguna.'}</h2>
        <p className="narrative">{lang
          ? 'I’m open to working together on applied AI, full-stack engineering, and multimedia systems.'
          : 'Saya terbuka untuk berkolaborasi dalam AI terapan, rekayasa full-stack, dan sistem multimedia.'}</p>
        <p className="eyebrow contact-status"><i className="live-dot" aria-hidden="true" /> {content.copy.availability[lang]}</p>
        <div className="actions contact-actions">
          <button className="key primary" type="button" onClick={() => copyText(EMAIL, 'email')}>
            <EmailIcon size={17} aria-hidden="true" /> {emailCopied ? (lang ? 'Email copied' : 'Email disalin') : (lang ? 'Copy email' : 'Salin email')}
          </button>
          <div className="contact-secondary">
            <External className="key" href={GITHUB}>GitHub <ArrowUpRight size={15} aria-hidden="true" /></External>
            <External className="key" href={LINKEDIN}>LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></External>
            <button className="key resume-action" type="button" onClick={openResume}><FileText size={16} aria-hidden="true" /> {resumeLabel[lang]}</button>
            <CommandTrigger className="contact-command" lang={lang} onClick={openCommand} />
          </div>
        </div>
        <a className="email-address" href={'mailto:' + EMAIL}>{EMAIL}</a>
      </div>
      <QuickBrief {...{ lang, copied, copyText }} />
    </section>
  )
}
