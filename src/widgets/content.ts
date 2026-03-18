import { genId, baseElement } from './core.js';

// ─── Icon Box ─────────────────────────────────────────────────────────────────

export interface IconBoxOpts {
  titleColor?: string;
  descColor?: string;
  iconColor?: string;
  align?: 'left' | 'center' | 'right';
  titleSize?: number;
  descSize?: number;
  iconSize?: number;
  view?: 'default' | 'stacked' | 'framed';
  iconPosition?: 'top' | 'left' | 'right';
  link?: string;
}

export function iconBox(icon: string, title: string, description: string, opts: IconBoxOpts = {}): unknown {
  const s: Record<string, unknown> = {
    selected_icon: { value: icon, library: 'fa-solid' },
    title_text: title,
    description_text: description,
    text_align: opts.align ?? 'left',
    title_bottom_space: { unit: 'px', size: 8 },
    title_typography_typography: 'custom',
    title_typography_font_size: { unit: 'px', size: opts.titleSize ?? 17 },
    title_color: opts.titleColor ?? '#111827',
    description_typography_typography: 'custom',
    description_typography_font_size: { unit: 'px', size: opts.descSize ?? 15 },
    description_typography_font_weight: '400',
    description_color: opts.descColor ?? '#4B5563',
  };

  if (opts.view && opts.view !== 'default') s.view = opts.view;
  if (opts.iconColor) s.primary_color = opts.iconColor;
  if (opts.iconSize) s.icon_size = { unit: 'px', size: opts.iconSize };
  if (opts.iconPosition) s.position = opts.iconPosition;
  if (opts.link) s.link = { url: opts.link, is_external: false, nofollow: false, custom_attributes: '' };

  return { id: genId(), elType: 'widget', widgetType: 'icon-box', ...baseElement(), settings: s };
}

// ─── Icon List ────────────────────────────────────────────────────────────────

export interface IconListItem { text: string; icon?: string; url?: string; }

export interface IconListOpts {
  view?: 'traditional' | 'inline';
  iconColor?: string;
  textColor?: string;
  space?: number;
  divider?: boolean;
}

export function iconList(items: IconListItem[], opts: IconListOpts = {}): unknown {
  const list = items.map(item => ({
    text: item.text,
    selected_icon: { value: item.icon ?? 'fas fa-check', library: 'fa-solid' },
    ...(item.url && { link: { url: item.url, is_external: false, nofollow: false, custom_attributes: '' } }),
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'icon-list',
    ...baseElement(),
    settings: {
      icon_list: list,
      view: opts.view ?? 'traditional',
      ...(opts.space !== undefined && { space: { unit: 'px', size: opts.space } }),
      ...(opts.iconColor && { icon_color: opts.iconColor }),
      ...(opts.textColor && { text_color: opts.textColor }),
      ...(opts.divider !== undefined && { divider: opts.divider ? 'yes' : '' }),
    },
  };
}

// ─── Image Box ────────────────────────────────────────────────────────────────

export interface ImageBoxOpts {
  imageSize?: 'thumbnail' | 'medium' | 'large' | 'full';
  titleTag?: 'h2' | 'h3' | 'h4' | 'h5';
  titleColor?: string;
  descColor?: string;
  align?: 'left' | 'center' | 'right';
  link?: string;
  imageWidth?: number;
}

export function imageBox(imageUrl: string, title: string, description: string, opts: ImageBoxOpts = {}): unknown {
  const s: Record<string, unknown> = {
    image: { url: imageUrl, id: '', size: '' },
    image_size: opts.imageSize ?? 'medium',
    title_text: title,
    description_text: description,
    text_align: opts.align ?? 'center',
    title_tag: opts.titleTag ?? 'h3',
  };

  if (opts.titleColor) s.title_color = opts.titleColor;
  if (opts.descColor) s.description_color = opts.descColor;
  if (opts.imageWidth) s.image_space = { unit: '%', size: opts.imageWidth };
  if (opts.link) s.link = { url: opts.link, is_external: false, nofollow: false, custom_attributes: '' };

  return { id: genId(), elType: 'widget', widgetType: 'image-box', ...baseElement(), settings: s };
}

// ─── Counter ──────────────────────────────────────────────────────────────────

export interface CounterOpts {
  prefix?: string;
  suffix?: string;
  duration?: number;
  titleColor?: string;
  numberColor?: string;
  titleTag?: 'div' | 'h2' | 'h3' | 'h4' | 'h5' | 'span';
  align?: 'left' | 'center' | 'right';
  numberSize?: number;
}

export function counter(start: number, end: number, title: string, opts: CounterOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'counter',
    ...baseElement(),
    settings: {
      starting_number: start,
      ending_number: end,
      title,
      prefix: opts.prefix ?? '',
      suffix: opts.suffix ?? '',
      duration: opts.duration ?? 2000,
      title_tag: opts.titleTag ?? 'div',
      thousand_separator: 'yes',
      ...(opts.align && { title_align: opts.align }),
      ...(opts.titleColor && { title_color: opts.titleColor }),
      ...(opts.numberColor && { number_color: opts.numberColor }),
      ...(opts.numberSize && {
        number_typography_typography: 'custom',
        number_typography_font_size: { unit: 'px', size: opts.numberSize },
      }),
    },
  };
}

// ─── Testimonial ──────────────────────────────────────────────────────────────

export interface TestimonialOpts {
  imageUrl?: string;
  imagePosition?: 'aside' | 'top' | 'bottom';
  alignment?: 'left' | 'center' | 'right';
  textColor?: string;
  nameColor?: string;
  jobColor?: string;
}

export function testimonial(content: string, name: string, job: string, opts: TestimonialOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'testimonial',
    ...baseElement(),
    settings: {
      testimonial_content: content,
      testimonial_name: name,
      testimonial_job: job,
      testimonial_image_position: opts.imagePosition ?? 'aside',
      testimonial_alignment: opts.alignment ?? 'center',
      ...(opts.imageUrl && {
        testimonial_image: { url: opts.imageUrl, id: '', size: '' },
        testimonial_image_size: 'thumbnail',
      }),
      ...(opts.textColor && { testimonial_content_color: opts.textColor }),
      ...(opts.nameColor && { testimonial_name_color: opts.nameColor }),
      ...(opts.jobColor && { testimonial_job_color: opts.jobColor }),
    },
  };
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

export interface StarRatingOpts {
  scale?: 5 | 10;
  title?: string;
  align?: 'left' | 'center' | 'right';
  starColor?: string;
  unmarkedColor?: string;
}

export function starRating(rating: number, opts: StarRatingOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'star-rating',
    ...baseElement(),
    settings: {
      rating,
      rating_scale: String(opts.scale ?? 5),
      title: opts.title ?? '',
      align: opts.align ?? 'center',
      ...(opts.starColor && { star_color: opts.starColor }),
      ...(opts.unmarkedColor && { unmarked_star_color: opts.unmarkedColor }),
    },
  };
}

