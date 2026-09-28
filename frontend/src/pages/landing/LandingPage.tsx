import { useEffect, useRef, useState } from 'react'
import { CategoriesSection } from './CategoriesSection'
import { HeroSection } from './HeroSection'
import { HowItWorksSection } from './HowItWorksSection'
import { LandingFooter } from './LandingFooter'
import { LandingHeader } from './LandingHeader'
import { ProCtaSection } from './ProCtaSection'
import { TopProsSection } from './TopProsSection'
import { WhySection } from './WhySection'

/** Landing pública: primera pantalla de la presentación */
export function LandingPage() {
  const heroSearchRef = useRef<HTMLDivElement>(null)
  const [heroSearchVisible, setHeroSearchVisible] = useState(true)

  // Cuando el buscador del hero queda tapado por el header, se muestra el compacto
  useEffect(() => {
    const target = heroSearchRef.current
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setHeroSearchVisible(entry.isIntersecting), {
      rootMargin: '-72px 0px 0px 0px',
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <LandingHeader showSearch={!heroSearchVisible} />
      <main>
        <HeroSection searchRef={heroSearchRef} />
        <CategoriesSection />
        <WhySection />
        <HowItWorksSection />
        <TopProsSection />
        <ProCtaSection />
      </main>
      <LandingFooter />
    </>
  )
}
