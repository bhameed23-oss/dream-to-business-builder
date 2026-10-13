const WEBSITE_REPORT_HISTORY_KEY = 'dreamToBusinessBuilderWebsiteReportHistory';

const readWebsiteHistory = () => {
  try {
    const raw = localStorage.getItem(WEBSITE_REPORT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeWebsiteHistory = (items) => {
  try {
    localStorage.setItem(WEBSITE_REPORT_HISTORY_KEY, JSON.stringify(items.slice(0, 6)));
  } catch (error) {
    // Ignore localStorage errors in constrained browsers.
  }
};

const appendWebsiteHistory = (report) => {
  const history = readWebsiteHistory();
  const next = [
    {
      url: report.url,
      status: report.status,
      overall: report.scores?.overall || 0,
      blocked: !!report.blocked,
      note: report.note,
      createdAt: report.createdAt || new Date().toISOString(),
    },
    ...history
  ].slice(0, 6);
  writeWebsiteHistory(next);
  renderWebsiteHistory(next);
};

const renderWebsiteHistory = (items = readWebsiteHistory()) => {
  const list = document.getElementById('website-history-list');
  if (!list) return;

  if (!items.length) {
    list.innerHTML = '<li class="history-empty">No website scans yet.</li>';
    return;
  }

  list.innerHTML = items.map((entry) => {
    const date = new Date(entry.createdAt || Date.now()).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `
      <li>
        <div>
          <strong>${entry.url}</strong>
          <small>${date}</small>
        </div>
        <span class="history-status ${entry.blocked ? 'blocked' : 'ok'}">${entry.blocked ? 'Blocked' : 'Grade'} ${entry.overall}/10</span>
      </li>
    `;
  }).join('');
};

const buildWebsiteReportText = (report) => {
  const lines = [
    'Dream to Business Builder — Website Grade',
    `URL: ${report.url}`,
    `Status: ${report.status}`,
    `Generated: ${new Date(report.createdAt || Date.now()).toISOString()}`,
    '',
    `Overall: ${report.scores?.overall || 0}/10`,
    `Security: ${report.scores?.security || 0}/10`,
    `Exposure: ${report.scores?.exposure || 0}/10`,
    `Design: ${report.scores?.design || 0}/10`,
    `Performance: ${report.scores?.performance || 0}/10`,
    '',
    'Summary:',
    report.note || 'The site was assessed with a passive public scan.',
    '',
    'Findings:',
  ];

  (report.findings || []).forEach((item) => lines.push(`- ${item}`));
  lines.push('', 'Recommendations:');
  (report.recommendations || []).forEach((item) => lines.push(`- ${item}`));

  lines.push('', 'This report is a passive public review, not a vulnerability exploit or pentest.');
  return lines.join('\n');
};

const exportWebsiteReport = (report) => {
  const text = buildWebsiteReportText(report);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeHost = (report.url || 'website')
    .replace(/^https?:\/\//i, '')
    .replace(/[^a-z0-9.-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'website';
  link.download = `website-grade-${safeHost}-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  trackEvent('website_report_exported', {
    website: report.url,
    overall: report.scores?.overall || 0,
    status: report.status,
  });
};

const updateWebsiteStageBadge = (report) => {
  const badge = document.getElementById('website-grade-tier');
  if (!badge) return;

  if (report.blocked || report.status === 'blocked') {
    badge.textContent = 'Managed review recommended';
    badge.dataset.state = 'blocked';
    return;
  }

  if ((report.scores?.overall || 0) < 5) {
    badge.textContent = 'Deeper review recommended';
    badge.dataset.state = 'watch';
    return;
  }

  badge.textContent = 'Basic public grade';
  badge.dataset.state = 'ok';
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
  const exportButton = document.getElementById('website-export-btn');
  const tierBadge = document.getElementById('website-grade-tier');

  if (!card) return;

  card.classList.remove('hidden');
  if (urlField) urlField.textContent = report.url;
  if (overallValue) overallValue.textContent = `${report.scores?.overall || 0}/10`;
  if (securityValue) securityValue.textContent = `${report.scores?.security || 0}/10`;
  if (exposureValue) exposureValue.textContent = `${report.scores?.exposure || 0}/10`;
  if (designValue) designValue.textContent = `${report.scores?.design || 0}/10`;
  if (performanceValue) performanceValue.textContent = `${report.scores?.performance || 0}/10`;
  if (summaryText) summaryText.textContent = report.note || 'The passive audit completed successfully.';
  if (statusTag) {
    statusTag.textContent = report.status === 'blocked' ? 'Blocked' : 'Completed';
    statusTag.dataset.state = report.status === 'blocked' ? 'blocked' : 'done';
  }
  if (exportButton) {
    exportButton.onclick = () => exportWebsiteReport(report);
  }

  if (findingsList) {
    findingsList.innerHTML = (report.findings || []).map((item) => `<li>${item}</li>`).join('');
  }
  if (recommendationsList) {
    recommendationsList.innerHTML = (report.recommendations || []).map((item) => `<li>${item}</li>`).join('');
  }

  updateWebsiteStageBadge(report);
  appendWebsiteHistory(report);
  renderWebsiteHistory(readWebsiteHistory());

  if (tierBadge) {
    tierBadge.textContent = tierBadge.textContent || 'Basic public grade';
  }
};

const hydrateWebsiteHistory = () => {
  renderWebsiteHistory(readWebsiteHistory());
};

const saveWebsiteReportLocally = (report) => {
  try {
    localStorage.setItem('dreamToBusinessBuilderWebsiteReport', JSON.stringify(report));
  } catch (error) {
    // Ignore localStorage errors in constrained browsers.
  }
};

const hydrateCachedWebsiteReport = () => {
  try {
    const raw = localStorage.getItem('dreamToBusinessBuilderWebsiteReport');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.url) {
      renderWebsiteReport(parsed);
    }
  } catch (error) {
    // Ignore parse errors.
  }
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

  const url = input.value.trim();
  if (!url) {
    if (errorBox) {
      errorBox.textContent = 'Please enter a valid URL like https://example.com';
      errorBox.classList.remove('hidden');
    }
    return;
  }

  if (errorBox) errorBox.classList.add('hidden');
  if (button) button.disabled = true;
  if (statusText) statusText.textContent = 'Running a safe public audit...';

  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, consent: true })
    });

    const report = await response.json();
    saveWebsiteReportLocally(report);
    renderWebsiteReport(report);

    if (statusText) {
      statusText.textContent = report.status === 'blocked' ? 'Public scan blocked — report ready.' : 'Report ready.';
    }
  } catch (error) {
    if (errorBox) {
      errorBox.textContent = error.message || 'Unexpected scan error. Please try again later.';
      errorBox.classList.remove('hidden');
    }
    if (statusText) statusText.textContent = 'Scan failed.';
  } finally {
    if (button) button.disabled = false;
  }
};

const bindWebsiteScan = () => {
  const form = document.getElementById('website-scan-form');
  if (form) form.addEventListener('submit', handleWebsiteScan);
};

const bindWebsiteTierActions = () => {
  const deeperBtn = document.getElementById('website-deeper-btn');
  const managedBtn = document.getElementById('website-managed-btn');

  deeperBtn?.addEventListener('click', () => {
    trackEvent('website_deeper_flow_click', { flow: 'deeper' });
  });

  managedBtn?.addEventListener('click', () => {
    trackEvent('website_managed_flow_click', { flow: 'managed' });
  });
};

bindWebsiteScan();
hydrateWebsiteHistory();
hydrateCachedWebsiteReport();
bindWebsiteTierActions();
