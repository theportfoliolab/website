import { NavLink, useParams } from "react-router-dom"
import { Card, CardDescription } from "@/components/ui/card"
import ArticleLayout from "@/components/layout/articlelayout"
import { articlePosts, getArticleBySlug } from "@/content/registry"
import { formatIsoDate } from "@/lib/date"
import NotFound from "./NotFound"

export default function Articles() {
    const { slug } = useParams<{ slug?: string }>()

    if (!slug) {
        return (
            <div className="px-md py-2xl rounded-lg bg-primary-light-bg dark:bg-primary-dark-bg text-primary-light-fg dark:text-primary-dark-fg">
                <h1 className="text-pageTitle font-pageTitle my-8">Articles</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articlePosts.map((post) => (
                        <NavLink
                            key={post.meta.slug}
                            to={`/articles/${post.meta.slug}`}
                            className="no-underline"
                        >
                            <Card className="h-full p-6 flex flex-col gap-2 hover:shadow-lg transition-shadow">
                                <h3 className="text-subheading font-subheading mb-0">{post.meta.title}</h3>
                                <p className="text-tiny font-tiny opacity-60 mt-0">
                                    {formatIsoDate(post.meta.date)}
                                </p>
                                <CardDescription className="text-muted-foreground mt-2 flex-grow">
                                    {post.meta.description}
                                </CardDescription>
                                <div className="mt-3 text-primary/80 text-body">Read -&gt;</div>
                            </Card>
                        </NavLink>
                    ))}
                </div>
            </div>
        )
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
