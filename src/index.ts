import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import {
  buildLandingPage, buildHero, buildStats, buildFeatures, buildCTA,
  buildTwoCol, buildTestimonials, SCHEMES,
  section, row, col,
  heading, text, button, image, icon, html, shortcode,
  iconBox, iconList, imageBox, counter, testimonial, starRating, alert,
  progressBar, divider, spacer, socialIcons, menuAnchor,
  accordion, tabs, toggle,
  imageCarousel, imageGallery, video, lottie,
  ctaWidget, flipBox, priceTable, priceList, blockquote, animatedHeadline,
  slides, testimonialCarousel, posts, portfolio,
  form, countdown, reviews, galleryPro, loopGrid, textPath, navMenu, templateEmbed, shareButtons,
  LandingPageConfig,
} from './builder.js';
import { getClient } from './wordpress.js';

const server = new Server(
  { name: 'elementor-mcp', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

// ─── Shared schema fragments ───────────────────────────────────────────────────

const heroSchema = {
  type: 'object',
  properties: {
    headline: { type: 'string' },
    subtext: { type: 'string' },
    primaryCTA: { type: 'object', properties: { label: { type: 'string' }, url: { type: 'string' } }, required: ['label', 'url'] },
    secondaryCTA: { type: 'object', properties: { label: { type: 'string' }, url: { type: 'string' } } },
    bgColor: { type: 'string', description: 'Background hex (default: #0F172A)' },
    gradient: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' }, angle: { type: 'number' } } },
    textColor: { type: 'string' },
    accentColor: { type: 'string', description: 'CTA button color (default: #3B82F6)' },
  },
  required: ['headline', 'subtext', 'primaryCTA'],
};

const featuresSchema = {
  type: 'object',
  properties: {
    headline: { type: 'string' },
    subtext: { type: 'string' },
    bgColor: { type: 'string' },
    cardBgColor: { type: 'string' },
    columns: { type: 'number', enum: [2, 3] },
    features: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          icon: { type: 'string', description: 'FontAwesome class e.g. "fa-code"' },
          title: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['icon', 'title', 'description'],
      },
    },
  },
  required: ['headline', 'features'],
};

const ctaSchema = {
  type: 'object',
  properties: {
    headline: { type: 'string' },
    subtext: { type: 'string' },
    bgColor: { type: 'string' },
    gradient: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' } } },
    primaryCTA: { type: 'object', properties: { label: { type: 'string' }, url: { type: 'string' } }, required: ['label', 'url'] },
    secondaryCTA: { type: 'object', properties: { label: { type: 'string' }, url: { type: 'string' } } },
  },
  required: ['headline', 'primaryCTA'],
};

