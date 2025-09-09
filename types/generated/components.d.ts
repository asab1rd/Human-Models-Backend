import type { Schema, Struct } from '@strapi/strapi';

export interface ModelMeasurements extends Struct.ComponentSchema {
  collectionName: 'components_model_measurements';
  info: {
    description: 'Model body measurements';
    displayName: 'Model Measurements';
  };
  attributes: {
    bust: Schema.Attribute.String;
    dress: Schema.Attribute.String;
    eyes: Schema.Attribute.String;
    hair: Schema.Attribute.String;
    height: Schema.Attribute.String;
    hips: Schema.Attribute.String;
    shoes: Schema.Attribute.String;
    waist: Schema.Attribute.String;
    weight: Schema.Attribute.String;
  };
}

export interface ModelSocials extends Struct.ComponentSchema {
  collectionName: 'components_model_socials';
  info: {
    description: 'Model social media profiles';
    displayName: 'Model Social Links';
  };
  attributes: {
    instagram: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    tiktok: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
    website: Schema.Attribute.String;
  };
}

export interface ModelWorkItem extends Struct.ComponentSchema {
  collectionName: 'components_model_work_items';
  info: {
    description: 'Individual work experience entry';
    displayName: 'Work Item';
  };
  attributes: {
    client: Schema.Attribute.String & Schema.Attribute.Required;
    date: Schema.Attribute.Date & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    images: Schema.Attribute.Media<'images' | 'videos', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<
      ['editorial', 'campaign', 'runway', 'commercial', 'e-commerce']
    > &
      Schema.Attribute.Required;
  };
}

