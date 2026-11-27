import { useId, useRef, useState } from 'react'

export default function SegmentTabs({ label, items, children, onSelect, keepPanels = false, activeIndex }) {
  const id = useId()
  const buttons = useRef([])
  const [localIndex, setLocalIndex] = useState(0)
  const active = activeIndex ?? localIndex

  function select(index) {
    if (activeIndex === undefined) setLocalIndex(index)
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

  const panels = items.map((_, index) => {
    const inactive = index !== active
    return <div key={index} className="segment-panel" id={id + '-panel-' + index} role="tabpanel"
      aria-labelledby={id + '-tab-' + index} hidden={inactive && !keepPanels}
      inert={inactive && keepPanels} data-inactive={inactive && keepPanels ? '' : undefined} tabIndex={0}>
      {(keepPanels || !inactive) && children(index)}
    </div>
  })

  return (
    <>
      <div className="segment-tabs" role="tablist" aria-label={label} style={{ '--segment-count': items.length }}>
        {items.map((item, index) => <button key={index} type="button" role="tab" id={id + '-tab-' + index}
          aria-controls={id + '-panel-' + index} aria-selected={active === index}
          tabIndex={active === index ? 0 : -1} ref={element => { buttons.current[index] = element }}
          onClick={() => select(index)} onKeyDown={event => navigate(event, index)}>{item}</button>)}
      </div>
      {keepPanels ? <div className="segment-sizing">{panels}</div> : panels}
    </>
  )
}
