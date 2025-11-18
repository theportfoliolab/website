import * as React from "react"
import {PageTitle, Subheading, Kicker} from "./typography"

export function Intro({ children }: { children?: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <Kicker>Content Kicker</Kicker>
            <PageTitle>Content Title</PageTitle>
            <Subheading>
                A short description of this piece.
            </Subheading>
            {children ? <div className="mt-2">{children}</div> : null}
        </div>
    )
}