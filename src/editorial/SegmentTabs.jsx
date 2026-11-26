import { useId, useRef, useState } from 'react'

export default function SegmentTabs({ label, items, children, onSelect }) {
  const id = useId()
  const buttons = useRef([])
  const [active, setActive] = useState(0)

  function select(index) {
    setActive(index)
    onSelect?.(index)
  }

  function navigate(event, index) {
    const next = {
      ArrowLeft: (index + items.length - 1) % items.length,
      ArrowRight: (index + 1) % items.length,
      Home: 0,
      End: items.length - 1,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next)
    buttons.current[next]?.focus()
  }

  return (
    <>
      <div className="segment-tabs" role="tablist" aria-label={label} style={{ '--segment-count': items.length }}>
        {items.map((item, index) => <button key={index} type="button" role="tab" id={id + '-tab-' + index}
          aria-controls={id + '-panel-' + index} aria-selected={active === index}
          tabIndex={active === index ? 0 : -1} ref={element => { buttons.current[index] = element }}
          onClick={() => select(index)} onKeyDown={event => navigate(event, index)}>{item}</button>)}
      </div>
      {items.map((_, index) => <div key={index} className="segment-panel" id={id + '-panel-' + index} role="tabpanel"
        aria-labelledby={id + '-tab-' + index} hidden={index !== active} tabIndex={0}>
        {index === active && children(index)}
      </div>)}
    </>
  )
}
