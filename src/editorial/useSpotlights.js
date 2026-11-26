import { useEffect } from 'react'

const tiltLimit = 3.5

export default function useSpotlights(root) {
  useEffect(() => {
    const area = root.current
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let frame
    let card
    let untransformed
    let x, y, nextX, nextY
    let tiltX = 0
    let tiltY = 0

    function clear() {
      cancelAnimationFrame(frame)
      frame = undefined
      card?.removeAttribute('data-lit')
      card?.style.removeProperty('--tilt-x')
      card?.style.removeProperty('--tilt-y')
      card?.style.removeProperty('--magnet-x')
      card?.style.removeProperty('--magnet-y')
      card = null
      tiltX = 0
      tiltY = 0
    }

    function track(event) {
      if (event.pointerType !== 'mouse' || motion.matches) return
      const target = event.target.closest('[data-spotlight], [data-magnetic]')
      if (target !== card) {
        clear()
        if (!target) return
        card = target
        untransformed = target.getBoundingClientRect()
      }
      if (!card) return
      x = Math.min(1, Math.max(0, (event.clientX - untransformed.left) / untransformed.width))
      y = Math.min(1, Math.max(0, (event.clientY - untransformed.top) / untransformed.height))
      nextX = (0.5 - y) * 2 * tiltLimit
      nextY = (x - 0.5) * 2 * tiltLimit
      if (frame === undefined) frame = requestAnimationFrame(paint)
    }

    function paint() {
      frame = undefined
      if (!card) return
      if (card.hasAttribute('data-magnetic')) {
        card.style.setProperty('--magnet-x', ((x - 0.5) * 8) + 'px')
        card.style.setProperty('--magnet-y', ((y - 0.5) * 8) + 'px')
        return
      }
      card.style.setProperty('--mouse-x', x * 100 + '%')
      card.style.setProperty('--mouse-y', y * 100 + '%')
      if (card.hasAttribute('data-tilt')) {
        tiltX += (nextX - tiltX) * .23
        tiltY += (nextY - tiltY) * .23
        card.style.setProperty('--tilt-x', tiltX + 'deg')
        card.style.setProperty('--tilt-y', tiltY + 'deg')
        if (Math.abs(nextX - tiltX) + Math.abs(nextY - tiltY) > .025) frame = requestAnimationFrame(paint)
      }
      card.setAttribute('data-lit', '')
    }

    area.addEventListener('pointermove', track, { passive: true })
    area.addEventListener('pointerleave', clear)
    area.addEventListener('scroll', clear, { passive: true })
    motion.addEventListener('change', clear)
    return () => {
      area.removeEventListener('pointermove', track)
      area.removeEventListener('pointerleave', clear)
      area.removeEventListener('scroll', clear)
      motion.removeEventListener('change', clear)
      clear()
    }
  }, [root])
}
