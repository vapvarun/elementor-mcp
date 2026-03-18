import { genId, baseElement } from './core.js';

// ─── Form (Pro) ───────────────────────────────────────────────────────────────

export type FormFieldType =
  | 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select'
  | 'checkbox' | 'radio' | 'date' | 'time' | 'upload' | 'hidden' | 'html';

export interface FormField {
  id?: string;
  type?: FormFieldType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  width?: '100' | '75' | '50' | '33' | '25';
  options?: string;       // comma separated for select/radio/checkbox
  defaultValue?: string;
}

export interface FormOpts {
  name?: string;
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  emailTo?: string;
  emailSubject?: string;
  inputSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabels?: boolean;
  markRequired?: boolean;
  buttonWidth?: '100' | '33' | '25' | 'auto';
  btnBgColor?: string;
  btnTextColor?: string;
}

function buildFormField(f: FormField, idx: number): Record<string, unknown> {
  const fieldId = f.id ?? `field${idx}`;
  return {
    custom_id: fieldId,
    field_type: f.type ?? 'text',
    field_label: f.label ?? '',
    placeholder: f.placeholder ?? '',
    required: f.required ? 'true' : '',
    width: f.width ?? '100',
    ...(f.options && { field_options: f.options }),
    ...(f.defaultValue && { field_value: f.defaultValue }),
  };
}

export function form(fields: FormField[], opts: FormOpts = {}): unknown {
  const formFields = fields.map((f, i) => buildFormField(f, i + 1));

  const s: Record<string, unknown> = {
    form_name: opts.name ?? 'Contact Form',
    form_fields: formFields,
    input_size: opts.inputSize ?? 'sm',
    show_labels: opts.showLabels !== false ? 'true' : '',
    mark_required: opts.markRequired ? 'yes' : '',
    button_size: opts.inputSize ?? 'sm',
    button_width: opts.buttonWidth ?? '100',
    submit_actions: ['email'],
    success_message: opts.successMessage ?? 'Thank you! Your message has been sent.',
    error_message: opts.errorMessage ?? 'Please fill in all required fields.',
  };

  if (opts.emailTo) {
    s.email_to = opts.emailTo;
    s.email_subject = opts.emailSubject ?? 'New message from website';
  }
  if (opts.btnBgColor) s.button_background_color = opts.btnBgColor;
  if (opts.btnTextColor) s.button_text_color = opts.btnTextColor;

  return { id: genId(), elType: 'widget', widgetType: 'form', ...baseElement(), settings: s };
}

// ─── Countdown (Pro) ──────────────────────────────────────────────────────────
// Note: This widget had a PHP dump error but structure is well-known from Elementor source.

export interface CountdownOpts {
  type?: 'due_date' | 'evergreen';
  /** ISO date string for due_date type, e.g. "2025-12-31 23:59" */
  dueDate?: string;
  /** Minutes for evergreen type */
  evergreenMinutes?: number;
  showLabels?: boolean;
  showSeparator?: boolean;
  labelDays?: string;
  labelHours?: string;
  labelMinutes?: string;
  labelSeconds?: string;
  expiredAction?: 'none' | 'redirect' | 'hide' | 'message';
  expiredMessage?: string;
  expiredRedirect?: string;
  numberColor?: string;
  labelColor?: string;
  numberSize?: number;
  boxBgColor?: string;
  boxPadding?: number;
}

export function countdown(opts: CountdownOpts = {}): unknown {
  const type = opts.type ?? 'due_date';
  const dueDate = opts.dueDate ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString().slice(0, 16).replace('T', ' ');

  const s: Record<string, unknown> = {
    countdown_type: type,
    due_date: type === 'due_date' ? dueDate : undefined,
    evergreen_counter_minutes: type === 'evergreen' ? (opts.evergreenMinutes ?? 60) : undefined,
    show_labels: opts.showLabels !== false ? 'yes' : '',
    show_separator: opts.showSeparator !== false ? 'yes' : '',
    label_days: opts.labelDays ?? 'Days',
    label_hours: opts.labelHours ?? 'Hours',
    label_minutes: opts.labelMinutes ?? 'Minutes',
    label_seconds: opts.labelSeconds ?? 'Seconds',
    expire_actions: opts.expiredAction ?? 'none',
    message_after_expire: opts.expiredMessage ?? '',
    expire_redirect_url: opts.expiredRedirect ? { url: opts.expiredRedirect } : undefined,
  };

  if (opts.numberColor) s.digit_color = opts.numberColor;
  if (opts.labelColor) s.label_color = opts.labelColor;
  if (opts.numberSize) {
    s.digit_typography_typography = 'custom';
    s.digit_typography_font_size = { unit: 'px', size: opts.numberSize };
  }
  if (opts.boxBgColor) s.box_background_color = opts.boxBgColor;
  if (opts.boxPadding) {
    s.box_padding = {
      unit: 'px',
      top: String(opts.boxPadding),
      right: String(opts.boxPadding),
      bottom: String(opts.boxPadding),
      left: String(opts.boxPadding),
      isLinked: true,
    };
  }

  return { id: genId(), elType: 'widget', widgetType: 'countdown', ...baseElement(), settings: s };
}

