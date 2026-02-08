import { ContentService } from './content';
import { Module, Post } from '@/types';

const MOCK_MODULES: Module[] = [
    {
        slug: 'two-pointers',
        title: 'Two Pointers',
        description: 'Master the art of manipulating arrays with two pointers.',
        content: '# Two Pointers\n\nThis is a fundamental technique...',
        problems: [
            {
                id: '167',
                title: 'Two Sum II',
                link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                difficulty: 'Medium',
                status: 'Due',
                nextReview: new Date().toISOString()
            },
            {
                id: '15',
                title: '3Sum',
                link: 'https://leetcode.com/problems/3sum/',
                difficulty: 'Medium',
                status: 'New'
            }
        ]
    },
    {
        slug: 'sliding-window',
        title: 'Sliding Window',
        description: 'Efficiently process subarrays and substrings.',
        content: '# Sliding Window\n\nIntroduction to fixed and variable windows...',
        problems: []
    }
];

export class MockContentService implements ContentService {
    async getDailyLogs(): Promise<Post[]> {
        return [
            {
                slug: 'hello-world',
                title: 'Hello World: The Redemption Begins',
                date: '2026-02-07',
                excerpt: 'Why I\'m starting this journey and what \'botthef\' means.',
                tags: ['redemption', 'intro'],
                content: '# Hello World\n\nThis is the start of my redemption arc...'
            }
        ];
    }

    async getModules(): Promise<Module[]> {
        return MOCK_MODULES;
    }

    async getModuleBySlug(slug: string): Promise<Module | null> {
        return MOCK_MODULES.find(m => m.slug === slug) || null;
    }

    async getPostBySlug(slug: string): Promise<Post | null> {
        // Mock post for now
        if (slug === 'hello-world') {
            return {
                slug: 'hello-world',
                title: 'Hello World: The Redemption Begins',
                date: '2026-02-07',
                excerpt: 'Why I\'m starting this journey...',
                tags: ['redemption', 'intro'],
                content: '# Hello World\n\nMock content...'
            };
        }
        return null;
    }
}
