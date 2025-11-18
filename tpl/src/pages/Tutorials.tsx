// src/pages/Tutorials.tsx
import { NavLink, useParams } from "react-router-dom"
import { tutorials } from "../tutorials"
import * as React from "react";

/**
 * Helpers
 */
const toKebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()

export default function Tutorials() {
    const { slug } = useParams<{ slug?: string }>()
    const [TutorialComponent, setTutorialComponent] = React.useState<React.ComponentType<any> | null>(null)
    const [list, setList] = React.useState<{ slug: string; title: string; key: string }[] | null>(null)

    // Build list of available tutorials (use the raw filename and produce a readable title)
    React.useEffect(() => {
        const keys = Object.keys(tutorials)
        const items = keys.map((path) => {
            const filename = path.replace("./", "").replace(".tsx", "")
            // ensure the public slug always ends with "-tutorial"
            const base = toKebab(filename)
            const slug = base.endsWith("-tutorial") ? base : `${base}-tutorial`
            const title = filename
                // turn kebab/camel/pascal into readable title
                .replace(/[-_]/g, " ")
                .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                .replace(/\b([a-z])/g, (m) => m.toUpperCase())
            return { slug, title: title.trim(), key: path }
        })
        setList(items)
    }, [])

    // Load tutorial component when slug changes
    React.useEffect(() => {
        if (!slug) {
            setTutorialComponent(null)
            return
        }

        const keys = Object.keys(tutorials)

        // Try to find the module key by matching a few variants reliably:
        // - exact filename (e.g. "data-cleaning-tutorial")
        // - filename lowercased
        // - filename kebabified
        // - slug kebabified matches filename kebabified
        const matchKey = keys.find((path) => {
            const filename = path.replace("./", "").replace(".tsx", "")
            const fileKebab = toKebab(filename)
            const expectedSlug = fileKebab.endsWith("-tutorial") ? fileKebab : `${fileKebab}-tutorial`
            if (expectedSlug === slug) return true
            if (expectedSlug.toLowerCase() === slug.toLowerCase()) return true
            if (fileKebab === toKebab(slug)) return true
            // allow slug to be a short form contained within filename (e.g. "data-cleaning")
            if (fileKebab.includes(toKebab(slug)) || toKebab(slug).includes(fileKebab)) return true
            return false
        })

        if (!matchKey) {
            console.warn("[Tutorials] no match for slug:", slug, "available:", keys)
            setTutorialComponent(null)
            return
        }

        const loader = tutorials[matchKey]
        if (!loader) {
            setTutorialComponent(null)
            return
        }

        // Load module; be defensive about mod vs mod.default shapes
        loader()
            .then((mod) => {
                const Comp = (mod && (mod as any).default) ?? mod
                if (Comp && (typeof Comp === "function" || typeof Comp === "object")) {
                    setTutorialComponent(Comp as React.ComponentType<any>)
                } else {
                    console.warn("[Tutorials] module is not a component:", matchKey, mod)
                    setTutorialComponent(null)
                }
            })
            .catch((err) => {
                console.error("[Tutorials] failed to load", matchKey, err)
                setTutorialComponent(null)
            })
    }, [slug])

    // Case 1: no slug → list all tutorials
    if (!slug) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Tutorials</h1>
                <ul className="space-y-2">
                    {list ? (
                        list.map((t) => (
                            <li key={t.slug}>
                                <NavLink to={`/tutorials/${t.slug}`} className="text-blue-600 hover:underline">
                                    {t.title}
                                </NavLink>
                            </li>
                        ))
                    ) : (
                        <li>Loading…</li>
                    )}
                </ul>
            </div>
        )
    }

    // Case 2: slug exists → render tutorial component (or show not found)
    return (
        <div className="prose mx-auto p-8">
            {TutorialComponent ? (
                <TutorialComponent />
            ) : (
                <div>
                    <h2>Not found</h2>
                    <p>Could not locate a tutorial matching: <strong>{slug}</strong></p>
                    <p>Open the browser console to see attempted keys and loader errors.</p>
                </div>
            )}
        </div>
    )
}