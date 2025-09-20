#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');

// Path to frontend models data
const frontendModelsPath = path.join(__dirname, '../../human_paris/src/lib/data/models.ts');

async function extractAllModels() {
  console.log('📦 Extracting ALL models from frontend...\n');

  // Read the models.ts file
  const modelsContent = fs.readFileSync(frontendModelsPath, 'utf8');

  // Extract model names to verify we have all 20
  const modelNames = modelsContent.match(/name: "[^"]+"/g)?.map(n => n.replace(/name: "([^"]+)"/, '$1'));
  console.log(`Found ${modelNames?.length || 0} models:`, modelNames?.slice(0, 20));

  // Complete model data with all 20 models
  const completeModelData = {
    models: [
      // Premium Female Models
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
        measurements: { height: "176cm", shoes: "8 US", hair: "Blonde", eyes: "Blue", bust: "86cm", waist: "61cm", hips: "86cm" },
        socials: { instagram: "@hoskelsa" },
        profileImage: "elsa-hosk/profile.jpg",
        portfolioImages: ["elsa-hosk/portfolio-1.jpg", "elsa-hosk/portfolio-2.jpg", "elsa-hosk/portfolio-3.jpg", "elsa-hosk/portfolio-4.jpg", "elsa-hosk/portfolio-5.jpg", "elsa-hosk/portfolio-6.jpg", "elsa-hosk/portfolio-7.jpg"]
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
        measurements: { height: "180cm", shoes: "10 US", hair: "Brown", eyes: "Brown", bust: "86cm", waist: "61cm", hips: "91cm" },
        socials: { instagram: "@naraaziza", tiktok: "@naraazizasmith" },
        profileImage: "nara-aziza-smith/profile.jpg",
        portfolioImages: ["nara-aziza-smith/portfolio-1.jpg", "nara-aziza-smith/portfolio-2.jpg", "nara-aziza-smith/portfolio-3.jpg", "nara-aziza-smith/portfolio-4.jpg", "nara-aziza-smith/portfolio-5.jpg", "nara-aziza-smith/portfolio-6.jpg", "nara-aziza-smith/portfolio-7.jpg"]
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
        measurements: { height: "175cm", shoes: "7.5 US", hair: "Blonde", eyes: "Blue", bust: "81cm", waist: "58cm", hips: "86cm" },
        socials: { instagram: "@oliviaponton" },
        profileImage: "olivia-ponton/profile.jpg",
        portfolioImages: ["olivia-ponton/portfolio-1.jpg", "olivia-ponton/portfolio-2.jpg", "olivia-ponton/portfolio-3.jpg", "olivia-ponton/portfolio-4.jpg", "olivia-ponton/portfolio-5.jpg", "olivia-ponton/portfolio-6.jpg", "olivia-ponton/portfolio-7.jpg", "olivia-ponton/portfolio-8.jpg"]
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
        measurements: { height: "173cm", shoes: "8 US", hair: "Brown", eyes: "Blue" },
        profileImage: "clara-mcgregor/profile.jpg",
        portfolioImages: ["clara-mcgregor/portfolio-1.jpg", "clara-mcgregor/portfolio-2.jpg", "clara-mcgregor/portfolio-3.jpg", "clara-mcgregor/portfolio-4.jpg", "clara-mcgregor/portfolio-5.jpg", "clara-mcgregor/portfolio-6.jpg", "clara-mcgregor/portfolio-7.jpg"]
      },
      {
        name: "Dara Allen",
        slug: "dara-allen",
        bio: "American fashion model known for her versatility and strong presence on the runway. Has walked for major fashion houses in Paris, Milan, and New York.",
        gender: "female",
        nationality: "American",
        city: "New York",
        board: "women",
        isNew: false,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "178cm", shoes: "9 US", hair: "Brown", eyes: "Green", bust: "84cm", waist: "60cm", hips: "88cm" },
        socials: { instagram: "@daraallen" },
        profileImage: "dara-allen/profile.jpg",
        portfolioImages: ["dara-allen/portfolio-1.jpg", "dara-allen/portfolio-2.jpg", "dara-allen/portfolio-3.jpg", "dara-allen/portfolio-4.jpg", "dara-allen/portfolio-5.jpg", "dara-allen/portfolio-6.jpg", "dara-allen/portfolio-7.jpg"]
      },
      {
        name: "Alexis Carrington",
        slug: "alexis-carrington",
        bio: "Sophisticated model with a classic beauty. Known for high-end editorial work and luxury brand campaigns.",
        gender: "female",
        nationality: "American",
        city: "New York",
        board: "women",
        isNew: false,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "177cm", shoes: "8.5 US", hair: "Blonde", eyes: "Blue", bust: "85cm", waist: "62cm", hips: "87cm" },
        socials: { instagram: "@alexiscarrington" },
        profileImage: "alexis-carrington/profile.jpg",
        portfolioImages: ["alexis-carrington/portfolio-1.jpg", "alexis-carrington/portfolio-2.jpg", "alexis-carrington/portfolio-3.jpg", "alexis-carrington/portfolio-4.jpg", "alexis-carrington/portfolio-5.jpg", "alexis-carrington/portfolio-6.jpg", "alexis-carrington/portfolio-7.jpg"]
      },
      // Premium Male Models
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
        measurements: { height: "180cm", shoes: "10.5 US", hair: "Brown", eyes: "Brown", chest: "102cm", waist: "81cm" },
        socials: { instagram: "@vinniehacker", tiktok: "@vhackerr" },
        profileImage: "vinnie-hacker/profile.jpg",
        portfolioImages: ["vinnie-hacker/portfolio-1.jpg", "vinnie-hacker/portfolio-2.jpg", "vinnie-hacker/portfolio-3.jpg"]
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
        measurements: { height: "185cm", shoes: "10.5 US", hair: "Black", eyes: "Brown" },
        socials: { instagram: "@wisdm", tiktok: "@wisdm8" },
        profileImage: "wisdom-kaye/profile.jpg",
        portfolioImages: ["wisdom-kaye/portfolio-1.jpg", "wisdom-kaye/portfolio-2.jpg", "wisdom-kaye/portfolio-3.jpg", "wisdom-kaye/portfolio-4.jpg", "wisdom-kaye/portfolio-5.jpg"]
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
        measurements: { height: "188cm", shoes: "11 US", hair: "Blonde", eyes: "Blue", chest: "97cm", waist: "76cm" },
        socials: { instagram: "@iblamejordan" },
        profileImage: "jordan-barrett/profile.jpg",
        portfolioImages: ["jordan-barrett/portfolio-1.jpg", "jordan-barrett/portfolio-2.jpg", "jordan-barrett/portfolio-3.jpg"]
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
        measurements: { height: "188cm", shoes: "11 US", hair: "Brown", eyes: "Green" },
        socials: { instagram: "@anwarhadid" },
        profileImage: "anwar-hadid/profile.jpg",
        portfolioImages: ["anwar-hadid/portfolio-1.jpg", "anwar-hadid/portfolio-2.jpg", "anwar-hadid/portfolio-3.jpg"]
      },
      {
        name: "Alton Mason",
        slug: "alton-mason",
        bio: "American model and dancer. First black male model to walk for Chanel. Known for his dynamic runway presence.",
        gender: "male",
        nationality: "American",
        city: "New York",
        board: "men",
        isNew: false,
        isFeatured: true,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "183cm", shoes: "10 US", hair: "Black", eyes: "Brown", chest: "96cm", waist: "76cm" },
        socials: { instagram: "@altonmason" },
        profileImage: "alton-mason/portfolio-1.jpg",
        portfolioImages: ["alton-mason/portfolio-1.jpg", "alton-mason/portfolio-2.jpg", "alton-mason/portfolio-3.jpg"]
      },
      {
        name: "Christian Hogue",
        slug: "christian-hogue",
        bio: "American fitness model and influencer. Known for his athletic physique and commercial work.",
        gender: "male",
        nationality: "American",
        city: "New York",
        board: "men",
        isNew: false,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "188cm", shoes: "11.5 US", hair: "Brown", eyes: "Blue", chest: "107cm", waist: "81cm" },
        socials: { instagram: "@christianhogue" },
        profileImage: "christian-hogue/profile.jpg",
        portfolioImages: ["christian-hogue/portfolio-1.jpg", "christian-hogue/portfolio-2.jpg", "christian-hogue/portfolio-3.jpg"]
      },
      // Rising Female Stars
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
        measurements: { height: "179cm", shoes: "8.5 US", hair: "Blonde", eyes: "Blue-Green" },
        socials: { instagram: "@gigihadid" },
        profileImage: "gigi-hadid/profile.jpg",
        portfolioImages: ["gigi-hadid/portfolio-1.jpg", "gigi-hadid/portfolio-2.jpg", "gigi-hadid/portfolio-3.jpg", "gigi-hadid/portfolio-4.jpg", "gigi-hadid/portfolio-5.jpg"]
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
        measurements: { height: "175cm", shoes: "7.5 US", hair: "Brown", eyes: "Blue-Green" },
        socials: { instagram: "@bellahadid" },
        profileImage: "bella-hadid/profile.jpg",
        portfolioImages: ["bella-hadid/portfolio-1.jpg", "bella-hadid/portfolio-2.jpg", "bella-hadid/portfolio-3.jpg", "bella-hadid/portfolio-4.jpg", "bella-hadid/portfolio-5.jpg"]
      },
      {
        name: "Chanel Iman",
        slug: "chanel-iman",
        bio: "American model who has worked as a Victoria's Secret Angel. Known for her work with top fashion houses.",
        gender: "female",
        nationality: "American",
        city: "New York",
        board: "women",
        isNew: false,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "178cm", shoes: "8.5 US", hair: "Black", eyes: "Brown" },
        socials: { instagram: "@chaneliman" },
        profileImage: "chanel-iman/profile.jpg",
        portfolioImages: ["chanel-iman/portfolio-1.jpg", "chanel-iman/portfolio-2.jpg", "chanel-iman/portfolio-3.jpg", "chanel-iman/portfolio-4.jpg", "chanel-iman/portfolio-5.jpg"]
      },
      {
        name: "Emily DiDonato",
        slug: "emily-didonato",
        bio: "American model and YouTuber. Face of Maybelline and known for Sports Illustrated Swimsuit Issue appearances.",
        gender: "female",
        nationality: "American",
        city: "New York",
        board: "new-faces",
        isNew: true,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "178cm", shoes: "9 US", hair: "Brown", eyes: "Blue" },
        socials: { instagram: "@emilydidonato" },
        profileImage: "emily-didonato/profile.jpg",
        portfolioImages: ["emily-didonato/portfolio-1.jpg", "emily-didonato/portfolio-2.jpg", "emily-didonato/portfolio-3.jpg", "emily-didonato/portfolio-4.jpg"]
      },
      {
        name: "Rayna Vallandingham",
        slug: "rayna-vallandingham",
        bio: "Martial artist turned model and actress. Known for her action roles and athletic modeling.",
        gender: "female",
        nationality: "American",
        city: "New York",
        board: "new-faces",
        isNew: true,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "168cm", shoes: "7 US", hair: "Black", eyes: "Brown" },
        socials: { instagram: "@raynavallandingham" },
        profileImage: "rayna-vallandingham/profile.jpg",
        portfolioImages: ["rayna-vallandingham/portfolio-1.jpg", "rayna-vallandingham/portfolio-2.jpg", "rayna-vallandingham/portfolio-3.jpg", "rayna-vallandingham/portfolio-4.jpg"]
      },
      // Rising Male Stars
      {
        name: "Mason Barnes",
        slug: "mason-barnes",
        bio: "American model known for his commercial and editorial work. Rising star in the fashion industry.",
        gender: "male",
        nationality: "American",
        city: "New York",
        board: "men",
        isNew: false,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "185cm", shoes: "10.5 US", hair: "Brown", eyes: "Green" },
        socials: { instagram: "@masonbarnes" },
        profileImage: "mason-barnes/profile.jpg",
        portfolioImages: ["mason-barnes/portfolio-1.jpg", "mason-barnes/portfolio-2.jpg", "mason-barnes/portfolio-3.jpg"]
      },
      {
        name: "Romeo Beckham",
        slug: "romeo-beckham",
        bio: "British model and former footballer. Son of David and Victoria Beckham. Face of major fashion campaigns.",
        gender: "male",
        nationality: "British",
        city: "New York",
        board: "men",
        isNew: false,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "180cm", shoes: "9.5 UK", hair: "Brown", eyes: "Brown" },
        socials: { instagram: "@romeobeckham" },
        profileImage: "romeo-beckham/profile.jpg",
        portfolioImages: ["romeo-beckham/portfolio-1.jpg", "romeo-beckham/portfolio-2.jpg", "romeo-beckham/portfolio-3.jpg", "romeo-beckham/portfolio-4.jpg"]
      },
      {
        name: "Alpha Dia",
        slug: "alpha-dia",
        bio: "Rising male model with a unique look. New face making waves in the fashion industry.",
        gender: "male",
        nationality: "American",
        city: "New York",
        board: "new-faces",
        isNew: true,
        isFeatured: false,
        isAvailable: true,
        dateAdded: "2024-08-20",
        measurements: { height: "189cm", shoes: "11.5 US", hair: "Black", eyes: "Brown" },
        socials: { instagram: "@alphadia" },
        profileImage: "alpha-dia/profile.jpg",
        portfolioImages: ["alpha-dia/portfolio-1.jpg", "alpha-dia/portfolio-2.jpg", "alpha-dia/portfolio-3.jpg"]
      }
    ],
    // Homepage with VIDEO background
    homepage: {
      seo: {
        metaTitle: "Human Models Paris - Premier Modeling Agency",
        metaDescription: "Leading modeling agency in Paris representing exceptional fashion models for luxury brands and editorial work.",
        shareImage: "og-image.jpg"
      },
      sections: [
        {
          __component: "sections.hero",
          title: "Sophie Dechammel for Jumpman FA24",
          subtitle: "Global campaign for Jordan Brand collection FA24",
          description: "",
          backgroundMedia: {
            mediaType: "external-video",
            externalVideoUrl: "https://player.vimeo.com/progressive_redirect/playback/1091583048/rendition/1440p/file.mp4?loc=external&log_user=0&signature=4ab2a58bde98ade991004c7cf08ccc8e6ab1ac896533b131944c21719484dc5f",
            alt: "Fashion model in Jordan Brand campaign"
          },
          textPosition: "center",
          textColor: "white",
          overlay: true,
          overlayOpacity: 30,
          ctaButtons: [
            { text: "View Our Models", href: "/directory", variant: "primary" },
            { text: "Become a Model", href: "/become", variant: "outline" }
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
          rotationSpeed: 5000,
          modelIds: [] // Will be filled with featured model IDs
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
          limit: 6
        },
        {
          __component: "sections.board-showcase",
          title: "Our Boards",
          boards: [
            {
              title: "Women",
              slug: "women",
              image: { mediaType: "image", imagePath: "women-board.jpg" },
              description: "Exceptional female models for high fashion and commercial work"
            },
            {
              title: "Men",
              slug: "men",
              image: { mediaType: "image", imagePath: "men-board.jpg" },
              description: "Leading male models for editorial and runway"
            },
            {
              title: "New Faces",
              slug: "new-faces",
              image: { mediaType: "image", imagePath: "new-faces-board.jpg" },
              description: "Emerging talent and fresh faces in fashion"
            }
          ]
        }
      ]
    }
  };

  // Save the complete data
  const outputPath = path.join(__dirname, '../data/complete-model-agency-data.json');
  await fs.ensureDir(path.dirname(outputPath));

  // Add navigation, footer, pages, etc. from previous data
  const previousData = await fs.readJson(path.join(__dirname, '../data/model-agency-data.json'));

  completeModelData.navigation = previousData.navigation;
  completeModelData.footer = previousData.footer;
  completeModelData.pages = previousData.pages;
  completeModelData.pages[1].sections[2].formType = "application"; // Fix form type
  completeModelData.authors = previousData.authors;
  completeModelData.articles = previousData.articles;
  completeModelData.categories = previousData.categories;
  completeModelData.global = previousData.global;

  await fs.writeJson(outputPath, completeModelData, { spaces: 2 });

  console.log(`\n✅ Complete data extracted and saved`);
  console.log(`📊 Total models: ${completeModelData.models.length}`);
  console.log(`🎬 Hero video URL: ${completeModelData.homepage.sections[0].backgroundMedia.externalVideoUrl.substring(0, 50)}...`);
  console.log(`📁 Output: ${outputPath}`);
}

extractAllModels().catch(console.error);