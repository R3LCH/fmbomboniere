import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, MOTION_OK } from '../motion.ts'
import { LOGO_LARGE } from './ui.tsx'

const KEY = 'fm-intro'

/** Ivory curtain with the logo; once per session, never under reduced motion. Total 1.3s. */
export default function Intro({ onDone }: { onDone: () => void }) {
  const [show] = useState(() => !sessionStorage.getItem(KEY) && window.matchMedia(MOTION_OK).matches)
  const ref = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(!show)

  useLayoutEffect(() => {
    if (!show || !ref.current) {
      onDone()
      return
    }
    sessionStorage.setItem(KEY, '1')
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            setGone(true)
            onDone()
          },
        })
        .fromTo('img', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out' })
        .to(ref.current, { yPercent: -100, duration: 0.7, ease: 'expo.inOut' })
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div ref={ref} aria-hidden="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory">
      <img src={LOGO_LARGE} alt="" width={640} height={640} className="size-36 rounded-full sm:size-44" />
    </div>
  )
}
