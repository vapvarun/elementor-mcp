import { genId, baseElement } from './core.js';

// ─── Call to Action (Pro) ─────────────────────────────────────────────────────

export interface CTAWidgetOpts {
  skin?: 'classic' | 'cover';
  layout?: 'left' | 'above' | 'right' | 'below';
  bgImageUrl?: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonType?: 'button' | 'boxed';
  ribbonText?: string;
  titleColor?: string;
  descColor?: string;
  bgColor?: string;
  btnBgColor?: string;
  btnTextColor?: string;
}

export function ctaWidget(opts: CTAWidgetOpts): unknown {
  const s: Record<string, unknown> = {
    skin: opts.skin ?? 'classic',
    layout: opts.layout ?? 'above',
    title: opts.title,
    description: opts.description ?? '',
    graphic_element: 'none',
  };

  if (opts.bgImageUrl) s.bg_image = { url: opts.bgImageUrl, id: '', size: '' };
  if (opts.bgColor) {
    s.background_background = 'classic';
    s.background_color = opts.bgColor;
  }

  if (opts.buttonText && opts.buttonUrl) {
    s.button = opts.buttonText;
    s.link = { url: opts.buttonUrl, is_external: false, nofollow: false, custom_attributes: '' };
  }

  if (opts.ribbonText) {
    s.show_ribbon = 'yes';
    s.ribbon_title = opts.ribbonText;
  }

  if (opts.titleColor) s.title_color = opts.titleColor;
  if (opts.descColor) s.description_color = opts.descColor;
  if (opts.btnBgColor) s.button_background_color = opts.btnBgColor;
  if (opts.btnTextColor) s.button_text_color = opts.btnTextColor;

  return { id: genId(), elType: 'widget', widgetType: 'call-to-action', ...baseElement(), settings: s };
}

// ─── Flip Box (Pro) ───────────────────────────────────────────────────────────

export interface FlipBoxOpts {
  frontIcon?: string;
  frontImageUrl?: string;
  frontTitle: string;
  frontDescription?: string;
  frontBgColor?: string;
  frontTextColor?: string;
  backTitle: string;
  backDescription?: string;
  backBgColor?: string;
  backTextColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  flipDirection?: 'left' | 'right' | 'up' | 'down';
}

export function flipBox(opts: FlipBoxOpts): unknown {
  const s: Record<string, unknown> = {
    title_text_a: opts.frontTitle,
    description_text_a: opts.frontDescription ?? '',
    title_text_b: opts.backTitle,
    description_text_b: opts.backDescription ?? '',
    flip_effect: opts.flipDirection ?? 'left',
    graphic_element: opts.frontIcon ? 'icon' : (opts.frontImageUrl ? 'image' : 'none'),
  };

  if (opts.frontIcon) s.selected_icon = { value: opts.frontIcon, library: 'fa-solid' };
  if (opts.frontImageUrl) s.image = { url: opts.frontImageUrl, id: '', size: '' };

  if (opts.frontBgColor) {
    s.background_a_background = 'classic';
    s.background_a_color = opts.frontBgColor;
  }
  if (opts.backBgColor) {
    s.background_b_background = 'classic';
    s.background_b_color = opts.backBgColor;
  }
  if (opts.frontTextColor) {
    s.title_color_a = opts.frontTextColor;
    s.description_color_a = opts.frontTextColor;
  }
  if (opts.backTextColor) {
    s.title_color_b = opts.backTextColor;
    s.description_color_b = opts.backTextColor;
  }

  if (opts.buttonText && opts.buttonUrl) {
    s.button_text = opts.buttonText;
    s.link = { url: opts.buttonUrl, is_external: false, nofollow: false, custom_attributes: '' };
  }

  return { id: genId(), elType: 'widget', widgetType: 'flip-box', ...baseElement(), settings: s };
}

// ─── Price Table (Pro) ────────────────────────────────────────────────────────

export interface PriceFeature { text: string; included?: boolean; icon?: string; }

export interface PriceTableOpts {
  heading: string;
  subHeading?: string;
  currency?: 'dollar' | 'euro' | 'pound' | 'custom';
  customCurrency?: string;
  price: string;
  period?: string;
  sale?: boolean;
  originalPrice?: number;
  features: PriceFeature[];
  buttonText?: string;
  buttonUrl?: string;
  ribbonText?: string;
  featured?: boolean;
  headingBgColor?: string;
  headingTextColor?: string;
  priceColor?: string;
}

export function priceTable(opts: PriceTableOpts): unknown {
  const features = opts.features.map(f => ({
    item_text: f.text,
    item_icon: f.included !== false ? 'fas fa-check' : 'fas fa-times',
    selected_item_icon: { value: f.icon ?? (f.included !== false ? 'fas fa-check' : 'fas fa-times'), library: 'fa-solid' },
  }));

  const s: Record<string, unknown> = {
    heading: opts.heading,
    sub_heading: opts.subHeading ?? '',
    currency_symbol: opts.currency ?? 'dollar',
    currency_symbol_custom: opts.customCurrency ?? '',
    price: opts.price,
    period: opts.period ?? '',
    features_list: features,
    button_text: opts.buttonText ?? 'Get Started',
    heading_tag: 'h3',
    sale: opts.sale ? 'yes' : '',
    original_price: opts.originalPrice ?? '',
  };

  if (opts.buttonUrl) s.link = { url: opts.buttonUrl, is_external: false, nofollow: false, custom_attributes: '' };
  if (opts.ribbonText) { s.show_ribbon = 'yes'; s.ribbon_title = opts.ribbonText; }
  if (opts.headingBgColor) s.heading_background_color = opts.headingBgColor;
  if (opts.headingTextColor) s.heading_color = opts.headingTextColor;
  if (opts.priceColor) s.price_color = opts.priceColor;

  return { id: genId(), elType: 'widget', widgetType: 'price-table', ...baseElement(), settings: s };
}

