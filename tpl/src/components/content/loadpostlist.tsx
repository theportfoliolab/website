// src/content/loadPostList.ts
import type * as React from "react"
import type { PostMeta } from "@/components/content/types"

export type PostModule = () => Promise<{
    default: React.ComponentType<any>
    meta: PostMeta
}>

export async function loadPostList(
    modules: Record<string, PostModule>
): Promise<Array<{ key: string; meta: PostMeta }>> {
    const entries: Array<{ key: string; meta: PostMeta }> = []

    for (const [key, loader] of Object.entries(modules)) {
        const mod = await loader()
        entries.push({ key, meta: mod.meta })
    }

    // Newest → Oldest (ISO string sort)
    entries.sort((a, b) => b.meta.date.localeCompare(a.meta.date))

    return entries
}
