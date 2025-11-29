// src/pages/Articles.tsx
import * as React from "react"
import { NavLink, useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import type { PostMeta } from "@/components/content/types"
import { ContentHeader } from "@/components/ui/header"

// Import all article components + metadata
const articleModules = import.meta.glob("@/content/articles/*.tsx") as Record<
    string,
    () => Promise<{ default: React.ComponentType<any>; meta: PostMeta }>
>

export default function Articles() {
    const { slug } = useParams<{ slug?: string }>()

    const [list, setList] = React.useState<
        { slug: string; title: string; date: string; key: string; meta: PostMeta }[]
    >([])
    const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
    const [meta, setMeta] = React.useState<PostMeta | null>(null)

    // ─────────────────────────────────────────────────────────────
    // Load metadata for all posts
    // ─────────────────────────────────────────────────────────────
    React.useEffect(() => {
        const loadAll = async () => {
            const entries = []

            for (const [key, loader] of Object.entries(articleModules)) {
                const mod = await loader()
                entries.push({
                    key,
                    slug: mod.meta.slug,
                    title: mod.meta.title,
                    date: mod.meta.date,
                    meta: mod.meta
                })
            }

            // Newest → Oldest
            entries.sort((a, b) => b.date.localeCompare(a.date))

            setList(entries)
        }

        loadAll()
    }, [])

    // ─────────────────────────────────────────────────────────────
    // If a slug is provided → load that article (via metadata only)
    // ─────────────────────────────────────────────────────────────
    React.useEffect(() => {
        if (!slug) {
            setComponent(null)
            setMeta(null)
            return
        }

        const loadOne = async () => {
            // Find article by meta.slug
            const match = list.find((p) => p.slug === slug)
            if (!match) {
                setComponent(null)
                setMeta(null)
                return
            }

            const mod = await articleModules[match.key]()
            setComponent(() => mod.default)
            setMeta(mod.meta)
        }

        loadOne()
    }, [slug, list])

    // ─────────────────────────────────────────────────────────────
    // LIST VIEW
    // ─────────────────────────────────────────────────────────────
    if (!slug) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold my-8">Articles</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((p) => (
                        <NavLink key={p.slug} to={`/articles/${p.slug}`} className="no-underline">
                            <Card className="h-full py-6 flex flex-col gap-2 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold mb-0">{p.title}</h3>
                                <p className="text-sm opacity-60 mt-0">
                                    {new Date(p.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2 flex-grow">
                                    {p.meta.description}
                                </p>
                                <div className="mt-3 text-primary/80 text-sm">Read →</div>
                            </Card>
                        </NavLink>
                    ))}
                </div>
            </div>
        )
    }

    // ─────────────────────────────────────────────────────────────
    // ARTICLE VIEW
    // ─────────────────────────────────────────────────────────────
    return (
        <div className="prose mx-auto p-8 max-w-3xl">
            {meta && (
                <>
                    <ContentHeader
                        title={meta.title}
                        description={meta.description}
                        date={meta.date}
                        tags={meta.tags}
                    />
                </>
            )}

            {Component ? <Component /> : <p>Loading…</p>}
        </div>
    )
}
