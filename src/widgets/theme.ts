/**
 * theme.ts — Theme Builder & single/archive template elements.
 * Used when building Elementor theme templates (headers, footers,
 * single post templates, archive templates, search results).
 */
import { genId, baseElement } from './core.js';

// ─── Site Logo ────────────────────────────────────────────────────────────────

export interface SiteLogoOpts {
  size?: 'thumbnail' | 'medium' | 'large' | 'full';
  linkTo?: 'site_url' | 'custom' | 'none';
  customUrl?: string;
  width?: number;
}

export function themeSiteLogo(opts: SiteLogoOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'theme-site-logo',
    ...baseElement(),
    settings: {
      image_size: opts.size ?? 'full',
      link_to: opts.linkTo ?? 'site_url',
      ...(opts.customUrl && { link: { url: opts.customUrl, is_external: false, nofollow: false, custom_attributes: '' } }),
      ...(opts.width && { width: { unit: 'px', size: opts.width, sizes: [] } }),
    },
  };
}

// ─── Site Title ───────────────────────────────────────────────────────────────

export interface SiteTitleOpts {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p';
  link?: string;
  size?: number;
  color?: string;
}

export function themeSiteTitle(opts: SiteTitleOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'theme-site-title',
    ...baseElement(),
    settings: {
      header_size: opts.tag ?? 'h2',
      ...(opts.link && { link: { url: opts.link, is_external: false, nofollow: false, custom_attributes: '' } }),
      ...(opts.size && {
        typography_typography: 'custom',
        typography_font_size: { unit: 'px', size: opts.size, sizes: [] },
      }),
      ...(opts.color && { title_color: opts.color }),
    },
  };
}

// ─── Page Title ───────────────────────────────────────────────────────────────

export function themePageTitle(opts: { tag?: string; size?: number; color?: string; align?: string } = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'theme-page-title',
    ...baseElement(),
    settings: {
      header_size: opts.tag ?? 'h1',
      ...(opts.size && { typography_typography: 'custom', typography_font_size: { unit: 'px', size: opts.size, sizes: [] } }),
      ...(opts.color && { title_color: opts.color }),
      ...(opts.align && { align: opts.align }),
    },
  };
}

// ─── Post Title ───────────────────────────────────────────────────────────────

export function themePostTitle(opts: { tag?: string; link?: boolean; size?: number; color?: string } = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'theme-post-title',
    ...baseElement(),
    settings: {
      header_size: opts.tag ?? 'h1',
      link_to: opts.link ? 'post' : 'none',
      ...(opts.size && { typography_typography: 'custom', typography_font_size: { unit: 'px', size: opts.size, sizes: [] } }),
      ...(opts.color && { title_color: opts.color }),
    },
  };
}

// ─── Archive Title ────────────────────────────────────────────────────────────

export function themeArchiveTitle(opts: { tag?: string; size?: number; color?: string } = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'theme-archive-title',
    ...baseElement(),
    settings: {
      header_size: opts.tag ?? 'h1',
      ...(opts.size && { typography_typography: 'custom', typography_font_size: { unit: 'px', size: opts.size, sizes: [] } }),
      ...(opts.color && { title_color: opts.color }),
    },
  };
}

// ─── Post Content ─────────────────────────────────────────────────────────────

export function themePostContent(): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'theme-post-content',
    ...baseElement(),
    settings: {},
  };
}

// ─── Post Excerpt ─────────────────────────────────────────────────────────────

export function themePostExcerpt(opts: { color?: string; fontSize?: number } = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'theme-post-excerpt',
    ...baseElement(),
    settings: {
      ...(opts.color && { text_color: opts.color }),
      ...(opts.fontSize && { typography_typography: 'custom', typography_font_size: { unit: 'px', size: opts.fontSize, sizes: [] } }),
    },
  };
}

// ─── Post Featured Image ──────────────────────────────────────────────────────

export function themePostFeaturedImage(opts: {
  size?: 'thumbnail' | 'medium' | 'large' | 'full';
  link?: boolean;
  openLightbox?: boolean;
  borderRadius?: number;
} = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'theme-post-featured-image',
    ...baseElement(),
    settings: {
      image_size: opts.size ?? 'large',
      link_to: opts.link ? 'post' : 'none',
      open_lightbox: opts.openLightbox ? 'yes' : 'default',
      ...(opts.borderRadius && {
        image_border_radius: {
          unit: 'px',
          top: String(opts.borderRadius), right: String(opts.borderRadius),
          bottom: String(opts.borderRadius), left: String(opts.borderRadius),
          isLinked: true,
        },
      }),
    },
  };
}

// ─── Post Info (meta: date, author, comments, time) ───────────────────────────

export type PostInfoType = 'author' | 'date' | 'time' | 'comments' | 'terms' | 'custom';

