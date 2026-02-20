// src/components/content/postcard.tsx
import { NavLink } from "react-router-dom";
import { Card } from "@/components/ui/card";
import type { PostMeta } from "./types";
import { cn } from "@/lib/utils";

interface PostCardProps {
    meta: PostMeta;
    className?: string;
}

export function PostCard({ meta, className }: PostCardProps) {
    const postUrl = meta.type === "article" ? `/articles/${meta.slug}` : `/tutorials/${meta.slug}`;

    return (
        <NavLink to={postUrl} className="no-underline">
            <Card className={cn("h-full py-6 flex flex-col gap-2 hover:shadow-lg transition-shadow", className)}>
                <h3 className="text-lg font-semibold mb-0">{meta.title}</h3>
                <p className="text-sm opacity-60 mt-0">
                    {meta.type} · {new Date(meta.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mt-2 flex-grow">{meta.description}</p>
                <div className="mt-3 text-primary/80 text-sm">Open →</div>
            </Card>
        </NavLink>
    );
}

export default PostCard;
