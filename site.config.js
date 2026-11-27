export const primarySiteUrl = 'https://fahmirifaldi.is-a.dev'

export function resolveSiteUrl(value = primarySiteUrl) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('PORTFOLIO_SITE_URL must be an HTTPS origin, without credentials, path, query, or fragment.')
  }
  return url.origin
}

export function siteMetadata(origin) {
  return {
    name: 'portfolio-site-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('%PORTFOLIO_SITE_URL%', origin),
    },
    generateBundle() {
      const paths = ['/', '/llms.txt']
      const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        paths.map(path => '  <url><loc>' + origin + path + '</loc></url>').join('\n') + '\n</urlset>\n'
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: 'User-agent: *\nAllow: /\nSitemap: ' + origin + '/sitemap.xml\n' })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
    },
  }
}
