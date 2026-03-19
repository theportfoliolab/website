export interface PostMeta {
    title: string;
    description: string;
    date: string;         // ISO format yyyy-mm-dd
    tags: string[];
    type: "article" | "tutorial";
    slug: string;
    nextInSeriesSlug?: string;
}

export interface Post {
    meta: PostMeta;
    Component: React.ComponentType<any>;
}
