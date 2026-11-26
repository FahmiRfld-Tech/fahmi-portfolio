import { useEffect, useRef } from 'react'
import { m } from 'framer-motion'
import { X } from 'lucide-react'

export default function Dialog({ title, closeLabel, close, children, className = '' }) {
  const ref = useRef(null)
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
  return (
    <dialog
      ref={ref} className={'dialog ' + className} aria-label={title}
      onCancel={event => { event.preventDefault(); close() }}
      onClick={event => { if (event.target === event.currentTarget) close() }}
    >
      <m.div className="dialog-panel" initial={{ opacity: 0, scale: 0.97, y: 7 }}
        animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <div className="dialog-top">
          <h2>{title}</h2>
          <button type="button" className="key icon-key" onClick={close} aria-label={closeLabel}><X size={19} aria-hidden="true" /></button>
        </div>
        {children}
      </m.div>
    </dialog>
  )
}
