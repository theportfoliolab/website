import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..")
const distDir = path.join(projectRoot, "dist")
const ssrEntryPath = path.join(projectRoot, "dist-ssr", "entry-server.js")

const { render, prerenderRoutes, notFoundRoute } = await import(pathToFileURL(ssrEntryPath).href)
const template = await fs.readFile(path.join(distDir, "index.html"), "utf8")

function escapeAttribute(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
}

function injectTemplate(html, route) {
    const robots = route.robots ?? "index, follow"
    return template
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
        .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
        .replace(
            /<meta name="description" content=".*?" \/>/,
            `<meta name="description" content="${escapeAttribute(route.description)}" />`
        )
        .replace(
            /<link rel="canonical" href=".*?" \/>/,
            `<link rel="canonical" href="${escapeAttribute(route.canonicalUrl)}" />`
        )
        .replace(
            /<meta name="robots" content=".*?" \/>/,
            `<meta name="robots" content="${robots}" />`
        )
        .replace(
            /<meta property="og:title" content=".*?" \/>/,
            `<meta property="og:title" content="${escapeAttribute(route.title)}" />`
        )
        .replace(
            /<meta property="og:description" content=".*?" \/>/,
            `<meta property="og:description" content="${escapeAttribute(route.description)}" />`
        )
        .replace(
            /<meta property="og:url" content=".*?" \/>/,
            `<meta property="og:url" content="${escapeAttribute(route.canonicalUrl)}" />`
        )
        .replace(
            /<meta name="twitter:title" content=".*?" \/>/,
            `<meta name="twitter:title" content="${escapeAttribute(route.title)}" />`
        )
        .replace(
            /<meta name="twitter:description" content=".*?" \/>/,
            `<meta name="twitter:description" content="${escapeAttribute(route.description)}" />`
        )
}

async function writeRoute(route) {
    const html = injectTemplate(render(route.path), route)

    if (route.path === "/") {
        await fs.writeFile(path.join(distDir, "index.html"), html)
        return
    }

    const routeDir = path.join(distDir, route.path.replace(/^\//, ""))
    await fs.mkdir(routeDir, { recursive: true })
    await fs.writeFile(path.join(routeDir, "index.html"), html)
}

for (const route of prerenderRoutes) {
    await writeRoute(route)
}

const notFoundHtml = injectTemplate(render(notFoundRoute.path), notFoundRoute)
await fs.writeFile(path.join(distDir, "404.html"), notFoundHtml)

const sitemapEntries = prerenderRoutes
    .map((route) => {
        const lastmod = route.lastModified ? `\n    <lastmod>${route.lastModified}</lastmod>` : ""
        return `  <url>\n    <loc>${route.canonicalUrl}</loc>${lastmod}\n  </url>`
    })
    .join("\n")

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`

await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemapXml)
