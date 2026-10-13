const WEBSITE_ANALYZER_KEY = 'dreamToBusinessBuilderWebsiteAnalysis';

const readWebsiteAnalysis = () => {
  try {
    const stored = localStorage.getItem(WEBSITE_ANALYZER_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
};

const writeWebsiteAnalysis = (report) => {
  try {
    localStorage.setItem(WEBSITE_ANALYZER_KEY, JSON.stringify(report));
  } catch (error) {
    // Ignore localStorage write failures in constrained browsers.
  }
};

const clampScore = (value) => Math.max(0, Math.min(10, Number(value) || 0));

const normalizeUrl = (candidate) => {
  const raw = String(candidate || '').trim();
  if (!raw) return null;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch (error) {
    return null;
  }
};

const getHostLabel = (candidate) => {
  try {
    const url = new URL(candidate);
    return url.hostname.replace(/^www\./i, '');
  } catch (error) {
    return 'website';
  }
};

const buildFindingsFromHeaders = (response, pageText) => {
  const headers = response.headers || {};
  const findings = [];
  const hsts = headers.get ? headers.get('strict-transport-security') : null;
  const csp = headers.get ? headers.get('content-security-policy') : null;
  const xFrame = headers.get ? headers.get('x-frame-options') : null;
  const xContent = headers.get ? headers.get('x-content-type-options') : null;
  const referrer = headers.get ? headers.get('referrer-policy') : null;

  if (!hsts && response.url.startsWith('https://')) findings.push('HSTS is missing, which strongly reduces HTTPS protection quality.');
  if (!csp) findings.push('No Content-Security-Policy header was detected, which may leave the site more exposed to injection or XSS patterns.');
  if (!xFrame) findings.push('No X-Frame-Options header was detected. This can make clickjacking riskier.');
  if (!xContent) findings.push('No X-Content-Type-Options header was detected. MIME confusion risk may be higher.');
  if (!referrer) findings.push('No Referrer-Policy header was detected. This can make traffic privacy weaker.');

  if (!pageText || !pageText.trim()) findings.push('The homepage returned empty or unreadable content, so the tool could not assess the rendered page in detail.');
  if ((pageText || '').includes('<html') && !(pageText || '').includes('<h1')) findings.push('The page structure appears minimal or missing a clear semantic heading hierarchy.');

  return findings.slice(0, 5);
};

const safeGetStatusScore = (status) => {
  if (status >= 200 && status < 300) return 10;
  if (status === 403 || status === 401) return 2;
  if (status >= 300 && status < 400) return 6;
  return 0;
};

const buildWebsiteReport = async (url, consent) => {
  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) {
    throw new Error('Enter a valid website URL such as https://example.com');
  }
  if (!consent) {
    throw new Error('You must confirm that you own the website or have permission to scan it before running a scan.');
  }

  const startedAt = new Date().toISOString();
  const hostName = getHostLabel(normalizedUrl);
  const report = {
    id: `site-scan-${Date.now()}`,
    url: normalizedUrl,
    hostName,
    consented: true,
    status: 'running',
    createdAt: startedAt,
    completedAt: null,
    scores: {
      overall: 0,
      security: 0,
      exposure: 0,
      design: 0,
      performance: 0
    },
    findings: [],
    recommendations: [],
    blocked: false,
    note: ''
  };

  try {
    const response = await fetch(normalizedUrl, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store',
      redirect: 'follow'
    });

    const pageText = await response.text();
    const securityScoreRaw = [
      response.url.startsWith('https://') ? 2 : 0,
      response.headers.get('strict-transport-security') ? 2 : 0,
      response.headers.get('content-security-policy') ? 2 : 0,
      response.headers.get('x-frame-options') ? 1.5 : 0,
      response.headers.get('x-content-type-options') ? 1.5 : 0,
      response.headers.get('referrer-policy') ? 1 : 0
    ].reduce((sum, value) => sum + value, 0);

    const securityScore = clampScore((securityScoreRaw / 10) * 10);
    const httpAccessibility = safeGetStatusScore(response.status);
    const exposureScore = clampScore(((httpAccessibility + (response.url.startsWith('https://') ? 2 : 0)) / 12) * 10);
    const designSignals = [
      /<h[1-6]/i.test(pageText) ? 2 : 0,
      /<img[^>]+alt=/i.test(pageText) ? 2 : 0,
      /<meta[^>]+name=['"]description['"]/i.test(pageText) ? 2 : 0,
      /<title>/i.test(pageText) ? 2 : 0,
      /<main|<header|<nav|<section/i.test(pageText) ? 2 : 0
    ].reduce((sum, value) => sum + value, 0);
    const designScore = clampScore((designSignals / 10) * 10);
    const performanceScore = clampScore(Math.max(0, 10 - Math.min(10, (pageText.length / 16000))));

    const findings = buildFindingsFromHeaders(response, pageText);
    const recommendations = [
      'Add security headers like HSTS, CSP, and Referrer-Policy for stronger hardening.',
      'Improve semantic structure with clear headings and descriptive alt text for meaningful content.',
      'Use a staging or owner-approved URL if you want a more detailed page-level audit.'
    ];

    const overallScore = Math.round(
      (securityScore * 0.3 + exposureScore * 0.25 + designScore * 0.25 + performanceScore * 0.2)
    );

    const finalReport = {
      ...report,
      status: 'complete',
      completedAt: new Date().toISOString(),
      blocked: response.status === 403 || response.status === 401 || response.status >= 500,
      note: response.status === 403 || response.status === 401 ? 'This site blocked the public scan, which reduces what the tool can assess.' : 'The site was reachable and a safe passive audit was completed.',
      scores: {
        overall: overallScore,
        security: Math.round(securityScore),
        exposure: Math.round(exposureScore),
        design: Math.round(designScore),
        performance: Math.round(performanceScore)
      },
      findings: findings.length ? findings : ['No critical issues were found in the passive scan, though a deeper audit may still be useful.'],
      recommendations
    };

    writeWebsiteAnalysis(finalReport);
    return finalReport;
  } catch (error) {
    const finalReport = {
      ...report,
      status: 'blocked',
      completedAt: new Date().toISOString(),
      blocked: true,
      note: "The scanner could not access the site publicly. This usually means the site blocks automated checks, requires authentication, or is behind a WAF.",
      scores: {
        overall: 0,
        security: 8,
        exposure: 2,
        design: 0,
        performance: 0
      },
      findings: [
        'The website blocked the public scan, so the tool could not evaluate the rendered page content.',
        'This usually represents a security-hardening signal, but it also means the site is not easily accessible to automated review tools.',
        'If you own the site, provide a public staging URL or an owner-approved workflow to unlock a more detailed audit.'
      ],
      recommendations: [
        'Confirm ownership and enable a public staging environment for a deeper audit.',
        'Use a simple, public URL for the scan if you want a basic accessibility and security assessment.',
        'If the site is intentionally hardened, document the decision and consider a guided professional review instead.'
      ]
    };

    writeWebsiteAnalysis(finalReport);
    return finalReport;
  }
};

const renderWebsiteReport = (report) => {
  const card = document.getElementById('website-report-card');
  const urlField = document.getElementById('website-report-url');
  const overallValue = document.getElementById('report-overall-score');
  const securityValue = document.getElementById('report-security-score');
  const exposureValue = document.getElementById('report-exposure-score');
  const designValue = document.getElementById('report-design-score');
  const performanceValue = document.getElementById('report-performance-score');
  const summaryText = document.getElementById('website-report-summary');
  const findingsList = document.getElementById('website-findings');
  const recommendationsList = document.getElementById('website-recommendations');
  const statusTag = document.getElementById('website-status-pill');

  if (!card) return;

  card.classList.remove('hidden');
  if (urlField) urlField.textContent = report.url;
  if (overallValue) overallValue.textContent = `${report.scores.overall || 0}/10`;
  if (securityValue) securityValue.textContent = `${report.scores.security || 0}/10`;
  if (exposureValue) exposureValue.textContent = `${report.scores.exposure || 0}/10`;
  if (designValue) designValue.textContent = `${report.scores.design || 0}/10`;
  if (performanceValue) performanceValue.textContent = `${report.scores.performance || 0}/10`;
  if (summaryText) summaryText.textContent = report.note || 'The passive audit completed successfully.';
  if (statusTag) {
    statusTag.textContent = report.status === 'blocked' ? 'Blocked' : 'Completed';
    statusTag.dataset.state = report.status === 'blocked' ? 'blocked' : 'done';
  }

  if (findingsList) {
    findingsList.innerHTML = (report.findings || []).map((item) => `<li>${item}</li>`).join('');
  }
  if (recommendationsList) {
    recommendationsList.innerHTML = (report.recommendations || []).map((item) => `<li>${item}</li>`).join('');
  }

  trackEvent('website_scan_complete', {
    website: report.url,
    overall: report.scores.overall,
    status: report.status,
    blocked: !!report.blocked
  });
};

const hydrateWebsiteReport = () => {
  const report = readWebsiteAnalysis();
  if (!report) return;
  renderWebsiteReport(report);
};

const handleWebsiteScan = async (event) => {
  event.preventDefault();

  const input = document.getElementById('website-url');
  const consent = document.getElementById('scan-consent');
  const errorBox = document.getElementById('website-scan-error');
  const button = document.getElementById('website-scan-btn');
  const statusText = document.getElementById('website-status-text');

  if (!input || !consent) return;

  if (!consent.checked) {
    if (errorBox) {
      errorBox.textContent = 'You must confirm that you own the website or have permission to scan it.';
      errorBox.classList.remove('hidden');
    }
    return;
  }

  const normalizedUrl = normalizeUrl(input.value);
  if (!normalizedUrl) {
    if (errorBox) {
      errorBox.textContent = 'Please enter a valid URL like https://example.com';
      errorBox.classList.remove('hidden');
    }
    return;
  }

  if (errorBox) errorBox.classList.add('hidden');
  if (button) button.disabled = true;
  if (statusText) statusText.textContent = 'Running a safe public audit…';

  trackEvent('website_scan_started', { website: normalizedUrl });

  try {
    const report = await buildWebsiteReport(normalizedUrl, true);
    renderWebsiteReport(report);
    if (statusText) statusText.textContent = report.status === 'blocked' ? 'Public scan blocked — report ready.' : 'Report ready.';
  } catch (error) {
    if (errorBox) {
      errorBox.textContent = error.message || 'We could not complete the scan.';
      errorBox.classList.remove('hidden');
    }
    if (statusText) statusText.textContent = 'The scan could not complete.';
  } finally {
    if (button) button.disabled = false;
  }
};

const bindWebsiteScan = () => {
  const form = document.getElementById('website-scan-form');
  if (form) form.addEventListener('submit', handleWebsiteScan);
};

const hydrateLocalTelemetry = () => {
  const analytics = readStoredCollection(ANALYTICS_KEY, []);
  if (!analytics.length) {
    writeStoredCollection(ANALYTICS_KEY, [{
      eventName: 'local_tracking_initialized',
      payload: { mode: 'local-first' },
      timestamp: new Date().toISOString()
    }]);
  }
};

bindWebsiteScan();
hydrateWebsiteReport();
hydrateLocalTelemetry();
