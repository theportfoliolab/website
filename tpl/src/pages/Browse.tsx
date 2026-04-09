import { NavLink, useSearchParams } from "react-router-dom"
import TagPill from "@/components/content/tagpill"
import { Card, CardDescription } from "@/components/ui/card"
import { Container } from "@/components/layout/pagecontainer"
import {
    filterPosts,
    getBrowsePath,
    getPosts,
    getSeries,
    getTags,
    type ContentType,
} from "@/content/discovery"
import { formatIsoDate } from "@/lib/date"

const TYPE_OPTIONS: Array<{ label: string; value: "all" | ContentType }> = [
    { label: "All", value: "all" },
    { label: "Articles", value: "article" },
    { label: "Tutorials", value: "tutorial" },
]

export default function Browse() {
    const [searchParams, setSearchParams] = useSearchParams()

    const query = searchParams.get("q") ?? ""
    const tag = searchParams.get("tag")
    const typeParam = searchParams.get("type")
    const type =
        typeParam === "article" || typeParam === "tutorial" ? typeParam : undefined

    const posts = getPosts()
    const tags = getTags(posts)
    const filteredPosts = filterPosts(posts, {
        query,
        tag,
        type,
    })
    const visiblePostSlugs = new Set(filteredPosts.map((post) => post.slug))
    const filteredSeries = getSeries(posts)
        .map((series) => ({
            ...series,
            posts: series.posts.filter((post) => visiblePostSlugs.has(post.slug)),
        }))
        .filter((series) => series.posts.length > 0)

    function updateSearchParams(next: {
        q?: string
        tag?: string | null
        type?: "all" | ContentType | null
    }) {
        const path = getBrowsePath({
            query: next.q ?? query,
            tag: next.tag === undefined ? tag : next.tag,
            type: next.type === undefined ? type ?? "all" : next.type,
        })
        const nextSearch = path.includes("?") ? path.split("?")[1] : ""
        setSearchParams(new URLSearchParams(nextSearch))
    }

    return (
        <Container className="py-lg md:py-2xl">
            <section className="flex flex-col gap-md md:gap-lg">
                <div>
                    <p className="text-kicker">Browse</p>
                    <h1 className="text-pageTitle font-pageTitle mt-xs">
                        Find articles and tutorials
                    </h1>
                    <p className="text-body opacity-85 mt-sm max-w-4xl">
                        Search the archive, filter by tag, and move between articles,
                        tutorials, or everything in one place.
                    </p>
                </div>
            </section>

            <section className="mt-2xl md:mt-3xl">
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] gap-xl items-start">
                    <div className="flex flex-col gap-xl">
                        <div className="rounded-lg border border-border p-md md:p-lg">
                            <p className="text-kicker mb-sm">Search and Filter</p>
                            <label htmlFor="browse-search" className="text-tiny block mb-sm">
                                Search the archive
                            </label>
                            <input
                                id="browse-search"
                                type="search"
                                value={query}
                                onChange={(event) => updateSearchParams({ q: event.target.value })}
                                placeholder="Search by title or description"
                                className="w-full rounded-md border border-border bg-background px-md py-sm text-body placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />

                            <div className="mt-md flex flex-wrap gap-xs md:gap-sm">
                                {TYPE_OPTIONS.map((option) => {
                                    const isActive = (type ?? "all") === option.value

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => updateSearchParams({ type: option.value, tag })}
                                            className={`rounded-full border px-sm py-xs text-tiny transition-colors ${
                                                isActive
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-border bg-transparent hover:bg-secondary"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="mt-md flex flex-wrap gap-xs md:gap-sm">
                                {tags.map((currentTag) => {
                                    const isActive = tag === currentTag

                                    return (
                                        <button
                                            key={currentTag}
                                            type="button"
                                            onClick={() =>
                                                updateSearchParams({
                                                    tag: isActive ? null : currentTag,
                                                })
                                            }
                                            className={`rounded-full border px-sm py-xs text-tiny transition-colors ${
                                                isActive
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-border bg-transparent hover:bg-secondary"
                                            }`}
                                        >
                                            {currentTag}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="border-t border-border pt-xl md:pt-2xl">
                            <div className="flex flex-col gap-md md:gap-lg">
                                <div className="flex flex-col gap-xs md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <p className="text-kicker">Results</p>
                                        <h2 className="text-sectionTitle font-sectionTitle mt-xs">
                                            Matching content
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
                                                    {post.tags.map((currentTag) => (
                                                        <TagPill
                                                            key={`${post.slug}-${currentTag}`}
                                                            to={getBrowsePath({
                                                                tag: currentTag,
                                                                type: post.type,
                                                            })}
                                                        >
                                                            {currentTag}
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
                                            Try a broader search or clear some filters to see more content.
                                        </CardDescription>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-md md:gap-lg">
                        <div>
                            <p className="text-kicker">Series</p>
                            <h2 className="text-sectionTitle font-sectionTitle mt-xs">
                                Follow a full sequence
                            </h2>
                            <p className="text-body opacity-80 mt-sm">
                                Browse complete series and move through each part in order.
                            </p>
                        </div>

                        <p className="text-tiny opacity-70">
                            {filteredSeries.length} series
                        </p>

                        {filteredSeries.length > 0 ? (
                            <div className="grid grid-cols-1 gap-md">
                                {filteredSeries.map((series) => (
                                    <Card key={series.id} className="p-6">
                                        <div className="flex flex-col gap-sm">
                                            <div className="flex items-center justify-between gap-sm text-tiny opacity-70">
                                                <span>Series</span>
                                                <span>{series.posts.length} part{series.posts.length === 1 ? "" : "s"}</span>
                                            </div>

                                            <h3 className="text-subheading font-subheading leading-snug">
                                                <NavLink
                                                    to={series.entryPost.href}
                                                    className="no-underline hover:text-primary"
                                                >
                                                    {series.title}
                                                </NavLink>
                                            </h3>

                                            <CardDescription>{series.description}</CardDescription>

                                            <div className="flex flex-wrap gap-xs">
                                                {series.entryPost.tags.map((currentTag) => (
                                                    <TagPill
                                                        key={`${series.id}-${currentTag}`}
                                                        to={getBrowsePath({
                                                            tag: currentTag,
                                                            type: series.entryPost.type,
                                                        })}
                                                    >
                                                        {currentTag}
                                                    </TagPill>
                                                ))}
                                            </div>

                                            <div className="mt-sm flex flex-col gap-sm border-t border-border/40 pt-md">
                                                {series.posts.map((post, index) => (
                                                    <div
                                                        key={post.slug}
                                                        className="flex flex-col gap-xs md:flex-row md:items-baseline md:justify-between"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="text-tiny opacity-70">
                                                                Part {index + 1}
                                                            </p>
                                                            <NavLink
                                                                to={post.href}
                                                                className="text-body no-underline hover:text-primary"
                                                            >
                                                                {post.title}
                                                            </NavLink>
                                                        </div>

                                                        <p className="text-tiny opacity-70 whitespace-nowrap">
                                                            {formatIsoDate(post.date)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-6">
                                <h3 className="text-subheading font-subheading">No matching series</h3>
                                <CardDescription className="mt-sm">
                                    Try a broader search or clear some filters to see more series.
                                </CardDescription>
                            </Card>
                        )}
                    </div>
                </div>
            </section>
        </Container>
    )
}