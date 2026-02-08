import { Module, Post } from '@/types';

export interface ContentService {
    getDailyLogs(): Promise<Post[]>;
    getModules(): Promise<Module[]>;
    getModuleBySlug(slug: string): Promise<Module | null>;
    getPostBySlug(slug: string): Promise<Post | null>;
}
