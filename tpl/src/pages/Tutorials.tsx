import { NavLink, useParams } from "react-router-dom"
import { tutorials } from "../tutorials"
import * as React from "react";

export default function Tutorials() {
    const { slug } = useParams<{ slug?: string }>()
    // when tutorials are TSX components we load the component and render it
    const [TutorialComponent, setTutorialComponent] = React.useState<React.ComponentType<any> | null>(null)
    // list holds the available tutorials for the index view with their filenames
    const [list, setList] = React.useState<{ slug: string; title: string }[] | null>(null)

    React.useEffect(() => {
        if (!slug) return

        // Helper: convert a filename (without ext) to kebab-case slug
        const filenameToSlug = (name: string) =>
            name
                // insert dashes between lower->upper boundaries, and between groups of upper followed by lower
                .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
                .replace(/\s+/g, "-")
                .toLowerCase()

        // Find the module key whose filename maps to the requested slug
        const keys = Object.keys(tutorials)
        const matchKey = keys.find((path) => {
            const file = path.replace("./", "").replace(".tsx", "")
            return filenameToSlug(file) === slug
        })

        setTutorialComponent(null)
        if (!matchKey) {
            // no matching file
            return
        }

        const loader = tutorials[matchKey]
        if (!loader) return

        loader()
            .then((mod) => {
                const Comp = (mod && (mod as any).default) ?? mod
                if (Comp && (typeof Comp === "function" || typeof Comp === "object")) {
                    setTutorialComponent(Comp as React.ComponentType<any>)
                } else {
                    setTutorialComponent(null)
                }
            })
            .catch(() => setTutorialComponent(null))
    }, [slug])

    // Load list of tutorials (slug + title) for the index view
    React.useEffect(() => {
        if (slug) return

        const keys = Object.keys(tutorials)
        // For listing we try to load each module to read a static title export if present; otherwise fall back to filename.
        Promise.all(
            keys.map(async (path) => {
                const filename = path.replace("./", "").replace(".tsx", "")
                // convert filename (e.g. DataCleaningTutorial) -> kebab slug (data-cleaning-tutorial)
                const slug = filename
                    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
                    .toLowerCase()
                const loader = tutorials[path]
                if (!loader) return { slug, title: slug.replace(/-/g, " ") }
                try {
                    const mod = await loader()
                    // defensive: mod might be the component itself or a module object
                    const title =
                        ((mod && (mod as any).title) ??
                            (mod && (mod as any).default && (mod as any).default.title) ??
                            // fallback: transform filename into readable title
                            filename.replace(/([A-Z]+)/g, " $1").replace(/[-_]/g, " ").trim()) ||
                        slug.replace(/-/g, " ")
                    return { slug, title }
                } catch {
                    return { slug, title: slug.replace(/-/g, " ") }
                }
            })
        ).then((items) => setList(items))
    }, [slug])

    // Case 1: no slug → list all tutorials
    if (!slug) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Tutorials</h1>
                <ul className="space-y-2">
                    {/* Prefer titles from dynamic list when available */}
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

    // Case 2: slug exists → render tutorial component
    return (
        <div className="prose mx-auto p-8">
            {TutorialComponent ? (
                // Render loaded tutorial component
                React.createElement(TutorialComponent)
            ) : (
                <p>Loading…</p>
            )}
        </div>
    )
}
