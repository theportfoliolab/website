import { NavLink } from "react-router-dom"
import aboutImg from "@/assets/about-image.jpg"

export default function About() {
    return (
        <div className="w-[50vw] mx-auto py-12">

            {/* Header */}
            <h1 className="text-4xl font-bold mb-8">About</h1>

            {/* Two-column layout */}
            <div className="flex flex-row gap-10 items-start max-md:flex-col">

                {/* Left column — text */}
                <div className="flex-1 space-y-4 leading-relaxed text-gray-800">
                    <p>
                        ThePortfolioLab is a personal blog built to explore quantitative thinking, algorithmic trading,
                        investment analysis, and applied programming. This website brings
                        together tutorials, articles, and tools that reflect real world
                        experimentation and practical insights.
                    </p>

                    <p>
                        My goal is to shed light on the reality of computer assisted investment. The articles
                        therein are a reflection of my personal opinions and experiences on the topic. To summarise,
                        I am sympathise more with the principles of traditional passive investment, however, I am not
                        convinced that we operate in the strong form of the efficient market hypothesis, and that
                        with careful and deliberate practice, some abnormal returns are possible. However, expectations must be tempered.
                    </p>

                    <p>
                        I therefore aim to showcase my background in computer science and finance with a
                        hands-on engineering mindset to create clear, actionable educational
                        content on the topic, so that others might learn, agree with, or challenge my ideas.
                    </p>

                    <p>
                        I live in New Zealand, and in my spare time I enjoy working on my classic BMW, land based fishing, film photography, and music.
                    </p>
                </div>

                {/* Right column — image */}
                <div className="w-[350px] max-md:w-full max-md:mx-auto">
                    <img
                        src={aboutImg}
                        alt="About illustration"
                        className="rounded-lg shadow-md w-full object-cover"
                    />
                </div>
            </div>

            {/* Contact button */}
            <div className="mt-10">
                <NavLink
                    to="/contact"
                    className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                    Contact Me
                </NavLink>
            </div>
        </div>
    );
}
