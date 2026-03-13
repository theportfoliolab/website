// src/pages/Tutorials.tsx
import * as React from "react"
import { NavLink, useParams } from "react-router-dom"
import { Card, CardDescription } from "@/components/ui/card"
import type { PostMeta } from "@/components/content/types"

// ✅ use the same layout as articles
import ArticleLayout from "@/components/layout/articlelayout"

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
            const entries: { slug: string; title: string; date: string; key: string; meta: PostMeta }[] =
                []

            for (const [key, loader] of Object.entries(tutorialModules)) {
                const mod = await loader()
                entries.push({
                    key,
                    slug: mod.meta.slug,
                    title: mod.meta.title,
                    date: mod.meta.date,
                    meta: mod.meta,
                })
            }

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
            <div className="px-md py-2xl rounded-lg bg-primary-light-bg dark:bg-primary-dark-bg text-primary-light-fg dark:text-primary-dark-fg">
                <h1 className="text-pageTitle font-pageTitle my-8">Tutorials</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {list.map((p) => (
                        <NavLink key={p.slug} to={`/tutorials/${p.slug}`} className="no-underline">
                            <Card className="h-full p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow">
                                <h3 className="text-subheading font-subheading mb-0">{p.title}</h3>
                                <p className="text-tiny font-tiny opacity-60 mt-0">{new Date(p.date).toLocaleDateString()}</p>
                                <CardDescription className="text-muted-foreground mt-2 flex-grow">
                                    {p.meta.description}
                                </CardDescription>
                                <div className="mt-3 text-primary/80 text-body">Read →</div>
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
    if (!meta) {
        return (
            <main className="mx-auto w-full max-w-6xl px-md py-2xl rounded-lg bg-primary-light-bg dark:bg-primary-dark-bg text-primary-light-fg dark:text-primary-dark-fg">
                <p>Loading…</p>
            </main>
        )
    }

    return <ArticleLayout meta={meta}>{Component ? <Component /> : <p>Loading…</p>}</ArticleLayout>
}
