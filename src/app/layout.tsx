import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientShell from '@/components/layout/ClientShell';
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
    'Portfolio of AccEEden — Math & Applied Mathematics student at Jiaying University. ' +
    'Python developer specialising in data engineering, web scraping, and LLM / AI applications. ' +
    'Open to internships and collaborations.',
  keywords: [
    'AccEEden', 'Python developer', 'data engineering', 'web scraping',
    'LLM', 'AI engineering', 'Next.js', 'portfolio', 'Jiaying University',
  ],
  authors: [{ name: 'AccEEden', url: 'https://github.com/patient-Zero-0' }],
  creator: 'AccEEden',
  openGraph: {
    type:        'website',
    url:          SITE_URL,
    siteName:    'AccEEden Portfolio',
    title:       'AccEEden — Python Developer & AI Engineer',
    description:
      'Data engineering · Web scraping · LLM / AI applications · Open to internships.',
    locale: 'en_US',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'AccEEden — Python Developer & AI Engineer',
    description: 'Data engineering · Web scraping · LLM / AI applications · Open to internships.',
    creator:     '@AccEEden',
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-white">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
