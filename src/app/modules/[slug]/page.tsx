import { getContentService } from '@/services/factory';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { ProblemList } from '@/components/modules/ProblemList';
import styles from './page.module.css';

export async function generateStaticParams() {
    const service = getContentService();
    const modules = await service.getModules();
    return modules.map((module) => ({
        slug: module.slug,
    }));
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = getContentService();
    const module = await service.getModuleBySlug(slug);

    if (!module) {
        notFound();
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
    };

    return (
        <article className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{module.title}</h1>
                <p className={styles.description}>{module.description}</p>
            </header>

            <div className="prose">
                <MDXRemote source={module.content} options={options as any} />
            </div>

            <ProblemList problems={module.problems} />
        </article>
    );
}