// ─── Alert ────────────────────────────────────────────────────────────────────

export type AlertType = 'info' | 'success' | 'warning' | 'danger';

export interface AlertOpts {
  showDismiss?: boolean;
  titleColor?: string;
  descColor?: string;
  bgColor?: string;
}

export function alert(type: AlertType, title: string, description: string, opts: AlertOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'alert',
    ...baseElement(),
    settings: {
      alert_type: type,
      alert_title: title,
      alert_description: description,
      show_dismiss: opts.showDismiss ? 'show' : '',
      ...(opts.titleColor && { title_color: opts.titleColor }),
      ...(opts.descColor && { alert_description_color: opts.descColor }),
      ...(opts.bgColor && { background_color: opts.bgColor }),
    },
  };
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export interface ProgressBarOpts {
  type?: '' | 'info' | 'success' | 'warning' | 'danger';
  displayPercent?: boolean;
  innerText?: string;
  barColor?: string;
  titleTag?: 'span' | 'div' | 'h2' | 'h3' | 'h4' | 'h5';
}

export function progressBar(title: string, percent: number, opts: ProgressBarOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'progress',
    ...baseElement(),
    settings: {
      title,
      title_tag: opts.titleTag ?? 'span',
      title_display: 'yes',
      progress_type: opts.type ?? '',
      percent: { unit: '%', size: percent, sizes: [] },
      display_percentage: opts.displayPercent !== false ? 'show' : '',
      inner_text: opts.innerText ?? `${percent}%`,
      ...(opts.barColor && { bar_color: opts.barColor }),
    },
  };
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function divider(color?: string, gap = 0): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'divider',
    ...baseElement(),
    settings: {
      separator_type: 'pattern',
      color: color ?? '#E5E7EB',
      gap: { unit: 'px', size: gap },
    },
  };
}

// ─── Spacer ───────────────────────────────────────────────────────────────────

export function spacer(height: number): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'spacer',
    ...baseElement(),
    settings: { space: { unit: 'px', size: height } },
  };
}

// ─── Social Icons ─────────────────────────────────────────────────────────────

export interface SocialIcon { platform: string; url: string; library?: string; }

const SOCIAL_LIBRARY: Record<string, string> = {
  facebook: 'fab fa-facebook', twitter: 'fab fa-twitter', instagram: 'fab fa-instagram',
  linkedin: 'fab fa-linkedin', youtube: 'fab fa-youtube', github: 'fab fa-github',
  pinterest: 'fab fa-pinterest', tiktok: 'fab fa-tiktok', discord: 'fab fa-discord',
  telegram: 'fab fa-telegram', whatsapp: 'fab fa-whatsapp', reddit: 'fab fa-reddit',
};

export interface SocialIconsOpts {
  shape?: 'rounded' | 'square' | 'circle';
  align?: 'left' | 'center' | 'right';
  size?: number;
  color?: string;
  hoverColor?: string;
  bgColor?: string;
}

