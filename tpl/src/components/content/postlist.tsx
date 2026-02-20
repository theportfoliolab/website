// src/components/content/postlist.tsx
import type { PostMeta } from "@/components/content/types"
import PostCard from "@/components/content/postcard"
import { cn } from "@/lib/utils"

export default function PostList({
                                     posts,
                                     className,
                                 }: {
    posts: PostMeta[]
    className?: string
}) {
    return (
        <div className={cn("grid grid-cols-1 gap-lg", className)}>
            {posts.map((meta) => (
                <PostCard key={`${meta.type}:${meta.slug}`} meta={meta} />
            ))}
        </div>
    )
}
