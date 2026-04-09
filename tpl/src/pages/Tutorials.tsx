import { useParams } from "react-router-dom"
import ArticleLayout from "@/components/layout/articlelayout"
import { getTutorialBySlug } from "@/content/registry"
import NotFound from "./NotFound"

export default function Tutorials() {
    const { slug } = useParams<{ slug?: string }>()
    if (!slug) {
        return <NotFound />
    }

    const tutorial = getTutorialBySlug(slug)
    if (!tutorial) {
        return <NotFound />
    }
    const Component = tutorial.Component

    return (
        <ArticleLayout meta={tutorial.meta}>
            <Component />
        </ArticleLayout>
    )
}
