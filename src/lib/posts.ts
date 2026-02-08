import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export interface Post {
    slug: string
    title: string
    date: string // ISO string
    excerpt: string
    tags: string[]
    content: string
}

export function getAllPosts(): Post[] {
    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
        return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".mdx" or ".md" from file name to get slug
        const slug = fileName.replace(/\.mdx?$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        return {
            slug,
            title: matterResult.data.title || 'Untitled',
            date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : new Date().toISOString(),
            excerpt: matterResult.data.excerpt || '',
            tags: matterResult.data.tags || [],
            content: matterResult.content,
        } as Post
    })

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getPostBySlug(slug: string): Post | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`)
        // Check if file exists, if not try .md
        let fileContents = ''
        if (fs.existsSync(fullPath)) {
            fileContents = fs.readFileSync(fullPath, 'utf8')
        } else {
            const fullPathMd = path.join(postsDirectory, `${slug}.md`)
            if (fs.existsSync(fullPathMd)) {
                fileContents = fs.readFileSync(fullPathMd, 'utf8')
            } else {
                return null
            }
        }

        const matterResult = matter(fileContents)

        return {
            slug,
            title: matterResult.data.title,
            date: matterResult.data.date ? new Date(matterResult.data.date).toISOString() : new Date().toISOString(),
            excerpt: matterResult.data.excerpt || '',
            tags: matterResult.data.tags || [],
            content: matterResult.content,
        } as Post
    } catch (e) {
        return null
    }
}
