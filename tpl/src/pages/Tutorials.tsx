// src/pages/Tutorials.tsx
import { NavLink, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { tutorials } from "../tutorials"
import * as React from "react";

export default function Tutorials() {
    const { slug } = useParams<{ slug?: string }>()
    const [content, setContent] = React.useState("")

    React.useEffect(() => {
        if (slug) {
            const key = `./${slug}.md`
            const loader = tutorials[key]
            if (loader) {
                loader().then(mod => setContent((mod && (mod as any).default) ?? mod))
            } else {
                setContent("# Not Found\nThis tutorial doesn’t exist.")
            }
        }
    }, [slug])

    // Case 1: no slug → list all tutorials
    if (!slug) {
        const list = Object.keys(tutorials).map(path => {
            const slug = path.replace("./", "").replace(".md", "")
            return { slug, title: slug.replace(/-/g, " ") }
        })

        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Tutorials</h1>
                <ul className="space-y-2">
                    {list.map(t => (
                        <li key={t.slug}>
                            <NavLink to={`/tutorials/${t.slug}`} className="text-blue-600 hover:underline">
                                {t.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    // Case 2: slug exists → render markdown
    return (
        <div className="prose mx-auto p-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    )
}