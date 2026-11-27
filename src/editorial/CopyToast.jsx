import { useLayoutEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import { EMAIL } from './content'

export default function CopyToast({ lang, toast }) {
  const island = useRef(null)
  useLayoutEffect(() => {
    const element = island.current
    if (!toast || !element.showPopover) return
    element.showPopover()
    return () => { if (element.matches(':popover-open')) element.hidePopover() }
  }, [toast])

  let message
  if (toast?.success) message = lang ? 'Copied — ready to connect' : 'Tersalin — siap terhubung'
  else if (toast?.kind === 'draft') message = lang ? 'Select the draft text to copy it.' : 'Pilih teks draf untuk menyalinnya.'
  else message = EMAIL

  return <div ref={island} className="copy-island" popover="manual" hidden={!toast}>
    {toast && <div className="copy-island-message" role="status" key={toast.key}>
      {toast.success && <span className="copy-island-check"><Check size={15} aria-hidden="true" /></span>}
      {message}
    </div>}
  </div>
}
