import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export async function generateStaticParams() {
    const posts = getAllPosts()
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h1>Post not found</h1>
                <p>The requested battle log entry does not exist.</p>
            </div>
        )
    }

    const options = {
        mdxOptions: {
            rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                [rehypePrettyCode, {
                    theme: 'github-dark',
                    keepBackground: true,
                }],
            ],
        },
    }

    return (
        <article className="container" style={{ maxWidth: '800px', padding: '4rem 0' }}>
            <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: '1.2' }}>
                    {post.title}
                </h1>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
                    <time>{new Date(post.date).toLocaleDateString()}</time>
                    <span>•</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {post.tags.map(tag => <span key={tag} style={{ color: 'var(--primary)' }}>#{tag}</span>)}
                    </div>
                </div>
            </header>
            <div className="prose">
                <MDXRemote source={post.content} options={options as any} />
            </div>
        </article>
    )
}
