/**
 * builder.ts — high-level section/page builders.
 * All widget factories live in src/widgets/*.ts
 */
import { section, row, col, pad } from './widgets/core.js';
import { heading, text, button } from './widgets/basic.js';
import { iconBox, spacer, divider } from './widgets/content.js';

export * from './widgets/index.js';

// ─── Color Scheme ─────────────────────────────────────────────────────────────

/**
 * A full brand color palette. Pass to buildLandingPage({ scheme }) and all
 * sections will pick up the right colors automatically.
 * Every field has a sensible default so only override what you need.
 */
export interface ColorScheme {
  /** Primary dark color — hero/CTA backgrounds (default: #0F172A) */
  primary?: string;
  /** Secondary brand color — CTA section bg (default: #1D4ED8) */
  secondary?: string;
  /** Accent / button color (default: #3B82F6) */
  accent?: string;
  /** Light section background (default: #F8FAFC) */
  bgLight?: string;
  /** White section background (default: #FFFFFF) */
  bgWhite?: string;
  /** Card / item background (default: #F9FAFB) */
  cardBg?: string;
  /** Dark body text (default: #111827) */
  textDark?: string;
  /** Muted / secondary text (default: #6B7280) */
  textMuted?: string;
  /** Light text for dark sections (default: #FFFFFF) */
  textLight?: string;
  /** Optional hero gradient — overrides primary */
  heroGradient?: { from: string; to: string; angle?: number };
  /** Optional CTA gradient — overrides secondary */
  ctaGradient?: { from: string; to: string; angle?: number };
}

export const DEFAULT_SCHEME: Required<Omit<ColorScheme, 'heroGradient' | 'ctaGradient'>> = {
  primary:   '#0F172A',
  secondary: '#1D4ED8',
  accent:    '#3B82F6',
  bgLight:   '#F8FAFC',
  bgWhite:   '#FFFFFF',
  cardBg:    '#F9FAFB',
  textDark:  '#111827',
  textMuted: '#6B7280',
  textLight: '#FFFFFF',
};

/** Pre-built named schemes */
export const SCHEMES: Record<string, ColorScheme> = {
  dark: {
    primary: '#0F172A', secondary: '#1D4ED8', accent: '#3B82F6',
    bgLight: '#F8FAFC', bgWhite: '#FFFFFF', cardBg: '#F9FAFB',
    textDark: '#111827', textMuted: '#6B7280', textLight: '#FFFFFF',
  },
  blue: {
    primary: '#1E3A5F', secondary: '#2563EB', accent: '#60A5FA',
    bgLight: '#EFF6FF', bgWhite: '#FFFFFF', cardBg: '#F0F4FF',
    textDark: '#1E3A5F', textMuted: '#64748B', textLight: '#FFFFFF',
    heroGradient: { from: '#1E3A5F', to: '#2563EB', angle: 135 },
    ctaGradient: { from: '#2563EB', to: '#3B82F6', angle: 135 },
  },
  purple: {
    primary: '#1E1B4B', secondary: '#7C3AED', accent: '#A78BFA',
    bgLight: '#F5F3FF', bgWhite: '#FFFFFF', cardBg: '#F3F0FF',
    textDark: '#1E1B4B', textMuted: '#6B7280', textLight: '#FFFFFF',
    heroGradient: { from: '#1E1B4B', to: '#4C1D95', angle: 135 },
    ctaGradient: { from: '#7C3AED', to: '#6D28D9', angle: 135 },
  },
  green: {
    primary: '#064E3B', secondary: '#065F46', accent: '#10B981',
    bgLight: '#ECFDF5', bgWhite: '#FFFFFF', cardBg: '#F0FDF4',
    textDark: '#064E3B', textMuted: '#4B5563', textLight: '#FFFFFF',
    heroGradient: { from: '#064E3B', to: '#065F46', angle: 135 },
    ctaGradient: { from: '#065F46', to: '#047857', angle: 135 },
  },
  orange: {
    primary: '#431407', secondary: '#EA580C', accent: '#F97316',
    bgLight: '#FFF7ED', bgWhite: '#FFFFFF', cardBg: '#FEF3C7',
    textDark: '#431407', textMuted: '#78350F', textLight: '#FFFFFF',
    heroGradient: { from: '#431407', to: '#7C2D12', angle: 135 },
    ctaGradient: { from: '#EA580C', to: '#C2410C', angle: 135 },
  },
  light: {
    primary: '#1F2937', secondary: '#374151', accent: '#3B82F6',
    bgLight: '#F9FAFB', bgWhite: '#FFFFFF', cardBg: '#F3F4F6',
    textDark: '#111827', textMuted: '#6B7280', textLight: '#FFFFFF',
  },
};

