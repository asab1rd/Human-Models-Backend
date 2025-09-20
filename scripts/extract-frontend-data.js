#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');

// Import data from frontend
const frontendDataPath = path.join(__dirname, '../../human_paris/src/lib/data');
const frontendModelsPath = path.join(frontendDataPath, 'models.ts');
const frontendJournalPath = path.join(frontendDataPath, 'journal.ts');

// Read and parse TypeScript files - not used in this version
function extractDataFromTS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content;
}

// Convert the extracted data
async function extractAndConvert() {
  console.log('📦 Extracting frontend data...\n');

  // Read the models data
  const modelsContent = fs.readFileSync(frontendModelsPath, 'utf8');
  const journalContent = fs.readFileSync(frontendJournalPath, 'utf8');

  // For now, we'll manually create the data structure based on what we saw
  // This would normally be done with a TypeScript compiler

  const modelAgencyData = {
    models: [
      {
        name: "Elsa Hosk",
        slug: "elsa-hosk",
        bio: "Supermodel, content creator, entrepreneur, creative, and mother. Began modeling at age 15 and formerly played professional basketball. Made her runway debut in Spring 2012, walking for Christian Dior and Giambattista Valli. Launched her own fashion label HELSA in 2022.",
        gender: "female",
        nationality: "Swedish",
        city: "New York",
        board: "women",
        isNew: false,
        isFeatured: true,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "176cm",
          shoes: "8 US",
          hair: "Blonde",
          eyes: "Blue",
          bust: "86cm",
          waist: "61cm",
          hips: "86cm"
        },
        socials: {
          instagram: "@hoskelsa"
        },
        profileImage: "elsa-hosk-profile.jpg",
        portfolioImages: [
          "elsa-hosk-portfolio-1.jpg",
          "elsa-hosk-portfolio-2.jpg",
          "elsa-hosk-portfolio-3.jpg",
          "elsa-hosk-portfolio-4.jpg"
        ],
        workExperience: [
          {
            client: "Victoria's Secret",
            type: "Campaign",
            year: "2015-2018"
          },
          {
            client: "Guess",
            type: "Global Ambassador",
            year: "2010-2012"
          }
        ]
      },
      {
        name: "Nara Aziza Smith",
        slug: "nara-aziza-smith",
        bio: "Digital creator and model currently taking the Internet by storm with over 14M followers across TikTok and Instagram. Has worked with major brands including Marc Jacobs, Calvin Klein, and Revolve.",
        gender: "female",
        nationality: "German",
        city: "New York",
        board: "women",
        isNew: false,
        isFeatured: true,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "180cm",
          shoes: "10 US",
          hair: "Brown",
          eyes: "Brown",
          bust: "86cm",
          waist: "61cm",
          hips: "91cm"
        },
        socials: {
          instagram: "@naraaziza",
          tiktok: "@naraazizasmith"
        },
        profileImage: "nara-aziza-smith-profile.jpg",
        portfolioImages: [
          "nara-aziza-smith-portfolio-1.jpg",
          "nara-aziza-smith-portfolio-2.jpg",
          "nara-aziza-smith-portfolio-3.jpg"
        ]
      },
      {
        name: "Olivia Ponton",
        slug: "olivia-ponton",
        bio: "Rising model and social media influencer represented by IMG Models. Known for her engaging social media presence and professional modeling portfolio.",
        gender: "female",
        nationality: "American",
        city: "New York",
        board: "women",
        isNew: false,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "175cm",
          shoes: "7.5 US",
          hair: "Blonde",
          eyes: "Blue",
          bust: "81cm",
          waist: "58cm",
          hips: "86cm"
        },
        socials: {
          instagram: "@oliviaponton"
        },
        profileImage: "olivia-ponton-profile.jpg",
        portfolioImages: [
          "olivia-ponton-portfolio-1.jpg",
          "olivia-ponton-portfolio-2.jpg"
        ]
      },
      {
        name: "Clara McGregor",
        slug: "clara-mcgregor",
        bio: "British model and actress with a unique presence in fashion and film. Daughter of Ewan McGregor.",
        gender: "female",
        nationality: "British",
        city: "New York",
        board: "women",
        isNew: false,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "173cm",
          shoes: "8 US",
          hair: "Brown",
          eyes: "Blue"
        },
        profileImage: "clara-mcgregor-profile.jpg",
        portfolioImages: []
      },
      {
        name: "Vinnie Hacker",
        slug: "vinnie-hacker",
        bio: "Social media personality turned model with millions of followers. Known for his edgy style and tattoos.",
        gender: "male",
        nationality: "American",
        city: "New York",
        board: "men",
        isNew: false,
        isFeatured: true,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "180cm",
          shoes: "10.5 US",
          hair: "Brown",
          eyes: "Brown",
          chest: "102cm",
          waist: "81cm"
        },
        socials: {
          instagram: "@vinniehacker",
          tiktok: "@vhackerr"
        },
        profileImage: "vinnie-hacker-profile.jpg",
        portfolioImages: [
          "vinnie-hacker-portfolio-1.jpg"
        ]
      },
      {
        name: "Jordan Barrett",
        slug: "jordan-barrett",
        bio: "Australian supermodel known for his distinctive features and high-fashion editorial work.",
        gender: "male",
        nationality: "Australian",
        city: "New York",
        board: "men",
        isNew: false,
        isFeatured: true,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "188cm",
          shoes: "11 US",
          hair: "Blonde",
          eyes: "Blue",
          chest: "97cm",
          waist: "76cm"
        },
        socials: {
          instagram: "@iblamejordan"
        },
        profileImage: "jordan-barrett-profile.jpg",
        portfolioImages: []
      },
      {
        name: "Anwar Hadid",
        slug: "anwar-hadid",
        bio: "Fashion model and musician. Brother of Gigi and Bella Hadid. Known for campaigns with Hugo Boss and Valentino.",
        gender: "male",
        nationality: "American",
        city: "New York",
        board: "men",
        isNew: false,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "188cm",
          shoes: "11 US",
          hair: "Brown",
          eyes: "Green"
        },
        socials: {
          instagram: "@anwarhadid"
        },
        profileImage: "anwar-hadid-profile.jpg",
        portfolioImages: []
      },
      {
        name: "Gigi Hadid",
        slug: "gigi-hadid",
        bio: "International supermodel and television personality. One of the highest paid models in the world.",
        gender: "female",
        nationality: "American",
        city: "New York",
        board: "women",
        isNew: false,
        isFeatured: true,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "179cm",
          shoes: "8.5 US",
          hair: "Blonde",
          eyes: "Blue-Green"
        },
        socials: {
          instagram: "@gigihadid"
        },
        profileImage: "gigi-hadid-profile.jpg",
        portfolioImages: []
      },
      {
        name: "Bella Hadid",
        slug: "bella-hadid",
        bio: "Supermodel known for her work with Dior, Versace, and Bulgari. Named Model of the Year multiple times.",
        gender: "female",
        nationality: "American",
        city: "New York",
        board: "women",
        isNew: false,
        isFeatured: true,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "175cm",
          shoes: "7.5 US",
          hair: "Brown",
          eyes: "Blue-Green"
        },
        socials: {
          instagram: "@bellahadid"
        },
        profileImage: "bella-hadid-profile.jpg",
        portfolioImages: []
      },
      {
        name: "Wisdom Kaye",
        slug: "wisdom-kaye",
        bio: "Fashion influencer and model known for his innovative street style. TikTok's best-dressed creator.",
        gender: "male",
        nationality: "Nigerian-American",
        city: "New York",
        board: "new-faces",
        isNew: true,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: {
          height: "185cm",
          shoes: "10.5 US",
          hair: "Black",
          eyes: "Brown"
        },
        socials: {
          instagram: "@wisdm",
          tiktok: "@wisdm8"
        },
        profileImage: "wisdom-kaye-profile.jpg",
        portfolioImages: []
      }
    ],
    homepage: {
      seo: {
        metaTitle: "Human Models Paris - Premier Modeling Agency",
        metaDescription: "Leading modeling agency in Paris representing exceptional fashion models for luxury brands and editorial work.",
        shareImage: "og-image.jpg"
      },
      sections: [
        {
          __component: "sections.hero",
          title: "Human Models Paris",
          subtitle: "Where Fashion Meets Excellence",
          description: "Representing the world's most exceptional talent for luxury brands and editorial excellence.",
          backgroundMedia: {
            type: "image",
            url: "hero-background.jpg",
            alt: "Fashion model on runway"
          },
          textPosition: "center",
          textColor: "white",
          overlay: true,
          overlayOpacity: 30,
          ctaButtons: [
            {
              text: "View Our Models",
              href: "/directory",
              style: "primary"
            },
            {
              text: "Become a Model",
              href: "/become",
              style: "secondary"
            }
          ]
        },
        {
          __component: "sections.featured-models",
          title: "Featured Models",
          subtitle: "Discover our exceptional talent",
          displayStyle: "carousel",
          showBio: true,
          showMeasurements: false,
          autoRotate: true,
          rotationSpeed: 5000
        },
        {
          __component: "sections.model-grid",
          title: "New Faces",
          subtitle: "Fresh talent joining our agency",
          board: "new-faces",
          limit: 6,
          showViewAll: true
        },
        {
          __component: "sections.latest-editorial",
          title: "Latest Editorial",
          subtitle: "Stories from the world of fashion",
          limit: 3
        },
        {
          __component: "sections.board-showcase",
          title: "Our Boards",
          boards: [
            {
              name: "Women",
              slug: "women",
              image: "women-board.jpg",
              description: "Exceptional female models for high fashion and commercial work"
            },
            {
              name: "Men",
              slug: "men",
              image: "men-board.jpg",
              description: "Leading male models for editorial and runway"
            },
            {
              name: "New Faces",
              slug: "new-faces",
              image: "new-faces-board.jpg",
              description: "Emerging talent and fresh faces in fashion"
            }
          ]
        }
      ]
    },
    navigation: {
      logo: "logo.png",
      logoAlt: "Human Models Paris",
      menuItems: [
        {
          label: "Models",
          href: "/directory",
          subItems: [
            { label: "Women", href: "/directory/women" },
            { label: "Men", href: "/directory/men" },
            { label: "New Faces", href: "/directory/new-faces" }
          ]
        },
        {
          label: "Journal",
          href: "/journal"
        },
        {
          label: "About",
          href: "/about"
        },
        {
          label: "Become a Model",
          href: "/become"
        },
        {
          label: "Contact",
          href: "/contact"
        }
      ],
      ctaButton: {
        text: "Book Models",
        href: "/contact",
        style: "primary"
      },
      showSearch: true,
      showLanguageSwitch: true
    },
    footer: {
      logo: "logo.png",
      description: "Premier modeling agency in Paris representing exceptional fashion models for luxury brands and editorial work.",
      sections: [
        {
          title: "Models",
          links: [
            { label: "Women", href: "/directory/women" },
            { label: "Men", href: "/directory/men" },
            { label: "New Faces", href: "/directory/new-faces" },
            { label: "All Models", href: "/directory" }
          ]
        },
        {
          title: "Company",
          links: [
            { label: "About Us", href: "/about" },
            { label: "Journal", href: "/journal" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" }
          ]
        },
        {
          title: "Services",
          links: [
            { label: "Become a Model", href: "/become" },
            { label: "Book Models", href: "/contact" },
            { label: "Scouting", href: "/scouting" }
          ]
        }
      ],
      socialLinks: [
        { platform: "instagram", url: "https://instagram.com/humanmodelsparis" },
        { platform: "linkedin", url: "https://linkedin.com/company/humanmodelsparis" }
      ],
      copyright: "© 2024 Human Models Paris. All rights reserved."
    },
    pages: [
      {
        title: "About Us",
        slug: "about",
        seo: {
          metaTitle: "About - Human Models Paris",
          metaDescription: "Learn about Human Models Paris, a leading modeling agency representing exceptional talent."
        },
        sections: [
          {
            __component: "sections.hero",
            title: "About Human Models Paris",
            subtitle: "Excellence in Model Management Since 1985",
            backgroundMedia: {
              type: "image",
              url: "about-hero.jpg"
            }
          },
          {
            __component: "sections.text-content",
            title: "Our Story",
            content: "Founded in 1985, Human Models Paris has been at the forefront of the fashion industry for nearly four decades. We represent exceptional talent and provide comprehensive management services to models at every stage of their careers.",
            alignment: "center"
          },
          {
            __component: "sections.gallery",
            title: "Our Legacy",
            images: [
              { url: "legacy-1.jpg", alt: "Fashion show" },
              { url: "legacy-2.jpg", alt: "Magazine cover" },
              { url: "legacy-3.jpg", alt: "Campaign shoot" }
            ]
          }
        ],
        showInNavigation: true,
        navigationOrder: 3
      },
      {
        title: "Become a Model",
        slug: "become",
        seo: {
          metaTitle: "Become a Model - Human Models Paris",
          metaDescription: "Start your modeling career with Human Models Paris. Apply now to join our prestigious agency."
        },
        sections: [
          {
            __component: "sections.hero",
            title: "Start Your Modeling Journey",
            subtitle: "Join Human Models Paris",
            backgroundMedia: {
              type: "image",
              url: "become-hero.jpg"
            }
          },
          {
            __component: "sections.text-content",
            title: "Requirements",
            content: "We're looking for unique individuals with professional attitude and dedication. Height requirements: Women 5'8\" (173cm) minimum, Men 6'0\" (183cm) minimum. Age: 14-25 for new faces."
          },
          {
            __component: "sections.form",
            title: "Apply Now",
            formType: "model-application",
            fields: [
              { name: "fullName", type: "text", label: "Full Name", required: true },
              { name: "email", type: "email", label: "Email", required: true },
              { name: "phone", type: "tel", label: "Phone", required: true },
              { name: "age", type: "number", label: "Age", required: true },
              { name: "height", type: "text", label: "Height", required: true },
              { name: "city", type: "text", label: "City", required: true },
              { name: "instagram", type: "text", label: "Instagram Handle", required: false },
              { name: "photos", type: "file", label: "Upload Photos", required: true, multiple: true }
            ]
          }
        ],
        showInNavigation: true,
        navigationOrder: 4
      },
      {
        title: "Contact",
        slug: "contact",
        seo: {
          metaTitle: "Contact - Human Models Paris",
          metaDescription: "Get in touch with Human Models Paris for bookings, inquiries, and collaborations."
        },
        sections: [
          {
            __component: "sections.text-content",
            title: "Get in Touch",
            content: "Whether you're looking to book models or have general inquiries, we're here to help."
          },
          {
            __component: "sections.contact-cta",
            title: "Contact Information",
            address: "123 Rue de Rivoli, 75001 Paris, France",
            phone: "+33 1 42 96 89 89",
            email: "info@humanmodels.paris",
            departments: [
              { name: "Bookings", email: "bookings@humanmodels.paris" },
              { name: "New Faces", email: "newfaces@humanmodels.paris" },
              { name: "Press", email: "press@humanmodels.paris" }
            ]
          },
          {
            __component: "sections.form",
            title: "Send us a message",
            formType: "contact",
            fields: [
              { name: "name", type: "text", label: "Name", required: true },
              { name: "email", type: "email", label: "Email", required: true },
              { name: "subject", type: "text", label: "Subject", required: true },
              { name: "message", type: "textarea", label: "Message", required: true }
            ]
          }
        ],
        showInNavigation: true,
        navigationOrder: 5
      }
    ],
    authors: [
      {
        name: "Sophie Martin",
        email: "sophie.martin@humanmodels.paris",
        bio: "Fashion editor and industry expert with over 15 years of experience.",
        avatar: "sophie-martin.jpg"
      },
      {
        name: "Jean-Luc Dubois",
        email: "jeanluc.dubois@humanmodels.paris",
        bio: "Creative director and fashion photographer.",
        avatar: "jean-luc-dubois.jpg"
      }
    ],
    articles: [
      {
        title: "Paris Fashion Week 2024: Our Models Shine",
        slug: "paris-fashion-week-2024-highlights",
        description: "A recap of the most memorable moments from this season's Paris Fashion Week.",
        category: "news",
        author: "Sophie Martin",
        content: "Paris Fashion Week 2024 proved once again why our city remains the epicenter of luxury fashion. Our models graced the runways of the most prestigious maisons, delivering unforgettable moments that defined the season.",
        cover: "pfw-2024.jpg"
      },
      {
        title: "The Future of Sustainable Fashion Modeling",
        slug: "sustainable-fashion-future",
        description: "Exploring how the modeling industry is embracing sustainability.",
        category: "editorial",
        author: "Jean-Luc Dubois",
        content: "Sustainability has become more than a trend—it's a fundamental shift in how fashion operates.",
        cover: "sustainable-fashion.jpg"
      }
    ],
    categories: [
      { name: "News", slug: "news" },
      { name: "Editorial", slug: "editorial" },
      { name: "Behind the Scenes", slug: "behind-the-scenes" },
      { name: "Fashion Week", slug: "fashion-week" }
    ],
    global: {
      siteName: "Human Models Paris",
      siteDescription: "Premier modeling agency in Paris",
      favicon: "favicon.png",
      defaultSeo: {
        metaTitle: "Human Models Paris",
        metaDescription: "Leading modeling agency in Paris representing exceptional fashion models.",
        shareImage: "og-image.jpg"
      }
    }
  };

  // Save the extracted data
  const outputPath = path.join(__dirname, '../data/model-agency-data.json');
  await fs.ensureDir(path.dirname(outputPath));
  await fs.writeJson(outputPath, modelAgencyData, { spaces: 2 });

  console.log(`✅ Data extracted and saved to: ${outputPath}`);
  console.log(`📊 Extracted: ${modelAgencyData.models.length} models`);
  console.log(`📄 Pages: ${modelAgencyData.pages.length}`);
  console.log(`📰 Articles: ${modelAgencyData.articles.length}`);
}

extractAndConvert().catch(console.error);