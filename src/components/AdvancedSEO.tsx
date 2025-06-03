import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  keywords?: string[];
  structuredData?: any;
}

export const AdvancedSEO: React.FC<SEOProps> = ({
  title = "Ilyes Abbas - AI & Data Science Student | C++ Developer",
  description = "First-year student at ENSIA Algeria, passionate about AI, data science, and efficient software development. Explore my projects in C++, Qt development, and more.",
  image = "/assets/logo.jpg",
  url = "https://ilyes-portfolio.vercel.app",
  type = "website",
  author = "Ilyes Abbas",
  keywords = ["AI", "Data Science", "C++", "Qt", "Software Development", "Algeria", "ENSIA", "Student Portfolio"],
  structuredData
}) => {
  const fullTitle = title.includes("Ilyes Abbas") ? title : `${title} | Ilyes Abbas`;
  const canonicalUrl = url;
  const imageUrl = image.startsWith('http') ? image : `${url}${image}`;

  // Default structured data for person/developer
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ilyes Abbas",
    "jobTitle": "AI & Data Science Student",
    "description": description,
    "url": url,
    "image": imageUrl,
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "National School of Artificial Intelligence (ENSIA)",
      "location": "Algeria"
    },
    "knowsAbout": ["Artificial Intelligence", "Data Science", "C++", "Qt Framework", "Software Development"],
    "sameAs": [
      "https://github.com/ilyyeees",
      "https://www.linkedin.com/in/ilyes-abbas-077660320/",
      "https://www.instagram.com/il.y.s/"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Ilyes Abbas Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@ilyes_abbas" />
      
      {/* Additional Meta Tags for Better SEO */}
      <meta name="theme-color" content="#ff6b35" />
      <meta name="msapplication-TileColor" content="#ff6b35" />
      <meta name="application-name" content="Ilyes Abbas Portfolio" />
      
      {/* Language and Geographic */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="DZ" />
      <meta name="geo.country" content="Algeria" />
      
      {/* Performance and Security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//github.com" />
      <link rel="dns-prefetch" href="//linkedin.com" />
      <link rel="dns-prefetch" href="//instagram.com" />
    </Helmet>
  );
};

// Specific SEO components for different pages
export const HomeSEO: React.FC = () => (
  <AdvancedSEO
    title="Ilyes Abbas - AI & Data Science Student | Portfolio"
    description="Welcome to my portfolio! I'm a first-year AI & Data Science student at ENSIA Algeria, passionate about C++ development, Qt frameworks, and innovative software solutions."
    keywords={["Portfolio", "AI Student", "Data Science", "C++", "Qt", "Algeria", "ENSIA", "Software Developer"]}
  />
);

export const ProjectsSEO: React.FC = () => (
  <AdvancedSEO
    title="Projects - Ilyes Abbas"
    description="Explore my software development projects including IYS Searcher (C++ file search tool), Library Management System, and Discord bots. See my technical skills in action."
    keywords={["Projects", "C++", "Qt", "File Search", "Library Management", "Discord Bot", "Software Development"]}
    type="website"
  />
);

export const AboutSEO: React.FC = () => (
  <AdvancedSEO
    title="About - Ilyes Abbas"
    description="Learn more about my journey as an AI & Data Science student at ENSIA Algeria. Discover my academic background, interests, and passion for technology."
    keywords={["About", "AI Student", "ENSIA", "Algeria", "Academic Background", "Technology"]}
    type="profile"
  />
);

export const ContactSEO: React.FC = () => (
  <AdvancedSEO
    title="Contact - Ilyes Abbas"
    description="Get in touch with me! Connect via GitHub, LinkedIn, Instagram, or email. I'm always open to collaborations and discussions about AI, programming, and technology."
    keywords={["Contact", "Collaboration", "GitHub", "LinkedIn", "Email", "Networking"]}
    type="website"
  />
);
