import { cn } from "@/lib/utils"
import TagPill from "./tagpill"
import { getBrowsePath } from "@/content/discovery"

interface TagListProps {
    tags: string[]
    className?: string
}

export function TagList({ tags, className }: TagListProps) {
    return (
        <div className={cn("flex flex-wrap gap-sm", className)}>
            {tags.map(tag => (
                <TagPill key={tag} to={getBrowsePath({ tag })}>{tag}</TagPill>
            ))}
        </div>
    )
}

export default TagList
