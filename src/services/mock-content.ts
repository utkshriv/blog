import { ContentService } from './content';
import { LeetCodeStats, Module, Post } from '@/types';

const MOCK_MODULES: Module[] = [
    {
        slug: 'two-pointers',
        title: 'Two Pointers',
        description: 'Master the art of manipulating arrays with two pointers.',
        content: '# Two Pointers\n\nThis is a fundamental technique for solving array and string problems efficiently by maintaining two indices that move toward each other or in the same direction.',
        problems: [
            {
                id: 'two-sum-ii',
                title: 'Two Sum II',
                link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                difficulty: 'Medium',
                status: 'Due',
                nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
                pseudocode: '1. Set left=0, right=n-1\n2. While left < right:\n   - sum = nums[left] + nums[right]\n   - If sum == target: return [left+1, right+1]\n   - If sum < target: left++\n   - Else: right--'
            },
            {
                id: 'remove-duplicates-from-sorted-array',
                title: 'Remove Duplicates from Sorted Array',
                link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
                difficulty: 'Easy',
                status: 'Review',
                nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                pseudocode: '1. Set slow=1\n2. For fast from 1 to n-1:\n   - If nums[fast] != nums[fast-1]:\n     - nums[slow] = nums[fast]\n     - slow++\n3. Return slow'
            },
            {
                id: '3sum',
                title: '3Sum',
                link: 'https://leetcode.com/problems/3sum/',
                difficulty: 'Medium',
                status: 'New'
            },
            {
                id: 'trapping-rain-water',
                title: 'Trapping Rain Water',
                link: 'https://leetcode.com/problems/trapping-rain-water/',
                difficulty: 'Hard',
                status: 'New',
                pseudocode: '1. left=0, right=n-1, leftMax=0, rightMax=0, water=0\n2. While left < right:\n   - If height[left] <= height[right]:\n     - leftMax = max(leftMax, height[left])\n     - water += leftMax - height[left]\n     - left++\n   - Else:\n     - rightMax = max(rightMax, height[right])\n     - water += rightMax - height[right]\n     - right--\n3. Return water'
            },
            {
                id: 'valid-palindrome',
                title: 'Valid Palindrome',
                link: 'https://leetcode.com/problems/valid-palindrome/',
                difficulty: 'Easy',
                status: 'Review'
            }
        ]
    },
    {
        slug: 'sliding-window',
        title: 'Sliding Window',
        description: 'Efficiently process subarrays and substrings with a moving window.',
        content: '# Sliding Window\n\nA technique to reduce nested loops to O(n) by maintaining a window that expands and contracts as it slides across the input.',
        problems: [
            {
                id: 'best-time-to-buy-and-sell-stock',
                title: 'Best Time to Buy and Sell Stock',
                link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
                difficulty: 'Easy',
                status: 'Review',
                pseudocode: '1. minPrice = Infinity, maxProfit = 0\n2. For each price:\n   - minPrice = min(minPrice, price)\n   - maxProfit = max(maxProfit, price - minPrice)\n3. Return maxProfit'
            },
            {
                id: 'longest-substring-without-repeating-characters',
                title: 'Longest Substring Without Repeating Characters',
                link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
                difficulty: 'Medium',
                status: 'Due',
                nextReview: new Date().toISOString(),
                pseudocode: '1. seen = {}, left = 0, maxLen = 0\n2. For right in range(n):\n   - While s[right] in seen and seen[s[right]] >= left:\n     - left = seen[s[right]] + 1\n   - seen[s[right]] = right\n   - maxLen = max(maxLen, right - left + 1)\n3. Return maxLen'
            },
            {
                id: 'minimum-window-substring',
                title: 'Minimum Window Substring',
                link: 'https://leetcode.com/problems/minimum-window-substring/',
                difficulty: 'Hard',
                status: 'New'
            }
        ]
    },
    {
        slug: 'binary-search',
        title: 'Binary Search',
        description: 'Divide and conquer sorted search spaces to achieve O(log n) lookups.',
        content: '# Binary Search\n\nBinary search eliminates half the search space each iteration. Understand the three templates and when to use each.',
        problems: [
            {
                id: 'binary-search',
                title: 'Binary Search',
                link: 'https://leetcode.com/problems/binary-search/',
                difficulty: 'Easy',
                status: 'Review',
                pseudocode: '1. left=0, right=n-1\n2. While left <= right:\n   - mid = left + (right - left) // 2\n   - If nums[mid] == target: return mid\n   - If nums[mid] < target: left = mid + 1\n   - Else: right = mid - 1\n3. Return -1'
            },
            {
                id: 'find-minimum-in-rotated-sorted-array',
                title: 'Find Minimum in Rotated Sorted Array',
                link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
                difficulty: 'Medium',
                status: 'New'
            },
            {
                id: 'median-of-two-sorted-arrays',
                title: 'Median of Two Sorted Arrays',
                link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
                difficulty: 'Hard',
                status: 'New',
                pseudocode: '1. Ensure nums1 is the shorter array\n2. Binary search on nums1 partition:\n   - halfLen = (m + n + 1) // 2\n   - iMid = (iMin + iMax) // 2\n   - jMid = halfLen - iMid\n3. Check partition validity and return median'
            }
        ]
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

    async getLeetCodeStats(): Promise<LeetCodeStats | null> {
        return { easy: 41, medium: 85, hard: 14, total: 140 };
    }
}
