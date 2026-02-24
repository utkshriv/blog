export interface Post {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    content: string; // MDX content
    readingTime?: string;
}

export interface Problem {
    id: string;
    title: string;
    link: string;
    difficulty: "Easy" | "Medium" | "Hard";
    lastSolved?: string; // ISO Date
    nextReview?: string; // ISO Date
    status?: "New" | "Due" | "Review";
    pseudocode?: string;
}

export interface Module {
    slug: string;
    title: string;
    description: string;
    content: string; // MDX content for the concept
    problems: Problem[];
}

export interface LeetCodeStats {
    easy: number;
    medium: number;
    hard: number;
    total: number;
    syncedAt?: string;
}
