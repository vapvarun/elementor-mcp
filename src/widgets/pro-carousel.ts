import { genId, baseElement } from './core.js';

// ─── Slides (Pro) ─────────────────────────────────────────────────────────────

export interface Slide {
  heading: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  bgImageUrl?: string;
  bgColor?: string;
  textColor?: string;
}

export interface SlidesOpts {
  height?: number;
  navigation?: 'both' | 'arrows' | 'dots' | 'none';
  autoplay?: boolean;
  autoplaySpeed?: number;
  loop?: boolean;
  transition?: 'slide' | 'fade';
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  overlay?: 'none' | 'classic' | 'gradient';
  overlayColor?: string;
}

export function slides(items: Slide[], opts: SlidesOpts = {}): unknown {
  const slideItems = items.map(slide => {
    const s: Record<string, unknown> = {
      heading: slide.heading,
      description: slide.description ?? '',
    };
    if (slide.bgImageUrl) s.background_image = { url: slide.bgImageUrl, id: '', size: '' };
    if (slide.bgColor) { s.background_overlay_color = slide.bgColor; s.background_color = slide.bgColor; }
    if (slide.textColor) s.heading_color = slide.textColor;
    if (slide.buttonText) { s.button_text = slide.buttonText; s.button_type = 'button'; }
    if (slide.buttonUrl) s.link = { url: slide.buttonUrl, is_external: false, nofollow: false, custom_attributes: '' };
    return s;
  });

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'slides',
    ...baseElement(),
    settings: {
      slides: slideItems,
      slides_height: { unit: 'px', size: opts.height ?? 500, sizes: [] },
      navigation: opts.navigation ?? 'both',
      autoplay: opts.autoplay !== false ? 'yes' : '',
      pause_on_hover: 'yes',
      pause_on_interaction: 'yes',
      autoplay_speed: opts.autoplaySpeed ?? 5000,
      infinite: opts.loop !== false ? 'yes' : '',
      transition: opts.transition ?? 'slide',
      slides_title_tag: opts.titleTag ?? 'h2',
      overlay: opts.overlay ?? 'classic',
      ...(opts.overlayColor && { background_overlay_color: opts.overlayColor }),
    },
  };
}

// ─── Testimonial Carousel (Pro) ───────────────────────────────────────────────

export interface TestimonialSlide {
  content: string;
  name: string;
  title?: string;
  company?: string;
  imageUrl?: string;
  rating?: number;
  link?: string;
}

export interface TestimonialCarouselOpts {
  skin?: 'default' | 'bubble';
  layout?: 'image_inline' | 'image_stacked' | 'image_above' | 'image_left';
  alignment?: 'left' | 'center' | 'right';
  slidesPerView?: 1 | 2 | 3;
  autoplay?: boolean;
  autoplaySpeed?: number;
  loop?: boolean;
  navigation?: 'arrows' | 'dots' | 'both' | 'none';
}

