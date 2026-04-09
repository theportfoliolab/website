export interface PostMeta {
    title: string;
    description: string;
    date: string;         // ISO format yyyy-mm-dd
    tags: string[];
    type: "article" | "tutorial";
    slug: string;
    nextInSeriesSlug?: string;
    seriesId?: string;
    seriesEntry?: boolean;
    seriesTitle?: string;
    seriesDescription?: string;
    homepageClass?: "off-topic";
    homepagePriority?: number;
}

export interface Post {
    meta: PostMeta;
    Component: React.ComponentType<any>;
}
