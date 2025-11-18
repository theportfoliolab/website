import * as React from "react"
import { SectionTitle, SmallHeading } from "./typography"
import { cn } from "@/lib/utils"
import Subsection from "@/components/typography/subsection.tsx";

interface SectionProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
  className?: string
  // image can be a src string or a React node (for custom figure)
  image?: string | React.ReactNode
  imageAlt?: string
}

export function Section({ title, subtitle, children, className, image, imageAlt }: SectionProps) {
  return (
      <div className="mb-10 mt-12 border-t-1">
        <section className={cn("mt-4", className)}>
          {title ? <SectionTitle>{title}</SectionTitle> : null}
          {subtitle ? <SmallHeading>{subtitle}</SmallHeading> : null}

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

          <div>
            {/* Use the Body typography component to render section content */}
            <Subsection>{children}</Subsection>
          </div>
        </section>
      </div>
  )
}

export default Section
