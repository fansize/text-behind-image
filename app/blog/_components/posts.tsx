import Link from 'next/link'
import { formatDate, getBlogPosts } from '../utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row gap-1 md:gap-8">
              <p className="text-neutral-900 dark:text-neutral-100 font-semibold tracking-tight">
                {post.metadata.title}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 min-w-[100px] shrink-0 tabular-nums whitespace-nowrap">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}
