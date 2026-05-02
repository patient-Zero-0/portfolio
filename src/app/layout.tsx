import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientShell from '@/components/layout/ClientShell';
import { CONTACT_EMAIL, GITHUB_URL } from '@/lib/contact';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = 'https://portfolio-nine-zeta-33.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AccEEden — Python Developer & AI Engineer',
    template: '%s | AccEEden',
  },
  description:
    'Portfolio of AccEEden — Math & Applied Mathematics student. ' +
    'Python developer specialising in data engineering, web scraping, and LLM / AI applications. ' +
    'Open to internships and collaborations.',
  keywords: [
    'AccEEden', 'Python developer', 'data engineering', 'web scraping',
    'LLM', 'AI engineering', 'Next.js', 'portfolio', 'Math Applied Mathematics',
  ],
  authors: [{ name: 'AccEEden', url: 'https://github.com/patient-Zero-0' }],
  creator: 'AccEEden',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type:        'website',
    url:          SITE_URL,
    siteName:    'AccEEden Portfolio',
    title:       'AccEEden — Python Developer & AI Engineer',
    description:
      'Data engineering · Web scraping · LLM / AI applications · Open to internships.',
    locale:      'en_US',
    images: [{
      url:    `${SITE_URL}/opengraph-image`,
      width:   1200,
      height:  630,
      alt:    'AccEEden — Python Developer & AI Engineer',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'AccEEden — Python Developer & AI Engineer',
    description: 'Data engineering · Web scraping · LLM / AI applications · Open to internships.',
    creator:     '@AccEEden',
    images:     [`${SITE_URL}/opengraph-image`],
  },
  robots: {
    index:  true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Person',
  name:        'AccEEden',
  url:          SITE_URL,
  email:        CONTACT_EMAIL,
  sameAs:      [GITHUB_URL],
  jobTitle:    'Python Developer & AI Engineer',
  description: 'Math & Applied Mathematics student. Python developer specialising in data engineering, web scraping, and LLM / AI applications.',
  knowsAbout:  ['Python', 'Data Engineering', 'Web Scraping', 'LLM', 'AI Engineering', 'Next.js', 'TypeScript'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-white">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
