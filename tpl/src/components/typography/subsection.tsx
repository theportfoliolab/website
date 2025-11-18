import * as React from "react"
import { Lead, Body, SmallHeading } from "./typography"
import { cn } from "@/lib/utils"

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
              {title ? <SmallHeading>{title}</SmallHeading> : null}
              {subtitle ? <Lead>{subtitle}</Lead> : null}

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
                  <Body>{children}</Body>
              </div>
          </section>
      </div>

  )
}

// @ts-ignore
export default Subsection