// ─── Reviews (Pro) ────────────────────────────────────────────────────────────

export interface ReviewItem {
  content: string;
  name: string;
  title?: string;
  imageUrl?: string;
  rating?: number;   // 1-5
}

export interface ReviewsOpts {
  slidesPerView?: 1 | 2 | 3;
  autoplay?: boolean;
  autoplaySpeed?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  reviewColor?: string;
  nameColor?: string;
  ratingColor?: string;
  bgColor?: string;
}

export function reviews(items: ReviewItem[], opts: ReviewsOpts = {}): unknown {
  const slides = items.map(item => ({
    content: item.content,
    name: item.name,
    title: item.title ?? '',
    ...(item.imageUrl && { image: { url: item.imageUrl, id: '', size: '' } }),
    ...(item.rating !== undefined && { rating: { value: item.rating } }),
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'reviews',
    ...baseElement(),
    settings: {
      slides,
      slides_per_view: String(opts.slidesPerView ?? ''),
      autoplay: opts.autoplay ? 'yes' : '',
      autoplay_speed: opts.autoplaySpeed ?? 5000,
      infinite: opts.loop !== false ? 'yes' : '',
      show_arrows: opts.showArrows !== false ? 'yes' : '',
      pagination: opts.showDots !== false ? 'yes' : '',
      ...(opts.reviewColor && { review_color: opts.reviewColor }),
      ...(opts.nameColor && { reviewer_name_color: opts.nameColor }),
      ...(opts.ratingColor && { stars_color: opts.ratingColor }),
      ...(opts.bgColor && { review_background_color: opts.bgColor }),
    },
  };
}

// ─── Gallery Pro ──────────────────────────────────────────────────────────────

export interface GalleryProOpts {
  type?: 'single' | 'multiple';
  layout?: 'grid' | 'justified' | 'masonry';
  columns?: number;
  gap?: number;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:4';
  openLightbox?: boolean;
  showCaption?: boolean;
  orderBy?: '' | 'rand' | 'title' | 'date';
}

export function galleryPro(imageUrls: string[], opts: GalleryProOpts = {}): unknown {
  const gallery = imageUrls.map(url => ({ url, id: '', size: '' }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'gallery',
    ...baseElement(),
    settings: {
      gallery,
      gallery_type: opts.type ?? 'single',
      gallery_layout: opts.layout ?? 'grid',
      columns: opts.columns ?? 3,
      columns_tablet: Math.min(opts.columns ?? 3, 2),
      columns_mobile: 1,
      gap: { unit: 'px', size: opts.gap ?? 8 },
      open_lightbox: opts.openLightbox ? 'yes' : 'default',
      order_by: opts.orderBy ?? '',
    },
  };
}

// ─── Loop Grid (Pro) ──────────────────────────────────────────────────────────

export interface LoopGridOpts {
  templateId?: number;
  postsPerPage?: number;
  columns?: number;
  columnsTablet?: number;
  columnsMobile?: number;
  masonry?: boolean;
  equalHeight?: boolean;
  postType?: string;
  orderBy?: 'date' | 'title' | 'rand' | 'menu_order';
  order?: 'desc' | 'asc';
  categories?: number[];
  paginationType?: '' | 'numbers' | 'load_more' | 'infinite_scroll';
}

export function loopGrid(opts: LoopGridOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'loop-grid',
    ...baseElement(),
    settings: {
      template_id: opts.templateId ?? '',
      posts_per_page: opts.postsPerPage ?? 6,
      columns: opts.columns ?? 3,
      columns_tablet: opts.columnsTablet ?? 2,
      columns_mobile: opts.columnsMobile ?? 1,
      masonry: opts.masonry ? 'yes' : '',
      equal_height: opts.equalHeight ? 'yes' : '',
      post_type: opts.postType ?? 'post',
      orderby: opts.orderBy ?? 'date',
      order: opts.order ?? 'desc',
      pagination_type: opts.paginationType ?? '',
      ...(opts.categories?.length && { select_categories: opts.categories }),
    },
  };
}

// ─── Text Path ────────────────────────────────────────────────────────────────

export type TextPathShape = 'wave' | 'arc' | 's-curve' | 'straight' | 'spiral' | 'custom';

export interface TextPathOpts {
  path?: TextPathShape;
  direction?: 'ltr' | 'rtl';
  showPath?: boolean;
  align?: 'left' | 'center' | 'right';
  link?: string;
  fontSize?: number;
  color?: string;
}

export function textPath(text: string, opts: TextPathOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'text-path',
    ...baseElement(),
    settings: {
      text,
      path: opts.path ?? 'wave',
      show_path: opts.showPath ? 'yes' : '',
      align: opts.align ?? 'center',
      ...(opts.direction && { text_path_direction: opts.direction }),
      ...(opts.link && { link: { url: opts.link, is_external: false, nofollow: false, custom_attributes: '' } }),
      ...(opts.fontSize && {
        text_typography_typography: 'custom',
        text_typography_font_size: { unit: 'px', size: opts.fontSize },
      }),
      ...(opts.color && { text_stroke_paint_order: opts.color }),
    },
  };
}

// ─── Nav Menu (Pro) ───────────────────────────────────────────────────────────

export interface NavMenuOpts {
  menu?: string;  // menu slug
  layout?: 'horizontal' | 'vertical' | 'dropdown';
  pointer?: 'none' | 'underline' | 'overline' | 'double-line' | 'framed' | 'background' | 'text';
  itemColor?: string;
  itemHoverColor?: string;
  activeColor?: string;
  bgColor?: string;
  align?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
}

export function navMenu(opts: NavMenuOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'nav-menu',
    ...baseElement(),
    settings: {
      menu: opts.menu ?? '',
      layout: opts.layout ?? 'horizontal',
      pointer: opts.pointer ?? 'underline',
      align_items: opts.align ?? 'center',
      ...(opts.itemColor && { color_menu_item: opts.itemColor }),
      ...(opts.itemHoverColor && { color_menu_item_hover: opts.itemHoverColor }),
      ...(opts.activeColor && { color_menu_item_active: opts.activeColor }),
      ...(opts.bgColor && { background_color: opts.bgColor }),
    },
  };
}

