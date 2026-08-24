import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { PORTFOLIO_DATA } from '@/data/portfolioData';
import { ThemeProvider } from '@/context/ThemeContext';
import {
  getPersonSchema,
  getOrganizationSchema,
  getFaqSchema,
  getWebsiteSchema,
  getProfilePageSchema,
  getServicesSchema,
} from '@/lib/seo';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dharmikrathod.com'),
  title: {
    default: 'DR.Developer | Dharmik Rathod | Software Engineer & Full Stack MERN Developer',
    template: '%s | DR.Developer',
  },
  description:
    'DR.Developer (Dharmik Rathod) is a professional Software Engineer and MERN Stack Developer specializing in React, Node.js, Express, MongoDB, scalable web applications, modern UI/UX, API development, and cloud deployment. Available for freelance and full-time opportunities worldwide.',
  keywords: [
    // Primary Keywords
    'Software Engineer Portfolio',
    'Full Stack Developer',
    'MERN Stack Developer',
    'React Developer',
    'Node.js Developer',
    'JavaScript Developer',
    'Web Developer',
    'Portfolio Website',
    'Freelance Software Engineer',
    'Website Developer',
    // Local SEO Keywords
    'Software Engineer in Ahmedabad',
    'Full Stack Developer Ahmedabad',
    'Web Developer Surat',
    'MERN Developer Vadodara',
    'React Developer Mumbai',
    'Node.js Developer Delhi',
    'Software Engineer Bangalore',
    'Web Application Developer India',
    // International Keywords
    'Software Engineer USA',
    'Full Stack Developer UK',
    'Remote MERN Developer Canada',
    'React Developer Australia',
    'Web Developer Dubai',
    'Full Stack Developer Singapore',
    'Software Engineer Germany',
    'Remote Web Developer Worldwide',
    // High-Ranking SEO Keywords
    'Software Engineer',
    'Express.js Developer',
    'MongoDB Developer',
    'Web Application Developer',
    'Frontend Developer',
    'Backend Developer',
    'API Developer',
    'SaaS Developer',
    'Custom Software Developer',
    'Responsive Website Developer',
    'Portfolio Website Developer',
    'Remote Full Stack Developer',
    'Hire Software Engineer',
    'Hire MERN Developer',
    'Hire React Developer',
    'Software Engineer Ahmedabad',
    'Web Developer Ahmedabad',
    'Software Engineer Surat',
    'MERN Developer Mumbai',
    'React Developer Delhi',
    'Software Engineer Bangalore',
    'Software Engineer London',
    'Software Engineer New York',
    'Software Engineer Toronto',
    'Software Engineer Dubai',
    'Software Engineer Singapore',
    'Software Engineer Sydney',
    'Software Engineer Berlin',
    'Remote Software Engineer'
  ],
  authors: [{ name: 'Dharmik Rathod', url: 'https://dharmikrathod.com' }],
  creator: 'Dharmik Rathod',
  publisher: 'Dharmik Rathod',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://dharmikrathod.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dharmikrathod.com',
    title: 'DR.Developer | Dharmik Rathod | Software Engineer & Full Stack MERN Developer',
    description: PORTFOLIO_DATA.personalInfo.bio,
    siteName: 'DR.Developer Portfolio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'DR.Developer - Dharmik Rathod - Software Engineer & MERN Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DR.Developer | Dharmik Rathod | Software Engineer & Full Stack MERN Developer',
    description: PORTFOLIO_DATA.personalInfo.bio,
    creator: '@dharmik_rathod',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import ClientShell from '@/components/ClientShell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personSchema = getPersonSchema();
  const orgSchema = getOrganizationSchema();
  const faqSchema = getFaqSchema();
  const websiteSchema = getWebsiteSchema();
  const profileSchema = getProfilePageSchema();
  const servicesSchema = getServicesSchema();

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
        />
      </head>
      <body className="font-sans bg-dark-bg text-customText-primary">
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
