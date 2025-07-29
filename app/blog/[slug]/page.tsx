import { notFound } from 'next/navigation'
import { CustomMDX } from '../_components/mdx'
import { formatDate, getBlogPosts } from '../utils'
import baseUrl from '../../sitemap'
import Link from 'next/link'

const STRINGS = {
  BREADCRUMB: {
    HOME: 'Blog',
  },
  SCHEMA: {
    PERSON_NAME: 'My Portfolio',
  },
} as const

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <section className="container mx-auto px-4 max-w-3xl">
      <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-8">
        <Link href="/blog" className="hover:text-neutral-800 dark:hover:text-neutral-200">
          {STRINGS.BREADCRUMB.HOME}
        </Link>
        <span>/</span>
        <span className="text-neutral-800 dark:text-neutral-200 truncate">
          {post.metadata.title}
        </span>
      </nav>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: STRINGS.SCHEMA.PERSON_NAME,
            },
          }),
        }}
      />
      <h1 className="text-4xl font-bold tracking-tighter mt-16 mb-4">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm text-neutral-600 dark:text-neutral-400">
        <p>{formatDate(post.metadata.publishedAt)}</p>
      </div>
      <article className="prose prose-lg dark:prose-invert 
        prose-headings:font-semibold
        prose-a:text-blue-600 
        prose-p:text-neutral-800 dark:prose-p:text-neutral-200
        prose-li:text-neutral-800 dark:prose-li:text-neutral-200
        prose-img:rounded-lg
        prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-900
        max-w-none">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
