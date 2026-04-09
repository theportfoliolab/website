import { allPosts, articlePosts, tutorialPosts, type PostRecord } from "@/content/registry"

export type ContentType = "article" | "tutorial"

export type ContentPost = {
    key: string
    title: string
    description: string
    date: string
    tags: string[]
    type: ContentType
    slug: string
    href: string
    nextInSeriesSlug?: string
    seriesId?: string
    seriesEntry: boolean
    seriesTitle?: string
    seriesDescription?: string
    homepageClass?: "off-topic"
    homepagePriority: number
}

export type ContentSeries = {
    id: string
    title: string
    description?: string
    entryPost: ContentPost
    posts: ContentPost[]
}

export type DiscoveryEntry =
    | {
          kind: "series"
          id: string
          title: string
          description: string
          href: string
          post: ContentPost
          series: ContentSeries
      }
    | {
          kind: "post"
          id: string
          title: string
          description: string
          href: string
          post: ContentPost
      }

type PostsOptions = {
    type?: ContentType
}

type FilterOptions = {
    query?: string
    tag?: string | null
    type?: ContentType
}

type BrowseParams = {
    query?: string
    tag?: string | null
    type?: ContentType | "all" | null
}

type HomepageDiscovery = {
    entries: DiscoveryEntry[]
}

const PRIORITY_DAY_WEIGHT = 45

function getPostHref(type: ContentType, slug: string) {
    return type === "article" ? `/articles/${slug}` : `/tutorials/${slug}`
}

function normalisePost(post: PostRecord): ContentPost {
    return {
        key: post.key,
        title: post.meta.title,
        description: post.meta.description,
        date: post.meta.date,
        tags: post.meta.tags,
        type: post.meta.type,
        slug: post.meta.slug,
        href: getPostHref(post.meta.type, post.meta.slug),
        nextInSeriesSlug: post.meta.nextInSeriesSlug,
        seriesId: post.meta.seriesId,
        seriesEntry: post.meta.seriesEntry ?? false,
        seriesTitle: post.meta.seriesTitle,
        seriesDescription: post.meta.seriesDescription,
        homepageClass: post.meta.homepageClass,
        homepagePriority: post.meta.homepagePriority ?? 0,
    }
}

function getSourcePosts(type?: ContentType) {
    if (type === "article") {
        return articlePosts
    }

    if (type === "tutorial") {
        return tutorialPosts
    }

    return allPosts
}

function getPriorityScore(post: ContentPost) {
    const dateScore = Date.parse(`${post.date}T00:00:00Z`)
    const priorityBoost = post.homepagePriority * PRIORITY_DAY_WEIGHT * 24 * 60 * 60 * 1000
    return dateScore + priorityBoost
}

function sortByDiscoveryPriority(posts: ContentPost[]) {
    return [...posts].sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
}

function pickFirstUnused(entries: DiscoveryEntry[], usedIds: Set<string>) {
    return entries.find((entry) => !usedIds.has(entry.id)) ?? null
}

export function getPosts(options: PostsOptions = {}) {
    return sortByDiscoveryPriority(getSourcePosts(options.type).map(normalisePost))
}

export function getTags(posts: ContentPost[] = getPosts()) {
    return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) =>
        a.localeCompare(b)
    )
}

export function filterPosts(posts: ContentPost[] = getPosts(), options: FilterOptions = {}) {
    const query = options.query?.trim().toLowerCase() ?? ""
    const filtered = posts.filter((post) => {
        if (options.type && post.type !== options.type) {
            return false
        }

        const matchesQuery =
            query.length === 0 ||
            post.title.toLowerCase().includes(query) ||
            post.description.toLowerCase().includes(query)

        const matchesTag = !options.tag || post.tags.includes(options.tag)

        return matchesQuery && matchesTag
    })

    if (!options.tag) {
        return filtered
    }

    return [...filtered].sort(
        (a, b) => a.tags.indexOf(options.tag as string) - b.tags.indexOf(options.tag as string)
    )
}

