# elementor-mcp

MCP server that generates Elementor Pro landing pages programmatically and pushes them to WordPress. Describe your page — headline, features, testimonials, CTA — and get a fully-built, styled Elementor page in seconds.

**106 widgets covered** — all Elementor Free + Pro + Theme Builder elements, 6 built-in color schemes, direct WordPress push via REST API.

---

## Table of Contents

- [What it does](#what-it-does)
- [Installation](#installation)
- [WordPress setup](#wordpress-setup)
- [MCP client setup](#mcp-client-setup)
- [Tools](#tools)
  - [elementor_build_landing_page](#elementor_build_landing_page)
  - [elementor_generate_json](#elementor_generate_json)
  - [elementor_push_json](#elementor_push_json)
  - [elementor_build_section](#elementor_build_section)
- [Color schemes](#color-schemes)
- [Section builders reference](#section-builders-reference)
- [Widget reference](#widget-reference)
- [Requirements](#requirements)

---

## What it does

- **One tool call** → full Elementor landing page, live on WordPress
- **Uniform color schemes** — set `scheme: "blue"` and every section (hero, features, CTA, testimonials) picks up the right colors automatically
- **106 widgets** — every Elementor Free + Pro + Theme Builder widget implemented as a TypeScript factory
- **Assemble piece by piece** — build individual sections and widgets, get JSON back, combine manually
- **Push or preview** — push directly to WordPress or return raw Elementor JSON for review/manual import

---

## Installation

```bash
git clone https://github.com/vapvarun/elementor-mcp.git
cd elementor-mcp
npm install
npm run build
```

---

## WordPress setup

### 1. Generate an Application Password

In your WordPress admin: **Users → Profile → Application Passwords**

Give it a name (e.g. `elementor-mcp`) and copy the generated password.

### 2. Create the sites config file

```bash
mkdir -p ~/.wp-sites
```

Create `~/.wp-sites/sites.json`:

```json
{
  "sites": {
    "mysite": {
      "url": "https://mysite.com",
      "username": "admin",
      "app_password": "xxxx xxxx xxxx xxxx xxxx xxxx"
    },
    "staging": {
      "url": "https://staging.mysite.com",
      "username": "admin",
      "app_password": "yyyy yyyy yyyy yyyy yyyy yyyy"
    }
  }
}
```

The `site_id` you pass in tool calls matches the key in this file (`"mysite"`, `"staging"`, etc.).

---

## MCP client setup

### Claude Desktop / Claude Code

Add to your `claude_desktop_config.json` or MCP server config:

```json
{
  "mcpServers": {
    "elementor-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/elementor-mcp/dist/index.js"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "elementor-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/elementor-mcp/dist/index.js"]
    }
  }
}
```

---

## Tools

### `elementor_build_landing_page`

Build a complete landing page and push it to WordPress in one call.

**Sections (in order):** hero → stats (optional) → features (optional) → extra sections (optional) → second features (optional) → testimonials (optional) → CTA

**Required fields:** `site_id`, `title`, `hero`, `cta`

**Full example:**

```json
{
  "site_id": "mysite",
  "title": "Ship Faster with AI",
  "scheme": "blue",
  "publish": false,
  "hero": {
    "headline": "Ship faster with AI",
    "subtext": "The platform engineering teams use to move at speed without cutting corners.",
    "badge": "Now in public beta",
    "tagline": "Trusted by 1,200+ teams",
    "primaryCTA": { "label": "Start for free", "url": "/signup" },
    "secondaryCTA": { "label": "See a demo", "url": "/demo" }
  },
  "stats": {
    "items": [
      { "value": "10×", "label": "faster page builds" },
      { "value": "106", "label": "widgets supported" },
      { "value": "6", "label": "color schemes" },
      { "value": "100%", "label": "Elementor coverage" }
    ]
  },
  "features": {
    "headline": "Everything you need to ship",
    "subtext": "No drag-and-drop required.",
    "columns": 3,
    "features": [
      { "icon": "fa-bolt", "title": "Instant builds", "description": "Describe your page in plain text. Get Elementor JSON back in seconds." },
      { "icon": "fa-palette", "title": "Color schemes", "description": "One parameter themes the entire page — hero, cards, CTA, all of it." },
      { "icon": "fa-code", "title": "106 widgets", "description": "Every Elementor Free + Pro + Theme Builder widget implemented." }
    ]
  },
  "secondFeatures": {
    "headline": "Built for teams who move fast",
    "columns": 2,
    "features": [
      { "icon": "fa-server", "title": "Direct WP push", "description": "Pages go live via REST API. No copy-paste, no import steps." },
      { "icon": "fa-layer-group", "title": "Assemble sections", "description": "Build piece by piece with elementor_build_section, combine in any order." }
    ]
  },
  "testimonials": {
    "headline": "What teams say",
    "columns": 3,
    "items": [
      { "content": "We rebuilt our entire service pages in an afternoon. Would have taken a week manually.", "name": "Sarah K.", "job": "Head of Marketing at Acme" },
      { "content": "The color scheme system is the killer feature. One param, entire page themed perfectly.", "name": "James R.", "job": "Frontend Lead at BuildCo" },
      { "content": "Finally something that speaks Elementor natively instead of generating broken HTML.", "name": "Priya M.", "job": "CTO at LaunchFast" }
    ]
  },
  "cta": {
    "headline": "Ready to build your first page?",
    "subtext": "Free to start. No credit card required.",
    "primaryCTA": { "label": "Get started free", "url": "/signup" },
    "secondaryCTA": { "label": "Read the docs", "url": "/docs" }
  }
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `site_id` | string | ✓ | Key from `~/.wp-sites/sites.json` |
| `title` | string | ✓ | Page title in WordPress |
| `hero` | object | ✓ | Hero section config (see below) |
| `cta` | object | ✓ | CTA section config (see below) |
| `scheme` | string \| object | — | Named scheme or custom object (see [Color schemes](#color-schemes)) |
| `page_id` | number | — | Existing page ID to update. Omit to create a new page |
| `publish` | boolean | — | `true` to publish immediately. Default: `false` (draft) |
| `push_to_wp` | boolean | — | `false` to return JSON without pushing. Default: `true` |
| `stats` | object | — | Stats bar section |
| `features` | object | — | First features grid |
| `secondFeatures` | object | — | Second features grid (rendered with alternate background) |
| `testimonials` | object | — | Testimonials grid |
| `extraSections` | array | — | Raw Elementor section elements injected between features and secondFeatures |

---

### `elementor_generate_json`

Same input as `elementor_build_landing_page` but returns Elementor JSON instead of pushing to WordPress. Use for review, debugging, or manual import via Elementor's template import.

```json
{
  "title": "My Page",
  "scheme": "purple",
  "hero": {
    "headline": "Hello world",
    "subtext": "A tagline for the hero section.",
    "primaryCTA": { "label": "Get started", "url": "/start" }
  },
  "cta": {
    "headline": "Ready?",
    "primaryCTA": { "label": "Go", "url": "/go" }
  }
}
```

**Response:**
```json
{
  "success": true,
  "json": {
    "content": [ ... ],
    "page_settings": {},
    "version": "0.4",
    "title": "My Page",
    "type": "page"
  }
}
```

---

### `elementor_push_json`

Push any raw Elementor JSON to an existing WordPress page. Use this when you've assembled JSON manually or from `elementor_build_section` calls.

```json
{
  "site_id": "mysite",
  "page_id": 123,
  "title": "Updated page title",
  "publish": true,
  "elementor_json": {
    "content": [ ... ],
    "page_settings": {},
    "version": "0.4",
    "title": "My page",
    "type": "page"
  }
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `site_id` | string | ✓ | Site key |
| `page_id` | number | ✓ | WordPress page ID |
| `elementor_json` | object | ✓ | Full Elementor page JSON |
| `title` | string | — | Update page title at the same time |
| `publish` | boolean | — | Set to `true` to publish |

---

### `elementor_build_section`

Build a single section or widget and return its Elementor JSON element. Use this for assembling pages section by section, then push with `elementor_push_json`.

```json
{
  "widget": "testimonial-carousel",
  "config": {
    "items": [
      { "content": "Best tool we've used.", "name": "Jane Smith", "title": "CTO", "rating": 5 }
    ],
    "opts": {
      "slidesPerView": 2,
      "autoplay": true,
      "navigation": "dots"
    }
  }
}
```

**Available widgets:**

| `widget` value | Description | Config shape |
|----------------|-------------|--------------|
| `hero` | Full hero section | `HeroConfig` |
| `stats` | Stats bar | `StatsConfig` |
| `features` | Features grid | `FeaturesConfig` |
| `cta` | CTA section | `CTAConfig` |
| `two-col` | Two-column layout | `TwoColConfig` |
| `testimonials` | Testimonials grid | `TestimonialsConfig` |
| `slides` | Pro hero slides carousel | `{ items: Slide[], opts: SlidesOpts }` |
| `accordion` | Accordion | `{ items: AccordionItem[], opts }` |
| `tabs` | Tabs | `{ items: TabItem[], opts }` |
| `toggle` | Toggle | `{ items: ToggleItem[], opts }` |
| `price-table` | Pricing table | `PriceTableConfig` |
| `price-list` | Price list | `{ items: PriceListItem[], opts }` |
| `flip-box` | Flip box | `FlipBoxConfig` |
| `animated-headline` | Animated headline | `{ beforeText, animatedText, opts }` |
| `blockquote` | Blockquote | `{ quote, author, opts }` |
| `testimonial-carousel` | Testimonial carousel | `{ items: TestimonialSlide[], opts }` |
| `posts-grid` | Pro posts grid | `PostsOpts` |
| `portfolio` | Portfolio grid | `PortfolioOpts` |
| `image-carousel` | Image carousel | `{ images: string[], opts }` |
| `image-gallery` | Image gallery | `{ images: string[], opts }` |
| `video` | Video embed | `{ url: string, opts }` |
| `social-icons` | Social icons | `{ icons: SocialIcon[], opts }` |
| `counter` | Animated counter | `{ start, end, title, opts }` |
| `progress-bar` | Progress bar | `{ title, percent, opts }` |
| `form` | Pro form | `{ fields: FormField[], opts: FormOpts }` |
| `countdown` | Countdown timer | `CountdownOpts` |
| `reviews` | Reviews carousel | `{ items: ReviewItem[], opts }` |
| `gallery` | Pro gallery | `{ images: string[], opts }` |
| `loop-grid` | Loop grid | `LoopGridOpts` |
| `text-path` | Text path | `{ text, opts }` |
| `nav-menu` | Nav menu | `NavMenuOpts` |
| `share-buttons` | Share buttons | `ShareButtonsOpts` |

---

## Color schemes

Pass `scheme` to `elementor_build_landing_page` or `elementor_generate_json` to theme the entire page at once. Every section picks up the right colors automatically — no per-section overrides needed.

### Named schemes

```json
{ "scheme": "dark" }
{ "scheme": "blue" }
{ "scheme": "purple" }
{ "scheme": "green" }
{ "scheme": "orange" }
{ "scheme": "light" }
```

**Scheme values:**

| Scheme | Primary | Secondary | Accent | BG Light | Hero gradient |
|--------|---------|-----------|--------|----------|---------------|
| `dark` | `#0F172A` | `#1D4ED8` | `#3B82F6` | `#F8FAFC` | none |
| `blue` | `#1E3A5F` | `#2563EB` | `#60A5FA` | `#EFF6FF` | `#1E3A5F` → `#2563EB` 135° |
| `purple` | `#1E1B4B` | `#7C3AED` | `#A78BFA` | `#F5F3FF` | `#1E1B4B` → `#4C1D95` 135° |
| `green` | `#064E3B` | `#065F46` | `#10B981` | `#ECFDF5` | `#064E3B` → `#065F46` 135° |
| `orange` | `#431407` | `#EA580C` | `#F97316` | `#FFF7ED` | `#431407` → `#7C2D12` 135° |
| `light` | `#1F2937` | `#374151` | `#3B82F6` | `#F9FAFB` | none |

### Custom scheme

Override any or all tokens:

```json
{
  "scheme": {
    "primary": "#0F172A",
    "secondary": "#BE185D",
    "accent": "#EC4899",
    "bgLight": "#FDF2F8",
    "bgWhite": "#FFFFFF",
    "cardBg": "#FCE7F3",
    "textDark": "#1F2937",
    "textMuted": "#6B7280",
    "textLight": "#FFFFFF",
    "heroGradient": { "from": "#0F172A", "to": "#4A044E", "angle": 135 },
    "ctaGradient": { "from": "#BE185D", "to": "#9D174D", "angle": 135 }
  }
}
```

**Token reference:**

| Token | Used for |
|-------|---------|
| `primary` | Hero / dark section background |
| `secondary` | CTA section background |
| `accent` | Buttons, icon colors, stat numbers |
| `bgLight` | Alternate section background (stats, testimonials) |
| `bgWhite` | White section background |
| `cardBg` | Feature card background |
| `textDark` | Headings and body text on light sections |
| `textMuted` | Secondary / meta text |
| `textLight` | Text on dark sections |
| `heroGradient` | Gradient on hero section (overrides `primary`) |
| `ctaGradient` | Gradient on CTA section (overrides `secondary`) |

---

## Section builders reference

### `hero`

```json
{
  "headline": "string — required",
  "subtext": "string — required",
  "primaryCTA": { "label": "string", "url": "string" },
  "secondaryCTA": { "label": "string", "url": "string" },
  "badge": "Pill text above headline, e.g. 'Now in beta'",
  "tagline": "Social proof below CTAs, e.g. 'Trusted by 1000+ teams'",
  "bgColor": "#hex — overrides scheme.primary",
  "gradient": { "from": "#hex", "to": "#hex", "angle": 135 },
  "textColor": "#hex — overrides scheme.textLight",
  "accentColor": "#hex — overrides scheme.accent (button color)"
}
```

### `stats`

```json
{
  "items": [
    { "value": "10×", "label": "faster builds" },
    { "value": "99%", "label": "uptime" }
  ],
  "bgColor": "#hex — overrides scheme.bgLight",
  "accentColor": "#hex — overrides scheme.accent (number color)"
}
```

### `features`

```json
{
  "headline": "string — required",
  "subtext": "optional subtitle",
  "columns": 2,
  "variant": "light | alt",
  "bgColor": "#hex",
  "cardBgColor": "#hex",
  "features": [
    {
      "icon": "fa-bolt",
      "title": "Feature name",
      "description": "Feature description",
      "iconColor": "#hex — overrides scheme.accent"
    }
  ]
}
```

`variant: "alt"` uses `scheme.bgLight` instead of white. The `secondFeatures` section automatically gets `variant: "alt"`.

### `two-col`

```json
{
  "left": ["array of widget elements"],
  "right": ["array of widget elements"],
  "bgColor": "#hex",
  "variant": "light | alt | dark",
  "gap": 48,
  "reverse": false,
  "verticalAlign": "center | flex-start | flex-end"
}
```

### `testimonials`

```json
{
  "headline": "What our customers say",
  "columns": 3,
  "bgColor": "#hex",
  "items": [
    {
      "content": "Quote text",
      "name": "Full Name",
      "job": "Job Title at Company",
      "imageUrl": "https://..."
    }
  ]
}
```

### `cta`

```json
{
  "headline": "string — required",
  "subtext": "optional supporting text",
  "primaryCTA": { "label": "string", "url": "string" },
  "secondaryCTA": { "label": "string", "url": "string" },
  "bgColor": "#hex — overrides scheme.secondary",
  "gradient": { "from": "#hex", "to": "#hex", "angle": 135 }
}
```

---

## Widget reference

### Layout primitives (`core.ts`)

These are building blocks used inside section builders. You can also use them via `extraSections` in `elementor_build_landing_page`.

| Function | Description |
|----------|-------------|
| `section(opts, children)` | Full-width section. Supports `background_color`, `gradient`, `padding`, `min_height` |
| `row(opts, children)` | Flex container inside a section. Supports `flex_direction`, `gap`, `flex_wrap`, `max_width`, `flex_justify_content`, `flex_align_items` |
| `col(opts, children)` | Column inside a row. Supports `background_color`, `padding`, `gap`, `border_radius` |

---

### Basic widgets (`basic.ts`)

#### `heading(title, opts)`

```json
{
  "tag": "h1 | h2 | h3 | h4 | h5 | h6 | div | span | p",
  "size": 36,
  "weight": "700",
  "color": "#hex",
  "align": "left | center | right",
  "lineHeight": 1.4,
  "letterSpacing": 0
}
```

Responsive: tablet and mobile sizes auto-calculated at 75% and 60% of desktop.

#### `text(html, opts)`

Accepts raw HTML string. Options:
```json
{ "color": "#hex", "align": "left | center | right | justify", "fontSize": 16 }
```

#### `button(label, url, opts)`

```json
{
  "align": "left | center | right | justify",
  "bgColor": "#3B82F6",
  "textColor": "#FFFFFF",
  "borderColor": "#hex",
  "borderRadius": 6,
  "size": "xs | sm | md | lg | xl",
  "external": false,
  "outline": false,
  "icon": "fa-arrow-right",
  "iconPosition": "before | after"
}
```

#### `image(url, opts)`

```json
{
  "alt": "string",
  "size": "thumbnail | medium | large | full",
  "align": "left | center | right",
  "link": "https://...",
  "caption": "string",
  "width": 80,
  "borderRadius": 8,
  "openLightbox": false
}
```

#### `icon(name, opts)`

```json
{
  "view": "default | stacked | framed",
  "shape": "circle | square",
  "size": 48,
  "color": "#hex",
  "secondaryColor": "#hex",
  "link": "https://...",
  "align": "left | center | right"
}
```

#### `html(htmlCode)` · `shortcode(code)` · `googleMaps(address, zoom?, height?)`

---

### Content widgets (`content.ts`)

#### `iconBox(icon, title, description, opts)`

```json
{
  "titleColor": "#hex",
  "descColor": "#hex",
  "iconColor": "#hex",
  "align": "left | center | right",
  "titleSize": 17,
  "descSize": 15,
  "iconSize": 40,
  "view": "default | stacked | framed",
  "iconPosition": "top | left | right",
  "link": "https://..."
}
```

#### `iconList(items, opts)`

```json
{
  "items": [
    { "text": "Feature one", "icon": "fas fa-check", "url": "https://..." }
  ],
  "opts": {
    "view": "traditional | inline",
    "iconColor": "#hex",
    "textColor": "#hex",
    "space": 8,
    "divider": false
  }
}
```

#### `imageBox(imageUrl, title, description, opts)`

```json
{
  "imageSize": "thumbnail | medium | large | full",
  "titleTag": "h2 | h3 | h4 | h5",
  "titleColor": "#hex",
  "descColor": "#hex",
  "align": "left | center | right",
  "link": "https://...",
  "imageWidth": 100
}
```

#### `counter(start, end, title, opts)`

```json
{
  "prefix": "$",
  "suffix": "K+",
  "duration": 2000,
  "titleColor": "#hex",
  "numberColor": "#hex",
  "titleTag": "div | h2 | h3 | h4 | h5 | span",
  "align": "left | center | right",
  "numberSize": 48
}
```

#### `testimonial(content, name, job, opts)`

```json
{
  "imageUrl": "https://...",
  "imagePosition": "aside | top | bottom",
  "alignment": "left | center | right",
  "textColor": "#hex",
  "nameColor": "#hex",
  "jobColor": "#hex"
}
```

#### `starRating(rating, opts)`

```json
{
  "scale": 5,
  "title": "string",
  "align": "left | center | right",
  "starColor": "#FBBF24",
  "unmarkedColor": "#E5E7EB"
}
```

#### `alert(type, title, description, opts)`

```json
{
  "type": "info | success | warning | danger",
  "opts": {
    "showDismiss": true,
    "titleColor": "#hex",
    "descColor": "#hex",
    "bgColor": "#hex"
  }
}
```

#### `progressBar(title, percent, opts)`

```json
{
  "type": "info | success | warning | danger",
  "displayPercent": true,
  "innerText": "75%",
  "barColor": "#hex",
  "titleTag": "span | div | h2 | h3 | h4 | h5"
}
```

#### `divider(color?, gap?)` · `spacer(height)`

#### `socialIcons(icons, opts)`

```json
{
  "icons": [
    { "platform": "twitter", "url": "https://twitter.com/..." },
    { "platform": "github", "url": "https://github.com/..." }
  ],
  "opts": {
    "shape": "rounded | square | circle",
    "align": "left | center | right",
    "size": 24,
    "color": "#hex",
    "bgColor": "#hex"
  }
}
```

Supported platforms: `facebook`, `twitter`, `instagram`, `linkedin`, `youtube`, `github`, `pinterest`, `tiktok`, `discord`, `telegram`, `whatsapp`, `reddit`

#### `menuAnchor(id)` · `readMore(label?)`

#### `rating(value, opts)` — eicon-based rating widget

```json
{
  "scale": 5,
  "icon": "eicon-star | eicon-heart",
  "align": "left | center | right",
  "markedColor": "#FBBF24",
  "unmarkedColor": "#E5E7EB"
}
```

#### `sidebar(sidebarId)`

#### `contactButton(opts)` — WhatsApp / chat floating button

```json
{
  "platform": "WhatsApp | Email | SMS | Messenger | Skype | Telephone | Viber | Waze | Snapchat | Telegram | Discord | Line",
  "number": "+1234567890",
  "email": "hello@example.com",
  "emailSubject": "Hey!",
  "emailBody": "I wanted to ask...",
  "username": "telegram_username",
  "ariaLabel": "Chat with us",
  "bgColor": "#25D366",
  "iconColor": "#FFFFFF",
  "size": 56
}
```

#### `floatingBar(opts)` — Announcement bar

```json
{
  "text": "🎉 New feature launched!",
  "ctaText": "Learn more",
  "ctaUrl": "https://...",
  "icon": "fa-bullhorn",
  "closeable": true,
  "position": "top | bottom",
  "bgColor": "#1D4ED8",
  "textColor": "#FFFFFF"
}
```

---

### Interactive widgets (`interactive.ts`)

#### `accordion(items, opts)`

```json
{
  "items": [
    { "title": "Question?", "content": "<p>Answer</p>", "active": false }
  ],
  "opts": {
    "titleColor": "#hex",
    "activeColor": "#hex",
    "borderColor": "#hex",
    "iconClosed": "fa-plus",
    "iconOpened": "fa-minus"
  }
}
```

#### `tabs(items, opts)`

```json
{
  "items": [
    { "title": "Tab 1", "content": "<p>Content</p>", "icon": "fa-star" }
  ],
  "opts": {
    "type": "horizontal | vertical",
    "align": "left | center | right | justify",
    "activeColor": "#hex",
    "hoverColor": "#hex"
  }
}
```

#### `toggle(items, opts)` — same shape as accordion

#### `nestedAccordion(items, opts)` · `nestedTabs(items, opts)` — Elementor nested container equivalents

---

### Media widgets (`media.ts`)

#### `imageCarousel(imageUrls, opts)`

```json
{
  "images": ["https://...", { "url": "https://...", "caption": "Alt text", "link": "https://..." }],
  "opts": {
    "slidesPerView": 3,
    "autoplay": true,
    "autoplaySpeed": 3000,
    "loop": true,
    "navigation": "arrows | dots | both | none",
    "imageSize": "thumbnail | medium | large | full"
  }
}
```

#### `imageGallery(imageUrls, opts)`

```json
{
  "images": ["https://..."],
  "opts": {
    "columns": 4,
    "imageSize": "thumbnail | medium | large | full",
    "openLightbox": true,
    "orderBy": "rand | title | date"
  }
}
```

#### `video(url, opts)`

```json
{
  "url": "https://youtube.com/watch?v=...",
  "opts": {
    "autoplay": false,
    "mute": false,
    "loop": false,
    "controls": true,
    "lightbox": false,
    "lightboxImage": "https://...",
    "aspectRatio": "169 | 219 | 43 | 11 | 916",
    "startTime": 0,
    "endTime": 0
  }
}
```

#### `lottie(url, opts)`

```json
{
  "url": "https://assets.lottiefiles.com/...",
  "opts": {
    "trigger": "none | scroll | viewport | hover | click | mouseenter",
    "loop": true,
    "speed": 1,
    "reverse": false,
    "renderer": "svg | canvas",
    "width": 300,
    "height": 300
  }
}
```

#### `hotspot(imageUrl, spots, opts)` — Image hotspots

```json
{
  "imageUrl": "https://...",
  "spots": [
    {
      "positionX": 30,
      "positionY": 50,
      "icon": "fa-plus",
      "tooltipContent": "<p>Details here</p>"
    }
  ],
  "opts": {
    "triggerType": "mouseenter | click",
    "tooltipPosition": "top | bottom | left | right"
  }
}
```

---

### Pro content widgets (`pro-content.ts`)

#### `ctaWidget(opts)` — Elementor CTA banner widget

```json
{
  "heading": "Upgrade your plan",
  "description": "<p>Get access to all features.</p>",
  "imageUrl": "https://...",
  "imagePosition": "left | right | top | bottom",
  "buttonText": "Get Pro",
  "buttonUrl": "/pro",
  "layout": "image-above | image-left | image-right",
  "bgColor": "#hex",
  "headingColor": "#hex",
  "descColor": "#hex",
  "btnBgColor": "#hex",
  "btnTextColor": "#hex"
}
```

#### `flipBox(opts)`

```json
{
  "frontTitle": "Hover me",
  "frontDescription": "Front side description.",
  "frontIcon": "fa-star",
  "frontBgColor": "#1E3A5F",
  "frontTitleColor": "#FFFFFF",
  "backTitle": "Revealed",
  "backDescription": "Back side content.",
  "backBgColor": "#2563EB",
  "backTitleColor": "#FFFFFF",
  "backButtonText": "Click here",
  "backButtonUrl": "/page",
  "flipDirection": "up | down | left | right",
  "height": 300
}
```

#### `priceTable(opts)`

```json
{
  "heading": "Pro Plan",
  "subHeading": "For growing teams",
  "price": "49",
  "pricePeriod": "month",
  "currencySymbol": "$",
  "features": [
    { "text": "10 users", "icon": "fa-check" },
    { "text": "Unlimited pages", "icon": "fa-check" }
  ],
  "btnText": "Get started",
  "btnUrl": "/signup",
  "popular": true,
  "popularText": "Most Popular",
  "bgColor": "#hex",
  "headingColor": "#hex",
  "priceColor": "#hex",
  "featureColor": "#hex",
  "btnBgColor": "#hex"
}
```

#### `priceList(items, opts)`

```json
{
  "items": [
    {
      "title": "Coffee",
      "description": "Fresh brewed",
      "price": "$4",
      "imageUrl": "https://..."
    }
  ],
  "opts": {
    "divider": true,
    "titleColor": "#hex",
    "priceColor": "#hex",
    "descColor": "#hex"
  }
}
```

#### `blockquote(quote, author, opts)`

```json
{
  "quote": "The best code is no code at all.",
  "author": "Jeff Atwood",
  "opts": {
    "tweet": false,
    "skin": "border | boxed | quotation",
    "alignment": "left | center | right",
    "quoteColor": "#hex",
    "authorColor": "#hex",
    "borderColor": "#hex"
  }
}
```

#### `animatedHeadline(beforeText, animatedText, opts)`

```json
{
  "beforeText": "We build",
  "animatedText": ["faster", "smarter", "better"],
  "opts": {
    "afterText": "every day",
    "animation": "typing | clip | flip | wave | slide | spin | swirl | blinds | drop-in | drop-out | stack | toss | fadeIn | zoom-in | bounce | rotate",
    "tag": "h1 | h2 | h3",
    "align": "left | center | right",
    "weight": "700",
    "size": 48,
    "beforeAfterColor": "#hex",
    "animatedColor": "#hex"
  }
}
```

#### `tableOfContents(opts)` · `codeHighlight(code, opts)`

---

### Pro carousel / dynamic (`pro-carousel.ts`)

#### `slides(items, opts)` — Hero slides

```json
{
  "items": [
    {
      "heading": "Slide title",
      "description": "Slide text",
      "buttonText": "Learn more",
      "buttonUrl": "/page",
      "bgImageUrl": "https://...",
      "bgColor": "#0F172A",
      "textColor": "#FFFFFF"
    }
  ],
  "opts": {
    "height": 500,
    "navigation": "both | arrows | dots | none",
    "autoplay": true,
    "autoplaySpeed": 5000,
    "loop": true,
    "transition": "slide | fade",
    "titleTag": "h1 | h2 | h3 | h4 | div",
    "overlay": "none | classic | gradient",
    "overlayColor": "#hex"
  }
}
```

#### `testimonialCarousel(items, opts)`

```json
{
  "items": [
    {
      "content": "Amazing product.",
      "name": "Jane Smith",
      "title": "CTO",
      "company": "Acme",
      "imageUrl": "https://...",
      "rating": 5,
      "link": "https://..."
    }
  ],
  "opts": {
    "skin": "default | bubble",
    "layout": "image_inline | image_stacked | image_above | image_left",
    "alignment": "left | center | right",
    "slidesPerView": 2,
    "autoplay": true,
    "autoplaySpeed": 5000,
    "loop": true,
    "navigation": "arrows | dots | both | none"
  }
}
```

#### `mediaCarousel(items, opts)` — Mixed image/video carousel

```json
{
  "items": [
    { "type": "image", "url": "https://...", "caption": "Caption" },
    { "type": "video", "url": "https://youtube.com/..." }
  ],
  "opts": {
    "slidesPerView": 2,
    "autoplay": false,
    "loop": true,
    "navigation": "both | arrows | dots | none",
    "imageSize": "thumbnail | medium | large | full"
  }
}
```

#### `posts(opts)` — Pro posts grid

```json
{
  "postType": "post",
  "postsPerPage": 6,
  "columns": 3,
  "columnsTablet": 2,
  "columnsMobile": 1,
  "orderBy": "date | title | rand | menu_order",
  "order": "desc | asc",
  "skin": "classic | cards | full_content",
  "imagePosition": "top | left | right | none",
  "showTitle": true,
  "showExcerpt": true,
  "showMeta": false,
  "showReadMore": true,
  "readMoreText": "Read More »",
  "imageSize": "thumbnail | medium | large | full",
  "imageHeight": 56.25,
  "excerptLength": 20,
  "paginationType": "'' | numbers | prev_next | numbers_and_prev_next | load_more_on_click | load_more_infinite_scroll",
  "includeTermIds": [1, 2, 5],
  "excludeIds": [10]
}
```

> **Note:** `imagePosition: "none"` hides the image. Use `includeTermIds` to filter by category or tag term IDs (both share the same field).

#### `portfolio(opts)`

```json
{
  "postType": "post",
  "postsPerPage": 6,
  "columns": 3,
  "showFilter": true,
  "filterTaxonomy": "category",
  "hoverEffect": "none | zoomin | zoomout | moveup | grayscale"
}
```

#### `loopCarousel(opts)` · `nestedCarousel(slideCount, opts)` · `megaMenu(opts)`

---

### Pro forms & advanced (`pro-forms.ts`)

#### `form(fields, opts)`

```json
{
  "fields": [
    { "type": "text", "label": "Name", "placeholder": "Your name", "required": true, "width": "50" },
    { "type": "email", "label": "Email", "placeholder": "you@example.com", "required": true, "width": "50" },
    { "type": "select", "label": "Plan", "options": "Free,Pro,Enterprise", "width": "100" },
    { "type": "textarea", "label": "Message", "placeholder": "Your message", "width": "100" }
  ],
  "opts": {
    "name": "Contact Form",
    "submitLabel": "Send Message",
    "successMessage": "Thanks! We'll be in touch.",
    "errorMessage": "Please fill all required fields.",
    "emailTo": "hello@example.com",
    "emailSubject": "New message from website",
    "inputSize": "xs | sm | md | lg | xl",
    "showLabels": true,
    "markRequired": true,
    "buttonWidth": "100 | 33 | 25 | auto",
    "btnBgColor": "#hex",
    "btnTextColor": "#hex"
  }
}
```

**Field types:** `text`, `email`, `tel`, `number`, `textarea`, `select`, `checkbox`, `radio`, `date`, `time`, `upload`, `hidden`, `html`
**Field widths:** `"100"`, `"75"`, `"50"`, `"33"`, `"25"`

#### `countdown(opts)`

```json
{
  "type": "due_date | evergreen",
  "dueDate": "2025-12-31 23:59",
  "evergreenMinutes": 60,
  "showLabels": true,
  "showSeparator": true,
  "labelDays": "Days",
  "labelHours": "Hours",
  "labelMinutes": "Minutes",
  "labelSeconds": "Seconds",
  "expiredAction": "none | redirect | hide | message",
  "expiredMessage": "The offer has ended.",
  "expiredRedirect": "https://...",
  "numberColor": "#hex",
  "labelColor": "#hex",
  "numberSize": 48,
  "boxBgColor": "#hex",
  "boxPadding": 20
}
```

#### `reviews(items, opts)` — Reviews carousel

```json
{
  "items": [
    { "content": "Great!", "name": "Jane", "title": "CEO", "imageUrl": "https://...", "rating": 5 }
  ],
  "opts": {
    "slidesPerView": 2,
    "autoplay": true,
    "autoplaySpeed": 5000,
    "loop": true,
    "showArrows": true,
    "showDots": true,
    "reviewColor": "#hex",
    "nameColor": "#hex",
    "ratingColor": "#FBBF24",
    "bgColor": "#hex"
  }
}
```

#### `galleryPro(imageUrls, opts)`

```json
{
  "images": ["https://..."],
  "opts": {
    "type": "single | multiple",
    "layout": "grid | justified | masonry",
    "columns": 3,
    "gap": 8,
    "aspectRatio": "1:1 | 4:3 | 16:9 | 3:4",
    "openLightbox": true,
    "orderBy": "rand | title | date"
  }
}
```

#### `loopGrid(opts)`

```json
{
  "templateId": 123,
  "postsPerPage": 6,
  "columns": 3,
  "columnsTablet": 2,
  "columnsMobile": 1,
  "masonry": false,
  "equalHeight": true,
  "postType": "post",
  "orderBy": "date | title | rand | menu_order",
  "order": "desc | asc",
  "categories": [1, 2],
  "paginationType": "numbers | load_more | infinite_scroll"
}
```

#### `shareButtons(opts)`

```json
{
  "networks": ["facebook", "twitter", "linkedin", "pinterest", "email", "whatsapp"],
  "view": "icon | icon-text | text",
  "size": "tiny | small | medium | large | xlarge",
  "align": "left | center | right | justify",
  "showLabel": true
}
```

#### `navMenu(opts)`

```json
{
  "menu": "main-menu",
  "layout": "horizontal | vertical | dropdown",
  "pointer": "none | underline | overline | double-line | framed | background | text",
  "itemColor": "#hex",
  "itemHoverColor": "#hex",
  "activeColor": "#hex",
  "bgColor": "#hex",
  "align": "flex-start | center | flex-end | space-between"
}
```

#### `textPath(text, opts)`

```json
{
  "path": "wave | arc | s-curve | straight | spiral | custom",
  "direction": "ltr | rtl",
  "showPath": false,
  "align": "left | center | right",
  "fontSize": 24,
  "color": "#hex"
}
```

#### `templateEmbed(templateId)` · `taxonomyFilter(opts)`

#### `searchWidget(opts)`

```json
{
  "placeholder": "Search...",
  "submitButtonText": "Search",
  "submitTrigger": "click_submit | auto | none",
  "liveResults": false,
  "autocomplete": false,
  "skin": "classic | minimal | full_screen"
}
```

#### `progressTracker(opts)` — Reading progress bar

```json
{
  "type": "horizontal | vertical | circular",
  "relativeTo": "entire_page | post_content | selector",
  "selector": ".my-content",
  "showPercentage": true,
  "color": "#hex",
  "bgColor": "#hex",
  "height": 5
}
```

#### `offCanvas(opts)`

```json
{
  "name": "Sidebar Menu",
  "horizontalPosition": "left | right",
  "widthPx": 300,
  "entranceAnimation": "slideInRight",
  "bgColor": "#hex"
}
```

#### `videoPlaylist(items, opts)`

```json
{
  "items": [
    { "title": "Intro", "youtubeUrl": "https://youtube.com/watch?v=...", "thumbnailUrl": "https://..." },
    { "title": "Tutorial", "vimeoUrl": "https://vimeo.com/..." }
  ],
  "opts": {
    "playlistTitle": "Course Videos",
    "titleTag": "h2 | h3 | h4",
    "collapsible": false
  }
}
```

#### `audio(url, opts)`

```json
{
  "url": "https://example.com/audio.mp3",
  "opts": { "autoplay": false, "loop": false, "controls": true }
}
```

#### `loginWidget(opts)`

```json
{
  "submitButtonText": "Log In",
  "showRememberMe": true,
  "showLostPassword": true,
  "lostPasswordText": "Lost your password?",
  "redirectUrl": "/dashboard",
  "skin": "default | box",
  "labelUsername": "Username or Email",
  "labelPassword": "Password",
  "placeholderUsername": "Enter your email",
  "placeholderPassword": "Enter your password"
}
```

#### `paypalButton(sellerEmail, opts)`

```json
{
  "sellerEmail": "payments@example.com",
  "opts": {
    "type": "checkout | subscribe",
    "currency": "USD | EUR | GBP | INR | CAD | AUD",
    "price": "49.00",
    "quantity": 1,
    "itemName": "Pro Plan",
    "buttonText": "Pay Now",
    "buttonAlign": "left | center | right",
    "sandbox": false,
    "openInNewWindow": true,
    "billingCycle": "M | Y | D",
    "billingPeriod": 1
  }
}
```

#### `stripeButton(opts)`

```json
{
  "productName": "Pro Plan",
  "productDescription": "Monthly subscription",
  "currency": "usd",
  "price": 4900,
  "buttonText": "Buy Now",
  "buttonAlign": "left | center | right",
  "collectShipping": false,
  "collectPhone": false,
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

---

### Theme builder widgets (`theme.ts`)

For use in Elementor Theme Builder templates (headers, footers, single post templates, archive templates).

| Widget | Function | Key options |
|--------|----------|-------------|
| Site Logo | `themeSiteLogo(opts)` | `size`, `linkTo`, `customUrl`, `width` |
| Site Title | `themeSiteTitle(opts)` | `tag`, `link`, `size`, `color` |
| Page Title | `themePageTitle(opts)` | `tag`, `size`, `color`, `align` |
| Post Title | `themePostTitle(opts)` | `tag`, `link`, `size`, `color` |
| Archive Title | `themeArchiveTitle(opts)` | `tag`, `size`, `color` |
| Post Content | `themePostContent()` | — |
| Post Excerpt | `themePostExcerpt(opts)` | `color`, `fontSize` |
| Post Featured Image | `themePostFeaturedImage(opts)` | `size`, `link`, `openLightbox`, `borderRadius` |
| Post Info | `themePostInfo(items, opts)` | `items: [{type, icon, text, link}]`, `view`, `iconColor`, `textColor` |
| Post Navigation | `themePostNavigation(opts)` | `prevLabel`, `nextLabel`, `showArrows`, `textColor` |
| Post Comments | `themePostComments()` | — |
| Author Box | `authorBox(opts)` | `showAvatar`, `avatarSize`, `showName`, `showBio`, `showPosts`, `alignment` |
| Search Form | `searchForm(opts)` | `placeholder`, `skin`, `buttonType`, `buttonText`, `size` |
| Sitemap | `sitemap(items, opts)` | `items: [{type, postType, taxonomy}]`, `columns`, `titleTag` |
| Archive Posts | `archivePosts(opts)` | `skin`, `columns`, `thumbnail`, `showExcerpt`, `paginationType` |
| Link in Bio | `linkInBio(links, opts)` | `variant` 1–7, `imageStyle`, `heading`, `title`, `bgColor` |
| Facebook Button | `facebookButton(url, opts)` | `type`, `showFaces`, `size` |
| Facebook Comments | `facebookComments(url, opts)` | `numPosts`, `darkScheme` |
| Facebook Embed | `facebookEmbed(url, opts)` | `width`, `showText`, `showCover` |
| Facebook Page | `facebookPage(url, opts)` | `width`, `height`, `tabs`, `smallHeader` |

**Post Info item types:** `author`, `date`, `time`, `comments`, `terms`, `custom`

**Link in Bio variants:** 1–7 (maps to Elementor widgetType `link-in-bio` through `link-in-bio-var-7`)

---

## Requirements

- Node.js 18+
- WordPress with Elementor Pro activated (v3.5+)
- WordPress Application Password — generated in WP Admin under **Users → Profile → Application Passwords** (built into WP core since 5.6, no plugin needed)

---

## License

MIT
