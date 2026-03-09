// src/pages/Home.tsx
import * as React from "react"
import { NavLink } from "react-router-dom"
import { Card } from "@/components/ui/card"
import type { PostMeta } from "@/components/content/types"
import TagPill from "@/components/content/tagpill"
import { Container } from "@/components/layout/pagecontainer"

type LoadedPost = {
    key: string
    meta: PostMeta
    href: string
    kindLabel: "article" | "tutorial"
}

// Avoid `any` in module typing
type ContentModule = {
    default: React.ComponentType
    meta: PostMeta
}

const articleModules = import.meta.glob("@/content/articles/*.tsx") as Record<
    string,
    () => Promise<ContentModule>
>

const tutorialModules = import.meta.glob("@/content/tutorials/*.tsx") as Record<
    string,
    () => Promise<ContentModule>
>

function formatDate(date: string) {
    try {
        return new Date(date).toLocaleDateString()
    } catch {
        return date
    }
}

export default function Home() {
    const [featured, setFeatured] = React.useState<LoadedPost[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const load = async () => {
            setLoading(true)

            const posts: LoadedPost[] = []

            for (const [key, loader] of Object.entries(articleModules)) {
                const mod = await loader()
                posts.push({
                    key,
                    meta: mod.meta,
                    href: `/articles/${mod.meta.slug}`,
                    kindLabel: "article",
                })
            }

            for (const [key, loader] of Object.entries(tutorialModules)) {
                const mod = await loader()
                posts.push({
                    key,
                    meta: mod.meta,
                    href: `/tutorials/${mod.meta.slug}`,
                    kindLabel: "tutorial",
                })
            }

            posts.sort((a, b) => (b.meta.date ?? "").localeCompare(a.meta.date ?? ""))

            setFeatured(posts.slice(0, 3))
            setLoading(false)
        }

        // Handle the ignored promise warning + avoid setState after unmount
        let cancelled = false

        load()
            .catch((err) => {
                if (!cancelled) {
                    console.error("Failed to load homepage content:", err)
                    setFeatured([])
                    setLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [])

    return (
        <Container className="py-lg md:py-2xl">
            {/* HERO */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl md:gap-2xl items-start">
                <div className="flex flex-col gap-md md:gap-lg">
                    <div className="flex flex-col gap-xs md:gap-sm">
                        <p className="text-body sm:text-lead font-body italic">
                            Welcome to ThePortfolioLab: Practical experiments in markets, code, and decision making.
                        </p>
                    </div>

                    <p className="text-body font-body opacity-90 max-w-6xl whitespace-pre-line">
                        {`ThePortfolioLab is a collection of quantitative experiments, analytical tools, and practical tutorials at the intersection of finance and programming.

Projects range from strategy backtests and investment analysis to algorithm design and data workflows.

Each piece is built on a simple principle: financial ideas should be tested, measured, and understood, not simply accepted.`}
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-xs sm:gap-sm">
                        <NavLink to="/articles" className="no-underline w-full sm:w-auto">
              <span className="inline-flex w-full sm:w-auto justify-center items-center rounded-md px-md py-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                Browse Articles →
              </span>
                        </NavLink>

                        <NavLink to="/tutorials" className="no-underline w-full sm:w-auto">
              <span className="inline-flex w-full sm:w-auto justify-center items-center rounded-md px-md py-sm bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
                Browse Tutorials →
              </span>
                        </NavLink>
                    </div>

                    <div className="flex flex-wrap gap-xs md:gap-sm pt-xs md:pt-sm">
                        <TagPill>Quant & markets</TagPill>
                        <TagPill>Python</TagPill>
                        <TagPill>Data work</TagPill>
                        <TagPill>Algorithms</TagPill>
                    </div>
                </div>

                {/* FEATURED */}
                <div className="flex flex-col gap-md mt-sm lg:mt-0">
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-sectionTitle font-sectionTitle">Featured</h2>
                        <span className="text-tiny opacity-70">Newest work</span>
                    </div>

                    <div className="grid grid-cols-1 gap-md">
                        {loading ? (
                            <Card className="p-6">
                                <p className="text-body opacity-70">Loading…</p>
                            </Card>
                        ) : (
                            featured.map((p) => (
                                <NavLink key={p.key} to={p.href} className="no-underline">
                                    <Card className="p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-sm mb-sm">
                      <span className="text-tiny opacity-70">
                        {p.kindLabel} · {formatDate(p.meta.date)}
                      </span>
                                        </div>

                                        <h3 className="text-subheading font-subheading leading-snug">
                                            {p.meta.title}
                                        </h3>

                                        <p className="text-body opacity-80 mt-sm">
                                            {p.meta.description}
                                        </p>

                                        <div className="mt-md text-primary/80 text-sm">Open →</div>
                                    </Card>
                                </NavLink>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* VALUE PROPS (borderless, editorial) */}
            <section className="mt-3xl border-t border-border pt-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2xl">
                    <div>
                        <h3 className="text-sectionTitle font-sectionTitle text-[1.6rem]">Reproducible</h3>
                        <p className="text-body opacity-80 mt-sm">
                            Every project is written to be rerun and verified — not just a screenshot.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sectionTitle font-sectionTitle text-[1.6rem]">Practical finance</h3>
                        <p className="text-body opacity-80 mt-sm">
                            Focused on techniques you can actually apply: modeling, backtests, and analytics.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sectionTitle font-sectionTitle text-[1.6rem]">Learn by building</h3>
                        <p className="text-body opacity-80 mt-sm">
                            Tutorials teach the building blocks behind the articles, so you can extend them.
                        </p>
                    </div>
                </div>
            </section>
        </Container>
    )
}
