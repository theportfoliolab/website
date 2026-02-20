import { TagList } from "./taglist"
import { cn } from "@/lib/utils"

interface ContentHeaderProps {
    title: string
    description: string
    date: string
    tags?: string[]
    className?: string
}

export function ContentHeader({ title, description, date, tags, className }: ContentHeaderProps) {
    return (
        <header className={cn("w-full mb-2xl", className)}>
            <h1 className="font-pageTitle leading-[1.1] my-sm break-words text-[2.4rem] sm:text-[3rem] lg:text-pageTitle">
                {title}
            </h1>
            <p className="text-subheading text-muted-foreground">{description}</p>
            <p className="text-tiny text-muted-foreground">
                Published on {new Date(date).toLocaleDateString()}
            </p>
            {tags?.length ? <TagList tags={tags} /> : null}
        </header>
    )
}

export default ContentHeader