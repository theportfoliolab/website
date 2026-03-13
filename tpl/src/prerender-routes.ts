import { articlePosts, tutorialPosts } from "@/content/registry"
import { siteConfig } from "@/lib/site"

export type PrerenderRoute = {
    path: string
    title: string
    description: string
    canonicalUrl: string
    robots?: string
    lastModified?: string
}

const siteName = siteConfig.name

function withCanonical(route: Omit<PrerenderRoute, "canonicalUrl">): PrerenderRoute {
    return {
        ...route,
        canonicalUrl: `${siteConfig.url}${route.path === "/" ? "" : route.path}`,
    }
}

const staticRoutes: PrerenderRoute[] = [
    withCanonical({
        path: "/",
        title: siteConfig.defaultTitle,
        description: siteConfig.defaultDescription,
    }),
    withCanonical({
        path: "/about",
        title: `About | ${siteName}`,
        description:
            "Learn about The Portfolio Lab, its focus on quantitative finance, programming, and practical analysis.",
    }),
    withCanonical({
        path: "/contact",
        title: `Contact | ${siteName}`,
        description: "Get in touch with The Portfolio Lab.",
    }),
    withCanonical({
        path: "/articles",
        title: `Articles | ${siteName}`,
        description:
            "Browse articles on quantitative finance, markets, algorithms, time series analysis, and Python.",
    }),
    withCanonical({
        path: "/tutorials",
        title: `Tutorials | ${siteName}`,
        description:
            "Browse Python tutorials on data analysis, pandas, regex, and practical programming workflows.",
    }),
]

const articleRoutes = articlePosts.map((post) =>
    withCanonical({
        path: `/articles/${post.meta.slug}`,
        title: `${post.meta.title} | ${siteName}`,
        description: post.meta.description,
        lastModified: post.meta.date,
    })
)

const tutorialRoutes = tutorialPosts.map((post) =>
    withCanonical({
        path: `/tutorials/${post.meta.slug}`,
        title: `${post.meta.title} | ${siteName}`,
        description: post.meta.description,
        lastModified: post.meta.date,
    })
)

export const prerenderRoutes = [...staticRoutes, ...articleRoutes, ...tutorialRoutes]

export const notFoundRoute: PrerenderRoute = withCanonical({
    path: "/404",
    title: `Page Not Found | ${siteName}`,
    description: "The page you requested could not be found.",
    robots: "noindex, nofollow",
})

export function findRouteMetadata(pathname: string) {
    return prerenderRoutes.find((route) => route.path === pathname) ?? null
}
