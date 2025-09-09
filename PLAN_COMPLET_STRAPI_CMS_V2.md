# 📋 PLAN COMPLET STRAPI CMS V2 - AGENCE MANNEQUINS HUMAN PARIS

## 🎯 OBJECTIF DU PROJET

Créer un **CMS Strapi 5 ultra-complet** qui modélise **chaque composant et section** du site Human Paris, avec dynamic zones modulaires, support multi-médias (photo/vidéo/URL), et gestion complète i18n français/anglais.

**⚠️ IMPORTANT**: Le frontend Human Paris est situé à `../human_paris/` depuis le dossier backend `../human_paris_backend/`

---

## 📂 ARCHITECTURE ANALYSÉE

### Frontend Source (../human_paris/)
```
📁 ../human_paris/src/
├── app/[locale]/               # Pages principales
│   ├── page.tsx               # 🏠 Landing page
│   ├── directory/             # 📂 Répertoire modèles
│   ├── [slug]/                # 👤 Profil modèle individuel
│   ├── journal/               # 📰 Blog/journal
│   ├── contact/               # 📞 Contact
│   └── become/                # 📝 Candidature modèle
├── components/
│   ├── layout/                # Navigation, Footer, Container
│   ├── boards/                # ModelGrid, BoardFilters
│   ├── portfolio/             # Portfolio components
│   ├── journal/               # JournalGrid, ArticleCard
│   ├── forms/                 # ContactForm, BecomeForm
│   └── ui/                    # Boutons, modales, etc.
└── lib/data/                  # 🎯 Données mock à migrer
    ├── models.ts              # 20 modèles + 160 photos
    └── journal.ts             # Articles + auteurs
```

---


## 🏗️ PHASE 1: PRÉPARATION INFRASTRUCTURE (1h)

### 1.2 Nettoyage structure existante
```bash
# Dans human_paris_backend/
rm -rf src/api/article/
rm -rf src/api/author/
rm -rf src/api/category/
rm -rf src/api/about/
rm -rf src/api/global/
```

### 1.3 Installation dépendances
```bash
pnpm add @strapi/plugin-i18n
pnpm rebuild
```

---

## 🏗️ PHASE 2: CONFIGURATION PLUGINS ET BASE (1h)

### 2.1 Configuration i18n

**Fichier** : `config/plugins.ts`
```typescript
export default ({ env }) => ({
  'i18n': {
    enabled: true,
    config: {
      defaultLocale: 'en',
      locales: ['en', 'fr'],
    },
  },
  'upload': {
    config: {
      sizeLimit: 100 * 1024 * 1024, // 100MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        thumbnail: 150,
      },
      providerOptions: {
        localServer: {
          maxage: 300000,
        },
      },
    },
  },
});
```

### 2.2 Configuration CORS

