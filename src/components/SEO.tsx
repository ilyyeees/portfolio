import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Ilyes Abbas - Full Stack Developer Portfolio",
  description = "Experienced Full Stack Developer specializing in React, TypeScript, and modern web technologies. View my projects and get in touch for collaboration opportunities.",
  keywords = "Full Stack Developer, React Developer, TypeScript, JavaScript, Web Development, Portfolio, Software Engineer, Frontend, Backend",
  image = "/assets/logo.jpg",
  url = "https://ilyes-abbas-portfolio.com",
  type = "website",
  author = "Ilyes Abbas"
}) => {
  const fullTitle = title.includes("Ilyes Abbas") ? title : `${title} | Ilyes Abbas`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Add structured data
    const addStructuredData = () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Ilyes Abbas",
        "jobTitle": "Full Stack Developer",
        "description": description,
        "url": url,
        "image": image,
        "email": "ilyes.abbas@ensia.edu.dz",
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "École Nationale Supérieure d'Informatique (ESI)"
        },
        "knowsAbout": [
          "React",
          "TypeScript",
          "JavaScript",
          "Node.js",
          "Full Stack Development",
          "Web Development",
          "Software Engineering"
        ],
        "sameAs": [
          "https://github.com/ilyesabbas",
          "https://linkedin.com/in/ilyesabbas",
          "https://twitter.com/ilyesabbas"
        ]
      });
      document.head.appendChild(script);
    };

    addStructuredData();
  }, [fullTitle, description, keywords, author, image, url, type]);

  return null; // This component doesn't render anything
};

export default SEO;
