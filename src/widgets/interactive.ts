import { genId, baseElement } from './core.js';

// ─── Accordion ────────────────────────────────────────────────────────────────

export interface AccordionItem { title: string; content: string; }

export interface AccordionOpts {
  titleHtmlTag?: 'div' | 'h2' | 'h3' | 'h4' | 'h5';
  openFirst?: boolean;
  titleColor?: string;
  activeColor?: string;
  borderColor?: string;
  iconOpen?: string;
  iconClose?: string;
  faqSchema?: boolean;
}

export function accordion(items: AccordionItem[], opts: AccordionOpts = {}): unknown {
  const tabs = items.map(item => ({
    tab_title: item.title,
    tab_content: item.content,
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'accordion',
    ...baseElement(),
    settings: {
      tabs,
      title_html_tag: opts.titleHtmlTag ?? 'div',
      selected_icon: { value: opts.iconOpen ?? 'fas fa-plus', library: 'fa-solid' },
      selected_active_icon: { value: opts.iconClose ?? 'fas fa-minus', library: 'fa-solid' },
      faq_schema: opts.faqSchema ? 'yes' : '',
      ...(opts.titleColor && { title_color: opts.titleColor }),
      ...(opts.activeColor && { active_color: opts.activeColor }),
      ...(opts.borderColor && { border_color: opts.borderColor }),
    },
  };
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export interface TabItem { title: string; content: string; icon?: string; }

export interface TabsOpts {
  type?: 'horizontal' | 'vertical';
  align?: 'left' | 'center' | 'right';
  titleColor?: string;
  activeColor?: string;
  activeBgColor?: string;
}

export function tabs(items: TabItem[], opts: TabsOpts = {}): unknown {
  const tabItems = items.map(item => ({
    tab_title: item.title,
    tab_content: item.content,
    ...(item.icon && { tab_icon: { value: item.icon, library: 'fa-solid' } }),
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'tabs',
    ...baseElement(),
    settings: {
      tabs: tabItems,
      type: opts.type ?? 'horizontal',
      tabs_align_horizontal: opts.align ?? '',
      ...(opts.titleColor && { tab_color: opts.titleColor }),
      ...(opts.activeColor && { tab_active_color: opts.activeColor }),
      ...(opts.activeBgColor && { background_color: opts.activeBgColor }),
    },
  };
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

export interface ToggleOpts {
  titleHtmlTag?: 'div' | 'h2' | 'h3' | 'h4' | 'h5';
  faqSchema?: boolean;
  titleColor?: string;
  activeColor?: string;
}

export function toggle(items: AccordionItem[], opts: ToggleOpts = {}): unknown {
  const tabItems = items.map(item => ({
    tab_title: item.title,
    tab_content: item.content,
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'toggle',
    ...baseElement(),
    settings: {
      tabs: tabItems,
      title_html_tag: opts.titleHtmlTag ?? 'div',
      faq_schema: opts.faqSchema ? 'yes' : '',
      selected_icon: { value: 'fas fa-caret-right', library: 'fa-solid' },
      selected_active_icon: { value: 'fas fa-caret-up', library: 'fa-solid' },
      ...(opts.titleColor && { title_color: opts.titleColor }),
      ...(opts.activeColor && { active_color: opts.activeColor }),
    },
  };
}

// ─── Nested Accordion (v4 style) ─────────────────────────────────────────────

export function nestedAccordion(items: AccordionItem[], opts: AccordionOpts = {}): unknown {
  const tabItems = items.map(item => ({
    item_title: item.title,
    item_content: item.content,
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'nested-accordion',
    ...baseElement(),
    settings: {
      items: tabItems,
      faq_schema: opts.faqSchema ? 'yes' : '',
    },
  };
}

// ─── Nested Tabs (v4 style) ───────────────────────────────────────────────────

export function nestedTabs(items: TabItem[], opts: TabsOpts = {}): unknown {
  const tabItems = items.map(item => ({
    tab_title: item.title,
    tab_content: item.content,
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'nested-tabs',
    ...baseElement(),
    settings: {
      tabs: tabItems,
      tab_position: opts.type === 'vertical' ? 'start' : 'top',
    },
  };
}
