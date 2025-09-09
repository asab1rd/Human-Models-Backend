# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Strapi v5 headless CMS backend for a multilingual blog/content management system. It uses TypeScript and better-sqlite3 as the default database.

## Development Commands

- `pnpm dev` or `pnpm develop` - Start development server with autoReload
- `pnpm build` - Build the admin panel
- `pnpm start` - Start production server (no autoReload)
- `pnpm seed:example` - Seed database with example content
- `pnpm strapi` - Access Strapi CLI commands directly

## Architecture

### Content Types
The system has five main content types:

**Collection Types:**
- `article` - Blog articles with title, description, slug, cover, author, category, and dynamic blocks
- `author` - Author profiles with avatar and bio
- `category` - Article categories

**Single Types:**
- `global` - Site-wide settings (siteName, favicon, siteDescription, defaultSeo)
- `about` - About page content

### Shared Components
Located in `src/components/shared/`:
- `media` - File uploads (images, videos, documents)
- `rich-text` - Rich text content blocks
- `quote` - Quote blocks with attribution
- `seo` - SEO metadata component
- `slider` - Image gallery/slider

### Dynamic Content
Articles use a dynamic zone called `blocks` that can contain any combination of shared components (media, quote, rich-text, slider).

### Internationalization
- Configured for English (en) and French (fr) locales
- Default locale: English
- i18n plugin enabled in `config/plugins.ts`

### Database
- Uses better-sqlite3 by default (configured in `config/database.ts`)
- Supports MySQL and PostgreSQL via environment variables
- Database file location: `.tmp/data.db`

### API Structure
Each content type follows Strapi's standard structure:
- `src/api/{content-type}/controllers/` - Request handlers
- `src/api/{content-type}/services/` - Business logic
- `src/api/{content-type}/routes/` - Route definitions
- `src/api/{content-type}/content-types/{content-type}/schema.json` - Content type schema

### Seeding Data
The `scripts/seed.js` file provides comprehensive seeding functionality:
- Imports sample content from `data/data.json`
- Handles file uploads and media associations
- Sets up public permissions for content types
- Only runs on first setup (tracked via plugin store)