export function testimonialCarousel(items: TestimonialSlide[], opts: TestimonialCarouselOpts = {}): unknown {
  const slides = items.map(item => ({
    content: item.content,
    name: item.name,
    title: item.title ?? '',
    company: item.company ?? '',
    ...(item.imageUrl && { image: { url: item.imageUrl, id: '', size: '' } }),
    ...(item.rating !== undefined && { rating: { value: item.rating } }),
    ...(item.link && { link: { url: item.link, is_external: false, nofollow: false, custom_attributes: '' } }),
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'testimonial-carousel',
    ...baseElement(),
    settings: {
      slides,
      skin: opts.skin ?? 'default',
      layout: opts.layout ?? 'image_inline',
      alignment: opts.alignment ?? 'center',
      slides_per_view: String(opts.slidesPerView ?? ''),
      autoplay: opts.autoplay !== false ? 'yes' : '',
      autoplay_speed: opts.autoplaySpeed ?? 5000,
      infinite: opts.loop !== false ? 'yes' : '',
      show_arrows: opts.navigation !== 'dots' && opts.navigation !== 'none' ? 'yes' : '',
      pagination: opts.navigation !== 'arrows' && opts.navigation !== 'none' ? 'yes' : '',
    },
  };
}

// ─── Media Carousel (Pro) ─────────────────────────────────────────────────────

export interface MediaCarouselItem {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface MediaCarouselOpts {
  slidesPerView?: number;
  autoplay?: boolean;
  loop?: boolean;
  navigation?: 'both' | 'arrows' | 'dots' | 'none';
  imageSize?: 'thumbnail' | 'medium' | 'large' | 'full';
}

export function mediaCarousel(items: MediaCarouselItem[], opts: MediaCarouselOpts = {}): unknown {
  const slides = items.map(item => ({
    _id: Math.random().toString(36).slice(2, 9),
    type: item.type,
    image: item.type === 'image' ? { url: item.url, id: '', size: '' } : undefined,
    video_url: item.type === 'video' ? item.url : undefined,
    caption: item.caption ?? '',
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'media-carousel',
    ...baseElement(),
    settings: {
      slides,
      image_size: opts.imageSize ?? 'medium_large',
      slides_count: String(opts.slidesPerView ?? 2),
      autoplay: opts.autoplay ? 'yes' : '',
      loop: opts.loop ? 'yes' : '',
      navigation: opts.navigation ?? 'both',
    },
  };
}

// ─── Loop Carousel (Pro) ──────────────────────────────────────────────────────

export interface LoopCarouselOpts {
  templateId?: number;
  postsPerPage?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  loop?: boolean;
  navigation?: 'both' | 'arrows' | 'dots' | 'none';
  slidesPerView?: number;
}

export function loopCarousel(opts: LoopCarouselOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'loop-carousel',
    ...baseElement(),
    settings: {
      template_id: opts.templateId ?? '',
      posts_per_page: opts.postsPerPage ?? 6,
      autoplay: opts.autoplay ? 'yes' : '',
      autoplay_speed: opts.autoplaySpeed ?? 5000,
      infinite: opts.loop ? 'yes' : '',
      slides_per_view: String(opts.slidesPerView ?? 3),
      navigation: opts.navigation ?? 'both',
    },
  };
}

// ─── Posts Grid (Pro) ─────────────────────────────────────────────────────────

export interface PostsOpts {
  postType?: string;
  postsPerPage?: number;
  columns?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  orderBy?: 'date' | 'title' | 'rand' | 'menu_order';
  order?: 'desc' | 'asc';
  skin?: 'classic' | 'cards' | 'full_content';
  /** Image position (also controls visibility — 'none' hides image) */
  imagePosition?: 'top' | 'left' | 'right' | 'none';
  showTitle?: boolean;
  showExcerpt?: boolean;
  /** Pass true to show date + comments meta, or an array of: 'author','date','time','comments','modified' */
  showMeta?: boolean | string[];
  showReadMore?: boolean;
  readMoreText?: string;
  /** Include posts in these term IDs (categories, tags, or any taxonomy) */
  includeTermIds?: number[];
  excludeIds?: number[];
  imageSize?: 'thumbnail' | 'medium' | 'large' | 'full';
  imageHeight?: number;
  excerptLength?: number;
  paginationType?: '' | 'numbers' | 'prev_next' | 'numbers_and_prev_next' | 'load_more_on_click' | 'load_more_infinite_scroll';
}

export function posts(opts: PostsOpts = {}): unknown {
  const skin = opts.skin ?? 'classic';
  const p = skin; // skin-prefixed control helper

  const metaData: string[] = Array.isArray(opts.showMeta)
    ? opts.showMeta
    : (opts.showMeta ? ['date', 'comments'] : []);

  const s: Record<string, unknown> = {
    _skin: skin,
    // Query group controls (prefixed with widget name 'posts')
    posts_post_type: opts.postType ?? 'post',
    posts_orderby: opts.orderBy ?? 'date',
    posts_order: opts.order ?? 'desc',
    // Pagination (widget-level, not skin-prefixed)
    pagination_type: opts.paginationType ?? '',
    // Skin controls (prefixed with skin id)
    [`${p}_posts_per_page`]: opts.postsPerPage ?? 6,
    [`${p}_columns`]: String(opts.columns ?? 3),
    [`${p}_columns_tablet`]: String(opts.columnsTablet ?? 2),
    [`${p}_columns_mobile`]: String(opts.columnsMobile ?? 1),
    [`${p}_thumbnail`]: opts.imagePosition ?? 'top',
    [`${p}_thumbnail_size_size`]: opts.imageSize ?? 'medium',
    [`${p}_item_ratio`]: { unit: '%', size: opts.imageHeight ?? 56.25 },
    [`${p}_show_title`]: opts.showTitle !== false ? 'yes' : '',
    [`${p}_show_excerpt`]: opts.showExcerpt !== false ? 'yes' : '',
    [`${p}_excerpt_length`]: opts.excerptLength ?? 20,
    [`${p}_show_read_more`]: opts.showReadMore !== false ? 'yes' : '',
    [`${p}_read_more_text`]: opts.readMoreText ?? 'Read More »',
    [`${p}_meta_data`]: metaData,
  };

  if (opts.includeTermIds?.length) {
    s.posts_include = ['terms'];
    s.posts_include_term_ids = opts.includeTermIds;
  }

  if (opts.excludeIds?.length) {
    s.posts_exclude = ['manual_selection'];
    s.posts_exclude_ids = opts.excludeIds;
  }

  return { id: genId(), elType: 'widget', widgetType: 'posts', ...baseElement(), settings: s };
}

// ─── Portfolio (Pro) ──────────────────────────────────────────────────────────

export interface PortfolioOpts {
  postType?: string;
  postsPerPage?: number;
  columns?: number;
  showFilter?: boolean;
  filterTaxonomy?: string;
  hoverEffect?: 'none' | 'zoomin' | 'zoomout' | 'moveup' | 'grayscale';
}

export function portfolio(opts: PortfolioOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'portfolio',
    ...baseElement(),
    settings: {
      post_type: opts.postType ?? 'post',
      posts_per_page: opts.postsPerPage ?? 6,
      columns: opts.columns ?? 3,
      show_filter: opts.showFilter ? 'yes' : '',
      taxonomy_filter: opts.filterTaxonomy ?? 'category',
      hover_effect: opts.hoverEffect ?? 'zoomin',
    },
  };
}

// ─── Nested Carousel (Pro) ────────────────────────────────────────────────────

export interface NestedCarouselOpts {
  name?: string;
  slidesPerView?: number;
  slidesPerViewTablet?: number;
  slidesPerViewMobile?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  loop?: boolean;
  navigation?: 'both' | 'arrows' | 'dots' | 'none';
}

export function nestedCarousel(slideCount = 3, opts: NestedCarouselOpts = {}): unknown {
  const items = Array.from({ length: slideCount }, (_, i) => ({
    slide_title: `Slide #${i + 1}`,
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'nested-carousel',
    ...baseElement(),
    settings: {
      carousel_name: opts.name ?? 'Carousel',
      carousel_items: items,
      slides_to_show: String(opts.slidesPerView ?? ''),
      slides_to_show_tablet: String(opts.slidesPerViewTablet ?? 2),
      slides_to_show_mobile: String(opts.slidesPerViewMobile ?? 1),
      autoplay: opts.autoplay ? 'yes' : '',
      autoplay_speed: opts.autoplaySpeed ?? 5000,
      loop: opts.loop ? 'yes' : '',
      navigation: opts.navigation ?? 'both',
    },
  };
}

// ─── Mega Menu (Pro / Theme) ──────────────────────────────────────────────────

export interface MegaMenuOpts {
  menu?: string;
  layout?: 'horizontal' | 'vertical' | 'dropdown';
  contentWidth?: 'full_width' | 'boxed';
  itemLayout?: 'horizontal' | 'vertical';
  pointer?: 'none' | 'underline' | 'overline' | 'framed' | 'background';
  mobileLayout?: 'accordion' | 'full_screen';
  itemColor?: string;
  itemHoverColor?: string;
  bgColor?: string;
}

export function megaMenu(opts: MegaMenuOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'mega-menu',
    ...baseElement(),
    settings: {
      menu: opts.menu ?? '',
      content_width: opts.contentWidth ?? 'full_width',
      item_layout: opts.itemLayout ?? 'horizontal',
      pointer: opts.pointer ?? 'underline',
      ...(opts.itemColor && { color_menu_item: opts.itemColor }),
      ...(opts.itemHoverColor && { color_menu_item_hover: opts.itemHoverColor }),
      ...(opts.bgColor && { background_color: opts.bgColor }),
    },
  };
}