export interface PostInfoItem {
  type: PostInfoType;
  icon?: string;
  text?: string;   // for custom type
  link?: boolean;
}

export function themePostInfo(items: PostInfoItem[], opts: { view?: 'inline' | 'stacked'; iconColor?: string; textColor?: string } = {}): unknown {
  const list = items.map(item => ({
    type: item.type,
    selected_icon: { value: item.icon ?? defaultPostInfoIcon(item.type), library: 'fa-solid' },
    link: item.link ? 'yes' : '',
    custom_text: item.text ?? '',
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'post-info',
    ...baseElement(),
    settings: {
      icon_list: list,
      view: opts.view ?? 'inline',
      ...(opts.iconColor && { icon_color: opts.iconColor }),
      ...(opts.textColor && { text_color: opts.textColor }),
    },
  };
}

function defaultPostInfoIcon(type: PostInfoType): string {
  const map: Record<PostInfoType, string> = {
    author: 'fas fa-user', date: 'fas fa-calendar', time: 'fas fa-clock',
    comments: 'fas fa-comment', terms: 'fas fa-tag', custom: 'fas fa-info',
  };
  return map[type] ?? 'fas fa-info';
}

// ─── Post Navigation ──────────────────────────────────────────────────────────

export function themePostNavigation(opts: {
  showLabel?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  showArrows?: boolean;
  textColor?: string;
} = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'post-navigation',
    ...baseElement(),
    settings: {
      show_label: opts.showLabel !== false ? 'yes' : '',
      prev_label: opts.prevLabel ?? 'Previous',
      next_label: opts.nextLabel ?? 'Next',
      show_arrow: opts.showArrows !== false ? 'yes' : '',
      ...(opts.textColor && { arrow_color: opts.textColor }),
    },
  };
}

// ─── Post Comments ────────────────────────────────────────────────────────────

export function themePostComments(): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'post-comments',
    ...baseElement(),
    settings: {},
  };
}

// ─── Author Box ───────────────────────────────────────────────────────────────

export interface AuthorBoxOpts {
  source?: 'current' | 'custom';
  showAvatar?: boolean;
  avatarSize?: number;
  showName?: boolean;
  showBio?: boolean;
  showPosts?: boolean;
  postsText?: string;
  alignment?: 'left' | 'center' | 'right';
}

export function authorBox(opts: AuthorBoxOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'author-box',
    ...baseElement(),
    settings: {
      source: opts.source ?? 'current',
      show_avatar: opts.showAvatar !== false ? 'yes' : '',
      avatar_size: opts.avatarSize ?? 96,
      show_name: opts.showName !== false ? 'yes' : '',
      show_biography: opts.showBio !== false ? 'yes' : '',
      show_posts: opts.showPosts !== false ? 'yes' : '',
      link_text: opts.postsText ?? 'View all posts',
      text_align: opts.alignment ?? 'left',
    },
  };
}

// ─── Search Form (Theme) ──────────────────────────────────────────────────────

export interface SearchFormOpts {
  placeholder?: string;
  skin?: 'classic' | 'minimal' | 'full_screen';
  buttonType?: 'icon' | 'text';
  buttonText?: string;
  size?: number;
}

export function searchForm(opts: SearchFormOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'search-form',
    ...baseElement(),
    settings: {
      placeholder: opts.placeholder ?? 'Search...',
      skin: opts.skin ?? 'classic',
      button_type: opts.buttonType ?? 'icon',
      button_text: opts.buttonText ?? 'Search',
      size: opts.size ? { unit: 'px', size: opts.size, sizes: [] } : undefined,
    },
  };
}

// ─── Sitemap (Theme) ──────────────────────────────────────────────────────────

export interface SitemapItem {
  type: 'post_type' | 'taxonomy';
  postType?: string;
  taxonomy?: string;
}

export interface SitemapOpts {
  columns?: number;
  titleTag?: 'h2' | 'h3' | 'h4';
  addNofollow?: boolean;
}

