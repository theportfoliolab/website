import { useState } from "react"
import { NavLink } from "react-router-dom"
import TagPill from "@/components/content/tagpill"
import { Button } from "@/components/ui/button"
import { Card, CardDescription } from "@/components/ui/card"
import {
    filterPosts,
    getHomepageDiscovery,
    getPosts,
    getTags,
    type DiscoveryEntry,
} from "@/content/discovery"
import { Container } from "@/components/layout/pagecontainer"
import { formatIsoDate } from "@/lib/date"
import { getBrowsePath } from "@/content/discovery"

function getDiscoveryLabel(entry: DiscoveryEntry) {
    if (entry.kind === "series") {
        return "Series"
    }

    if (entry.post.homepageClass === "off-topic") {
        return "Off topic"
    }

    return entry.post.type === "tutorial" ? "Tutorial" : "Article"
}

function getDiscoveryLinkText(entry: DiscoveryEntry) {
    return entry.kind === "series" ? "Open series ->" : `Open ${entry.post.type} ->`
}

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    const posts = getPosts()
    const discovery = getHomepageDiscovery(posts)
    const tags = getTags(posts)
    const filteredPosts = filterPosts(posts, {
        query: searchTerm,
        tag: selectedTag,
    })

    return (
        <Container className="py-lg md:py-2xl">
            <section className="flex flex-col gap-lg md:gap-xl">
                <p className="text-kicker">ThePortfolioLab</p>

                <div className="max-w-4xl flex flex-col gap-sm md:gap-md">
                    <h1 className="text-pageTitle font-pageTitle">
                        Practical finance, Python, and portfolio analysis.
                    </h1>

                    <p className="text-body opacity-90">
                        Tutorials, articles, and small research projects focused on
                        practical portfolio analysis. Each piece is built to be followed,
                        tested, and extended.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-sm">
                    <Button asChild className="h-auto min-h-12 px-lg py-sm text-center whitespace-normal leading-snug">
                        <NavLink to={getBrowsePath({ type: "tutorial" })}>Start with Tutorials</NavLink>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="h-auto min-h-12 px-lg py-sm text-center whitespace-normal leading-snug"
                    >
                        <NavLink to={getBrowsePath({ type: "article" })}>Browse All Articles</NavLink>
                    </Button>
                </div>
            </section>

            <section className="mt-2xl md:mt-3xl">
                <div className="flex flex-col gap-sm md:gap-md">
                    <div>
                        <p className="text-kicker">Discovery</p>
                        <h2 className="text-sectionTitle font-sectionTitle mt-xs">
                            Selected Works
                        </h2>
                        <p className="text-body opacity-80 mt-sm max-w-4xl">
                            Recent work, core tutorials, and side projects.
                            Each piece is a good place to start, depending on what you want
                            to explore.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                        {discovery.entries.map((entry) => (
                            <Card key={entry.id} className="h-full p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between gap-sm text-tiny opacity-70">
                                    <span>{getDiscoveryLabel(entry)}</span>
                                    <span>{formatIsoDate(entry.post.date)}</span>
                                </div>

                                <h3 className="text-subheading font-subheading leading-snug mt-sm">
                                    <NavLink to={entry.href} className="no-underline hover:text-primary">
                                        {entry.title}
                                    </NavLink>
                                </h3>

                                <CardDescription className="mt-sm">
                                    {entry.description}
                                </CardDescription>

                                <div className="mt-md flex flex-wrap gap-xs">
                                    {entry.post.tags.slice(0, 4).map((tag) => (
                                        <TagPill
                                            key={`${entry.id}-${tag}`}
                                            to={getBrowsePath({ tag, type: entry.post.type })}
                                        >
                                            {tag}
                                        </TagPill>
                                    ))}
                                </div>

                                <div className="mt-md text-primary/80 text-sm">
                                    <NavLink to={entry.href} className="no-underline hover:text-primary">
                                        {getDiscoveryLinkText(entry)}
                                    </NavLink>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mt-2xl md:mt-3xl">
                <div className="flex flex-col gap-md md:gap-lg">
                    <div className="flex flex-col gap-sm">
                        <p className="text-kicker">Search and Filter</p>
                        <div className="flex flex-col gap-xs">
                            <h2 className="text-sectionTitle font-sectionTitle">
                                Find the right piece quickly
                            </h2>
                            <p className="text-body opacity-80 max-w-4xl">
                                Search by title or description, or narrow the list using
                                tags. Results update immediately as you refine your input.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border p-md md:p-lg">
                        <label htmlFor="homepage-search" className="text-tiny block mb-sm">
                            Search articles and tutorials
                        </label>
                        <input
                            id="homepage-search"
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search by title or description"
                            className="w-full rounded-md border border-border bg-background px-md py-sm text-body placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />

                        <div className="mt-md flex flex-wrap gap-xs md:gap-sm">
                            {tags.map((tag) => {
                                const isActive = selectedTag === tag

                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() =>
                                            setSelectedTag((currentTag) =>
                                                currentTag === tag ? null : tag
                                            )
                                        }
                                        className={`rounded-full border px-sm py-xs text-tiny transition-colors ${
                                            isActive
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-transparent hover:bg-secondary"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-2xl md:mt-3xl border-t border-border pt-xl md:pt-2xl">
                <div className="flex flex-col gap-md md:gap-lg">
                    <div className="flex flex-col gap-xs md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-kicker">All Content</p>
                            <h2 className="text-sectionTitle font-sectionTitle mt-xs">
                                Articles and tutorials
                            </h2>
                        </div>

                        <p className="text-tiny opacity-70">
                            {filteredPosts.length} result{filteredPosts.length === 1 ? "" : "s"}
                        </p>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                            {filteredPosts.map((post) => (
                                <Card key={post.key} className="h-full p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between gap-sm text-tiny opacity-70">
                                        <span className="capitalize">
                                            {post.homepageClass === "off-topic"
                                                ? "Off topic"
                                                : post.type}
                                        </span>
                                        <span>{formatIsoDate(post.date)}</span>
                                    </div>

                                    <h3 className="text-subheading font-subheading leading-snug mt-sm">
                                        <NavLink to={post.href} className="no-underline hover:text-primary">
                                            {post.title}
                                        </NavLink>
                                    </h3>

                                    <CardDescription className="mt-sm">
                                        {post.description}
                                    </CardDescription>

                                    <div className="mt-md flex flex-wrap gap-xs">
                                        {post.tags.map((tag) => (
                                            <TagPill
                                                key={`${post.slug}-${tag}`}
                                                to={getBrowsePath({ tag, type: post.type })}
                                            >
                                                {tag}
                                            </TagPill>
                                        ))}
                                    </div>

                                    <div className="mt-md text-primary/80 text-sm">
                                        <NavLink to={post.href} className="no-underline hover:text-primary">
                                            Open {post.type} -&gt;
                                        </NavLink>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-6">
                            <h3 className="text-subheading font-subheading">No matching posts</h3>
                            <CardDescription className="mt-sm">
                                Try a broader search or clear the filters to see more content.
                            </CardDescription>
                        </Card>
                    )}
                </div>
            </section>
        </Container>
    )
}