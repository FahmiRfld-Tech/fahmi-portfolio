import { Braces, Fingerprint, ShieldAlert } from 'lucide-react'
import SegmentTabs from './SegmentTabs'
import { redact, repairJSON, samples, scan } from './promptgate'
import './promptgate.css'

const presets = [
  { Icon: ShieldAlert, label: ['Serangan Prompt Injection', 'Prompt Injection Attack'], tone: 'blocked' },
  { Icon: Fingerprint, label: ['Masking PII (NIK & WA)', 'PII Data Masking (NIK & WA)'], tone: 'masked' },
  { Icon: Braces, label: ['Perbaikan JSON', 'Malformed JSON Repair'], tone: 'repaired' },
]
const repairsID = {
  'Stripped prefix': 'Awalan dihapus',
  'Removed trailing comma': 'Koma akhir dihapus',
  'Closed brace': 'Kurung kurawal ditutup',
}

function PresetResult({ index, lang }) {
  const source = samples[index]
  const presentation = presets[index]
  let heading, output
  if (index === 0) {
    const result = scan(source)
    const status = result.blocked ? (lang ? 'BLOCKED' : 'DIBLOKIR') : (lang ? 'ALLOWED' : 'DIIZINKAN')
    heading = status + ' · ' + (lang ? 'Risk ' : 'Risiko ') + result.riskScore + '/100'
    output = <ul className="tags" aria-label={lang ? 'Matched rules' : 'Aturan yang terpicu'}>
      {result.rules.map(rule => <li key={rule}>{rule}</li>)}
    </ul>
  } else if (index === 1) {
    heading = lang ? 'MASKED · Safe preview' : 'DISAMARKAN · Pratinjau'
    output = <pre><code>{redact(source)}</code></pre>
  } else {
    const result = repairJSON(source)
    heading = (lang ? 'Repaired: ' : 'Diperbaiki: ') + result.repairs.map(repair => lang ? repair : repairsID[repair]).join(' + ')
    output = <pre><code>{JSON.stringify(result.data, null, 2)}</code></pre>
  }
  return <div className="promptgate-example" data-tone={presentation.tone}>
    <p className="eyebrow">{lang ? 'Sample input' : 'Contoh input'}</p>
    <pre><code>{source}</code></pre>
    <p className="promptgate-result" role="status">{heading}</p>
    {output}
  </div>
}

export default function PromptGateSandbox({ lang }) {
  const title = lang ? 'Live Guardrail Sandbox' : 'Sandbox Guardrail Interaktif'
  return <section className="promptgate-sandbox" aria-label={title}>
    <header className="pipeline-header">
      <h3>{title}</h3>
      <span className="pipeline-code">{lang ? 'Browser only' : 'Lokal di browser'}</span>
    </header>
    <SegmentTabs label={title} keepPanels items={presets.map(({ Icon, label }, i) =>
      <><Icon size={14} aria-hidden="true" /><span>{i + 1}. {label[lang]}</span></>
    )}>
      {index => <PresetResult {...{ index, lang }} />}
    </SegmentTabs>
  </section>
}
