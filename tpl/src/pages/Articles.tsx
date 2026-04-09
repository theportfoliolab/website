import { useParams } from "react-router-dom"
import ArticleLayout from "@/components/layout/articlelayout"
import { getArticleBySlug } from "@/content/registry"
import NotFound from "./NotFound"

export default function Articles() {
    const { slug } = useParams<{ slug?: string }>()
    if (!slug) {
        return <NotFound />
    }

    const article = getArticleBySlug(slug)
    if (!article) {
        return <NotFound />
    }
    const Component = article.Component

    return (
        <ArticleLayout meta={article.meta}>
            <Component />
        </ArticleLayout>
    )
}