**Fichier** : `config/middlewares.ts`
```typescript
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ['*'],
          'media-src': ['*'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'https://humanparis.com',
        'https://assets.humanparis.com',
      ],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

---

## 🏗️ PHASE 3: CRÉATION SHARED COMPONENTS (2h)

### 3.1 Component shared.seo

**Créer** : `src/components/shared/seo.json`
```json
{
  "collectionName": "components_shared_seos",
  "info": {
    "displayName": "SEO",
    "description": "Meta tags et données structurées"
  },
  "attributes": {
    "metaTitle": {
      "type": "string",
      "maxLength": 60,
      "required": true
    },
    "metaDescription": {
      "type": "text",
      "maxLength": 160,
      "required": true
    },
    "keywords": {
      "type": "string"
    },
    "canonicalURL": {
      "type": "string"
    },
    "metaImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "preventIndexing": {
      "type": "boolean",
      "default": false
    },
    "structuredData": {
      "type": "json"
    }
  }
}
```

### 3.2 Component shared.cta-button

**Créer** : `src/components/shared/cta-button.json`
```json
{
  "collectionName": "components_shared_cta_buttons",
  "info": {
    "displayName": "CTA Button",
    "description": "Call-to-action button"
  },
  "attributes": {
    "text": {
      "type": "string",
      "required": true
    },
    "url": {
      "type": "string",
      "required": true
    },
    "style": {
      "type": "enumeration",
      "enum": ["primary", "secondary", "outline", "link"],
      "default": "primary"
    },
    "size": {
      "type": "enumeration",
      "enum": ["small", "medium", "large"],
      "default": "medium"
    },
    "openInNewTab": {
      "type": "boolean",
      "default": false
    }
  }
}
```

### 3.3 Component shared.media-block

**Créer** : `src/components/shared/media-block.json`
```json
{
  "collectionName": "components_shared_media_blocks",
  "info": {
    "displayName": "Media Block",
    "description": "Bloc média universel (image/vidéo/URL)"
  },
  "attributes": {
    "mediaType": {
      "type": "enumeration",
      "enum": ["image", "video", "gallery", "external-video", "external-url"],
      "required": true,
      "default": "image"
    },
    "image": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "video": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["videos"]
    },
    "gallery": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images"]
    },
    "externalVideoUrl": {
      "type": "string",
      "regex": "^https?://(?:www\\.)?(youtube\\.com|youtu\\.be|vimeo\\.com|instagram\\.com)"
    },
    "externalUrl": {
      "type": "string"
    },
    "alt": {
      "type": "string"
    },
    "caption": {
      "type": "text"
    },
    "aspectRatio": {
      "type": "enumeration",
      "enum": ["1:1", "3:4", "4:3", "16:9", "21:9", "auto"],
      "default": "auto"
    }
  }
}
```

### 3.4 Component navigation.menu-item

**Créer** : `src/components/navigation/menu-item.json`
```json
{
  "collectionName": "components_navigation_menu_items",
  "info": {
    "displayName": "Menu Item",
    "description": "Item de navigation avec sous-menus"
  },
  "attributes": {
    "label": {
      "type": "string",
      "required": true
    },
    "url": {
      "type": "string",
      "required": true
    },
    "order": {
      "type": "integer",
      "required": true
    },
    "isExternal": {
      "type": "boolean",
      "default": false
    },
    "subMenuItems": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.sub-menu-item"
    }
  }
}
```

### 3.5 Component model.measurements

**Créer** : `src/components/model/measurements.json`
```json
{
  "collectionName": "components_model_measurements",
  "info": {
    "displayName": "Model Measurements",
    "description": "Mensurations mannequin"
  },
  "attributes": {
    "height": {
      "type": "string"
    },
    "bust": {
      "type": "string"
    },
    "waist": {
      "type": "string"
    },
    "hips": {
      "type": "string"
    },
    "shoes": {
      "type": "string"
    },
    "hair": {
      "type": "string"
    },
    "eyes": {
      "type": "string"
    },
    "dress": {
      "type": "string"
    },
    "weight": {
      "type": "string"
    }
  }
}
```

### 3.6 Component model.socials

**Créer** : `src/components/model/socials.json`
```json
{
  "collectionName": "components_model_socials",
  "info": {
    "displayName": "Social Links",
    "description": "Liens réseaux sociaux mannequin"
  },
  "attributes": {
    "instagram": {
      "type": "string"
    },
    "tiktok": {
      "type": "string"
    },
    "twitter": {
      "type": "string"
    },
    "linkedin": {
      "type": "string"
    },
    "website": {
      "type": "string"
    }
  }
}
```

---

## 🏗️ PHASE 4: SECTIONS DYNAMIC ZONE (3h)

### 4.1 Component sections.hero

**Créer** : `src/components/sections/hero.json`
```json
{
  "collectionName": "components_sections_heroes",
  "info": {
    "displayName": "Hero Section",
    "description": "Section hero avec média de fond et CTA"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 120
    },
    "subtitle": {
      "type": "text",
      "maxLength": 300
    },
    "description": {
      "type": "richtext"
    },
    "backgroundMedia": {
      "type": "component",
      "repeatable": false,
      "component": "shared.media-block",
      "required": true
    },
    "ctaButtons": {
      "type": "component",
      "repeatable": true,
      "component": "shared.cta-button",
      "max": 3
    },
    "textPosition": {
      "type": "enumeration",
      "enum": ["left", "center", "right", "bottom-left", "bottom-center"],
      "default": "center"
    },
    "textColor": {
      "type": "enumeration",
      "enum": ["white", "black", "auto"],
      "default": "white"
    },
    "overlay": {
      "type": "boolean",
      "default": true
    },
    "overlayOpacity": {
      "type": "integer",
      "min": 0,
      "max": 100,
      "default": 30
    }
  }
}
```

### 4.2 Component sections.model-grid

**Créer** : `src/components/sections/model-grid.json`
```json
{
  "collectionName": "components_sections_model_grids",
  "info": {
    "displayName": "Model Grid",
    "description": "Grille de mannequins avec filtres"
  },
  "attributes": {
    "title": {
      "type": "string"
    },
    "subtitle": {
      "type": "text"
    },
    "gridType": {
      "type": "enumeration",
      "enum": ["featured", "board", "search", "custom"],
      "required": true,
      "default": "featured"
    },
    "boardFilter": {
      "type": "enumeration",
      "enum": ["all", "women", "men", "new-faces"],
      "default": "all"
    },
    "featuredModels": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::model.model"
    },
    "layout": {
      "type": "enumeration",
      "enum": ["2-columns", "3-columns", "4-columns", "masonry", "carousel"],
      "default": "3-columns"
    },
    "showFilters": {
      "type": "boolean",
      "default": true
    },
    "showSearch": {
      "type": "boolean",
      "default": true
    },
    "maxModels": {
      "type": "integer",
      "min": 1,
      "max": 50,
      "default": 12
    },
    "showPagination": {
      "type": "boolean",
      "default": true
    },
    "ctaButton": {
      "type": "component",
      "repeatable": false,
      "component": "shared.cta-button"
    }
  }
}
```

### 4.3 Component sections.featured-models

**Créer** : `src/components/sections/featured-models.json`
```json
{
  "collectionName": "components_sections_featured_models",
  "info": {
    "displayName": "Featured Models",
    "description": "Mise en avant de mannequins sélectionnés"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "subtitle": {
      "type": "text"
    },
    "models": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::model.model"
    },
    "displayStyle": {
      "type": "enumeration",
      "enum": ["carousel", "grid", "hero-grid", "spotlight"],
      "default": "carousel"
    },
    "showBio": {
      "type": "boolean",
      "default": true
    },
    "showMeasurements": {
      "type": "boolean",
      "default": false
    },
    "autoRotate": {
      "type": "boolean",
      "default": true
    },
    "rotationSpeed": {
      "type": "integer",
      "min": 3000,
      "max": 10000,
      "default": 5000
    }
  }
}
```

### 4.4 Component sections.latest-editorial

**Créer** : `src/components/sections/latest-editorial.json`
```json
{
  "collectionName": "components_sections_latest_editorials",
  "info": {
    "displayName": "Latest Editorial",
    "description": "Derniers contenus éditoriaux"
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true
    },
    "subtitle": {
      "type": "text"
    },
    "articlesToShow": {
      "type": "integer",
      "min": 1,
      "max": 12,
      "default": 6
    },
    "categoryFilter": {
      "type": "enumeration",
      "enum": ["all", "news", "editorial", "interview", "behind-the-scenes"],
      "default": "all"
    },
    "layout": {
      "type": "enumeration",
      "enum": ["grid", "list", "featured-grid", "masonry"],
      "default": "featured-grid"
    },
    "showExcerpt": {
      "type": "boolean",
      "default": true
    },
    "showAuthor": {
      "type": "boolean",
      "default": true
    },
    "showDate": {
      "type": "boolean",
      "default": true
    }
  }
}
```

### 4.5 Component sections.board-showcase

**Créer** : `src/components/sections/board-showcase.json`
```json
{
  "collectionName": "components_sections_board_showcases",
  "info": {
    "displayName": "Board Showcase",
    "description": "Présentation des boards (Women, Men, New Faces)"
  },
  "attributes": {
    "title": {
      "type": "string"
    },
    "boards": {
      "type": "component",
      "repeatable": true,
      "component": "sections.board-item"
    },
    "layout": {
      "type": "enumeration",
      "enum": ["horizontal", "vertical", "grid"],
      "default": "horizontal"
    }
  }
}
```

### 4.6 Component sections.board-item

**Créer** : `src/components/sections/board-item.json`
```json
{
  "collectionName": "components_sections_board_items",
  "info": {
    "displayName": "Board Item",
    "description": "Item individuel de board"
  },
  "attributes": {
    "boardType": {
      "type": "enumeration",
      "enum": ["women", "men", "new-faces"],
      "required": true
    },
    "title": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text"
    },
    "coverImage": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"],
      "required": true
    },
    "modelCount": {
      "type": "integer"
    },
    "linkText": {
      "type": "string"
    },
    "linkUrl": {
      "type": "string"
    }
  }
}
```

### 4.7 Component sections.text-content

**Créer** : `src/components/sections/text-content.json`
```json
{
  "collectionName": "components_sections_text_contents",
  "info": {
    "displayName": "Text Content",
    "description": "Section de contenu textuel"
  },
  "attributes": {
    "title": {
      "type": "string"
    },
    "content": {
      "type": "richtext",
      "required": true
    },
    "textAlign": {
      "type": "enumeration",
      "enum": ["left", "center", "right"],
      "default": "left"
    },
    "backgroundColor": {
      "type": "string"
    },
    "textColor": {
      "type": "string"
    },
    "padding": {
      "type": "enumeration",
      "enum": ["none", "small", "medium", "large"],
      "default": "medium"
    }
  }
}
```

### 4.8 Component sections.gallery

**Créer** : `src/components/sections/gallery.json`
```json
{
  "collectionName": "components_sections_galleries",
  "info": {
    "displayName": "Gallery",
    "description": "Galerie d'images/vidéos"
  },
  "attributes": {
    "title": {
      "type": "string"
    },
    "medias": {
      "type": "component",
      "repeatable": true,
      "component": "shared.media-block"
    },
    "layout": {
      "type": "enumeration",
      "enum": ["grid", "masonry", "carousel", "lightbox-grid"],
      "default": "grid"
    },
    "columns": {
      "type": "integer",
      "min": 1,
      "max": 6,
      "default": 3
    },
    "showLightbox": {
      "type": "boolean",
      "default": true
    }
  }
}
```

---

## 🏗️ PHASE 5: CONTENT TYPES PERSONNALISÉS (4h)

### 5.1 Collection Type: Model

**Créer** : `src/api/model/content-types/model/schema.json`
```json
{
  "kind": "collectionType",
  "collectionName": "models",
  "info": {
    "singularName": "model",
    "pluralName": "models",
    "displayName": "Model",
    "description": "Fashion models and talents"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true,
      "maxLength": 100,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "slug": {
      "type": "uid",
      "targetField": "name",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "bio": {
      "type": "richtext",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "gender": {
      "type": "enumeration",
      "enum": ["male", "female", "non-binary"],
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "nationality": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "city": {
      "type": "enumeration",
      "enum": ["Paris", "London", "Milan", "New York", "Los Angeles", "Sydney", "Tokyo"],
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "board": {
      "type": "enumeration",
      "enum": ["women", "men", "new-faces", "curve", "commercial"],
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "isNew": {
      "type": "boolean",
      "default": false,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "isFeatured": {
      "type": "boolean",
      "default": false,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "isAvailable": {
      "type": "boolean",
      "default": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "dateAdded": {
      "type": "date",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "profileImage": {
      "type": "media",
      "multiple": false,
      "required": true,
      "allowedTypes": ["images"],
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "portfolioImages": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images", "videos"],
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "measurements": {
      "type": "component",
      "repeatable": false,
      "component": "model.measurements",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "socials": {
      "type": "component",
      "repeatable": false,
      "component": "model.socials",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "compCardPdf": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["files"],
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "workExperience": {
      "type": "component",
      "repeatable": true,
      "component": "model.work-item"
    },
    "specialties": {
      "type": "json",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "languages": {
      "type": "json",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "photos": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::photo.photo",
      "mappedBy": "model"
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo"
    }
  }
}
```

### 5.2 Collection Type: Photo

**Créer** : `src/api/photo/content-types/photo/schema.json`
```json
{
  "kind": "collectionType",
  "collectionName": "photos",
  "info": {
    "singularName": "photo",
    "pluralName": "photos",
    "displayName": "Photo",
    "description": "Photos de portfolio mannequins"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "alt": {
      "type": "string",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "title": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "description": {
      "type": "text",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "category": {
      "type": "enumeration",
      "enum": ["digitals", "portfolio", "polaroid", "campaign", "editorial", "runway"],
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "subcategory": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "order": {
      "type": "integer",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "image": {
      "type": "media",
      "multiple": false,
      "required": true,
      "allowedTypes": ["images"],
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "photographer": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "stylist": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "makeupArtist": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "hairStylist": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "shootDate": {
      "type": "date",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "client": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "isFeatured": {
      "type": "boolean",
      "default": false,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "model": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::model.model",
      "inversedBy": "photos"
    },
    "tags": {
      "type": "json",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    }
  }
}
```

### 5.3 Single Type: Homepage

**Créer** : `src/api/homepage/content-types/homepage/schema.json`
```json
{
  "kind": "singleType",
  "collectionName": "homepages",
  "info": {
    "singularName": "homepage",
    "pluralName": "homepages",
    "displayName": "Homepage",
    "description": "Page d'accueil avec sections modulaires"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo",
      "required": true
    },
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.model-grid",
        "sections.featured-models",
        "sections.latest-editorial",
        "sections.board-showcase",
        "sections.text-content",
        "sections.gallery",
        "sections.contact-cta"
      ],
      "required": true,
      "min": 1
    }
  }
}
```

### 5.4 Single Type: Navigation

**Créer** : `src/api/navigation/content-types/navigation/schema.json`
```json
{
  "kind": "singleType",
  "collectionName": "navigations",
  "info": {
    "singularName": "navigation",
    "pluralName": "navigations",
    "displayName": "Navigation",
    "description": "Menu principal et navigation"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "logo": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"],
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "logoAlt": {
      "type": "string",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "menuItems": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.menu-item",
      "required": true
    },
    "ctaButton": {
      "type": "component",
      "repeatable": false,
      "component": "shared.cta-button"
    },
    "showSearch": {
      "type": "boolean",
      "default": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "showLanguageSwitch": {
      "type": "boolean",
      "default": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    }
  }
}
```

### 5.5 Single Type: Footer

**Créer** : `src/api/footer/content-types/footer/schema.json`
```json
{
  "kind": "singleType",
  "collectionName": "footers",
  "info": {
    "singularName": "footer",
    "pluralName": "footers",
    "displayName": "Footer",
    "description": "Pied de page"
  },
  "options": {
    "draftAndPublish": false
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "agencyDescription": {
      "type": "richtext",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "sections": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.footer-section"
    },
    "socialLinks": {
      "type": "component",
      "repeatable": true,
      "component": "shared.social-link"
    },
    "copyrightText": {
      "type": "string",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "legalLinks": {
      "type": "component",
      "repeatable": true,
      "component": "navigation.menu-item"
    }
  }
}
```

### 5.6 Collection Type: Page

**Créer** : `src/api/page/content-types/page/schema.json`
```json
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Page",
    "description": "Pages statiques du site"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "slug": {
      "type": "uid",
      "targetField": "title",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "shared.seo",
      "required": true
    },
    "sections": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.text-content",
        "sections.model-grid",
        "sections.gallery",
        "sections.contact-cta",
        "sections.form"
      ],
      "required": true,
      "min": 1
    },
    "showInNavigation": {
      "type": "boolean",
      "default": false,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "navigationOrder": {
      "type": "integer",
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    }
  }
}
```

### 5.7 Collection Type: Work Item

**Créer** : `src/api/work-item/content-types/work-item/schema.json`
```json
{
  "kind": "collectionType",
  "collectionName": "work_items",
  "info": {
    "singularName": "work-item",
    "pluralName": "work-items",
    "displayName": "Work Item",
    "description": "Travaux et campagnes des mannequins"
  },
  "options": {
    "draftAndPublish": true
  },
  "pluginOptions": {
    "i18n": {
      "localized": true
    }
  },
  "attributes": {
    "title": {
      "type": "string",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "client": {
      "type": "string",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "type": {
      "type": "enumeration",
      "enum": ["editorial", "campaign", "runway", "commercial", "e-commerce"],
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "date": {
      "type": "date",
      "required": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "description": {
      "type": "richtext",
      "pluginOptions": {
        "i18n": {
          "localized": true
        }
      }
    },
    "images": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images", "videos"],
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "models": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::model.model",
      "mappedBy": "workItems"
    },
    "credits": {
      "type": "component",
      "repeatable": false,
      "component": "work.credits"
    },
    "isPublic": {
      "type": "boolean",
      "default": true,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    },
    "isFeatured": {
      "type": "boolean",
      "default": false,
      "pluginOptions": {
        "i18n": {
          "localized": false
        }
      }
    }
  }
}
```

---

## 🏗️ PHASE 6: FORMS & APPLICATIONS (1h)

### 6.1 Collection Type: Contact Submission

**Créer** : `src/api/contact-submission/content-types/contact-submission/schema.json`
```json
{
  "kind": "collectionType",
  "collectionName": "contact_submissions",
  "info": {
    "singularName": "contact-submission",
    "pluralName": "contact-submissions",
    "displayName": "Contact Submission",
    "description": "Soumissions formulaires de contact"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "fullName": {
      "type": "string",
      "required": true
    },
    "email": {
      "type": "email",
      "required": true
    },
    "phone": {
      "type": "string"
    },
    "inquiryType": {
      "type": "enumeration",
      "enum": ["booking", "collaboration", "press", "general"],
      "required": true
    },
    "message": {
      "type": "text",
      "required": true
    },
    "company": {
      "type": "string"
    },
    "projectDetails": {
      "type": "richtext"
    },
    "budget": {
      "type": "enumeration",
      "enum": ["under-5k", "5k-15k", "15k-50k", "50k-plus", "undisclosed"]
    },
    "timeline": {
      "type": "string"
    },
    "attachments": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["files", "images"]
    },
    "status": {
      "type": "enumeration",
      "enum": ["new", "in-progress", "replied", "closed"],
      "default": "new"
    },
    "submittedAt": {
      "type": "datetime",
      "required": true
    },
    "locale": {
      "type": "enumeration",
      "enum": ["en", "fr"],
      "required": true
    }
  }
}
```

### 6.2 Collection Type: Model Application

**Créer** : `src/api/model-application/content-types/model-application/schema.json`
```json
{
  "kind": "collectionType",
  "collectionName": "model_applications",
  "info": {
    "singularName": "model-application",
    "pluralName": "model-applications",
    "displayName": "Model Application",
    "description": "Candidatures mannequins"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "firstName": {
      "type": "string",
      "required": true
    },
    "lastName": {
      "type": "string",
      "required": true
    },
    "email": {
      "type": "email",
      "required": true
    },
    "phone": {
      "type": "string",
      "required": true
    },
    "dateOfBirth": {
      "type": "date",
      "required": true
    },
    "gender": {
      "type": "enumeration",
      "enum": ["male", "female", "non-binary"],
      "required": true
    },
    "nationality": {
      "type": "string",
      "required": true
    },
    "city": {
      "type": "string",
      "required": true
    },
    "measurements": {
      "type": "component",
      "repeatable": false,
      "component": "model.measurements",
      "required": true
    },
    "experience": {
      "type": "enumeration",
      "enum": ["none", "amateur", "semi-professional", "professional"],
      "required": true
    },
    "portfolioPhotos": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images"],
      "required": true,
      "max": 10
    },
    "coverLetter": {
      "type": "richtext"
    },
    "socialLinks": {
      "type": "component",
      "repeatable": false,
      "component": "model.socials"
    },
    "availability": {
      "type": "enumeration",
      "enum": ["full-time", "part-time", "freelance", "student"],
      "required": true
    },
    "willingToTravel": {
      "type": "boolean",
      "default": true
    },
    "status": {
      "type": "enumeration",
      "enum": ["submitted", "reviewing", "interview", "accepted", "rejected"],
      "default": "submitted"
    },
    "submittedAt": {
      "type": "datetime",
      "required": true
    },
    "notes": {
      "type": "richtext"
    }
  }
}
```

---

## 🏗️ PHASE 7: SCRIPTS DE MIGRATION COMPLETS (3h)

### 7.1 Script principal de migration

**Créer** : `scripts/migrate-complete.js`
```javascript
#!/usr/bin/env node

/**
 * MIGRATION COMPLÈTE HUMAN PARIS → STRAPI 5 CMS
 *
 * Ce script migre TOUT le contenu depuis ../human_paris/src/lib/data/
 * vers le backend Strapi avec structure CMS complète
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN requis dans .env');
  process.exit(1);
}

console.log('🚀 MIGRATION COMPLÈTE HUMAN PARIS → STRAPI CMS');
console.log(`📡 URL: ${STRAPI_URL}`);

// Client API Strapi 5
class StrapiClient {
  constructor(url, token) {
    this.baseUrl = url;
    this.token = token;
  }

  async request(endpoint, method = 'GET', data = null) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };

    const options = { method, headers };
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    console.log(`📤 ${method} ${endpoint}`);
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return await response.json();
  }

  async get(endpoint) { return this.request(endpoint, 'GET'); }
  async post(endpoint, data) { return this.request(endpoint, 'POST', data); }
  async put(endpoint, data) { return this.request(endpoint, 'PUT', data); }
}

const strapi = new StrapiClient(STRAPI_URL, STRAPI_API_TOKEN);

/**
 * Upload d'images vers Strapi
 */
async function uploadImage(imagePath, fileName) {
  // Chemin vers les images du frontend
  const frontendImagePath = path.join(__dirname, '..', '..', 'human_paris', 'public', imagePath);

  if (!fs.existsSync(frontendImagePath)) {
    console.warn(`⚠️ Image non trouvée: ${frontendImagePath}`);
    return null;
  }

  const form = new FormData();
  form.append('files', fs.createReadStream(frontendImagePath), fileName);

  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      },
      body: form
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Image uploadée: ${fileName}`);
    return result[0];
  } catch (error) {
    console.error(`❌ Erreur upload ${fileName}:`, error.message);
    return null;
  }
}

/**
 * Charger les données mock depuis le frontend
 */
function loadMockData() {
  const modelsPath = path.join(__dirname, '..', '..', 'human_paris', 'src', 'lib', 'data', 'models.ts');
  const journalPath = path.join(__dirname, '..', '..', 'human_paris', 'src', 'lib', 'data', 'journal.ts');

  // Parser simple des fichiers TypeScript
  const modelsContent = fs.readFileSync(modelsPath, 'utf8');
  const journalContent = fs.readFileSync(journalPath, 'utf8');

  // Extraction basique (à améliorer avec un vrai parser)
  const models = extractExportFromTS(modelsContent, 'mockModelCards');
  const profiles = extractExportFromTS(modelsContent, 'mockModelProfiles');
  const articles = extractExportFromTS(journalContent, 'mockJournalPosts');

  return { models, profiles, articles };
}

function extractExportFromTS(content, exportName) {
  // Parser basique - à améliorer
  try {
    const regex = new RegExp(`export const ${exportName}[^=]*=([^;]+);`, 's');
    const match = content.match(regex);
    if (!match) return [];

    // Nettoyer et évaluer (dangereux mais pour migration seulement)
    let dataString = match[1].trim();
    dataString = dataString.replace(/: (ModelCard|ModelProfile|JournalPost|Author)\[\]/g, '');
    dataString = dataString.replace(/: Record<string, (ModelProfile|Author)>/g, '');

    return Function('"use strict"; return (' + dataString + ')')();
  } catch (error) {
    console.error(`Erreur parsing ${exportName}:`, error);
    return [];
  }
}

/**
 * Migration des auteurs
 */
async function migrateAuthors(articles) {
  console.log('\n👥 Migration des auteurs...');
  const authors = {};
  const uniqueAuthors = {};

  articles.forEach(article => {
    if (article.author && !uniqueAuthors[article.author.id]) {
      uniqueAuthors[article.author.id] = article.author;
    }
  });

  for (const [authorId, authorData] of Object.entries(uniqueAuthors)) {
    // Version EN
    const authorEN = await strapi.post('/authors', {
      data: {
        name: authorData.name,
        bio: authorData.bio,
        locale: 'en'
      }
    });

    // Version FR
    const authorFR = await strapi.post('/authors', {
      data: {
        name: authorData.name,
        bio: translateText(authorData.bio),
        locale: 'fr'
      }
    });

    authors[authorId] = { en: authorEN.data.id, fr: authorFR.data.id };
    console.log(`✅ Auteur créé: ${authorData.name}`);
  }

  return authors;
}

/**
 * Migration des modèles avec toutes leurs photos
 */
async function migrateModels(models, profiles) {
  console.log('\n🧑‍🦱 Migration des modèles...');
  const migratedModels = {};

  for (const model of models) {
    const profile = profiles[model.slug];
    if (!profile) continue;

    console.log(`\n📸 Migration: ${model.name}`);

    // Upload profile image
    let profileImageId = null;
    if (model.thumbnail) {
      const profileImage = await uploadImage(model.thumbnail, `${model.slug}-profile.jpg`);
      profileImageId = profileImage?.id;
    }

    // Upload portfolio images
    const portfolioImageIds = [];
    if (profile.photos) {
      for (const photo of profile.photos) {
        const uploadedImage = await uploadImage(photo.url, `${model.slug}-${photo.id}.jpg`);
        if (uploadedImage) {
          portfolioImageIds.push(uploadedImage.id);

          // Créer entrée Photo (EN)
          await strapi.post('/photos', {
            data: {
              alt: photo.alt,
              title: `${model.name} - ${photo.category}`,
              category: photo.category,
              order: photo.order,
              image: uploadedImage.id,
              locale: 'en'
            }
          });

          // Créer entrée Photo (FR)
          await strapi.post('/photos', {
            data: {
              alt: translateText(photo.alt),
              title: `${model.name} - ${photo.category}`,
              category: photo.category,
              order: photo.order,
              image: uploadedImage.id,
              locale: 'fr'
            }
          });
        }
      }
    }

    // Créer modèle EN
    const modelEN = await strapi.post('/models', {
      data: {
        name: model.name,
        slug: model.slug,
        bio: profile.bio || '',
        gender: model.gender,
        nationality: model.nationality,
        city: model.city,
        board: model.board,
        isNew: model.isNew || false,
        isFeatured: Math.random() > 0.7, // 30% featured aléatoirement
        dateAdded: profile.dateAdded,
        profileImage: profileImageId,
        portfolioImages: portfolioImageIds,
        measurements: profile.measurements ? {
          height: profile.measurements.height,
          bust: profile.measurements.bust,
          waist: profile.measurements.waist,
          hips: profile.measurements.hips,
          shoes: profile.measurements.shoes,
          hair: profile.measurements.hair,
          eyes: profile.measurements.eyes
        } : null,
        socials: profile.socials || null,
        locale: 'en'
      }
    });

    // Créer modèle FR
    const modelFR = await strapi.post('/models', {
      data: {
        name: model.name,
        slug: model.slug + '-fr',
        bio: translateText(profile.bio || ''),
        gender: model.gender,
        nationality: model.nationality,
        city: model.city,
        board: model.board,
        isNew: model.isNew || false,
        isFeatured: modelEN.data.attributes.isFeatured,
        dateAdded: profile.dateAdded,
        profileImage: profileImageId,
        portfolioImages: portfolioImageIds,
        measurements: profile.measurements,
        socials: profile.socials,
        locale: 'fr'
      }
    });

    migratedModels[model.slug] = {
      en: modelEN.data.id,
      fr: modelFR.data.id
    };

    console.log(`✅ Modèle migré: ${model.name}`);

    // Pause pour éviter surcharge API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return migratedModels;
}

/**
 * Migration des articles de journal
 */
async function migrateArticles(articles, authors) {
  console.log('\n📰 Migration des articles...');

  for (const article of articles) {
    // Upload cover image si nécessaire
    let coverImageId = null;
    if (article.coverImage && !article.coverImage.includes('placeholder')) {
      const coverImage = await uploadImage(article.coverImage, `article-${article.slug}-cover.jpg`);
      coverImageId = coverImage?.id;
    }

    const authorId = authors[article.author.id]?.[article.locale] || authors[article.author.id]?.en;

    await strapi.post('/articles', {
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        publishedAt: article.publishedAt,
        category: article.category,
        featured: article.featured,
        tags: article.tags,
        coverImage: coverImageId,
        author: authorId,
        locale: article.locale
      }
    });

    console.log(`✅ Article migré: ${article.title} (${article.locale})`);
  }
}

/**
 * Création des sections de landing page
 */
async function createLandingSections() {
  console.log('\n🏠 Création des sections landing...');

  const sections = [
    // Hero Section
    {
      sectionType: 'sections.hero',
      title: 'Human Models Paris',
      subtitle: 'Discover Exceptional Talent',
      description: 'Premier modeling agency representing the world\'s most promising faces in fashion, commercial, and editorial industries.',
      backgroundMedia: {
        mediaType: 'image',
        // Image sera uploadée séparément
      },
      ctaButtons: [
        {
          text: 'View Models',
          url: '/directory',
          style: 'primary',
          size: 'large'
        },
        {
          text: 'Book Talent',
          url: '/contact',
          style: 'outline',
          size: 'large'
        }
      ],
      textPosition: 'center',
      textColor: 'white',
      overlay: true,
      overlayOpacity: 40
    },

    // Featured Models Section
    {
      sectionType: 'sections.featured-models',
      title: 'Featured Talent',
      subtitle: 'Discover our most sought-after models',
      displayStyle: 'hero-grid',
      showBio: true,
      showMeasurements: false,
      autoRotate: false
    },

    // Latest Editorial Section
    {
      sectionType: 'sections.latest-editorial',
      title: 'Latest Editorial',
      subtitle: 'Behind the scenes and industry insights',
      articlesToShow: 6,
      categoryFilter: 'all',
      layout: 'featured-grid',
      showExcerpt: true,
      showAuthor: true,
      showDate: true
    },

    // Board Showcase Section
    {
      sectionType: 'sections.board-showcase',
      title: 'Our Boards',
      layout: 'horizontal',
      boards: [
        {
          boardType: 'women',
          title: 'Women',
          description: 'Elite female models for fashion, commercial, and editorial',
          linkText: 'View Women',
          linkUrl: '/directory/women'
        },
        {
          boardType: 'men',
          title: 'Men',
          description: 'Professional male models for all industries',
          linkText: 'View Men',
          linkUrl: '/directory/men'
        },
        {
          boardType: 'new-faces',
          title: 'New Faces',
          description: 'Fresh talent and emerging models',
          linkText: 'View New Faces',
          linkUrl: '/directory/new-faces'
        }
      ]
    }
  ];

  // Créer homepage avec sections EN
  await strapi.post('/homepage', {
    data: {
      seo: {
        metaTitle: 'Human Models Paris - Premier Modeling Agency',
        metaDescription: 'Discover exceptional modeling talent with Human Models Paris. Elite fashion models, commercial talent, and editorial stars.',
        keywords: 'modeling agency, paris, fashion models, commercial models, talent agency',
        preventIndexing: false
      },
      sections: sections,
      locale: 'en'
    }
  });

  // Version française
  const sectionsFR = sections.map(section => ({
    ...section,
    title: translateText(section.title),
    subtitle: translateText(section.subtitle),
    description: translateText(section.description)
  }));

  await strapi.post('/homepage', {
    data: {
      seo: {
        metaTitle: 'Human Models Paris - Agence de Mannequins Première',
        metaDescription: 'Découvrez des talents exceptionnels avec Human Models Paris. Mannequins mode, talents commerciaux et stars éditoriales.',
        keywords: 'agence mannequins, paris, modèles fashion, mannequins commerciaux, agence talent',
        preventIndexing: false
      },
      sections: sectionsFR,
      locale: 'fr'
    }
  });

  console.log('✅ Sections landing créées');
}

/**
 * Configuration navigation
 */
async function createNavigation() {
  console.log('\n🧭 Configuration navigation...');

  const menuItems = [
    {
      label: 'Models',
      url: '/directory',
      order: 1,
      subMenuItems: [
        { label: 'All Models', url: '/directory', order: 1 },
        { label: 'Women', url: '/directory/women', order: 2 },
        { label: 'Men', url: '/directory/men', order: 3 },
        { label: 'New Faces', url: '/directory/new-faces', order: 4 }
      ]
    },
    {
      label: 'Journal',
      url: '/journal',
      order: 2
    },
    {
      label: 'Become a Model',
      url: '/become',
      order: 3
    },
    {
      label: 'Contact',
      url: '/contact',
      order: 4
    }
  ];

  // Navigation EN
  await strapi.post('/navigation', {
    data: {
      logoAlt: 'Human Models Paris',
      menuItems: menuItems,
      ctaButton: {
        text: 'Book Talent',
        url: '/contact',
        style: 'primary'
      },
      showSearch: true,
      showLanguageSwitch: true,
      locale: 'en'
    }
  });

  // Navigation FR
  await strapi.post('/navigation', {
    data: {
      logoAlt: 'Human Models Paris',
      menuItems: menuItems.map(item => ({
        ...item,
        label: translateText(item.label),
        subMenuItems: item.subMenuItems?.map(sub => ({
          ...sub,
          label: translateText(sub.label)
        }))
      })),
      ctaButton: {
        text: 'Réserver un Talent',
        url: '/contact',
        style: 'primary'
      },
      showSearch: true,
      showLanguageSwitch: true,
      locale: 'fr'
    }
  });

  console.log('✅ Navigation configurée');
}

/**
 * Traductions basiques (à améliorer avec service de traduction)
 */
function translateText(englishText) {
  if (!englishText) return '';

  const translations = {
    'Models': 'Mannequins',
    'All Models': 'Tous les Mannequins',
    'Women': 'Femmes',
    'Men': 'Hommes',
    'New Faces': 'Nouveaux Visages',
    'Journal': 'Journal',
    'Become a Model': 'Devenir Mannequin',
    'Contact': 'Contact',
    'View Models': 'Voir les Mannequins',
    'Book Talent': 'Réserver un Talent',
    'Featured Talent': 'Talents Vedettes',
    'Latest Editorial': 'Derniers Éditoriaux',
    'Our Boards': 'Nos Divisions',
    'Discover exceptional talent': 'Découvrez des talents exceptionnels',
    'Elite female models': 'Mannequins féminins élite',
    'Professional male models': 'Mannequins masculins professionnels',
    'Fresh talent': 'Talents émergents'
  };

  let translated = englishText;
  Object.entries(translations).forEach(([en, fr]) => {
    translated = translated.replace(new RegExp(en, 'gi'), fr);
  });

  return translated;
}

/**
 * Migration principale
 */
async function main() {
  try {
    // Test connexion
    await strapi.get('/models?pagination[pageSize]=1');
    console.log('✅ Connexion Strapi OK');

    // Charger données mock
    const { models, profiles, articles } = loadMockData();
    console.log(`📊 Données chargées: ${models.length} modèles, ${articles.length} articles`);

    // Migration en séquence
    const authors = await migrateAuthors(articles);
    const migratedModels = await migrateModels(models, profiles);
    await migrateArticles(articles, authors);
    await createLandingSections();
    await createNavigation();

    console.log('\n🎉 MIGRATION COMPLÈTE TERMINÉE !');
    console.log('📝 Vérifiez dans l\'admin Strapi:');
    console.log(`   👤 ${models.length} Modèles`);
    console.log(`   📸 ~${models.length * 8} Photos`);
    console.log(`   📰 ${articles.length} Articles`);
    console.log(`   ✍️ ${Object.keys(authors).length} Auteurs`);
    console.log(`   🏠 1 Homepage avec sections dynamiques`);
    console.log(`   🧭 1 Navigation configurée`);

  } catch (error) {
    console.error('💥 Erreur migration:', error);
  }
}

// Exécution
if (require.main === module) {
  main();
}

module.exports = { main, migrateModels, migrateArticles };
```

### 7.2 Configuration script

**Créer** : `scripts/.env`
```bash
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-local-api-token-here
```

**Créer** : `scripts/package.json`
```json
{
  "name": "human-paris-migration",
  "version": "1.0.0",
  "scripts": {
    "migrate": "node migrate-complete.js",
    "migrate:local": "STRAPI_URL=http://localhost:1337 node migrate-complete.js",
    "migrate:cloud": "node migrate-complete.js"
  },
  "dependencies": {
    "form-data": "^4.0.0",
    "node-fetch": "^2.7.0"
  }
}
```

---

## 🏗️ PHASE 8: CONFIGURATION AVANCÉE (1h)

### 8.1 Lifecycle hooks

**Créer** : `src/api/model/content-types/model/lifecycles.ts`
```typescript
export default {
  async afterCreate(event) {
    const { result } = event;
    console.log(`Nouveau modèle créé: ${result.name}`);

    // Invalidation cache CDN si configuré
    if (process.env.CLOUDFLARE_ZONE_ID) {
      // Purger cache modèles
    }
  },

  async afterUpdate(event) {
    console.log(`Modèle mis à jour: ${event.result.name}`);
  }
};
```

### 8.2 Configuration des rôles

**Fichier** : `config/admin.ts`
```typescript
export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
```

---

## 🏗️ PHASE 9: DÉPLOIEMENT ET PRODUCTION (2h)

### 9.1 Configuration production

**Fichier** : `.env` (production)
```bash
NODE_ENV=production
APP_KEYS=your-app-keys-from-strapi-cloud
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret

# Base de données (auto-configurée par Strapi Cloud)
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...

# Upload (Strapi Cloud par défaut)
UPLOAD_PROVIDER=strapi-provider-upload-strapi-cloud
```

### 9.2 Script déploiement

**Créer** : `deploy.sh`
```bash
#!/bin/bash

echo "🚀 Déploiement Strapi CMS Human Paris"

# Build production
pnpm run build

# Commit changes
git add .
git commit -m "feat: complete CMS structure for modeling agency Human Paris"

# Push to trigger Strapi Cloud deployment
git push origin main

echo "✅ Déploiement déclenché sur Strapi Cloud"
echo "🔗 Suivre le progrès sur cloud.strapi.io"
```

---

## 🏗️ PHASE 10: TESTS ET VALIDATION (2h)

### 10.1 Tests API endpoints

**Créer** : `scripts/test-api.js`
```javascript
const tests = [
  'GET /api/models?populate=*&locale=en',
  'GET /api/models?populate=*&locale=fr',
  'GET /api/articles?populate=*&locale=en',
  'GET /api/homepage?populate[sections][on][sections.hero]=*&locale=en',
  'GET /api/navigation?populate=*&locale=fr',
  'GET /api/contact-info?locale=en'
];

async function runTests() {
  console.log('🧪 Tests API endpoints...');

  for (const test of tests) {
    try {
      const response = await fetch(`${STRAPI_URL}${test}`);
      const data = await response.json();
      console.log(`✅ ${test} - ${data.data?.length || 1} résultat(s)`);
    } catch (error) {
      console.error(`❌ ${test} - ${error.message}`);
    }
  }
}
```

---

## 📊 DONNÉES MOCK SOURCES À MIGRER

### Depuis ../human_paris/src/lib/data/

**models.ts** (20 modèles complets) :
- Elsa Hosk, Nara Aziza Smith, Olivia Ponton, Clara McGregor
- Dara Allen, Alexis Carrington, Vinnie Hacker, Wisdom Kaye
- Jordan Barrett, Anwar Hadid, Alton Mason, Christian Hogue
- Gigi Hadid, Bella Hadid, Chanel Iman, Emily DiDonato
- Rayna Vallandingham, Mason Barnes, Romeo Beckham, Alpha Dia

**Données par modèle** :
- Informations de base (nom, nationalité, ville, board)
- Bio complète en anglais
- Measurements détaillées (8 champs)
- 6-8 photos portfolio avec métadonnées
- Liens sociaux (Instagram/TikTok/Twitter)
- Date d'ajout et statut (isNew)

**journal.ts** (5 articles + 3 auteurs) :
- Articles bilingues français/anglais
- Catégories variées (news, editorial, interview)
- Images de couverture
- Relations auteurs
- Tags et métadonnées SEO

---

## 🎯 RÉSULTAT FINAL CMS

### 📊 Content Types Créés
- **Model** (Collection) - Mannequins avec relations complexes
- **Photo** (Collection) - Portfolio avec métadonnées créatives
- **Article** (Collection) - Journal/blog bilingue
- **Author** (Collection) - Journalistes et contributeurs
- **Work-Item** (Collection) - Campagnes et travaux
- **Homepage** (Single) - Page d'accueil avec dynamic zones
- **Navigation** (Single) - Menu principal
- **Footer** (Single) - Pied de page
- **Contact-Info** (Single) - Coordonnées agence
- **Page** (Collection) - Pages statiques (about, legal, etc.)

### 🧩 Components Modulaires
- **Sections** : Hero, Model Grid, Featured Models, Editorial, Gallery
- **Shared** : SEO, CTA Button, Media Block, Social Links
- **Navigation** : Menu Items, Footer Sections
- **Model** : Measurements, Socials, Work Experience
- **Forms** : Contact Fields, Application Fields

### 🎛️ Dynamic Zones
- **Homepage** : Sections modulaires configurables
- **Pages Custom** : Compositions flexibles de contenus
- **Landing Sections** : Hero + showcase + editorial + CTA

### 📱 Support Multi-Médias
- **Images** : Upload avec formats multiples, optimization
- **Vidéos** : Upload direct + URLs externes (YouTube, Vimeo)
- **Documents** : PDF comp cards, contrats, lookbooks
- **URLs Externes** : Liens vers portfolios externes, réseaux sociaux

### 🌐 i18n Intégré
- **Contenu bilingue** : Français/Anglais sur tous les types
- **Slugs localisés** : SEO optimisé par langue
- **Navigation traduite** : Menus et labels adaptés
- **Métadonnées SEO** : Par langue et par page

---

**DURÉE TOTALE** : 20-25h réparties sur 3-4 jours
**RÉSULTAT** : CMS ultra-complet reproduisant fidèlement toute l'architecture frontend Human Paris avec flexibilité maximale pour évolutions futures.