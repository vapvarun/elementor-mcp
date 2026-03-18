import { genId, baseElement } from './core.js';

// ─── Image Carousel ───────────────────────────────────────────────────────────

export interface CarouselImage { url: string; caption?: string; link?: string; }

export interface ImageCarouselOpts {
  slidesPerView?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
  loop?: boolean;
  navigation?: 'arrows' | 'dots' | 'both' | 'none';
  imageSize?: 'thumbnail' | 'medium' | 'large' | 'full';
  borderRadius?: number;
}

export function imageCarousel(images: CarouselImage[], opts: ImageCarouselOpts = {}): unknown {
  const gallery = images.map(img => ({
    url: img.url,
    id: '',
    size: '',
    ...(img.caption && { caption: img.caption }),
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'image-carousel',
    ...baseElement(),
    settings: {
      carousel: gallery,
      image_size: opts.imageSize ?? 'medium_large',
      slides_per_view: String(opts.slidesPerView ?? 3),
      autoplay: opts.autoplay !== false ? 'yes' : '',
      pause_on_hover: 'yes',
      autoplay_speed: opts.autoplaySpeed ?? 3000,
      infinite: opts.loop !== false ? 'yes' : '',
      navigation: opts.navigation ?? 'dots',
    },
  };
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

export interface GalleryOpts {
  columns?: number;
  imageSize?: 'thumbnail' | 'medium' | 'large';
  gap?: number;
  openLightbox?: boolean;
}

export function imageGallery(images: string[], opts: GalleryOpts = {}): unknown {
  const gallery = images.map(url => ({ url, id: '', size: '' }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'image-gallery',
    ...baseElement(),
    settings: {
      wp_gallery: gallery,
      gallery_columns: String(opts.columns ?? 3),
      gallery_rand: '',
      gallery_link: opts.openLightbox ? 'file' : 'none',
      gallery_image_size: opts.imageSize ?? 'medium',
    },
  };
}

// ─── Video ────────────────────────────────────────────────────────────────────

export interface VideoOpts {
  provider?: 'youtube' | 'vimeo' | 'dailymotion' | 'hosted';
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  aspectRatio?: '169' | '219' | '43' | '32' | '11' | '916';
  lightbox?: boolean;
  overlayImageUrl?: string;
  playIconColor?: string;
}

export function video(url: string, opts: VideoOpts = {}): unknown {
  const provider = opts.provider ?? 'youtube';

  const s: Record<string, unknown> = {
    video_type: provider,
    aspect_ratio: opts.aspectRatio ?? '169',
    autoplay: opts.autoplay ? 'yes' : '',
    mute: opts.mute ? 'yes' : '',
    loop: opts.loop ? 'yes' : '',
    controls: opts.controls !== false ? 'yes' : '',
  };

  if (provider === 'youtube') s.youtube_url = url;
  else if (provider === 'vimeo') s.vimeo_url = url;
  else if (provider === 'dailymotion') s.dailymotion_url = url;
  else s.hosted_url = { url, id: '' };

  if (opts.lightbox) {
    s.show_image_overlay = 'yes';
    if (opts.overlayImageUrl) s.image_overlay = { url: opts.overlayImageUrl, id: '', size: '' };
    if (opts.playIconColor) s.play_icon_color = opts.playIconColor;
  }

  return { id: genId(), elType: 'widget', widgetType: 'video', ...baseElement(), settings: s };
}

// ─── Lottie (Pro) ─────────────────────────────────────────────────────────────

export interface LottieOpts {
  source?: 'media_file' | 'external_url';
  trigger?: 'none' | 'arriving' | 'viewport' | 'on_click' | 'on_hover';
  loop?: boolean;
  speed?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

export function lottie(jsonUrl: string, opts: LottieOpts = {}): unknown {
  const source = opts.source ?? 'external_url';
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'lottie',
    ...baseElement(),
    settings: {
      source,
      source_external_url: source === 'external_url' ? { url: jsonUrl } : undefined,
      source_json: source === 'media_file' ? { url: jsonUrl, id: '' } : undefined,
      trigger: opts.trigger ?? 'arriving',
      loop: opts.loop !== false ? 'yes' : '',
      speed: { unit: 'px', size: opts.speed ?? 1 },
      align: opts.align ?? 'center',
      ...(opts.width && { width: { unit: 'px', size: opts.width } }),
    },
  };
}

// ─── Hotspot (Pro) ────────────────────────────────────────────────────────────

export interface HotspotItem {
  positionX: number;
  positionY: number;
  tooltip: string;
  icon?: string;
}

export function hotspot(imageUrl: string, items: HotspotItem[]): unknown {
  const spots = items.map(item => ({
    _id: Math.random().toString(36).slice(2, 9),
    hotspot_position_x: { unit: '%', size: item.positionX },
    hotspot_position_y: { unit: '%', size: item.positionY },
    hotspot_tooltip_content: item.tooltip,
    ...(item.icon && { selected_icon: { value: item.icon, library: 'fa-solid' } }),
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'hotspot',
    ...baseElement(),
    settings: {
      image: { url: imageUrl, id: '', size: '' },
      image_size: 'large',
      hotspot: spots,
      trigger: 'mouseenter',
    },
  };
}
