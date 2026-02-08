import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import LeetCodeTracker from '@/components/LeetCodeTracker'

export default function Home() {
  const posts = getAllPosts()

  return (
    <section>
      <div className="hero">
        <h1 className="text-gradient">
          The Redemption Arc
        </h1>
        <p>
          Documenting the journey from rejection to mastery.
          Solving problems, building systems, and proving them wrong.
        </p>
        <LeetCodeTracker />
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
        Log Entries
      </h2>

      <div className="posts-grid">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="card">
            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {post.title}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {post.excerpt}
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.75rem', background: '#222', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#ccc' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
