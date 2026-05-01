import type { MetadataRoute } from 'next';

const SITE_URL = 'https://portfolio-nine-zeta-33.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
