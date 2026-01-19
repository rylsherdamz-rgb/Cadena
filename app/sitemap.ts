import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cadena-ml7gqzvo1-rylsherdamzs-projects.vercel.app'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/cadena`, // Your "Get Started" / Onboarding path
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/game`, // Fiscal Protocol / National Budget
      lastModified: new Date(),
      changeFrequency: 'always', // Since this is a "live" ledger
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vote`, // Voting_Node / Governance
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/message`, // P2P / Handshake
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about-us`, // The Protocol / Documentation
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}