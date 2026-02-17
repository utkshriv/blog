import Link from 'next/link'
import { getContentService } from '@/services/factory'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BlogPostAnimation } from '@/components/ui/BlogPostAnimation'
import styles from './page.module.css'

export const metadata = {
  title: 'Blog // botthef',
  description: 'Thoughts, learnings, and documentation of my journey.',
}

export default async function BlogPage() {
  const service = getContentService()
  const posts = await service.getDailyLogs()

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left Pane - Blog content */}
        <div className={styles.leftPane}>
          <div className={styles.hero}>
            <h1 className="text-gradient">Blog</h1>
            <p className={styles.subtitle}>
              Thoughts, learnings, and documentation of my journey
            </p>
          </div>

          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} passHref style={{ display: 'contents' }}>
                <Card hoverEffect>
                  <div className={styles.postDate}>
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <div className={styles.tags}>
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="default">#{tag}</Badge>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Pane - Blog post animation */}
        <div className={styles.rightPane}>
          <BlogPostAnimation />
        </div>
      </div>
    </section>
  )
}
