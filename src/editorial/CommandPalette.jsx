import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'

export default function CommandPalette({ lang, commands, close }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const matches = commands.filter(item => (item.name + ' ' + (item.keywords ?? '')).toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()))
  const selected = Math.min(index, Math.max(matches.length - 1, 0))
  function run(command) {
    close()
    requestAnimationFrame(command.run)
  }
  return (
    <div>
      <div className="command-search"><Search size={21} />
        <input data-initial-focus aria-label={lang ? 'Search commands' : 'Cari perintah'} placeholder={lang ? 'Find a project or action…' : 'Cari proyek atau aksi…'}
          value={query} onChange={event => { setQuery(event.target.value); setIndex(0) }}
          role="combobox" aria-autocomplete="list" aria-expanded={Boolean(matches.length)} aria-controls="command-list"
          aria-activedescendant={matches[selected] ? 'cmd-' + matches[selected].id : undefined}
          onKeyDown={event => {
            if (!matches.length) return
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              const next = (selected + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length
              setIndex(next)
              document.getElementById('cmd-' + matches[next].id)?.scrollIntoView({ block: 'nearest' })
            } else if (event.key === 'Enter') {
              event.preventDefault()
              run(matches[selected])
            }
          }} />
      </div>
      <ul className="command-list" id="command-list" role="listbox">
        {matches.map(({ Icon, id, name, run: action }, i) => (
          <li key={id} id={'cmd-' + id} role="option" aria-selected={selected === i}
            onPointerMove={() => setIndex(i)} onClick={() => run({ run: action })}>
            <Icon size={18} /> <span>{name}</span><ArrowRight size={16} />
          </li>
        ))}
      </ul>
      {!matches.length && <p className="empty-search">{lang ? 'No matching commands.' : 'Perintah tidak ditemukan.'}</p>}
      <div className="command-help"><kbd>↑</kbd><kbd>↓</kbd> {lang ? 'navigate' : 'navigasi'} <kbd>↵</kbd> {lang ? 'open' : 'buka'} <kbd>esc</kbd> {lang ? 'close' : 'tutup'}</div>
    </div>
  )
}

