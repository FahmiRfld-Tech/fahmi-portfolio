import { Command, Search } from 'lucide-react'

export default function CommandTrigger({ className, lang, onClick }) {
  return (
    <button className={'key command-trigger ' + className} type="button" onClick={onClick}
      aria-keyshortcuts="Control+K Meta+K">
      <span className="command-trigger-key">
        <Command size={15} aria-hidden="true" /><span aria-hidden="true">K</span>
        <span className="sr-only">{lang ? 'Open command palette' : 'Buka palet perintah'}</span>
      </span>
      <span className="command-trigger-touch">
        <Search size={16} aria-hidden="true" /> {lang ? 'Search / Menu' : 'Cari / Menu'}
      </span>
    </button>
  )
}
