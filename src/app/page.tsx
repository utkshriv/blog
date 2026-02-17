import Image from 'next/image'
import { SocialLinks } from '@/components/SocialLinks'
import styles from './home.module.css'

export default function Home() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left Pane - Content */}
        <div className={styles.leftPane}>
          {/* Hero Section */}
          <div className={styles.hero}>
            <h1 className={styles.name}>Utkarsh</h1>
            <h2 className={styles.mainTitle}>Full Stack</h2>
            <h2 className={styles.mainTitle}>Developer</h2>
            <p className={styles.bio}>
              I love creating products that solve real problems.
              Passionate about data structures, algorithms, and building scalable systems.
            </p>
          </div>

          {/* Social Links */}
          <SocialLinks />
        </div>

        {/* Right Pane - Caricature with Blob */}
        <div className={styles.rightPane}>
          <div className={styles.blobContainer}>
            <div className={styles.blob}></div>
            <Image
              src="/caricature.png"
              alt="Utkarsh - Developer Caricature"
              width={500}
              height={500}
              className={styles.caricature}
              priority
            />
          </div>
        </div>
      </div>


    </section>
  )
}
