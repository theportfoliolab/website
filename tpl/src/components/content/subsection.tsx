import * as React from "react"
import { cn } from "@/lib/utils.ts"

interface SectionProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
  className?: string
  image?: string | React.ReactNode
  imageAlt?: string
}

export function Subsection({ title, subtitle, children, className, image, imageAlt }: SectionProps) {
  return (
      <div className="mb-10">
          <section className={cn("mt-4 mb-4", className)}>
              {title ? <h3 className="text-2xl font-bold">{title}</h3> : null}
              {subtitle ? <h5>{subtitle}</h5> : null}

              {image ? (
                  typeof image === "string" ? (
                      <figure className="my-6">
                          <img src={image} alt={imageAlt ?? String(title ?? "")} className="w-full rounded-md object-cover" />
                      </figure>
                  ) : (
                      <div>
                          {image}
                      </div>
                  )
              ) : null}

              <div className={cn(typeof children === "string" ? "prose" : "")}>
                  {children}
              </div>
          </section>
      </div>

  )
}

// @ts-ignore
export default Subsection