# elementor-mcp

MCP server that generates Elementor Pro landing pages programmatically and pushes them to WordPress. Give it a headline, features, testimonials, and a CTA — get a fully-built Elementor page back.

**106 widgets covered** — all Elementor Free + Pro + Theme Builder elements.

## What it does

- Build complete landing pages from a single structured config
- Apply uniform color schemes (dark, blue, purple, green, orange, light — or custom)
- Push directly to any WordPress site via REST API
- Generate and preview Elementor JSON without a live site
- Build individual sections/widgets for assembly in other tools

## Installation

```bash
git clone https://github.com/vapvarun/elementor-mcp.git
cd elementor-mcp
npm install
npm run build
```

### Configure your WordPress sites

Create `~/.wp-sites/sites.json`:

```json
{
  "sites": {
    "mysite": {
      "url": "https://mysite.com",
      "username": "admin",
      "app_password": "xxxx xxxx xxxx xxxx xxxx xxxx"
    }
  }
}
```

Generate an application password in WordPress under **Users → Profile → Application Passwords**.

### Add to Claude / Cursor / any MCP client

```json
{
  "mcpServers": {
    "elementor-mcp": {
      "command": "node",
      "args": ["/path/to/elementor-mcp/dist/index.js"]
    }
  }
}
```

## Tools

### `elementor_build_landing_page`

Build a full landing page and push it to WordPress in one call.

```jsonc
{
  "site_id": "mysite",
  "title": "My Product",
  "scheme": "blue",          // named scheme or custom object
  "publish": false,          // default: draft
  "hero": {
    "headline": "Ship faster with AI",
    "subtext": "The platform teams use to move at speed.",
    "primaryCTA": { "label": "Get started", "url": "/signup" }
  },
  "features": {
    "headline": "Everything you need",
    "features": [
      { "icon": "fa-bolt", "title": "Fast", "description": "Built for speed from day one." }
    ]
  },
  "testimonials": {
    "headline": "What teams say",
    "items": [
      { "content": "Saved us 40 hours a week.", "name": "Jane Smith", "job": "CTO at Acme" }
    ]
  },
  "cta": {
    "headline": "Ready to start?",
    "primaryCTA": { "label": "Try free", "url": "/signup" }
  }
}
```

**Named color schemes:** `dark` · `blue` · `purple` · `green` · `orange` · `light`

**Custom scheme:**
```jsonc
{
  "scheme": {
    "primary": "#0F172A",
    "accent": "#3B82F6",
    "heroGradient": { "from": "#0F172A", "to": "#1E3A5F", "angle": 135 }
  }
}
```

### `elementor_generate_json`

Same input as `elementor_build_landing_page` but returns Elementor JSON instead of pushing. Good for review or manual import.

### `elementor_push_json`

Push raw Elementor JSON to an existing page:

```jsonc
{
  "site_id": "mysite",
  "page_id": 123,
  "elementor_json": { ... },
  "publish": true
}
```

### `elementor_build_section`

Build a single section or widget and get its JSON:

```jsonc
{
  "widget": "testimonial-carousel",
  "config": {
    "items": [{ "content": "...", "name": "..." }],
    "opts": { "slidesPerView": 2 }
  }
}
```

**Available widgets:**

| Category | Widgets |
|----------|---------|
| Section builders | `hero`, `stats`, `features`, `cta`, `two-col`, `testimonials` |
| Interactive | `slides`, `accordion`, `tabs`, `toggle` |
| Pro content | `price-table`, `price-list`, `flip-box`, `animated-headline`, `blockquote` |
| Carousels / dynamic | `testimonial-carousel`, `posts-grid`, `portfolio` |
| Media | `image-carousel`, `image-gallery`, `video` |
| Utility | `social-icons`, `counter`, `progress-bar` |
| Pro v2 | `form`, `countdown`, `reviews`, `gallery`, `loop-grid`, `text-path`, `nav-menu`, `share-buttons` |

## Widget coverage

106/106 Elementor Free + Pro widgets implemented across 9 modules:

| Module | Widgets |
|--------|---------|
| `core.ts` | section, row, col (container primitives) |
| `basic.ts` | heading, text, button, image, icon, html, shortcode, google-maps |
| `content.ts` | icon-box, icon-list, image-box, counter, testimonial, star-rating, alert, progress-bar, divider, spacer, social-icons, menu-anchor, read-more, rating, sidebar, contact-button, floating-bar |
| `interactive.ts` | accordion, tabs, toggle, nested-accordion, nested-tabs |
| `media.ts` | image-carousel, image-gallery, video, lottie, hotspot |
| `pro-content.ts` | cta, flip-box, price-table, price-list, blockquote, animated-headline, table-of-contents, code-highlight |
| `pro-carousel.ts` | slides, testimonial-carousel, media-carousel, loop-carousel, posts, portfolio, nested-carousel, mega-menu |
| `pro-forms.ts` | form, countdown, reviews, gallery-pro, loop-grid, text-path, nav-menu, template-embed, taxonomy-filter, share-buttons, search, progress-tracker, off-canvas, video-playlist, audio, login, paypal-button, stripe-button |
| `theme.ts` | site-logo, site-title, page-title, post-title, archive-title, post-content, post-excerpt, post-featured-image, post-info, post-navigation, post-comments, author-box, search-form, sitemap, archive-posts, link-in-bio, facebook-button, facebook-comments, facebook-embed, facebook-page |

## Requirements

- Node.js 18+
- WordPress with Elementor Pro activated
- WordPress Application Password (standard WP feature, no plugin needed)

## License

MIT