import { testimonial } from './widgets/content.js';
export type { TestimonialOpts } from './widgets/content.js';

// ─── Scheme resolver ──────────────────────────────────────────────────────────

type ResolvedScheme = Required<Omit<ColorScheme, 'heroGradient' | 'ctaGradient'>> & {
  heroGradient?: ColorScheme['heroGradient'];
  ctaGradient?: ColorScheme['ctaGradient'];
};

function resolveScheme(scheme?: ColorScheme | string): ResolvedScheme {
  const named = typeof scheme === 'string' ? (SCHEMES[scheme] ?? {}) : (scheme ?? {});
  return { ...DEFAULT_SCHEME, ...named };
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export interface HeroConfig {
  headline: string;
  subtext: string;
  primaryCTA: { label: string; url: string };
  secondaryCTA?: { label: string; url: string };
  /** Override background. Scheme.primary used by default. */
  bgColor?: string;
  /** Override gradient. Scheme.heroGradient used if defined. */
  gradient?: { from: string; to: string; angle?: number };
  textColor?: string;
  accentColor?: string;
  /** Badge text shown above headline e.g. "New → AI-Powered" */
  badge?: string;
  /** Tagline / social proof below CTA e.g. "Trusted by 1000+ teams" */
  tagline?: string;
}

export function buildHero(cfg: HeroConfig, scheme?: ColorScheme | string): unknown {
  const s = resolveScheme(scheme);
  const gradient = cfg.gradient ?? s.heroGradient;
  const bg = cfg.bgColor ?? s.primary;
  const txt = cfg.textColor ?? s.textLight;
  const accent = cfg.accentColor ?? s.accent;
  const subtextColor = `rgba(255,255,255,0.8)`;

  const children: unknown[] = [];

  if (cfg.badge) {
    children.push(text(
      `<p style="text-align:center;display:inline-block;background:rgba(255,255,255,0.12);color:${txt};padding:6px 16px;border-radius:99px;font-size:0.85rem;font-weight:600;letter-spacing:0.05em;border:1px solid rgba(255,255,255,0.2);margin:0 auto 4px;">${cfg.badge}</p>`
    ));
  }

  children.push(
    heading(cfg.headline, { tag: 'h1', size: 52, weight: '700', color: txt, align: 'center', lineHeight: 1.15 })
  );
  children.push(
    text(`<p style="text-align:center;color:${subtextColor};font-size:1.15rem;line-height:1.7;max-width:680px;margin:0 auto;">${cfg.subtext}</p>`)
  );

  const buttons: unknown[] = [
    button(cfg.primaryCTA.label, cfg.primaryCTA.url, {
      bgColor: accent, textColor: '#FFFFFF', align: 'center', borderRadius: 8, size: 'md',
    }),
  ];
  if (cfg.secondaryCTA) {
    buttons.push(
      button(cfg.secondaryCTA.label, cfg.secondaryCTA.url, {
        outline: true, bgColor: accent, textColor: txt,
        borderColor: `${txt}55`, align: 'center', borderRadius: 8,
      })
    );
  }
  children.push(row({ flex_direction: 'row', gap: 16, flex_justify_content: 'center', flex_wrap: 'wrap' }, buttons));

  if (cfg.tagline) {
    children.push(
      text(`<p style="text-align:center;color:rgba(255,255,255,0.55);font-size:0.875rem;margin-top:4px;">${cfg.tagline}</p>`)
    );
  }

  const inner = row({ flex_direction: 'column', gap: 24, max_width: 860 }, children);
  const sectionOpts = gradient
    ? { gradient, padding: pad('100', '24', '100', '24') }
    : { background_color: bg, padding: pad('100', '24', '100', '24') };

  return section(sectionOpts, [inner]);
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

export interface StatsConfig {
  items: Array<{ value: string; label: string }>;
  bgColor?: string;
  accentColor?: string;
}

export function buildStats(cfg: StatsConfig, scheme?: ColorScheme | string): unknown {
  const s = resolveScheme(scheme);
  const bg = cfg.bgColor ?? s.bgLight;
  const numColor = cfg.accentColor ?? s.accent;

  const cols = cfg.items.map(item =>
    col({}, [
      heading(item.value, { tag: 'h3', size: 40, weight: '700', color: numColor, align: 'center' }),
      text(`<p style="text-align:center;color:${s.textMuted};font-size:14px;margin:4px 0 0;">${item.label}</p>`),
    ])
  );

  const inner = row({ flex_direction: 'row', gap: 0, max_width: 1000 }, cols);
  return section({ background_color: bg, padding: pad('48', '24', '48', '24') }, [inner]);
}

// ─── Features Grid ────────────────────────────────────────────────────────────

export interface FeaturesConfig {
  headline: string;
  subtext?: string;
  features: Array<{ icon: string; title: string; description: string; iconColor?: string }>;
  columns?: 2 | 3;
  /** 'light' = white bg, 'alt' = bgLight bg */
  variant?: 'light' | 'alt';
  bgColor?: string;
  cardBgColor?: string;
}

export function buildFeatures(cfg: FeaturesConfig, scheme?: ColorScheme | string): unknown {
  const s = resolveScheme(scheme);
  const variant = cfg.variant ?? 'light';
  const bg = cfg.bgColor ?? (variant === 'alt' ? s.bgLight : s.bgWhite);
  const cardBg = cfg.cardBgColor ?? s.cardBg;
  const cols = cfg.columns ?? 3;

  const cardCols = cfg.features.map(f =>
    col(
      { background_color: cardBg, padding: pad('28', '28', '28', '28'), gap: 12 },
      [iconBox(f.icon, f.title, f.description, {
        titleColor: s.textDark,
        descColor: s.textMuted,
        iconColor: f.iconColor ?? s.accent,
      })]
    )
  );

  const rows: unknown[] = [];
  for (let i = 0; i < cardCols.length; i += cols) {
    rows.push(row({ flex_direction: 'row', gap: 24, flex_wrap: 'wrap' }, cardCols.slice(i, i + cols)));
  }

  const headerItems: unknown[] = [
    heading(cfg.headline, { tag: 'h2', size: 36, weight: '700', color: s.textDark, align: 'center' }),
  ];
  if (cfg.subtext) {
    headerItems.push(text(`<p style="text-align:center;color:${s.textMuted};font-size:1rem;max-width:620px;margin:0 auto;">${cfg.subtext}</p>`));
  }
  headerItems.push(spacer(16));

  const inner = row({ flex_direction: 'column', gap: 24, max_width: 1100 }, [...headerItems, ...rows]);
  return section({ background_color: bg, padding: pad('80', '24', '80', '24') }, [inner]);
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

export interface CTAConfig {
  headline: string;
  subtext?: string;
  primaryCTA: { label: string; url: string };
  secondaryCTA?: { label: string; url: string };
  bgColor?: string;
  gradient?: { from: string; to: string; angle?: number };
}

export function buildCTA(cfg: CTAConfig, scheme?: ColorScheme | string): unknown {
  const s = resolveScheme(scheme);
  const gradient = cfg.gradient ?? s.ctaGradient;
  const bg = cfg.bgColor ?? s.secondary;

  const buttons: unknown[] = [
    button(cfg.primaryCTA.label, cfg.primaryCTA.url, {
      bgColor: '#FFFFFF', textColor: bg, borderRadius: 8, align: 'center', size: 'md',
    }),
  ];
  if (cfg.secondaryCTA) {
    buttons.push(
      button(cfg.secondaryCTA.label, cfg.secondaryCTA.url, {
        outline: true, bgColor: '#FFFFFF', textColor: '#FFFFFF',
        borderColor: '#FFFFFF66', borderRadius: 8, align: 'center', external: true,
      })
    );
  }

  const items: unknown[] = [
    heading(cfg.headline, { tag: 'h2', size: 36, weight: '700', color: s.textLight, align: 'center' }),
  ];
  if (cfg.subtext) {
    items.push(text(`<p style="text-align:center;color:rgba(255,255,255,0.8);font-size:1.05rem;">${cfg.subtext}</p>`));
  }
  items.push(row({ flex_direction: 'row', gap: 16, flex_justify_content: 'center', flex_wrap: 'wrap' }, buttons));

  const inner = row({ flex_direction: 'column', gap: 28, max_width: 720 }, items);
  const sectionOpts = gradient
    ? { gradient, padding: pad('80', '24', '80', '24') }
    : { background_color: bg, padding: pad('80', '24', '80', '24') };

  return section(sectionOpts, [inner]);
}

// ─── Two-column section ───────────────────────────────────────────────────────

export interface TwoColConfig {
  left: unknown[];
  right: unknown[];
  bgColor?: string;
  gap?: number;
  reverse?: boolean;
  verticalAlign?: 'center' | 'flex-start' | 'flex-end';
  variant?: 'light' | 'alt' | 'dark';
}

export function buildTwoCol(cfg: TwoColConfig, scheme?: ColorScheme | string): unknown {
  const s = resolveScheme(scheme);
  const bg = cfg.bgColor ?? (
    cfg.variant === 'alt' ? s.bgLight :
    cfg.variant === 'dark' ? s.primary : s.bgWhite
  );
  const leftCol = col({}, cfg.left);
  const rightCol = col({}, cfg.right);
  const children = cfg.reverse ? [rightCol, leftCol] : [leftCol, rightCol];
  const inner = row({
    flex_direction: 'row',
    gap: cfg.gap ?? 48,
    flex_align_items: cfg.verticalAlign ?? 'center',
    flex_wrap: 'wrap',
    max_width: 1100,
  }, children);
  return section({ background_color: bg, padding: pad('80', '24', '80', '24') }, [inner]);
}

// ─── Testimonials section ─────────────────────────────────────────────────────

export interface TestimonialsConfig {
  headline?: string;
  items: Array<{ content: string; name: string; job: string; imageUrl?: string }>;
  bgColor?: string;
  columns?: 2 | 3;
}

export function buildTestimonials(cfg: TestimonialsConfig, scheme?: ColorScheme | string): unknown {
  const s = resolveScheme(scheme);
  const bg = cfg.bgColor ?? s.bgLight;
  const cols = cfg.columns ?? 3;

  const cards = cfg.items.map(item =>
    col(
      { background_color: s.bgWhite, padding: pad('24', '24', '24', '24'), gap: 12 },
      [testimonial(item.content, item.name, item.job, {
        imageUrl: item.imageUrl,
        alignment: 'left',
        textColor: s.textDark,
        nameColor: s.textDark,
        jobColor: s.textMuted,
      })]
    )
  );

  const rows: unknown[] = [];
  for (let i = 0; i < cards.length; i += cols) {
    rows.push(row({ flex_direction: 'row', gap: 24, flex_wrap: 'wrap' }, cards.slice(i, i + cols)));
  }

  const headerItems: unknown[] = [];
  if (cfg.headline) {
    headerItems.push(heading(cfg.headline, { tag: 'h2', size: 36, weight: '700', color: s.textDark, align: 'center' }));
    headerItems.push(spacer(16));
  }

  const inner = row({ flex_direction: 'column', gap: 24, max_width: 1100 }, [...headerItems, ...rows]);
  return section({ background_color: bg, padding: pad('80', '24', '80', '24') }, [inner]);
}

// ─── Full landing page builder ────────────────────────────────────────────────

export interface LandingPageConfig {
  title: string;
  /**
   * Color scheme for the whole page.
   * Pass a named scheme ('dark' | 'blue' | 'purple' | 'green' | 'orange' | 'light')
   * or a custom ColorScheme object.
   * Individual sections can still override specific colors.
   */
  scheme?: ColorScheme | string;
  hero: HeroConfig;
  stats?: StatsConfig;
  features?: FeaturesConfig;
  secondFeatures?: FeaturesConfig;
  testimonials?: TestimonialsConfig;
  cta: CTAConfig;
  extraSections?: unknown[];
}

export function buildLandingPage(cfg: LandingPageConfig): object {
  const scheme = cfg.scheme;
  const sections: unknown[] = [buildHero(cfg.hero, scheme)];

  if (cfg.stats) sections.push(buildStats(cfg.stats, scheme));
  if (cfg.features) sections.push(buildFeatures(cfg.features, scheme));
  if (cfg.extraSections) sections.push(...cfg.extraSections);
  if (cfg.secondFeatures) sections.push(buildFeatures({ ...cfg.secondFeatures, variant: 'alt' }, scheme));
  if (cfg.testimonials) sections.push(buildTestimonials(cfg.testimonials, scheme));

  sections.push(buildCTA(cfg.cta, scheme));

  return {
    content: sections,
    page_settings: {},
    version: '0.4',
    title: cfg.title,
    type: 'page',
  };
}