// ─── Tool Definitions ──────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'elementor_build_landing_page',
      description: `Build a full Elementor Pro landing page and push to WordPress. Supports hero, stats, features, testimonials, and CTA sections with uniform color scheme. Available named schemes: ${Object.keys(SCHEMES).join(', ')}.`,
      inputSchema: {
        type: 'object',
        properties: {
          site_id: { type: 'string', description: 'WordPress site ID (e.g. "vapvarun")' },
          page_id: { type: 'number', description: 'Existing page ID to update (omit to create new)' },
          title: { type: 'string' },
          push_to_wp: { type: 'boolean', description: 'Push to WordPress (default: true)' },
          publish: { type: 'boolean', description: 'Publish immediately (default: false = draft)' },
          scheme: {
            description: `Named color scheme or custom object. Named: ${Object.keys(SCHEMES).join(' | ')}. Custom: { primary, secondary, accent, bgLight, bgWhite, cardBg, textDark, textMuted, textLight, heroGradient?, ctaGradient? }`,
            oneOf: [
              { type: 'string', enum: Object.keys(SCHEMES) },
              {
                type: 'object',
                properties: {
                  primary: { type: 'string' }, secondary: { type: 'string' },
                  accent: { type: 'string' }, bgLight: { type: 'string' },
                  bgWhite: { type: 'string' }, cardBg: { type: 'string' },
                  textDark: { type: 'string' }, textMuted: { type: 'string' },
                  textLight: { type: 'string' },
                  heroGradient: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' }, angle: { type: 'number' } } },
                  ctaGradient: { type: 'object', properties: { from: { type: 'string' }, to: { type: 'string' }, angle: { type: 'number' } } },
                },
              },
            ],
          },
          hero: heroSchema,
          stats: {
            type: 'object',
            properties: {
              bgColor: { type: 'string' },
              items: { type: 'array', items: { type: 'object', properties: { value: { type: 'string' }, label: { type: 'string' } }, required: ['value', 'label'] } },
            },
            required: ['items'],
          },
          features: featuresSchema,
          secondFeatures: featuresSchema,
          testimonials: {
            type: 'object',
            properties: {
              headline: { type: 'string' },
              bgColor: { type: 'string' },
              columns: { type: 'number', enum: [2, 3] },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    content: { type: 'string' },
                    name: { type: 'string' },
                    job: { type: 'string' },
                    imageUrl: { type: 'string' },
                  },
                  required: ['content', 'name', 'job'],
                },
              },
            },
            required: ['items'],
          },
          cta: ctaSchema,
        },
        required: ['site_id', 'title', 'hero', 'cta'],
      },
    },
    {
      name: 'elementor_generate_json',
      description: 'Generate Elementor JSON without pushing. Returns raw JSON for review or manual import.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          hero: heroSchema,
          stats: { type: 'object' },
          features: featuresSchema,
          testimonials: { type: 'object' },
          cta: ctaSchema,
        },
        required: ['title', 'hero', 'cta'],
      },
    },
    {
      name: 'elementor_push_json',
      description: 'Push raw Elementor JSON to an existing WordPress page.',
      inputSchema: {
        type: 'object',
        properties: {
          site_id: { type: 'string' },
          page_id: { type: 'number' },
          elementor_json: { type: 'object', description: 'Elementor page JSON (content array wrapper)' },
          title: { type: 'string' },
          publish: { type: 'boolean' },
        },
        required: ['site_id', 'page_id', 'elementor_json'],
      },
    },
    {
      name: 'elementor_build_section',
      description: 'Build a single Elementor section/widget and return its JSON. Useful for assembling pages piece by piece.',
      inputSchema: {
        type: 'object',
        properties: {
          widget: {
            type: 'string',
            enum: [
              // Section builders (scheme-aware)
              'hero', 'stats', 'features', 'cta', 'two-col', 'testimonials',
              // Interactive
              'slides', 'accordion', 'tabs', 'toggle',
              // Pro content
              'price-table', 'price-list', 'flip-box', 'animated-headline', 'blockquote',
              // Carousels / dynamic
              'testimonial-carousel', 'posts-grid', 'portfolio',
              // Media
              'image-carousel', 'image-gallery', 'video',
              // Utility
              'social-icons', 'counter', 'progress-bar',
              // New in v2
              'form', 'countdown', 'reviews', 'gallery', 'loop-grid',
              'text-path', 'nav-menu', 'share-buttons',
            ],
            description: 'Widget/section type to build',
          },
          config: { type: 'object', description: 'Widget-specific config object' },
        },
        required: ['widget', 'config'],
      },
    },
  ],
}));

