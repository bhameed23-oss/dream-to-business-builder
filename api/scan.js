import { chromium } from 'playwright';

const clamp = (value, min = 0, max = 10) => {
  const normalized = Number(value) || 0;
  return Math.min(max, Math.max(min, normalized));
};

const normalizeUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const parsed = new URL(candidate);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch (error) {
    return null;
  }
};

const getSecurityScore = (response, html) => {
  const headers = response?.headers ? response.headers() : {};
  const checks = [
    response?.url?.startsWith('https://') ? 2 : 0,
    headers['strict-transport-security'] ? 2 : 0,
    headers['content-security-policy'] ? 2 : 0,
    headers['x-frame-options'] ? 1.5 : 0,
    headers['x-content-type-options'] ? 1.5 : 0,
    headers['referrer-policy'] ? 1 : 0,
  ];

  const total = checks.reduce((sum, item) => sum + item, 0);
  const score = clamp((total / 10) * 10, 0, 10);

  if (!html || html.trim().length < 200) {
    return 0;
  }

  return score;
};

const getDesignScore = (html) => {
  const checks = [
    /<h[1-6]/i.test(html) ? 2 : 0,
    /<img[^>]+alt=/i.test(html) ? 2 : 0,
    /<meta[^>]+name=['"]description['"]/i.test(html) ? 2 : 0,
    /<title>/i.test(html) ? 2 : 0,
    /<main|<header|<nav|<section/i.test(html) ? 2 : 0,
  ];

  const total = checks.reduce((sum, item) => sum + item, 0);
  return clamp((total / 10) * 10, 0, 10);
};

const getExposureScore = (status, url) => {
  if (status === 403 || status === 401) return 2;
  if (status >= 200 && status < 300) {
    const base = 8 + (url.startsWith('https://') ? 2 : 0);
    return clamp(base / 10, 0, 10);
  }
  if (status >= 300 && status < 400) return 6;
  return 0;
};

const getPerformanceScore = (html) => {
  const length = html ? html.length : 0;
  if (!length) return 0;
  return clamp(10 - Math.min(10, length / 16000), 0, 10);
};

const buildFindings = (status, headers, html) => {
  const findings = [];

  if (!headers['strict-transport-security'] && headers['x-forwarded-proto'] === 'https') {
    findings.push('HSTS is missing, which reduces HTTPS protection quality.');
  }

  if (!headers['content-security-policy']) {
    findings.push('No Content-Security-Policy header was detected.');
  }

  if (!headers['x-frame-options']) {
    findings.push('No X-Frame-Options header was detected.');
  }

  if (!headers['referrer-policy']) {
    findings.push('No Referrer-Policy header was detected.');
  }

  if (status === 403 || status === 401) {
    findings.push('The public scan was blocked, which means the site may be behind a WAF or authentication wall.');
  }

  if (!html || html.trim().length < 200) {
    findings.push('The page returned empty or unreadable content, which reduced the page-level audit confidence.');
  }

  return findings.slice(0, 5);
};

const buildRecommendations = (status) => {
  if (status === 403 || status === 401) {
    return [
      'Confirm ownership and provide a public staging URL for a deeper grade.',
      'If the site is intentionally hardened, keep the public scan limited and use a managed review workflow.',
      'Document which parts of the site are intentionally not public before running deeper checks.'
    ];
  }

  return [
    'Add security headers like HSTS, CSP, and Referrer-Policy for stronger hardening.',
    'Improve semantic structure with headings and descriptive alt text for meaningful content.',
    'If you want a more detailed report, use a public staging or owner-approved URL.'
  ];
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { url, consent } = req.body || {};
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) {
    return res.status(400).json({ error: 'A valid website URL is required.' });
  }

  if (!consent) {
    return res.status(400).json({
      error: 'You must confirm that you own the website or have permission to scan it.'
    });
  }

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const response = await page.goto(normalizedUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const html = await page.content();
    const status = response ? response.status() : 0;
    const headers = response ? response.headers() : {};

    const securityScore = getSecurityScore(response, html);
    const designScore = getDesignScore(html);
    const exposureScore = getExposureScore(status, normalizedUrl);
    const performanceScore = getPerformanceScore(html);

    const overall = Math.round(
      securityScore * 0.3 +
      exposureScore * 0.25 +
      designScore * 0.25 +
      performanceScore * 0.2
    );

    const findings = buildFindings(status, headers, html);
    const report = {
      status: status === 403 || status === 401 ? 'blocked' : 'complete',
      url: normalizedUrl,
      note: status === 403 || status === 401
        ? 'The website blocked the public scan. This usually means the site is behind a WAF, auth layer, or policy block.'
        : 'The site was reachable and a passive public audit was completed.',
      scores: {
        overall,
        security: Math.round(securityScore),
        exposure: Math.round(exposureScore),
        design: Math.round(designScore),
        performance: Math.round(performanceScore),
      },
      findings: findings.length ? findings : ['No critical issues were found in the passive scan, though a deeper audit may still be useful.'],
      recommendations: buildRecommendations(status),
      consented: true,
      createdAt: new Date().toISOString(),
    };

    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({
      status: 'blocked',
      url: normalizedUrl,
      note: 'The site could not be publicly evaluated. It may be protected or inaccessible to automated checks.',
      scores: {
        overall: 0,
        security: 8,
        exposure: 2,
        design: 0,
        performance: 0,
      },
      findings: [
        'The public scan was blocked or the site was unreachable.',
        'This usually means the site is behind a WAF, authentication layer, or policy block.',
      ],
      recommendations: [
        'Confirm ownership and provide a public staging URL for a deeper grade.',
        'If the site is intentionally hardened, keep the public scan limited and use a managed review workflow.'
      ],
      consented: true,
      createdAt: new Date().toISOString(),
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
