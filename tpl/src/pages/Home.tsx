// src/pages/Home.tsx
import * as React from "react"
import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { PostMeta } from "@/components/content/types"
import { loadPostList, type PostModule } from "@/components/content/loadpostlist"

// Import all article components + metadata
const articleModules = import.meta.glob("@/content/articles/*.tsx") as Record<string, PostModule>

// Import all tutorial components + metadata
const tutorialModules = import.meta.glob("@/content/tutorials/*.tsx") as Record<string, PostModule>

function postUrl(meta: PostMeta) {
    return meta.type === "article" ? `/articles/${meta.slug}` : `/tutorials/${meta.slug}`
}

export default function Home() {
    const [latest, setLatest] = React.useState<Array<{ key: string; meta: PostMeta }>>([])

    React.useEffect(() => {
        const load = async () => {
            const [articles, tutorials] = await Promise.all([
                loadPostList(articleModules),
                loadPostList(tutorialModules)
            ])

            const merged = [...articles, ...tutorials]
                .sort((a, b) => b.meta.date.localeCompare(a.meta.date))
                .slice(0, 3)

            setLatest(merged)
        }

        load()
    }, [])

    return (
        <div className="w-[50vw] mx-auto py-20">
            <h1 className="text-center text-4xl">Welcome to ThePortfolioLab!</h1>
            <h4 className="text-center mt-8">Choose a place to start.</h4>

            <div className="flex flex-row items-center justify-center gap-4 py-8 md:py-8">
                <Button asChild>
                    <NavLink to={"/articles"}>Articles</NavLink>
                </Button>
                <Button asChild>
                    <NavLink to={"/tutorials"}>Tutorials</NavLink>
                </Button>
            </div>

            {/* Latest content */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Latest</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {latest.map(({ meta }) => (
                        <NavLink
                            key={`${meta.type}:${meta.slug}`}
                            to={postUrl(meta)}
                            className="no-underline"
                        >
                            <Card className="h-full py-6 flex flex-col gap-2 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold mb-0">{meta.title}</h3>

                                <p className="text-sm opacity-60 mt-0">
                                    {meta.type} · {new Date(meta.date).toLocaleDateString()}
                                </p>

                                <p className="text-sm text-muted-foreground mt-2 flex-grow">
                                    {meta.description}
                                </p>

                                <div className="mt-3 text-primary/80 text-sm">Open →</div>
                            </Card>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    )
}
