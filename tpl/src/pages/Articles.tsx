// src/pages/Articles.tsx
import * as React from "react"
import { NavLink, useParams } from "react-router-dom"
import {PageTitle} from "@/components/typography/typography.tsx";
import {Card} from "@/components/ui/card.tsx";

// Dynamically import all article TSX components from src/articles
// Each article should default-export a React component.
// Keys will look like "./SomeArticle.tsx"
const articleModules = import.meta.glob("../articles/*.tsx", { import: "default" }) as Record<
  string,
  () => Promise<React.ComponentType<any>>
>

const toKebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()

export default function Articles() {
  const { slug } = useParams<{ slug?: string }>()
  const [ArticleComponent, setArticleComponent] = React.useState<React.ComponentType<any> | null>(null)
  const [list, setList] = React.useState<{ slug: string; title: string; key: string }[] | null>(null)

  // build the list of available articles from the import map
  React.useEffect(() => {
    const keys = Object.keys(articleModules)
    const items = keys.map((path) => {
      const filename = path.replace("../articles/", "").replace(".tsx", "")
      // public slug: ensure kebab-case and suffix "-article"
      const base = toKebab(filename)
      const slug = base.endsWith("-article") ? base : `${base}-article`
      const title = filename
        .replace(/[-_]/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/\b([a-z])/g, (m) => m.toUpperCase())
      return { slug, title: title.trim(), key: path }
    })
    setList(items)
  }, [])

  // load the selected article component when slug changes
  React.useEffect(() => {
    if (!slug) {
      setArticleComponent(null)
      return
    }

    const keys = Object.keys(articleModules)

    const matchKey = keys.find((path) => {
      const filename = path.replace("../articles/", "").replace(".tsx", "")
      const fileKebab = toKebab(filename)
      const expectedSlug = fileKebab.endsWith("-article") ? fileKebab : `${fileKebab}-article`

      if (expectedSlug === slug) return true
      if (expectedSlug.toLowerCase() === slug.toLowerCase()) return true
      if (fileKebab === toKebab(slug)) return true
      if (fileKebab.includes(toKebab(slug)) || toKebab(slug).includes(fileKebab)) return true
      return false
    })

    if (!matchKey) {
      console.warn("[Articles] no match for slug:", slug)
      setArticleComponent(null)
      return
    }

    const loader = articleModules[matchKey]
    if (!loader) {
      setArticleComponent(null)
      return
    }

    loader()
      .then((mod) => {
        const Comp = (mod && (mod as any).default) ?? mod
        if (Comp && (typeof Comp === "function" || typeof Comp === "object")) {
          setArticleComponent(Comp as React.ComponentType<any>)
        } else {
          console.warn("[Articles] module is not a component:", matchKey, mod)
          setArticleComponent(null)
        }
      })
      .catch((err) => {
        console.error("[Articles] failed to load", matchKey, err)
        setArticleComponent(null)
      })
  }, [slug])

    // Case 1: no slug → show tutorial cards
    if (!slug) {
        return (
            <div className="p-8">
                <PageTitle className="my-8">Articles</PageTitle>
                {list ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.map((t) => (
                            <NavLink key={t.slug} to={`/articles/${t.slug}`} className="no-underline">
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col h-full">
                                        <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
                                        <p className="text-sm text-muted-foreground grow">
                                            {/* optional: show raw filename or description later */}
                                            {t.title}
                                        </p>
                                        <div className="mt-4">
                                            <span className="text-sm text-primary/80">Read →</span>
                                        </div>
                                    </div>
                                </Card>
                            </NavLink>
                        ))}
                    </div>
                ) : (
                    <p>Loading…</p>
                )}
            </div>
        )
    }

    // Case 2: slug exists → render article component (or show not found)
    return (
        <div className="prose mx-auto p-8">
            {ArticleComponent ? (
                <ArticleComponent />
            ) : (
                <div>
                    <h2>Not found</h2>
                    <p>Could not locate an article matching: <strong>{slug}</strong></p>
                    <p>Open the browser console to see attempted keys and loader errors.</p>
                </div>
            )}
        </div>
    )
}