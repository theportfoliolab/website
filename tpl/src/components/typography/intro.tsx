import * as React from "react"
import {PageTitle, Subheading, Kicker} from "./typography"

interface IntroProps {
    kicker?: React.ReactNode
    title?: React.ReactNode
    description?: React.ReactNode
    children?: React.ReactNode
    className?: string
}

export function Intro({ kicker, title, description, children, className }: IntroProps) {
    return (
        <div className={["mt-10 space-y-2", className].filter(Boolean).join(" ")}>
            {kicker ? <Kicker>{kicker}</Kicker> : null}
            {title ? <PageTitle>{title}</PageTitle> : null}
            {description ? <Subheading>{description}</Subheading> : null}
            {children ? <div className="mt-2">{children}</div> : null}
        </div>
    )
}