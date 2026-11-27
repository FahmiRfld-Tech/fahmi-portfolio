import { useState } from 'react'
import { ArrowUpRight, Check, Code2, Copy, Database, Film, HeartHandshake, ShieldCheck, Zap } from 'lucide-react'
import { EMAIL, GITHUB, LINKEDIN } from './content'
import SegmentTabs from './SegmentTabs'
import { External } from './Shared'

const highlights = [
  [ShieldCheck, 'AI dengan sumber yang bisa diperiksa', 'AI with evidence you can inspect'],
  [Code2, 'Produk web untuk kebutuhan nyata', 'Web products built for real needs'],
  [HeartHandshake, 'Memimpin komunitas 3.000+ penghuni', 'Led a community of 3,000+ residents'],
]
const stack = [
  [Database, 'Python · Django REST · pgvector', 'Pencarian semantik dan rekayasa data.', 'Semantic retrieval and data engineering.'],
  [Code2, 'React · TypeScript', 'Antarmuka produk dan portal komunitas.', 'Product interfaces and community portals.'],
  [Film, 'Unity · C#', 'Multimedia interaktif dan prototipe 3D.', 'Interactive multimedia and 3D prototypes.'],
]

export function IdentityTrigger({ lang, onClick, className = '' }) {
  return <button type="button" className={'key identity-trigger ' + className} aria-haspopup="dialog" onClick={onClick}>
    <Zap size={15} aria-hidden="true" />{lang ? '15s Vibe Pass' : 'Kenalan 15 Detik'}
  </button>
}

function StackChips({ lang }) {
  const [selected, select] = useState(0)
  return <div className="identity-stack">
    <div className="identity-chips" role="group" aria-label={lang ? 'Technology groups' : 'Kelompok teknologi'}>
      {stack.map(([Icon, label], i) => <button type="button" className="key" key={label} aria-pressed={i === selected} onClick={() => select(i)}>
        <Icon size={16} aria-hidden="true" />{label}
      </button>)}
    </div>
    <p className="identity-note" role="status">{stack[selected][lang ? 3 : 2]}</p>
  </div>
}

function Ping({ lang, copyEmail }) {
  const [result, setResult] = useState(null)
  return <div className="identity-ping">
    <button className="key primary" type="button" onClick={async () => setResult(await copyEmail())}>
      {result ? <Check size={17} /> : <Copy size={17} />} {lang ? 'Copy email' : 'Salin email'}
    </button>
    <External href={GITHUB} className="key">GitHub <ArrowUpRight size={15} aria-hidden="true" /></External>
    <External href={LINKEDIN} className="key">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></External>
    <p className="identity-note" role="status">{result ? (lang ? '✓ Copied! Ready to chat' : '✓ Tersalin! Siap ngobrol') : <a href={'mailto:' + EMAIL}>{EMAIL}</a>}</p>
  </div>
}

export default function IdentityPass({ lang, copyEmail }) {
  return <>
    <div className="identity-header">
      <span className="identity-monogram" aria-hidden="true">MF.</span>
      <div><h3>M. Fahmi Rifaldi</h3><p>Applied AI &amp; Full-Stack Engineer · Bandung</p></div>
      <span className="identity-status"><i className="live-dot" aria-hidden="true" />OPEN TO WORK</span>
    </div>
    <SegmentTabs label={lang ? 'About Fahmi' : 'Tentang Fahmi'} items={['TL;DR', 'Stack', 'Ping Me']}>
      {index => index === 0
        ? <ul className="identity-highlights">{highlights.map(([Icon, id, en]) => <li key={id}><Icon size={20} aria-hidden="true" />{lang ? en : id}</li>)}</ul>
        : index === 1 ? <StackChips lang={lang} /> : <Ping {...{ lang, copyEmail }} />}
    </SegmentTabs>
  </>
}