export function socialIcons(icons: SocialIcon[], opts: SocialIconsOpts = {}): unknown {
  const list = icons.map(item => ({
    social_icon: {
      value: SOCIAL_LIBRARY[item.platform.toLowerCase()] ?? item.platform,
      library: 'fa-brands',
    },
    link: { url: item.url, is_external: true, nofollow: true, custom_attributes: '' },
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'social-icons',
    ...baseElement(),
    settings: {
      social_icon_list: list,
      shape: opts.shape ?? 'rounded',
      align: opts.align ?? 'center',
      ...(opts.size && { icon_size: { unit: 'px', size: opts.size } }),
      ...(opts.color && { icon_primary_color: opts.color }),
      ...(opts.bgColor && { icon_secondary_color: opts.bgColor }),
    },
  };
}

// ─── Menu Anchor ──────────────────────────────────────────────────────────────

export function menuAnchor(id: string): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'menu-anchor',
    ...baseElement(),
    settings: { anchor: id },
  };
}

// ─── Read More (Pro) ──────────────────────────────────────────────────────────

export function readMore(label = 'Read More'): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'read-more',
    ...baseElement(),
    settings: { link_text: label },
  };
}

// ─── Rating (eicon-based, different from star-rating) ─────────────────────────

export interface RatingOpts {
  scale?: number;   // 5 or 10
  icon?: string;    // eicon name e.g. 'eicon-star', 'eicon-heart'
  align?: 'left' | 'center' | 'right';
  markedColor?: string;
  unmarkedColor?: string;
}

export function rating(value: number, opts: RatingOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'rating',
    ...baseElement(),
    settings: {
      rating_scale: { unit: 'px', size: opts.scale ?? 5, sizes: [] },
      rating_value: value,
      rating_icon: { value: opts.icon ?? 'eicon-star', library: 'eicons' },
      icon_alignment: opts.align ?? 'center',
      ...(opts.markedColor && { marked_color: opts.markedColor }),
      ...(opts.unmarkedColor && { unmarked_color: opts.unmarkedColor }),
    },
  };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function sidebar(sidebarId: string): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'sidebar',
    ...baseElement(),
    settings: { sidebar: sidebarId },
  };
}

// ─── Contact Button (floating WhatsApp / chat button) ─────────────────────────

export type ContactPlatform =
  | 'WhatsApp' | 'Email' | 'SMS' | 'Messenger' | 'Skype' | 'Telephone'
  | 'Viber' | 'Waze' | 'Snapchat' | 'Telegram' | 'Discord' | 'Line';

export interface ContactButtonOpts {
  platform?: ContactPlatform;
  number?: string;    // phone / WhatsApp number
  email?: string;
  emailSubject?: string;
  emailBody?: string;
  username?: string;  // for Telegram, Snapchat etc.
  ariaLabel?: string;
  icon?: string;
  bgColor?: string;
  iconColor?: string;
  size?: number;
}

export function contactButton(opts: ContactButtonOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'contact-buttons',
    ...baseElement(),
    settings: {
      chat_button_platform: opts.platform ?? 'WhatsApp',
      chat_button_number: opts.number ?? '',
      chat_button_mail: opts.email ?? '',
      chat_button_mail_subject: opts.emailSubject ?? '',
      chat_button_mail_body: opts.emailBody ?? '',
      chat_button_username: opts.username ?? '',
      chat_aria_label: opts.ariaLabel ?? 'Contact Us',
      ...(opts.icon && { chat_button_icon: { value: opts.icon, library: 'fa-brands' } }),
      ...(opts.bgColor && { button_background_color: opts.bgColor }),
      ...(opts.iconColor && { button_icon_color: opts.iconColor }),
      ...(opts.size && { button_size: { unit: 'px', size: opts.size } }),
    },
  };
}

// ─── Floating Bar / Announcement Bar ─────────────────────────────────────────

export interface FloatingBarOpts {
  text: string;
  ctaText?: string;
  ctaUrl?: string;
  icon?: string;
  closeable?: boolean;
  position?: 'top' | 'bottom';
  bgColor?: string;
  textColor?: string;
}

export function floatingBar(opts: FloatingBarOpts): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'floating-bars-var-1',
    ...baseElement(),
    settings: {
      announcement_text: opts.text,
      cta_text: opts.ctaText ?? '',
      cta_link: opts.ctaUrl ? { url: opts.ctaUrl, is_external: true, nofollow: false, custom_attributes: '' } : undefined,
      floating_bar_close_switch: opts.closeable !== false ? 'yes' : '',
      accessible_name: 'Banner',
      ...(opts.icon && { announcement_icon: { value: opts.icon, library: 'fa-solid' } }),
      ...(opts.bgColor && { background_color: opts.bgColor }),
      ...(opts.textColor && { text_color: opts.textColor }),
    },
  };
}
