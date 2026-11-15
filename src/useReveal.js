import React, { useEffect, useRef } from 'react'

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scroll-reveal hook: observes the referenced element and adds the
 * .reveal-visible class (fade-up, see motion.css) when it enters the
 * viewport. Under prefers-reduced-motion — or without IntersectionObserver —
 * the element is shown in its final state immediately.
 */
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      el.classList.add('reveal-visible')
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('reveal-visible')
            io.disconnect()
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/**
 * Wrapper component so lists and sections can reveal without each page
 * wiring its own ref. `delay` staggers siblings via transition-delay.
 */
export function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal()
  const props = {
    ref,
    className: `reveal ${className}`.trim(),
    ...rest,
  }
  if (delay) props.style = { ...(rest.style || {}), transitionDelay: `${delay}ms` }
  return React.createElement(as, props, children)
}
