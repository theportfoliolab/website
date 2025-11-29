import { Button } from "@/components/ui/button.tsx";
import {NavLink} from "react-router-dom";

export default function Home() {
    // @ts-ignore
    return (
        <div className="w-[50vw] mx-auto py-20">
            <h1 className="text-center text-4xl">Welcome to ThePortfolioLab!</h1>
            <h4 className="text-center mt-8">Choose a place to start.</h4>
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
