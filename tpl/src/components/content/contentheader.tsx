import { TagList } from "./taglist"
import { cn } from "@/lib/utils"
import { formatIsoDate } from "@/lib/date"

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
            <h1 className="font-pageTitle leading-[1.1] my-sm break-words text-[2.4rem] sm:text-[3rem] lg:text-pageTitle text-primary-light-fg dark:text-primary-dark-fg">
                {title}
            </h1>
            <p className="text-subheading text-secondary-light-fg dark:text-secondary-dark-fg">{description}</p>
            <p className="text-tiny text-secondary-light-fg dark:text-secondary-dark-fg">
                Published on {formatIsoDate(date)}
            </p>
            {tags?.length ? <TagList tags={tags} /> : null}
        </header>
    )
}

export default ContentHeader