export function sitemap(items: SitemapItem[], opts: SitemapOpts = {}): unknown {
  const sitemapItems = items.map(item => ({
    sitemap_type_selector: item.type,
    sitemap_post_type_selector: item.postType ?? 'post',
    sitemap_taxonomy_selector: item.taxonomy ?? 'category',
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'sitemap',
    ...baseElement(),
    settings: {
      sitemap_items: sitemapItems,
      sitemap_columns: String(opts.columns ?? 4),
      sitemap_title_tag: opts.titleTag ?? 'h2',
      sitemap_add_nofollow: opts.addNofollow ? 'yes' : '',
    },
  };
}

// ─── Archive Posts (Theme Archive) ───────────────────────────────────────────

export interface ArchivePostsOpts {
  skin?: 'archive_classic' | 'archive_cards' | 'archive_full_content';
  columns?: number;
  masonry?: boolean;
  thumbnail?: 'top' | 'left' | 'right' | 'none';
  imageSize?: 'thumbnail' | 'medium' | 'large';
  showExcerpt?: boolean;
  excerptLength?: number;
  showReadMore?: boolean;
  readMoreText?: string;
  /** Pass true for default meta (date + comments), or an array of: 'author','date','time','comments','modified' */
  showMeta?: boolean | string[];
  paginationType?: '' | 'numbers' | 'prev_next' | 'numbers_and_prev_next' | 'load_more_on_click' | 'load_more_infinite_scroll';
}

export function archivePosts(opts: ArchivePostsOpts = {}): unknown {
  const skin = opts.skin ?? 'archive_classic';
  const p = skin;

  const metaData: string[] = Array.isArray(opts.showMeta)
    ? opts.showMeta
    : (opts.showMeta ? ['date', 'comments'] : []);

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'archive-posts',
    ...baseElement(),
    settings: {
      _skin: skin,
      [`${p}_columns`]: String(opts.columns ?? 3),
      [`${p}_masonry`]: opts.masonry ? 'yes' : '',
      [`${p}_thumbnail`]: opts.thumbnail ?? 'top',
      [`${p}_thumbnail_size_size`]: opts.imageSize ?? 'medium',
      [`${p}_show_excerpt`]: opts.showExcerpt !== false ? 'yes' : '',
      [`${p}_excerpt_length`]: opts.excerptLength ?? 20,
      [`${p}_show_read_more`]: opts.showReadMore !== false ? 'yes' : '',
      [`${p}_read_more_text`]: opts.readMoreText ?? 'Read More »',
      [`${p}_meta_data`]: metaData,
      pagination_type: opts.paginationType ?? 'numbers',
    },
  };
}

// ─── Link in Bio ──────────────────────────────────────────────────────────────

export interface LinkInBioItem {
  text: string;
  url: string;
  icon?: string;
}

export interface LinkInBioOpts {
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  imageStyle?: 'profile' | 'cover';
  imageUrl?: string;
  heading?: string;
  title?: string;
  bgColor?: string;
  headingColor?: string;
}

export function linkInBio(links: LinkInBioItem[], opts: LinkInBioOpts = {}): unknown {
  const variant = opts.variant ?? 1;
  const widgetType = variant === 1 ? 'link-in-bio' : `link-in-bio-var-${variant}`;

  const ctaItems = links.map(link => ({
    button_text: link.text,
    button_link: { url: link.url, is_external: true, nofollow: false, custom_attributes: '' },
    ...(link.icon && { button_icon: { value: link.icon, library: 'fa-solid' } }),
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType,
    ...baseElement(),
    settings: {
      identity_image_style: opts.imageStyle ?? 'profile',
      bio_heading: opts.heading ?? '',
      bio_title: opts.title ?? '',
      cta: ctaItems,
      ...(opts.imageUrl && { identity_image: { url: opts.imageUrl, id: '', size: '' } }),
      ...(opts.bgColor && { background_color: opts.bgColor }),
      ...(opts.headingColor && { bio_heading_color: opts.headingColor }),
    },
  };
}

// ─── Facebook embeds ──────────────────────────────────────────────────────────

export function facebookButton(url: string, opts: { type?: 'like' | 'recommend'; showFaces?: boolean; size?: 'small' | 'large' } = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'facebook-button',
    ...baseElement(),
    settings: {
      url,
      button_type: opts.type ?? 'like',
      show_faces: opts.showFaces ? 'yes' : '',
      size: opts.size ?? 'small',
    },
  };
}

export function facebookComments(url: string, opts: { numPosts?: number; darkScheme?: boolean } = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'facebook-comments',
    ...baseElement(),
    settings: {
      url,
      num_posts: opts.numPosts ?? 5,
      color_scheme: opts.darkScheme ? 'dark' : 'light',
    },
  };
}

export function facebookEmbed(url: string, opts: { width?: number; showText?: boolean; showCover?: boolean } = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'facebook-embed',
    ...baseElement(),
    settings: {
      url,
      width: opts.width ?? 340,
      show_text: opts.showText ? 'yes' : '',
      show_cover_photo: opts.showCover !== false ? 'yes' : '',
    },
  };
}

export function facebookPage(url: string, opts: { width?: number; height?: number; tabs?: string[]; smallHeader?: boolean } = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'facebook-page',
    ...baseElement(),
    settings: {
      url,
      width: opts.width ?? 340,
      height: opts.height ?? 500,
      tabs: (opts.tabs ?? ['timeline', 'events']).join(','),
      small_header: opts.smallHeader ? 'yes' : '',
    },
  };
}
