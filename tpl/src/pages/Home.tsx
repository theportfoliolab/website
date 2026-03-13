import { NavLink } from "react-router-dom"
import { Card, CardDescription } from "@/components/ui/card"
import TagPill from "@/components/content/tagpill"
import { Container } from "@/components/layout/pagecontainer"
import { allPosts } from "@/content/registry"
import { formatIsoDate } from "@/lib/date"

export default function Home() {
    const featured = allPosts.slice(0, 3).map((post) => ({
        key: post.key,
        meta: post.meta,
        href: post.meta.type === "article" ? `/articles/${post.meta.slug}` : `/tutorials/${post.meta.slug}`,
        kindLabel: post.meta.type,
    }))

    return (
        <Container className="py-lg md:py-2xl">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl md:gap-2xl items-start">
                <div className="flex flex-col gap-md md:gap-lg">
                    <div className="flex flex-col gap-xs md:gap-sm">
                        <p className="text-body sm:text-lead font-body italic">
                            Welcome to ThePortfolioLab: Practical experiments in markets, code, and decision making.
                        </p>
                    </div>

                    <p className="text-body font-body opacity-90 max-w-6xl whitespace-pre-line">
                        {`ThePortfolioLab is a collection of quantitative experiments, analytical tools, and practical tutorials at the intersection of finance and programming.

Projects range from strategy backtests and investment analysis to algorithm design and data workflows.

Each piece is built on a simple principle: financial ideas should be tested, measured, and understood, not simply accepted.`}
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-xs sm:gap-sm">
                        <NavLink to="/articles" className="no-underline w-full sm:w-auto">
                            <span className="inline-flex w-full sm:w-auto justify-center items-center rounded-md px-md py-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                                Browse Articles -&gt;
                            </span>
                        </NavLink>

                        <NavLink to="/tutorials" className="no-underline w-full sm:w-auto">
                            <span className="inline-flex w-full sm:w-auto justify-center items-center rounded-md px-md py-sm bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity">
                                Browse Tutorials -&gt;
                            </span>
                        </NavLink>
                    </div>

                    <div className="flex flex-wrap gap-xs md:gap-sm pt-xs md:pt-sm">
                        <TagPill>Quant & markets</TagPill>
                        <TagPill>Python</TagPill>
                        <TagPill>Data work</TagPill>
                        <TagPill>Algorithms</TagPill>
                    </div>
                </div>

                <div className="flex flex-col gap-md mt-sm lg:mt-0">
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-sectionTitle font-sectionTitle">Featured</h2>
                        <span className="text-tiny opacity-70">Newest work</span>
                    </div>

                    <div className="grid grid-cols-1 gap-md">
                        {featured.map((post) => (
                            <NavLink key={post.key} to={post.href} className="no-underline">
                                <Card className="p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-sm mb-sm">
                                        <span className="text-tiny opacity-70">
                                            {post.kindLabel} | {formatIsoDate(post.meta.date)}
                                        </span>
                                    </div>

                                    <h3 className="text-subheading font-subheading leading-snug">
                                        {post.meta.title}
                                    </h3>

                                    <CardDescription className="mt-sm">
                                        {post.meta.description}
                                    </CardDescription>

                                    <div className="mt-md text-primary/80 text-sm">Open -&gt;</div>
                                </Card>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mt-3xl border-t border-border pt-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2xl">
                    <div>
                        <h3 className="text-sectionTitle font-sectionTitle text-[1.6rem]">Reproducible</h3>
                        <p className="text-body opacity-80 mt-sm">
                            Every project is written to be rerun and verified, not just a screenshot.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sectionTitle font-sectionTitle text-[1.6rem]">Practical finance</h3>
                        <p className="text-body opacity-80 mt-sm">
                            Focused on techniques you can actually apply: modeling, backtests, and analytics.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sectionTitle font-sectionTitle text-[1.6rem]">Learn by building</h3>
                        <p className="text-body opacity-80 mt-sm">
                            Tutorials teach the building blocks behind the articles, so you can extend them.
                        </p>
                    </div>
                </div>
            </section>
        </Container>
    )
}
