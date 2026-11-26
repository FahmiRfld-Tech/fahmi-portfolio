import { useEffect } from 'react'

export default function useSpotlights(root) {
  useEffect(() => {
    const area = root.current
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let frame
    let current
    let position
    function track(event) {
      if (event.pointerType !== 'mouse' || motion.matches) return
      const target = event.target.closest('[data-spotlight]')
      if (current !== target) {
        current?.removeAttribute('data-lit')
        current = target
      }
      position = { x: event.clientX, y: event.clientY }
      if (!frame && target) frame = requestAnimationFrame(paint)
    }
    function paint() {
      frame = undefined
      if (!current) return
      const bounds = current.getBoundingClientRect()
      current.style.setProperty('--mouse-x', position.x - bounds.left + 'px')
      current.style.setProperty('--mouse-y', position.y - bounds.top + 'px')
      current.setAttribute('data-lit', '')
    }
    function clear() {
      current?.removeAttribute('data-lit')
      current = null
    }
    area.addEventListener('pointermove', track, { passive: true })
    area.addEventListener('pointerleave', clear)
    area.addEventListener('scroll', clear)
    motion.addEventListener('change', clear)
    return () => {
      cancelAnimationFrame(frame)
      area.removeEventListener('pointermove', track)
      area.removeEventListener('pointerleave', clear)
      area.removeEventListener('scroll', clear)
      motion.removeEventListener('change', clear)
      clear()
    }
  }, [root])
}