// ─── Template embed (Pro) ─────────────────────────────────────────────────────

export function templateEmbed(templateId: number): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'template',
    ...baseElement(),
    settings: { template_id: templateId },
  };
}

// ─── Taxonomy Filter (Pro) ────────────────────────────────────────────────────

export interface TaxonomyFilterOpts {
  taxonomy?: string;
  itemLayout?: 'horizontal' | 'vertical';
  showCount?: boolean;
  filterType?: 'all' | 'subtree';
}

export function taxonomyFilter(opts: TaxonomyFilterOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'taxonomy-filter',
    ...baseElement(),
    settings: {
      taxonomy: opts.taxonomy ?? 'category',
      item_layout: opts.itemLayout ?? 'horizontal',
      show_count: opts.showCount ? 'yes' : '',
    },
  };
}

// ─── Share Buttons (Pro) ─── (known structure despite dump error) ─────────────

export interface ShareButtonsOpts {
  networks?: Array<'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'email' | 'whatsapp'>;
  view?: 'icon' | 'icon-text' | 'text';
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
  align?: 'left' | 'center' | 'right' | 'justify';
  showLabel?: boolean;
}

export function shareButtons(opts: ShareButtonsOpts = {}): unknown {
  const nets = opts.networks ?? ['facebook', 'twitter', 'linkedin'];
  const buttons = nets.map(net => ({ button: net }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'share-buttons',
    ...baseElement(),
    settings: {
      share_buttons: buttons,
      view: opts.view ?? 'icon-text',
      size: opts.size ?? 'medium',
      alignment: opts.align ?? 'center',
      show_label: opts.showLabel ? 'yes' : '',
    },
  };
}

// ─── Search (Pro) ─────────────────────────────────────────────────────────────

export interface SearchWidgetOpts {
  placeholder?: string;
  submitButtonText?: string;
  submitTrigger?: 'click_submit' | 'auto' | 'none';
  liveResults?: boolean;
  autocomplete?: boolean;
  skin?: 'classic' | 'minimal' | 'full_screen';
}

export function searchWidget(opts: SearchWidgetOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'search',
    ...baseElement(),
    settings: {
      search_input_placeholder_text: opts.placeholder ?? 'Search...',
      submit_button_text: opts.submitButtonText ?? 'Search',
      submit_trigger: opts.submitTrigger ?? 'click_submit',
      live_results: opts.liveResults ? 'yes' : '',
      autocomplete: opts.autocomplete ? 'yes' : '',
      skin: opts.skin ?? 'classic',
    },
  };
}

