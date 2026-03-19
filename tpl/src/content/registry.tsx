import type * as React from "react"
import type { PostMeta } from "@/components/content/types"

type ContentModule = {
    default: React.ComponentType
    meta: PostMeta
}

export type PostRecord = {
    key: string
    meta: PostMeta
    Component: React.ComponentType
}

const articleModules = import.meta.glob("@/content/articles/*.tsx", {
    eager: true,
}) as Record<string, ContentModule>

const tutorialModules = import.meta.glob("@/content/tutorials/*.tsx", {
    eager: true,
}) as Record<string, ContentModule>

function toPostRecords(modules: Record<string, ContentModule>) {
    return Object.entries(modules)
        .map(([key, mod]) => ({
            key,
            meta: mod.meta,
            Component: mod.default,
        }))
        .sort((a, b) => b.meta.date.localeCompare(a.meta.date))
}

export const articlePosts = toPostRecords(articleModules)
export const tutorialPosts = toPostRecords(tutorialModules)
export const allPosts = [...articlePosts, ...tutorialPosts].sort((a, b) =>
    b.meta.date.localeCompare(a.meta.date)
)

export function getPostBySlug(slug: string) {
    return allPosts.find((post) => post.meta.slug === slug) ?? null
}

export function getArticleBySlug(slug: string) {
    return articlePosts.find((post) => post.meta.slug === slug) ?? null
}

export function getTutorialBySlug(slug: string) {
    return tutorialPosts.find((post) => post.meta.slug === slug) ?? null
}