// ─── Price List (Pro) ─────────────────────────────────────────────────────────

export interface PriceListItem {
  title: string;
  price: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

export interface PriceListOpts {
  titleColor?: string;
  priceColor?: string;
  separatorStyle?: 'dashed' | 'solid' | 'dotted';
}

export function priceList(items: PriceListItem[], opts: PriceListOpts = {}): unknown {
  const list = items.map(item => ({
    title: item.title,
    price: item.price,
    item_description: item.description ?? '',
    ...(item.imageUrl && { image: { url: item.imageUrl, id: '', size: '' } }),
    ...(item.link && { link: { url: item.link, is_external: false, nofollow: false, custom_attributes: '' } }),
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'price-list',
    ...baseElement(),
    settings: {
      price_list: list,
      title_tag: 'span',
      description_tag: 'p',
      ...(opts.titleColor && { title_color: opts.titleColor }),
      ...(opts.priceColor && { price_color: opts.priceColor }),
      ...(opts.separatorStyle && { separator_style: opts.separatorStyle }),
    },
  };
}

// ─── Blockquote (Pro) ─────────────────────────────────────────────────────────

export interface BlockquoteOpts {
  skin?: 'border' | 'quotation' | 'boxed' | 'clean';
  showTweetButton?: boolean;
  twitterUser?: string;
  authorColor?: string;
  quoteColor?: string;
  bgColor?: string;
  borderColor?: string;
}

export function blockquote(quote: string, author: string, opts: BlockquoteOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'blockquote',
    ...baseElement(),
    settings: {
      blockquote_skin: opts.skin ?? 'border',
      blockquote_content: quote,
      author_name: author,
      tweet_button: opts.showTweetButton ? 'yes' : '',
      user_name: opts.twitterUser ?? '',
      url_type: 'current_page',
      ...(opts.authorColor && { author_color: opts.authorColor }),
      ...(opts.quoteColor && { quote_color: opts.quoteColor }),
      ...(opts.bgColor && { background_color: opts.bgColor }),
      ...(opts.borderColor && { border_color: opts.borderColor }),
    },
  };
}

// ─── Animated Headline (Pro) ──────────────────────────────────────────────────

export interface AnimatedHeadlineOpts {
  style?: 'highlight' | 'rotate';
  animationType?: 'typing' | 'clip' | 'flip' | 'swirl';
  marker?: 'circle' | 'curly' | 'underline' | 'double';
  loop?: boolean;
  afterText?: string;
  titleColor?: string;
  animatedColor?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4';
  align?: 'left' | 'center' | 'right';
  iterationDelay?: number;
}

export function animatedHeadline(
  beforeText: string,
  animatedText: string,
  opts: AnimatedHeadlineOpts = {}
): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'animated-headline',
    ...baseElement(),
    settings: {
      headline_style: opts.style ?? 'highlight',
      animation_type: opts.animationType ?? 'typing',
      marker: opts.marker ?? 'circle',
      before_text: beforeText,
      highlighted_text: animatedText,
      rotating_text: animatedText,
      after_text: opts.afterText ?? '',
      loop: opts.loop !== false ? 'yes' : '',
      highlight_iteration_delay: opts.iterationDelay ?? 8000,
      rotate_iteration_delay: opts.iterationDelay ?? 2500,
      heading_tag: opts.tag ?? 'h2',
      align: opts.align ?? 'center',
      ...(opts.titleColor && { title_color: opts.titleColor }),
    },
  };
}

// ─── Table of Contents (Pro) ──────────────────────────────────────────────────

export interface TocOpts {
  title?: string;
  htmlTags?: string[];
  minimumHeadersCount?: number;
  collapsible?: boolean;
  collapsed?: boolean;
}

export function tableOfContents(opts: TocOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'table-of-contents',
    ...baseElement(),
    settings: {
      title: opts.title ?? 'Table of Contents',
      html_tag: opts.htmlTags ?? ['h2', 'h3'],
      minimum_headers_count: opts.minimumHeadersCount ?? 2,
      collapsible: opts.collapsible ? 'yes' : '',
      collapsed: opts.collapsed ? 'yes' : '',
    },
  };
}

// ─── Code Highlight (Pro) ─────────────────────────────────────────────────────

export function codeHighlight(code: string, language = 'javascript', showLineNumbers = true): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'code-highlight',
    ...baseElement(),
    settings: {
      code,
      language,
      show_line_numbers: showLineNumbers ? 'yes' : '',
    },
  };
}
