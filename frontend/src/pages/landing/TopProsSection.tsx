import { ProCard } from '@/components/ProCard'
import { compareRecommended } from '@/lib/plans'
import { useDemoStore } from '@/store/demo'
import { ratingOf } from '@/store/selectors'

export function TopProsSection() {
  const professionals = useDemoStore((s) => s.professionals)
  const reviews = useDemoStore((s) => s.reviews)
  const categories = useDemoStore((s) => s.categories)

  const top = professionals
    .filter((p) => p.verified)
    .map((p) => ({ professional: p, rating: ratingOf(reviews, p) }))
    .sort(compareRecommended)
    .slice(0, 4)

  return (
    <section className="bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-balance sm:text-4xl">Profesionales destacados</h2>
        <p className="mt-2 text-muted-foreground">
          Profesionales Premium y los mejor calificados de tu zona. Los perfiles con membresía llevan su insignia.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {top.map(({ professional, rating }) => (
            <li key={professional.id}>
              <ProCard
                professional={professional}
                rating={rating}
                categoryName={categories.find((c) => c.id === professional.categoryIds[0])?.name}
                to={`/profesionales/${professional.id}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
