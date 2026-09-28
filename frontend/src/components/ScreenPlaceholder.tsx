import { ArrowRight, Construction } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'

export interface FlowLink {
  to: string
  label: string
}

interface ScreenPlaceholderProps {
  title: string
  description: string
  /** Qué va a tener la pantalla (se implementa en la fase 2) */
  planned: string[]
  /** Enlaces para recorrer el flujo mientras las pantallas no están terminadas */
  links?: FlowLink[]
  children?: ReactNode
}

/** Pantalla provisoria de la fase 1: define el contenido previsto y permite navegar el flujo. */
export function ScreenPlaceholder({ title, description, planned, links, children }: ScreenPlaceholderProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
            <Construction className="size-5 text-accent-text" aria-hidden="true" />
            Contenido previsto
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {planned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {children && <div className="mt-6 border-t border-border pt-6">{children}</div>}
        </Card>
        {links && links.length > 0 && (
          <Card>
            <h2 className="mb-3 text-base font-semibold">Navegar a</h2>
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 text-sm font-medium hover:bg-muted"
                  >
                    {link.label}
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </>
  )
}
