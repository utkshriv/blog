import Link from 'next/link'
import { getContentService } from '@/services/factory'
import LeetCodeTracker from '@/components/LeetCodeTracker'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MatrixBackground } from '@/components/ui/MatrixBackground'
import styles from './page.module.css'

export default async function Home() {
  const service = getContentService()
  const posts = await service.getDailyLogs()

  return (
    <section style={{ position: 'relative', zIndex: 1 }}>
      <MatrixBackground />
      <div className={styles.hero}>
        <h1 className="text-gradient">
          The Redemption Arc
        </h1>
        <p>
          Documenting the journey from rejection to mastery.
          Solving problems, building systems, and proving them wrong.
        </p>
        <LeetCodeTracker />
      </div>

      <h2 className={styles.sectionTitle}>
        Log Entries
      </h2>

      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} passHref style={{ display: 'contents' }}>
            <Card hoverEffect>
              <div className={styles.postDate}>
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h3 className={styles.postTitle}>
                {post.title}
              </h3>
              <p className={styles.postExcerpt}>
                {post.excerpt}
              </p>
              <div className={styles.tags}>
                {post.tags.map(tag => (
                  <Badge key={tag} variant="default">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