// ─── Progress Tracker (Pro / Theme Single) ────────────────────────────────────

export interface ProgressTrackerOpts {
  type?: 'horizontal' | 'vertical' | 'circular';
  relativeTo?: 'entire_page' | 'post_content' | 'selector';
  selector?: string;
  showPercentage?: boolean;
  color?: string;
  bgColor?: string;
  height?: number;
}

export function progressTracker(opts: ProgressTrackerOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'progress-tracker',
    ...baseElement(),
    settings: {
      type: opts.type ?? 'horizontal',
      relative_to: opts.relativeTo ?? 'entire_page',
      selector: opts.selector ?? '',
      percentage: opts.showPercentage ? 'yes' : 'no',
      ...(opts.color && { color: opts.color }),
      ...(opts.bgColor && { background_color: opts.bgColor }),
      ...(opts.height && { height: { unit: 'px', size: opts.height } }),
    },
  };
}

// ─── Off Canvas (Pro) ─────────────────────────────────────────────────────────

export interface OffCanvasOpts {
  name?: string;
  horizontalPosition?: 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
  widthPx?: number;
  entranceAnimation?: string;
  bgColor?: string;
}

export function offCanvas(opts: OffCanvasOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'off-canvas',
    ...baseElement(),
    settings: {
      off_canvas_name: opts.name ?? 'Off-Canvas',
      horizontal_position: opts.horizontalPosition ?? 'right',
      vertical_position: opts.verticalPosition ?? '',
      width: opts.widthPx ? { unit: 'px', size: opts.widthPx, sizes: [] } : { unit: 'px', size: 300, sizes: [] },
      entrance_animation: opts.entranceAnimation ?? 'slideInRight',
      ...(opts.bgColor && { background_color: opts.bgColor }),
    },
  };
}

// ─── Video Playlist (Pro) ─────────────────────────────────────────────────────

export interface VideoPlaylistItem {
  title: string;
  youtubeUrl?: string;
  vimeoUrl?: string;
  thumbnailUrl?: string;
}

export interface VideoPlaylistOpts {
  playlistTitle?: string;
  titleTag?: 'h2' | 'h3' | 'h4';
  collapsible?: boolean;
  showInnerTabs?: boolean;
}

export function videoPlaylist(items: VideoPlaylistItem[], opts: VideoPlaylistOpts = {}): unknown {
  const tabs = items.map(item => ({
    title: item.title,
    youtube_url: item.youtubeUrl ?? '',
    vimeo_url: item.vimeoUrl ?? '',
    ...(item.thumbnailUrl && { thumbnail: { url: item.thumbnailUrl, id: '', size: '' } }),
  }));

  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'video-playlist',
    ...baseElement(),
    settings: {
      tabs,
      playlist_title: opts.playlistTitle ?? 'Playlist',
      playlist_title_tag: opts.titleTag ?? 'h2',
      inner_tab_is_content_collapsible: opts.collapsible ? 'yes' : '',
    },
  };
}

// ─── Audio ────────────────────────────────────────────────────────────────────
// Note: errored in controls dump; implemented from known Elementor structure.

export interface AudioOpts {
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  options?: Array<'autoplay' | 'loop' | 'muted'>;
}