export interface NavigationFooterSection extends Struct.ComponentSchema {
  collectionName: 'components_navigation_footer_sections';
  info: {
    description: 'Footer content section';
    displayName: 'Footer Section';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    links: Schema.Attribute.Component<'navigation.menu-item', true>;
    order: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_menu_items';
  info: {
    description: 'Navigation menu item with sub-menus';
    displayName: 'Menu Item';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.Required;
    subMenuItems: Schema.Attribute.Component<'navigation.sub-menu-item', true>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface NavigationSubMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_sub_menu_items';
  info: {
    description: 'Sub-menu navigation item';
    displayName: 'Sub Menu Item';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsBoardItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_board_items';
  info: {
    description: 'Individual board item';
    displayName: 'Board Item';
  };
  attributes: {
    boardType: Schema.Attribute.Enumeration<['women', 'men', 'new-faces']> &
      Schema.Attribute.Required;
    coverImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    linkText: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
    modelCount: Schema.Attribute.Integer;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsBoardShowcase extends Struct.ComponentSchema {
  collectionName: 'components_sections_board_showcases';
  info: {
    description: 'Model boards presentation (Women, Men, New Faces)';
    displayName: 'Board Showcase';
  };
  attributes: {
    boards: Schema.Attribute.Component<'sections.board-item', true>;
    layout: Schema.Attribute.Enumeration<['horizontal', 'vertical', 'grid']> &
      Schema.Attribute.DefaultTo<'horizontal'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsContactCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_ctas';
  info: {
    description: 'Contact call-to-action section';
    displayName: 'Contact CTA';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    contactInfo: Schema.Attribute.Component<'shared.social-link', true>;
    description: Schema.Attribute.RichText;
    primaryButton: Schema.Attribute.Component<'shared.cta-button', false>;
    secondaryButton: Schema.Attribute.Component<'shared.cta-button', false>;
    style: Schema.Attribute.Enumeration<['default', 'overlay', 'minimal']> &
      Schema.Attribute.DefaultTo<'default'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFeaturedModels extends Struct.ComponentSchema {
  collectionName: 'components_sections_featured_models';
  info: {
    description: 'Showcase of selected models';
    displayName: 'Featured Models';
  };
  attributes: {
    autoRotate: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    displayStyle: Schema.Attribute.Enumeration<
      ['carousel', 'grid', 'hero-grid', 'spotlight']
    > &
      Schema.Attribute.DefaultTo<'carousel'>;
    models: Schema.Attribute.Relation<'manyToMany', 'api::model.model'>;
    rotationSpeed: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10000;
          min: 3000;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5000>;
    showBio: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showMeasurements: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_forms';
  info: {
    description: 'Form section for pages';
    displayName: 'Form Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    fields: Schema.Attribute.JSON;
    formType: Schema.Attribute.Enumeration<
      ['contact', 'booking', 'application', 'newsletter']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'contact'>;
    redirectUrl: Schema.Attribute.String;
    submitText: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Submit'>;
    successMessage: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_galleries';
  info: {
    description: 'Image/video gallery for sections';
    displayName: 'Gallery Section';
  };
  attributes: {
    columns: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<3>;
    layout: Schema.Attribute.Enumeration<
      ['grid', 'masonry', 'carousel', 'lightbox-grid']
    > &
      Schema.Attribute.DefaultTo<'grid'>;
    medias: Schema.Attribute.Component<'shared.media-block', true>;
    showLightbox: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Hero section with media background and CTA';
    displayName: 'Hero Section';
  };
  attributes: {
    backgroundMedia: Schema.Attribute.Component<'shared.media-block', false> &
      Schema.Attribute.Required;
    ctaButtons: Schema.Attribute.Component<'shared.cta-button', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
        },
        number
      >;
    description: Schema.Attribute.RichText;
    overlay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    overlayOpacity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<30>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    textColor: Schema.Attribute.Enumeration<['white', 'black', 'auto']> &
      Schema.Attribute.DefaultTo<'white'>;
    textPosition: Schema.Attribute.Enumeration<
      ['left', 'center', 'right', 'bottom-left', 'bottom-center']
    > &
      Schema.Attribute.DefaultTo<'center'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface SectionsLatestEditorial extends Struct.ComponentSchema {
  collectionName: 'components_sections_latest_editorials';
  info: {
    description: 'Latest editorial content section';
    displayName: 'Latest Editorial';
  };
  attributes: {
    articlesToShow: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    categoryFilter: Schema.Attribute.Enumeration<
      ['all', 'news', 'editorial', 'interview', 'behind-the-scenes']
    > &
      Schema.Attribute.DefaultTo<'all'>;
    layout: Schema.Attribute.Enumeration<
      ['grid', 'list', 'featured-grid', 'masonry']
    > &
      Schema.Attribute.DefaultTo<'featured-grid'>;
    showAuthor: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showDate: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showExcerpt: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsModelGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_model_grids';
  info: {
    description: 'Grid of models with filters';
    displayName: 'Model Grid';
  };
  attributes: {
    boardFilter: Schema.Attribute.Enumeration<
      ['all', 'women', 'men', 'new-faces']
    > &
      Schema.Attribute.DefaultTo<'all'>;
    ctaButton: Schema.Attribute.Component<'shared.cta-button', false>;
    featuredModels: Schema.Attribute.Relation<'manyToMany', 'api::model.model'>;
    gridType: Schema.Attribute.Enumeration<
      ['featured', 'board', 'search', 'custom']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'featured'>;
    layout: Schema.Attribute.Enumeration<
      ['2-columns', '3-columns', '4-columns', 'masonry', 'carousel']
    > &
      Schema.Attribute.DefaultTo<'3-columns'>;
    maxModels: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<12>;
    showFilters: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showPagination: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showSearch: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTextContent extends Struct.ComponentSchema {
  collectionName: 'components_sections_text_contents';
  info: {
    description: 'Rich text content section';
    displayName: 'Text Content';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    padding: Schema.Attribute.Enumeration<
      ['none', 'small', 'medium', 'large']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    textAlign: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
    textColor: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta_buttons';
  info: {
    description: 'Call-to-action button';
    displayName: 'CTA Button';
  };
  attributes: {
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large']> &
      Schema.Attribute.DefaultTo<'medium'>;
    style: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'link']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMediaBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_blocks';
  info: {
    description: 'Universal media block (image/video/URL)';
    displayName: 'Media Block';
  };
  attributes: {
    alt: Schema.Attribute.String;
    aspectRatio: Schema.Attribute.Enumeration<
      ['1:1', '3:4', '4:3', '16:9', '21:9', 'auto']
    > &
      Schema.Attribute.DefaultTo<'auto'>;
    caption: Schema.Attribute.Text;
    externalUrl: Schema.Attribute.String;
    externalVideoUrl: Schema.Attribute.String;
    gallery: Schema.Attribute.Media<'images', true>;
    image: Schema.Attribute.Media<'images'>;
    mediaType: Schema.Attribute.Enumeration<
      ['image', 'video', 'gallery', 'external-video', 'external-url']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'image'>;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Individual social media link';
    displayName: 'Social Link';
  };
  attributes: {
    isPublic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    platform: Schema.Attribute.Enumeration<
      [
        'instagram',
        'facebook',
        'twitter',
        'linkedin',
        'tiktok',
        'youtube',
        'website',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    username: Schema.Attribute.String;
  };
}

export interface WorkCredits extends Struct.ComponentSchema {
  collectionName: 'components_work_credits';
  info: {
    description: 'Photo shoot and campaign credits';
    displayName: 'Work Credits';
  };
  attributes: {
    agency: Schema.Attribute.String;
    hairStylist: Schema.Attribute.String;
    location: Schema.Attribute.String;
    makeupArtist: Schema.Attribute.String;
    photographer: Schema.Attribute.String;
    production: Schema.Attribute.String;
    retoucher: Schema.Attribute.String;
    stylist: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'model.measurements': ModelMeasurements;
      'model.socials': ModelSocials;
      'model.work-item': ModelWorkItem;
      'navigation.footer-section': NavigationFooterSection;
      'navigation.menu-item': NavigationMenuItem;
      'navigation.sub-menu-item': NavigationSubMenuItem;
      'sections.board-item': SectionsBoardItem;
      'sections.board-showcase': SectionsBoardShowcase;
      'sections.contact-cta': SectionsContactCta;
      'sections.featured-models': SectionsFeaturedModels;
      'sections.form': SectionsForm;
      'sections.gallery': SectionsGallery;
      'sections.hero': SectionsHero;
      'sections.latest-editorial': SectionsLatestEditorial;
      'sections.model-grid': SectionsModelGrid;
      'sections.text-content': SectionsTextContent;
      'shared.cta-button': SharedCtaButton;
      'shared.media': SharedMedia;
      'shared.media-block': SharedMediaBlock;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.social-link': SharedSocialLink;
      'work.credits': WorkCredits;
    }
  }
}
