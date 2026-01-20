import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/propose', '/_next/', '/assign'], // Keep crawlers out of internal system files
    },
    sitemap: 'https://cadena-two.vercel.app/sitemap.xml',
  }
}
