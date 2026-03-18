import axios, { AxiosInstance } from 'axios';

export interface WPSite {
  url: string;
  username: string;
  password: string; // Application password
}

export class WordPressClient {
  private client: AxiosInstance;

  constructor(site: WPSite) {
    this.client = axios.create({
      baseURL: site.url.replace(/\/$/, '') + '/wp-json/wp/v2',
      auth: { username: site.username, password: site.password },
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
  }

  async createPage(title: string, elementorData: object, slug?: string): Promise<{ id: number; link: string; slug: string }> {
    const res = await this.client.post('/pages', {
      title,
      status: 'draft',
      ...(slug && { slug }),
      content: '',
      meta: {
        _elementor_edit_mode: 'builder',
        _elementor_data: JSON.stringify(elementorData),
        _elementor_template_type: 'wp-page',
        _elementor_version: '3.35.1',
      },
    });

    return { id: res.data.id, link: res.data.link, slug: res.data.slug };
  }

  async updatePage(
    pageId: number,
    elementorData: object,
    opts: { title?: string; status?: string; meta?: Record<string, string> } = {}
  ): Promise<{ id: number; link: string }> {
    const payload: Record<string, unknown> = {
      meta: {
        _elementor_edit_mode: 'builder',
        _elementor_data: JSON.stringify(elementorData),
        _elementor_template_type: 'wp-page',
        _elementor_version: '3.35.1',
        ...opts.meta,
      },
    };

    if (opts.title) payload.title = opts.title;
    if (opts.status) payload.status = opts.status;

    const res = await this.client.post(`/pages/${pageId}`, payload);
    return { id: res.data.id, link: res.data.link };
  }

  async getPage(pageId: number): Promise<{ id: number; title: string; status: string; link: string }> {
    const res = await this.client.get(`/pages/${pageId}`, { params: { _fields: 'id,title,status,link' } });
    return { id: res.data.id, title: res.data.title?.rendered, status: res.data.status, link: res.data.link };
  }
}

// Site registry — reads from wp-blog MCP sites.json for reuse
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

interface SiteConfig {
  url: string;
  username: string;
  password: string;
}

let siteRegistry: Record<string, SiteConfig> | null = null;

function loadSites(): Record<string, SiteConfig> {
  if (siteRegistry) return siteRegistry;

  const paths = [
    join(homedir(), '.mcp-servers', 'wp-blog-mcp-server', 'config', 'sites.json'),
    join(homedir(), '.wp-sites', 'sites.json'),
  ];

  for (const p of paths) {
    if (existsSync(p)) {
      const raw = JSON.parse(readFileSync(p, 'utf-8'));
      // Normalize: sites.json may have array or object format
      const normalized: Record<string, SiteConfig> = {};
      const items = Array.isArray(raw) ? raw : Object.values(raw);
      for (const site of items as Record<string, string>[]) {
        if (site.site_id || site.id) {
          normalized[site.site_id ?? site.id] = {
            url: site.url ?? site.site_url,
            username: site.username,
            password: site.password ?? site.app_password,
          };
        }
      }
      siteRegistry = normalized;
      return normalized;
    }
  }

  siteRegistry = {};
  return {};
}

export function getClient(siteId: string, customSite?: WPSite): WordPressClient {
  if (customSite) return new WordPressClient(customSite);

  const sites = loadSites();
  const site = sites[siteId];
  if (!site) {
    throw new Error(`Site "${siteId}" not found. Available: ${Object.keys(sites).join(', ')}`);
  }
  return new WordPressClient(site);
}