// ─── Tool Handlers ─────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'elementor_generate_json' || name === 'elementor_build_landing_page') {
      const cfg = args as unknown as LandingPageConfig;
      const pageJson = buildLandingPage(cfg);

      if (name === 'elementor_generate_json') {
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, json: pageJson }) }] };
      }

      const a = args as Record<string, unknown>;
      const siteId = a.site_id as string;
      const pageId = a.page_id as number | undefined;
      const pushToWP = a.push_to_wp !== false;
      const publish = a.publish === true;

      if (!pushToWP) {
        return { content: [{ type: 'text', text: JSON.stringify({ success: true, json: pageJson }) }] };
      }

      const client = getClient(siteId);
      let result: { id: number; link: string };

      if (pageId) {
        result = await client.updatePage(pageId, pageJson, {
          title: a.title as string,
          ...(publish && { status: 'publish' }),
        });
      } else {
        result = await client.createPage(a.title as string, pageJson);
        if (publish) {
          result = await client.updatePage(result.id, pageJson, { status: 'publish' });
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            page_id: result.id,
            url: result.link,
            message: `Landing page ${pageId ? 'updated' : 'created'} successfully.`,
          }),
        }],
      };
    }

    if (name === 'elementor_push_json') {
      const a = args as { site_id: string; page_id: number; elementor_json: object; title?: string; publish?: boolean };
      const client = getClient(a.site_id);
      const result = await client.updatePage(a.page_id, a.elementor_json, {
        ...(a.title && { title: a.title }),
        ...(a.publish && { status: 'publish' }),
      });
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: true, page_id: result.id, url: result.link }) }],
      };
    }

    if (name === 'elementor_build_section') {
      const a = args as { widget: string; config: Record<string, unknown> };
      const w = a.widget;
      const c = a.config;
      let element: unknown;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const unk = c as unknown as any;
      switch (w) {
        case 'hero': element = buildHero(unk); break;
        case 'stats': element = buildStats(unk); break;
        case 'features': element = buildFeatures(unk); break;
        case 'cta': element = buildCTA(unk); break;
        case 'two-col': element = buildTwoCol(unk); break;
        case 'testimonials': element = buildTestimonials(unk); break;
        case 'slides': element = slides(unk.items, unk.opts); break;
        case 'accordion': element = accordion(unk.items, unk.opts); break;
        case 'tabs': element = tabs(unk.items, unk.opts); break;
        case 'toggle': element = toggle(unk.items, unk.opts); break;
        case 'price-table': element = priceTable(unk); break;
        case 'price-list': element = priceList(unk.items, unk.opts); break;
        case 'flip-box': element = flipBox(unk); break;
        case 'testimonial-carousel': element = testimonialCarousel(unk.items, unk.opts); break;
        case 'posts-grid': element = posts(unk); break;
        case 'portfolio': element = portfolio(unk); break;
        case 'animated-headline': element = animatedHeadline(unk.beforeText, unk.animatedText, unk.opts); break;
        case 'blockquote': element = blockquote(unk.quote, unk.author, unk.opts); break;
        case 'image-carousel': element = imageCarousel(unk.images, unk.opts); break;
        case 'image-gallery': element = imageGallery(unk.images, unk.opts); break;
        case 'video': element = video(unk.url, unk.opts); break;
        case 'social-icons': element = socialIcons(unk.icons, unk.opts); break;
        case 'counter': element = counter(unk.start, unk.end, unk.title, unk.opts); break;
        case 'progress-bar': element = progressBar(unk.title, unk.percent, unk.opts); break;
        case 'form': element = form(unk.fields, unk.opts); break;
        case 'countdown': element = countdown(unk); break;
        case 'reviews': element = reviews(unk.items, unk.opts); break;
        case 'gallery': element = galleryPro(unk.images, unk.opts); break;
        case 'loop-grid': element = loopGrid(unk); break;
        case 'text-path': element = textPath(unk.text, unk.opts); break;
        case 'nav-menu': element = navMenu(unk); break;
        case 'share-buttons': element = shareButtons(unk); break;
        default:
          return { content: [{ type: 'text', text: JSON.stringify({ error: `Unknown widget: ${w}` }) }], isError: true };
      }

      return { content: [{ type: 'text', text: JSON.stringify({ success: true, element }) }] };
    }

    return { content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${name}` }) }] };

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const detail = (err as Record<string, unknown>)?.response
      ? JSON.stringify((err as Record<string, { data: unknown }>).response?.data)
      : '';
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: msg, detail }) }],
      isError: true,
    };
  }
});

// ─── Start ─────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('elementor-mcp v2 running');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
