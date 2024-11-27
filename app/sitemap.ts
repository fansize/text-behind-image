import { getBlogPosts } from './blog/utils'

const baseUrl = 'https://textbehindimage.site'

export default async function sitemap() {
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/app`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]

    const blogPosts = getBlogPosts().map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.metadata.publishedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
    }))

    return [...staticRoutes, ...blogPosts]
}