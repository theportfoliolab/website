import PostCard from "@/components/content/postcard"
import type { PostMeta } from "@/components/content/types"
import { allPosts, getPostBySlug } from "@/content/registry"

type FooterCard = {
    label: string
    meta: PostMeta
}

function hashString(value: string) {
    let hash = 0

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0
    }

    return hash
}

function buildFooterCards(currentPost: PostMeta): FooterCard[] {
    const usedSlugs = new Set<string>([currentPost.slug])
    const cards: FooterCard[] = []

    const pushCard = (label: string, meta?: PostMeta | null) => {
        if (!meta || usedSlugs.has(meta.slug)) {
            return false
        }

        usedSlugs.add(meta.slug)
        cards.push({ label, meta })
        return true
    }

    pushCard("Next in series", getPostBySlug(currentPost.nextInSeriesSlug ?? "")?.meta)

    const latestPost = allPosts.find((post) => !usedSlugs.has(post.meta.slug))
    pushCard("Latest post", latestPost?.meta)

    const remainingPosts = allPosts.filter((post) => !usedSlugs.has(post.meta.slug))
    if (remainingPosts.length > 0) {
        const index = hashString(currentPost.slug) % remainingPosts.length
        pushCard("Random post", remainingPosts[index]?.meta)
    }

    if (cards.length < 3) {
        for (const post of allPosts) {
            if (cards.length >= 3) {
                break
            }
            pushCard(cards.length === 0 ? "Next in series" : `More to read`, post.meta)
        }
    }

    return cards.slice(0, 3)
}

export default function SeriesFooter({ currentPost }: { currentPost: PostMeta }) {
    const cards = buildFooterCards(currentPost)

    if (cards.length === 0) {
        return null
    }

    return (
        <section className="mt-2xl border-t border-secondary-light-fg/20 pt-xl dark:border-secondary-dark-fg/20">
            <h2 className="mb-lg text-sectionTitle font-sectionTitle">Continue reading</h2>
            <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
                {cards.map(({ label, meta }) => (
                    <div key={`${label}:${meta.slug}`} className="flex h-full flex-col gap-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
                            {label}
                        </p>
                        <PostCard meta={meta} className="h-full" />
                    </div>
                ))}
            </div>
        </section>
    )
}
