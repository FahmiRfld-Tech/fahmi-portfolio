import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'

export default function CommandPalette({ lang, groups, close }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
  const filtered = groups.map(group => ({ ...group, commands: group.commands.filter(item => {
    const searchable = [group.label, item.name, item.keywords].join(' ').toLocaleLowerCase()
    return terms.every(term => searchable.includes(term))
  }) })).filter(group => group.commands.length)
  const matches = filtered.flatMap(group => group.commands)
  const selected = matches[Math.min(index, matches.length - 1)]

  function run(command) {
    close()
    command.run()
  }

  function move(event) {
    if (!selected) return
    if (event.key === 'Enter') {
      event.preventDefault()
      run(selected)
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = (matches.indexOf(selected) + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length
      setIndex(next)
      document.getElementById('cmd-' + matches[next].id)?.scrollIntoView({ block: 'nearest' })
    }
  }

  return <>
    <div className="command-search"><Search size={21} />
      <input data-initial-focus aria-label={lang ? 'Search commands' : 'Cari perintah'}
        placeholder={lang ? 'Find a chapter, project or action…' : 'Cari bab, proyek, atau aksi…'}
        value={query} onChange={event => { setQuery(event.target.value); setIndex(0) }}
        role="combobox" aria-autocomplete="list" aria-expanded={!!matches.length} aria-controls="command-list"
        aria-activedescendant={selected ? 'cmd-' + selected.id : undefined} onKeyDown={move} />
    </div>
    <div className="command-list" id="command-list" role="listbox" aria-label={lang ? 'Available commands' : 'Perintah yang tersedia'}>
      {filtered.map(({ id, label, commands }) => <div className="command-group" role="group" key={id} aria-labelledby={'cmd-group-' + id}>
        <p className="eyebrow" id={'cmd-group-' + id}>{label}</p>
        {commands.map(command => <div key={command.id} id={'cmd-' + command.id} role="option" aria-selected={selected === command}
          onPointerMove={() => setIndex(matches.indexOf(command))} onClick={() => run(command)}>
          <command.Icon size={18} aria-hidden="true" /><span>{command.name}</span><ArrowRight size={16} aria-hidden="true" />
        </div>)}
      </div>)}
    </div>
    {!matches.length && <p className="empty-search" role="status">{lang ? 'No matching commands.' : 'Perintah tidak ditemukan.'}</p>}
    <div className="command-help"><kbd>↑</kbd><kbd>↓</kbd> {lang ? 'navigate' : 'navigasi'} <kbd>↵</kbd> {lang ? 'open' : 'buka'} <kbd>esc</kbd> {lang ? 'close' : 'tutup'}</div>
  </>
}
