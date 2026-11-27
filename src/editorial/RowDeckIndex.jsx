import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function RowDeckIndex({ rows, className, rowClassName, onOpen }) {
  const list = useRef(null)
  const active = useRef(null)

  function highlight(row) {
    const index = list.current
    active.current = row
    index.toggleAttribute('data-highlighted', Boolean(row))
    if (!row) return
    index.style.setProperty('--row-top', row.offsetTop + 'px')
    index.style.setProperty('--row-height', row.offsetHeight + 'px')
  }

  useEffect(() => {
    const layout = new ResizeObserver(() => {
      if (active.current) highlight(active.current)
    })
    layout.observe(list.current)
    return () => layout.disconnect()
  }, [])

  return <ol ref={list} className={className + ' studio-index'}
    onPointerLeave={() => highlight(null)}
    onBlur={event => { if (!list.current.contains(event.relatedTarget)) highlight(null) }}>
    {rows.map(({ id, title, subtitle, date }, index) =>
      <li id={id} tabIndex={id ? -1 : undefined} key={title} className={rowClassName + ' glass'} data-spotlight=""
        onPointerEnter={event => { if (event.pointerType === 'mouse') highlight(event.currentTarget) }}
        onFocus={event => highlight(event.currentTarget)}>
        <button className="row-trigger" type="button" aria-haspopup="dialog" onClick={() => onOpen(index)}>
          <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="studio-row-copy"><strong>{title}</strong><span className="studio-row-subtitle">{subtitle}</span></span>
          <span className="date">{date}</span>
          <ArrowUpRight className="row-icon" size={17} aria-hidden="true" />
        </button>
      </li>
    )}
  </ol>
}