export function audio(url: string, opts: AudioOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'audio',
    ...baseElement(),
    settings: {
      audio_type: 'hosted',
      hosted_url: { url, id: '' },
      autoplay: opts.autoplay ? 'yes' : '',
      loop: opts.loop ? 'yes' : '',
      muted: false,
      options: opts.options ?? [],
    },
  };
}

// ─── Login (Pro) ─────────────────────────────────────────────────────────────
// Note: errored in controls dump; implemented from known Elementor structure.

export interface LoginWidgetOpts {
  submitButtonText?: string;
  rememberMeLabel?: string;
  showRememberMe?: boolean;
  showLostPassword?: boolean;
  lostPasswordText?: string;
  redirectUrl?: string;
  skin?: 'default' | 'box';
  labelUsername?: string;
  labelPassword?: string;
  placeholderUsername?: string;
  placeholderPassword?: string;
}

export function loginWidget(opts: LoginWidgetOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'login',
    ...baseElement(),
    settings: {
      button_text: opts.submitButtonText ?? 'Log In',
      show_remember_me: opts.showRememberMe !== false ? 'yes' : '',
      show_lost_password: opts.showLostPassword !== false ? 'yes' : '',
      lost_password_text: opts.lostPasswordText ?? 'Lost your password?',
      redirect_after_login: opts.redirectUrl ? 'custom' : 'home',
      redirect_url: { url: opts.redirectUrl ?? '' },
      skin: opts.skin ?? 'default',
      user_label: opts.labelUsername ?? 'Username or Email Address',
      user_placeholder: opts.placeholderUsername ?? '',
      password_label: opts.labelPassword ?? 'Password',
      password_placeholder: opts.placeholderPassword ?? '',
    },
  };
}

// ─── PayPal Button (Pro) ──────────────────────────────────────────────────────
// Note: errored in controls dump; implemented from known Elementor structure.

export type PayPalButtonType = 'checkout' | 'subscribe';
export type PayPalCurrency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD';

export interface PayPalButtonOpts {
  type?: PayPalButtonType;
  currency?: PayPalCurrency;
  price?: string;
  quantity?: number;
  itemName?: string;
  buttonText?: string;
  buttonAlign?: 'left' | 'center' | 'right';
  openInNewWindow?: boolean;
  sandbox?: boolean;
  // For subscriptions
  billingCycle?: 'M' | 'Y' | 'D';
  billingPeriod?: number;
}

export function paypalButton(sellerEmail: string, opts: PayPalButtonOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'paypal-button',
    ...baseElement(),
    settings: {
      merchant_email: sellerEmail,
      payment_type: opts.type ?? 'checkout',
      currency: opts.currency ?? 'USD',
      price: opts.price ?? '9.99',
      quantity: opts.quantity ?? 1,
      item_name: opts.itemName ?? '',
      button_text: opts.buttonText ?? 'Pay Now',
      align: opts.buttonAlign ?? 'center',
      sandbox_mode: opts.sandbox ? 'yes' : '',
      open_in_new_window: opts.openInNewWindow ? 'yes' : '',
      billing_cycle: opts.billingCycle ?? 'M',
      billing_period: opts.billingPeriod ?? 1,
    },
  };
}

// ─── Stripe Button (Pro) ──────────────────────────────────────────────────────
// Note: errored in controls dump; implemented from known Elementor structure.

export interface StripeButtonOpts {
  productName?: string;
  productDescription?: string;
  currency?: string;
  price?: number;   // in cents
  buttonText?: string;
  buttonAlign?: 'left' | 'center' | 'right';
  collectShipping?: boolean;
  collectPhone?: boolean;
  successUrl?: string;
  cancelUrl?: string;
}

export function stripeButton(opts: StripeButtonOpts = {}): unknown {
  return {
    id: genId(),
    elType: 'widget',
    widgetType: 'stripe-button',
    ...baseElement(),
    settings: {
      product_name: opts.productName ?? 'Product',
      product_description: opts.productDescription ?? '',
      currency: opts.currency ?? 'usd',
      price: opts.price ?? 999,
      button_text: opts.buttonText ?? 'Buy Now',
      align: opts.buttonAlign ?? 'center',
      collect_shipping_address: opts.collectShipping ? 'yes' : '',
      collect_phone_number: opts.collectPhone ? 'yes' : '',
      success_url: { url: opts.successUrl ?? '' },
      cancel_url: { url: opts.cancelUrl ?? '' },
    },
  };
}
