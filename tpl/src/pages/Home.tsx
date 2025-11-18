import { Button } from "@/components/ui/button.tsx";
import {PageTitle, Subheading} from "@/components/typography/typography.tsx"
import {NavLink} from "react-router-dom";

export default function Home() {
    // @ts-ignore
    return (
        <div className="w-[50vw] mx-auto py-20">
            <PageTitle className="text-center">Welcome to ThePortfolioLab!</PageTitle>
            <Subheading className="text-center mt-8">Choose a place to start.</Subheading>
            <div className="flex flex-row items-center justify-center gap-4 py-8 md:py-8">
                <Button asChild>
                    <NavLink to={"/articles"}>Articles</NavLink>
                </Button>
                <Button asChild>
                    <NavLink to={"/tutorials"}>Tutorials</NavLink>
                </Button>
            </div>
        </div>
        )
}