export function getSeries(posts: ContentPost[] = getPosts()) {
    const grouped = new Map<string, ContentPost[]>()

    for (const post of posts) {
        if (!post.seriesId) {
            continue
        }

        const seriesPosts = grouped.get(post.seriesId) ?? []
        seriesPosts.push(post)
        grouped.set(post.seriesId, seriesPosts)
    }

    return Array.from(grouped.entries())
        .map(([id, seriesPosts]) => {
            const orderedPosts = [...seriesPosts].sort((a, b) => a.date.localeCompare(b.date))
            const entryPost =
                orderedPosts.find((post) => post.seriesEntry) ??
                [...orderedPosts].sort((a, b) => getPriorityScore(b) - getPriorityScore(a))[0]

            return {
                id,
                title: entryPost.seriesTitle ?? entryPost.title,
                description: entryPost.seriesDescription ?? entryPost.description,
                entryPost,
                posts: orderedPosts,
            } satisfies ContentSeries
        })
        .sort((a, b) => getPriorityScore(b.entryPost) - getPriorityScore(a.entryPost))
}

export function getHomepageDiscovery(posts: ContentPost[] = getPosts()): HomepageDiscovery {
    const series = getSeries(posts)
    const seriesById = new Map(series.map((item) => [item.id, item]))

    const seriesEntries: DiscoveryEntry[] = series.map((series) => ({
        kind: "series",
        id: `series:${series.id}`,
        title: series.title,
        description: series.description ?? series.entryPost.description,
        href: series.entryPost.href,
        post: series.entryPost,
        series,
    }))

    const standaloneTutorials: DiscoveryEntry[] = getPosts({ type: "tutorial" })
        .filter((post) => !post.seriesId)
        .map((post) => ({
            kind: "post",
            id: `post:${post.slug}`,
            title: post.title,
            description: post.description,
            href: post.href,
            post,
        }))

    const articles: DiscoveryEntry[] = getPosts({ type: "article" })
        .filter((post) => post.homepageClass !== "off-topic")
        .map((post) => ({
            kind: "post",
            id: `post:${post.slug}`,
            title: post.title,
            description: post.description,
            href: post.href,
            post,
        }))

    const offTopic: DiscoveryEntry[] = getPosts()
        .filter((post) => post.homepageClass === "off-topic")
        .map((post) => ({
            kind: "post",
            id: `post:${post.slug}`,
            title: post.title,
            description: post.description,
            href: post.href,
            post,
        }))

    const mixedPool = sortByDiscoveryPriority(
        posts.filter((post) => post.seriesEntry || !post.seriesId)
    ).map((post) => {
        const series = post.seriesId ? seriesById.get(post.seriesId) ?? null : null

        if (series && series.entryPost.slug === post.slug) {
            return {
                kind: "series",
                id: `series:${series.id}`,
                title: series.title,
                description: series.description ?? series.entryPost.description,
                href: series.entryPost.href,
                post: series.entryPost,
                series,
            } satisfies DiscoveryEntry
        }

        return {
            kind: "post",
            id: `post:${post.slug}`,
            title: post.title,
            description: post.description,
            href: post.href,
            post,
        } satisfies DiscoveryEntry
    })

    const usedIds = new Set<string>()
    const entries: DiscoveryEntry[] = []

    for (const bucket of [seriesEntries, standaloneTutorials, articles, offTopic]) {
        const picked = pickFirstUnused(bucket, usedIds)
        if (!picked) {
            continue
        }

        entries.push(picked)
        usedIds.add(picked.id)
    }

    for (const candidate of mixedPool) {
        if (entries.length >= 4) {
            break
        }

        if (usedIds.has(candidate.id)) {
            continue
        }

        entries.push(candidate)
        usedIds.add(candidate.id)
    }

    return {
        entries: entries.slice(0, 4),
    }
}

export function getBrowsePath(params: BrowseParams = {}) {
    const searchParams = new URLSearchParams()

    if (params.query?.trim()) {
        searchParams.set("q", params.query.trim())
    }

    if (params.tag) {
        searchParams.set("tag", params.tag)
    }

    if (params.type && params.type !== "all") {
        searchParams.set("type", params.type)
    }

    const queryString = searchParams.toString()
    return queryString ? `/browse?${queryString}` : "/browse"
}
