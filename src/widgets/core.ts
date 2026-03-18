import { randomBytes } from 'crypto';

// ─── ID Generator ─────────────────────────────────────────────────────────────

export function genId(): string {
  return randomBytes(4).toString('hex').slice(0, 7);
}

// ─── Base element factory ──────────────────────────────────────────────────────

export function baseElement(overrides: Record<string, unknown> = {}) {
  return {
    isInner: false,
    isLocked: false,
    defaultEditSettings: { defaultEditRoute: 'content' },
    interactions: [],
    elements: [] as unknown[],
    editSettings: { defaultEditRoute: 'content' },
    ...overrides,
  };
}

// ─── Padding helper ───────────────────────────────────────────────────────────

export interface PaddingValue {
  top: string; right: string; bottom: string; left: string;
}

export function pad(top: string, right: string, bottom: string, left: string): PaddingValue {
  return { top, right, bottom, left };
}

// ─── Container settings ───────────────────────────────────────────────────────

export interface ContainerSettings {
  content_width?: 'full' | 'boxed';
  flex_direction?: 'row' | 'column';
  flex_align_items?: 'center' | 'flex-start' | 'flex-end' | 'stretch';
  flex_justify_content?: 'center' | 'flex-start' | 'flex-end' | 'space-between';
  background_color?: string;
  /** gradient: two hex colors */
  gradient?: { from: string; to: string; angle?: number };
  padding?: PaddingValue;
  gap?: number;
  max_width?: number;
  min_height?: number;
  flex_wrap?: 'wrap' | 'nowrap';
  border_radius?: number;
}

// ─── Section (outer wrapper container) ────────────────────────────────────────

export function section(settings: ContainerSettings, elements: unknown[]): unknown {
  const s: Record<string, unknown> = {
    content_width: settings.content_width ?? 'full',
    flex_direction: settings.flex_direction ?? 'column',
    flex_align_items: settings.flex_align_items ?? 'center',
  };

  if (settings.gradient) {
    const { from, to, angle = 135 } = settings.gradient;
    s.background_background = 'gradient';
    s.background_color = from;
    s.background_color_b = to;
    s.background_gradient_angle = { unit: 'deg', size: angle };
    s.background_gradient_type = 'linear';
  } else if (settings.background_color) {
    s.background_background = 'classic';
    s.background_color = settings.background_color;
  }

  if (settings.padding) {
    s.padding = {
      unit: 'px',
      top: settings.padding.top,
      right: settings.padding.right,
      bottom: settings.padding.bottom,
      left: settings.padding.left,
      isLinked: false,
    };
  }

  if (settings.min_height) {
    s.min_height = { unit: 'px', size: settings.min_height };
  }

  if (settings.border_radius) {
    s.border_radius = {
      unit: 'px',
      top: String(settings.border_radius),
      right: String(settings.border_radius),
      bottom: String(settings.border_radius),
      left: String(settings.border_radius),
      isLinked: true,
    };
  }

  return {
    id: genId(),
    elType: 'container',
    ...baseElement({ isInner: false }),
    settings: s,
    elements,
  };
}

// ─── Row (inner horizontal container) ─────────────────────────────────────────

export function row(settings: ContainerSettings, elements: unknown[]): unknown {
  const s: Record<string, unknown> = {
    flex_direction: settings.flex_direction ?? 'row',
    flex_align_items: settings.flex_align_items ?? 'flex-start',
  };

  if (settings.flex_wrap) s.flex_wrap = settings.flex_wrap;
  if (settings.flex_justify_content) s.flex_justify_content = settings.flex_justify_content;

  if (settings.gap !== undefined) {
    s.flex_gap = {
      size: settings.gap,
      unit: 'px',
      column: String(settings.gap),
      row: String(settings.gap),
      isLinked: true,
    };
  }

  if (settings.max_width) {
    s.width = { unit: 'px', size: settings.max_width, sizes: [] };
    s.boxed_width = { unit: 'px', size: settings.max_width, sizes: [] };
  }

  if (settings.background_color) {
    s.background_background = 'classic';
    s.background_color = settings.background_color;
  }

  if (settings.padding) {
    s.padding = {
      unit: 'px',
      top: settings.padding.top,
      right: settings.padding.right,
      bottom: settings.padding.bottom,
      left: settings.padding.left,
      isLinked: false,
    };
  }

  return {
    id: genId(),
    elType: 'container',
    ...baseElement({ isInner: true }),
    settings: s,
    elements,
  };
}

// ─── Col (inner vertical container / card) ────────────────────────────────────

export function col(settings: ContainerSettings, elements: unknown[]): unknown {
  const s: Record<string, unknown> = {
    flex_direction: settings.flex_direction ?? 'column',
  };

  if (settings.background_color) {
    s.background_background = 'classic';
    s.background_color = settings.background_color;
    s._border_radius = {
      unit: 'px',
      top: String(settings.border_radius ?? 8),
      right: String(settings.border_radius ?? 8),
      bottom: String(settings.border_radius ?? 8),
      left: String(settings.border_radius ?? 8),
      isLinked: true,
    };
  }

  if (settings.padding) {
    s._padding = {
      unit: 'px',
      top: settings.padding.top,
      right: settings.padding.right,
      bottom: settings.padding.bottom,
      left: settings.padding.left,
      isLinked: false,
    };
  }

  if (settings.gap !== undefined) {
    s.flex_gap = {
      size: settings.gap,
      unit: 'px',
      column: String(settings.gap),
      row: String(settings.gap),
      isLinked: true,
    };
  }

  if (settings.flex_align_items) s.flex_align_items = settings.flex_align_items;
  if (settings.flex_justify_content) s.flex_justify_content = settings.flex_justify_content;

  return {
    id: genId(),
    elType: 'container',
    ...baseElement({ isInner: true }),
    settings: s,
    elements,
  };
}
