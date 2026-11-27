import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

export default function Dialog({ title, closeLabel, close, children, className = '', eyebrow, footer }) {
  const ref = useRef(null)
  const sheet = useRef(null)
  const drag = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    const trigger = document.activeElement
    dialog.showModal()
    dialog.querySelector('[data-initial-focus]')?.focus()
    return () => {
      dialog.close()
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [])

  function startDrag(event) {
    if (event.button !== 0) return
    drag.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
    sheet.current.dataset.dragging = ''
  }

  function moveDrag(event) {
    if (drag.current === null) return
    sheet.current.style.setProperty('--sheet-slide', Math.max(0, event.clientY - drag.current) + 'px')
  }

  function finishDrag(event) {
    if (drag.current === null) return
    const dismiss = event.type === 'pointerup' && event.clientY - drag.current > 72
    drag.current = null
    delete sheet.current.dataset.dragging
    sheet.current.style.removeProperty('--sheet-slide')
    if (dismiss) close()
  }

  return (
    <dialog ref={ref} className={'dialog tactile-dialog ' + className} aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); close() }}
      onClick={event => { if (event.target === event.currentTarget) close() }}>
      <div className="dialog-panel" ref={sheet}>
        <div className="sheet-grab" aria-hidden="true" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
          <span />
        </div>
        <header className="dialog-top">
          <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 id={titleId}>{title}</h2></div>
          <button type="button" className="key icon-key" onClick={close} aria-label={closeLabel}><X size={19} aria-hidden="true" /></button>
        </header>
        <div className="dialog-scroll">{children}</div>
        {footer && <footer className="dossier-actions">{footer}</footer>}
      </div>
    </dialog>
  )
}
