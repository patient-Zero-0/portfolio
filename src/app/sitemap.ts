import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE_URL = 'https://portfolio-nine-zeta-33.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
