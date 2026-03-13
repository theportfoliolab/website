import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { findRouteMetadata, notFoundRoute } from "@/prerender-routes"

export function DocumentMetadata() {
    const location = useLocation()

    useEffect(() => {
        const route = findRouteMetadata(location.pathname) ?? notFoundRoute
        document.title = route.title

        const description = document.querySelector('meta[name="description"]')
        if (description) {
            description.setAttribute("content", route.description)
        }

        const canonical = document.querySelector('link[rel="canonical"]')
        if (canonical) {
            canonical.setAttribute("href", route.canonicalUrl)
        }

        const robots = document.querySelector('meta[name="robots"]')
        if (robots) {
            robots.setAttribute("content", route.robots ?? "index, follow")
        }

        const ogTitle = document.querySelector('meta[property="og:title"]')
        if (ogTitle) {
            ogTitle.setAttribute("content", route.title)
        }

        const ogDescription = document.querySelector('meta[property="og:description"]')
        if (ogDescription) {
            ogDescription.setAttribute("content", route.description)
        }

        const ogUrl = document.querySelector('meta[property="og:url"]')
        if (ogUrl) {
            ogUrl.setAttribute("content", route.canonicalUrl)
        }

        const twitterTitle = document.querySelector('meta[name="twitter:title"]')
        if (twitterTitle) {
            twitterTitle.setAttribute("content", route.title)
        }

        const twitterDescription = document.querySelector('meta[name="twitter:description"]')
        if (twitterDescription) {
            twitterDescription.setAttribute("content", route.description)
        }
    }, [location.pathname])

    return null
}
