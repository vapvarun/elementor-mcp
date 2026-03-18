import { genId, baseElement } from './core.js';

// ─── Heading ──────────────────────────────────────────────────────────────────

export interface HeadingOpts {
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p';
  size?: number;
  weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  letterSpacing?: number;
}

export function heading(title: string, opts: HeadingOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'heading',
    ...baseElement(),
    settings: {
      title,
      header_size: opts.tag ?? 'h2',
      ...(opts.color && { title_color: opts.color }),
      ...(opts.align && { align: opts.align }),
      ...(opts.size && {
        typography_typography: 'custom',
        typography_font_size: { unit: 'px', size: opts.size, sizes: [] },
        typography_font_size_tablet: { unit: 'px', size: Math.round(opts.size * 0.75), sizes: [] },
        typography_font_size_mobile: { unit: 'px', size: Math.round(opts.size * 0.6), sizes: [] },
      }),
      ...(opts.weight && { typography_font_weight: opts.weight }),
      ...(opts.lineHeight && { typography_line_height: { unit: 'em', size: opts.lineHeight } }),
      ...(opts.letterSpacing && { typography_letter_spacing: { unit: 'px', size: opts.letterSpacing } }),
    },
  };
}

// ─── Text Editor ──────────────────────────────────────────────────────────────

export interface TextOpts {
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  fontSize?: number;
}

export function text(html: string, opts: TextOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'text-editor',
    ...baseElement(),
    settings: {
      editor: html,
      ...(opts.align && { align: opts.align }),
      ...(opts.color && { text_color: opts.color }),
      ...(opts.fontSize && {
        typography_typography: 'custom',
        typography_font_size: { unit: 'px', size: opts.fontSize, sizes: [] },
      }),
    },
  };
}

// ─── Button ───────────────────────────────────────────────────────────────────

export interface ButtonOpts {
  align?: 'left' | 'center' | 'right' | 'justify';
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  external?: boolean;
  outline?: boolean;
  icon?: string;
  iconPosition?: 'before' | 'after';
}

export function button(label: string, url: string, opts: ButtonOpts = {}): unknown {
  const radius = opts.borderRadius ?? 6;
  const bg = opts.outline ? 'transparent' : (opts.bgColor ?? '#2563EB');
  const txt = opts.outline ? (opts.textColor ?? opts.bgColor ?? '#2563EB') : (opts.textColor ?? '#FFFFFF');

  const s: Record<string, unknown> = {
    text: label,
    align: opts.align ?? 'center',
    link: { url, is_external: opts.external ?? false, nofollow: false, custom_attributes: '' },
    background_color: bg,
    button_text_color: txt,
    border_radius: {
      unit: 'px',
      top: String(radius), right: String(radius), bottom: String(radius), left: String(radius),
      isLinked: true,
    },
  };

  if (opts.size) s.size = opts.size;

  if (opts.outline) {
    s.border_border = 'solid';
    s.border_width = { unit: 'px', top: '2', right: '2', bottom: '2', left: '2', isLinked: true };
    s.border_color = opts.borderColor ?? opts.bgColor ?? '#2563EB';
  }

  if (opts.icon) {
    s.selected_icon = { value: opts.icon, library: 'fa-solid' };
    s.icon_align = opts.iconPosition ?? 'before';
  }

  return { id: genId(), elType: 'widget', widgetType: 'button', ...baseElement(), settings: s };
}

// ─── Image ────────────────────────────────────────────────────────────────────

export interface ImageOpts {
  alt?: string;
  size?: 'thumbnail' | 'medium' | 'large' | 'full';
  align?: 'left' | 'center' | 'right';
  link?: string;
  caption?: string;
  width?: number;
  borderRadius?: number;
  openLightbox?: boolean;
}

export function image(url: string, opts: ImageOpts = {}): unknown {
  const s: Record<string, unknown> = {
    image: { url, id: '', size: '' },
    image_size: opts.size ?? 'large',
    align: opts.align ?? 'center',
  };

  if (opts.caption) {
    s.caption_source = 'custom';
    s.caption = opts.caption;
  }

  if (opts.link) {
    s.link_to = 'custom';
    s.link = { url: opts.link, is_external: false, nofollow: false, custom_attributes: '' };
  }

  if (opts.openLightbox) s.open_lightbox = 'yes';

  if (opts.width) s.width = { unit: '%', size: opts.width, sizes: [] };

  if (opts.borderRadius) {
    s.image_border_radius = {
      unit: 'px',
      top: String(opts.borderRadius), right: String(opts.borderRadius),
      bottom: String(opts.borderRadius), left: String(opts.borderRadius),
      isLinked: true,
    };
  }

  return { id: genId(), elType: 'widget', widgetType: 'image', ...baseElement(), settings: s };
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

export interface IconOpts {
  view?: 'default' | 'stacked' | 'framed';
  shape?: 'circle' | 'square';
  size?: number;
  color?: string;
  primaryColor?: string;
  secondaryColor?: string;
  link?: string;
  align?: 'left' | 'center' | 'right';
}

export function icon(name: string, opts: IconOpts = {}): unknown {
  const s: Record<string, unknown> = {
    selected_icon: { value: name, library: 'fa-solid' },
    view: opts.view ?? 'default',
    align: opts.align ?? 'center',
  };

  if (opts.shape && opts.view !== 'default') s.shape = opts.shape;

  if (opts.size) s.size = { unit: 'px', size: opts.size, sizes: [] };
  if (opts.color) s.primary_color = opts.color;
  if (opts.secondaryColor) s.secondary_color = opts.secondaryColor;

  if (opts.link) {
    s.link = { url: opts.link, is_external: false, nofollow: false, custom_attributes: '' };
  }

  return { id: genId(), elType: 'widget', widgetType: 'icon', ...baseElement(), settings: s };
}

// ─── HTML (raw) ───────────────────────────────────────────────────────────────

export function html(htmlCode: string): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'html',
    ...baseElement(),
    settings: { html: htmlCode },
  };
}

// ─── Shortcode ────────────────────────────────────────────────────────────────

export function shortcode(code: string): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'shortcode',
    ...baseElement(),
    settings: { shortcode: code },
  };
}

// ─── Google Maps ──────────────────────────────────────────────────────────────

export function googleMaps(address: string, zoom = 10, height = 300): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'google_maps',
    ...baseElement(),
    settings: {
      address,
      zoom: { size: zoom, unit: 'px' },
      height: { size: height, unit: 'px' },
    },
  };
}
