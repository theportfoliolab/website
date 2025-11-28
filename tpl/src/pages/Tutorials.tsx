// src/pages/Tutorials.tsx

import * as React from "react"
import { NavLink, useParams } from "react-router-dom"
import { PageTitle } from "@/components/typography/typography"
import { Card } from "@/components/ui/card"
import type { PostMeta } from "@/components/content/types"

// Import tutorial TSX files + metadata
const tutorialModules = import.meta.glob("@/content/tutorials/*.tsx") as Record<
    string,
    () => Promise<{ default: React.ComponentType<any>; meta: PostMeta }>
>

export default function Tutorials() {
    const { slug } = useParams<{ slug?: string }>()

    const [list, setList] = React.useState<
        { slug: string; title: string; date: string; key: string; meta: PostMeta }[]
    >([])
    const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
    const [meta, setMeta] = React.useState<PostMeta | null>(null)

    // ─────────────────────────────────────────────────────────────
    // Load all tutorial metadata
    // ─────────────────────────────────────────────────────────────
    React.useEffect(() => {
        const loadAll = async () => {
            const entries: {
                slug: string
                title: string
                date: string
                key: string
                meta: PostMeta
            }[] = []

            for (const [key, loader] of Object.entries(tutorialModules)) {
                const mod = await loader()
                entries.push({
                    key,
                    slug: mod.meta.slug,
                    title: mod.meta.title,
                    date: mod.meta.date,
                    meta: mod.meta
                })
            }

            // Sort by date descending
            entries.sort((a, b) => b.date.localeCompare(a.date))

            setList(entries)
        }

        loadAll()
    }, [])

    // ─────────────────────────────────────────────────────────────
    // Load a single tutorial when slug changes
    // ─────────────────────────────────────────────────────────────
    React.useEffect(() => {
        if (!slug) {
            setComponent(null)
            setMeta(null)
            return
        }

        const loadOne = async () => {
            const match = list.find((p) => p.slug === slug)

            if (!match) {
                setComponent(null)
                setMeta(null)
                return
            }

            const mod = await tutorialModules[match.key]()
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
                <PageTitle className="my-8">Tutorials</PageTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((p) => (
                        <NavLink key={p.slug} to={`/tutorials/${p.slug}`} className="no-underline">
                            <Card className="h-full p-4 flex flex-col hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold">{p.title}</h3>
                                <p className="text-xs opacity-60">
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
    // TUTORIAL VIEW
    // ─────────────────────────────────────────────────────────────
    return (
        <div className="prose mx-auto p-8 max-w-4xl">
            {meta && (
                <header className="mb-10">
                    <h1 className="text-4xl font-bold">{meta.title}</h1>
                    <p className="text-muted-foreground">{meta.description}</p>
                    <p className="text-sm opacity-60 mt-1">
                        {new Date(meta.date).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2 mt-3">
                        {meta.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-secondary rounded text-xs"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>
            )}

            {Component ? <Component /> : <p>Loading…</p>}
        </div>
    )
}
