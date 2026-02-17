'use client'

import { Github, Linkedin, Mail, User, Send, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import styles from './SocialLinks.module.css'

export function SocialLinks() {
  return (
    <div className={styles.socialContainer}>

      <div className={styles.platformIcons}>
        <Link
          href="https://github.com/utkshriv"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={styles.platformLink}
        >
          <Github size={18} />
        </Link>
        <Link
          href="https://www.linkedin.com/in/utkarsh-shrivastav"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={styles.platformLink}
        >
          <Linkedin size={18} />
        </Link>
      </div>
    </div>
  )
}
