// src/components/layout/articlelayout.tsx
import type { ReactNode } from "react"
import Body from "@/components/content/body"
import ContentHeader from "@/components/content/contentheader"
import type { PostMeta } from "@/components/content/types"

interface ArticleLayoutProps {
    meta: PostMeta
    children: ReactNode
    className?: string
}

export default function ArticleLayout({ meta, children, className }: ArticleLayoutProps) {
    return (
        <div className={`mx-auto w-full min-w-0 max-w-6xl px-md py-2xl ${className ?? ""}`}>
            <ContentHeader
                title={meta.title}
                description={meta.description}
                date={meta.date}
                tags={meta.tags}
                className="w-full"
            />

            <Body className="w-full">
                {children}
            </Body>
        </div>
    )
}