import { PORTFOLIO_DATA } from '@/data/portfolioData';

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://dharmikrathod.com/#person',
    name: 'DR.Developer (Dharmik Rathod)',
    jobTitle: 'Software Engineer | MERN Stack Developer | Full Stack Web Developer',
    url: 'https://dharmikrathod.com',
    email: `mailto:${PORTFOLIO_DATA.personalInfo.email}`,
    telephone: PORTFOLIO_DATA.personalInfo.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ahmedabad',
      addressRegion: 'Gujarat',
      addressCountry: 'India'
    },
    sameAs: [
      PORTFOLIO_DATA.personalInfo.github,
      PORTFOLIO_DATA.personalInfo.linkedin,
      PORTFOLIO_DATA.personalInfo.twitter
    ],
    knowsAbout: [
      'Software Engineering',
      'Full Stack Development',
      'MERN Stack',
      'React.js',
      'Next.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'JavaScript',
      'TypeScript',
      'REST APIs',
      'Web Application Development',
      'Website Performance Optimization'
    ],
    description: PORTFOLIO_DATA.personalInfo.bio
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://dharmikrathod.com/#organization',
    name: 'DR.Developer Digital Solutions',
    url: 'https://dharmikrathod.com',
    logo: 'https://dharmikrathod.com/logo.png',
    founder: {
      '@type': 'Person',
      name: 'DR.Developer (Dharmik Rathod)'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ahmedabad',
      addressRegion: 'Gujarat',
      addressCountry: 'India'
    },
    sameAs: [
      PORTFOLIO_DATA.personalInfo.linkedin,
      PORTFOLIO_DATA.personalInfo.github
    ]
  };
}

export function getFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: PORTFOLIO_DATA.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://dharmikrathod.com/#website',
    url: 'https://dharmikrathod.com',
    name: 'Dharmik Rathod | Software Engineer | MERN Stack Developer | Full Stack Web Developer',
    description: PORTFOLIO_DATA.personalInfo.bio,
    publisher: {
      '@id': 'https://dharmikrathod.com/#person'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://dharmikrathod.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function getProfilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateCreated: '2024-01-01T00:00:00+05:30',
    dateModified: '2026-07-29T22:00:00+05:30',
    mainEntity: {
      '@id': 'https://dharmikrathod.com/#person'
    }
  };
}

export function getServicesSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: PORTFOLIO_DATA.services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.title,
        description: service.fullDesc,
        provider: {
          '@id': 'https://dharmikrathod.com/#person'
        }
      }
    }))
  };
}
