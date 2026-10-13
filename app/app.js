const PHASE_SAFETY_RULES = {
  creation: [
    'Clarify the customer problem before expanding the offer.',
    'Keep delivery simple and repeatable while the business is still forming.',
    'Document what success looks like before adding more complexity.'
  ],
  operation: [
    'Review the recurring workflow for bottlenecks and confusion.',
    'Check whether customer follow-up is consistent and reliable.',
    'Look for manual work that slows down the business or creates errors.'
  ],
  auditing: [
    'Review the business as a system, not as isolated tasks.',
    'Identify where ownership, timing, or communication breaks down.',
    'Prioritize the biggest operational leaks before adding growth.'
  ],
  scaling: [
    'Do not grow faster than the business can support consistently.',
    'Document responsibilities and decision-makers before adding more volume.',
    'Validate whether the current team, process, and tools can absorb more demand.'
  ],
  compliance: [
    'Review legal, privacy, and customer-data risk exposures.',
    'Check whether contracts, collection, handling, and recordkeeping are consistent.',
    'Bring in professional guidance if the risk profile is significant.'
  ],
  automation: [
    'Standardize the workflow before automation.',
    'Review which tasks are repetitive enough to automate without creating blind spots.',
    'Keep human oversight on anything that affects customer trust or legal obligations.'
  ],
  exit: [
    'Review documentation, ownership, and operational dependencies before a handoff or sale.',
    'Assess whether the business would be understandable to an external buyer or successor.',
    'Clean up high-risk dependencies before moving toward transition.'
  ]
};

const REVIEW_GATE_MESSAGES = {
  creation: 'This phase is still early. Focus on clarity and stability before adding complexity.',
  operation: 'Your operation is active but may still benefit from a structured process review.',
  auditing: 'This is a good phase to tighten the system before major changes or growth.',
  scaling: 'The core risk here is scaling too quickly without stronger processes or ownership.',
  compliance: 'This phase may require legal, privacy, or financial review before moving forward confidently.',
  automation: 'Automation should reduce friction, not create blind spots or customer risk.',
  exit: 'This phase should include explicit exit or transition planning and documentation review.'
};

const buildSafetyChecks = (profile) => {
  const normalizedProfile = normalizeProfile(profile);
  if (!normalizedProfile) {
    return {
      summary: 'No profile is available yet. Complete the review to surface safety and review guidance.',
      checks: [
        'Add business context to see the safety review.',
        'Document what the business is trying to achieve next.',
        'Review the current phase and risk posture.'
      ]
    };
  }

  const checks = [...(PHASE_SAFETY_RULES[normalizedProfile.currentPhase] || PHASE_SAFETY_RULES.operation)];
  if (normalizedProfile.reviewRecommended) {
    checks.push('Professional review is recommended because the risk and operating posture may need more expertise.');
  }
  if (Number(normalizedProfile.healthScore || 0) < 60) {
    checks.push('The business health is still below a stronger operating threshold and may benefit from a more structured review.');
  }
  if (normalizedProfile.mainRisk) {
    checks.push(`Main risk to manage: ${normalizedProfile.mainRisk}`);
  }
  if (normalizedProfile.currentPhase === 'compliance' || normalizedProfile.currentPhase === 'exit') {
    checks.push('Review legal, financial, or advisor support before making a large operational change.');
  }

  return {
    summary: REVIEW_GATE_MESSAGES[normalizedProfile.currentPhase] || REVIEW_GATE_MESSAGES.operation,
    checks: [...new Set(checks)].slice(0, 5)
  };
};

const buildTrendSummary = (profile) => {
  const normalizedProfile = normalizeProfile(profile);
  if (!normalizedProfile) return 'No saved profile is available yet.';

  const history = readProfileHistory();
  if (!history.length) return 'This is your first profile snapshot. Save a new profile after a few changes to see progress over time.';

  const previous = history[1] || history[0];
  if (!previous) return 'This is your first profile snapshot. A trend view will appear after another profile is saved.';

  const currentScore = Number(normalizedProfile.healthScore || 0);
  const previousScore = Number(previous.healthScore || 0);
  const delta = currentScore - previousScore;

  if (delta > 0) {
    return `Compared with your last review, the business health increased by ${delta} points.`;
  }
  if (delta < 0) {
    return `Compared with your last review, the business health decreased by ${Math.abs(delta)} points.`;
  }
  return 'Compared with your last review, the business health is roughly unchanged.';
};

const renderSafetyPanel = (profile) => {
  const safety = buildSafetyChecks(profile);
  const summaryEl = document.getElementById('safety-summary');
  const listEl = document.getElementById('safety-checks');

  if (summaryEl) summaryEl.textContent = safety.summary;
  if (listEl) {
    listEl.innerHTML = safety.checks.map((item) => `<li>${item}</li>`).join('');
  }

  const trendEl = document.getElementById('trend-summary');
  if (trendEl) {
    trendEl.textContent = buildTrendSummary(profile);
  }
};

const renderComparisonTrend = (profile) => {
  const summary = buildTrendSummary(profile);
  const target = document.getElementById('trend-summary');
  if (target) target.textContent = summary;
};

const renderProfile = (profile) => {
  const normalizedProfile = normalizeProfile(profile);
  if (!normalizedProfile) return;

  const dashboard = document.getElementById('dashboard');
  const phaseTitle = document.getElementById('phase-title');
  const healthScore = document.getElementById('health-score');
  const primaryRisk = document.getElementById('primary-risk');
  const recommendation = document.getElementById('phase-recommendation');
  const profileSummary = document.getElementById('profile-summary');
  const riskFlags = document.getElementById('risk-flags');
  const actionItems = document.getElementById('action-items');
  const phaseDetail = document.getElementById('phase-detail');
  const reviewBadge = document.getElementById('review-badge');
  const healthStatus = document.getElementById('health-status');
  const phasePlanList = document.getElementById('phase-plan-list');

  phaseTitle.textContent = PHASES[normalizedProfile.currentPhase]?.title || 'Business phase';
  const scoreValue = Number(normalizedProfile.healthScore || 0);
  healthScore.textContent = `${scoreValue}/100`;
  primaryRisk.textContent = normalizedProfile.primaryRisk;
  recommendation.textContent = renderPhaseText(normalizedProfile.currentPhase);
  phaseDetail.textContent = renderPhaseDetail(normalizedProfile.currentPhase);

  if (healthStatus) {
    healthStatus.textContent = getHealthBand(scoreValue);
    healthStatus.dataset.level = scoreValue >= 80 ? 'strong' : scoreValue >= 60 ? 'healthy' : scoreValue >= 40 ? 'watch' : 'critical';
  }

  updateScoreRing(scoreValue);

  const summary = [
    `${normalizedProfile.businessName} is a ${String(normalizedProfile.businessType).replace('-', ' ')} business.`,
    `Current focus: ${String(normalizedProfile.situation).replace('-', ' ')}.`,
    `Customer expectation: ${normalizedProfile.customerSummary}`
  ].join(' ');

  profileSummary.textContent = summary;
  riskFlags.innerHTML = (normalizedProfile.riskFlags || []).map((item) => `<li>${item}</li>`).join('');
  actionItems.innerHTML = (normalizedProfile.actionItems || []).map((item) => `<li>${item}</li>`).join('');

  if (phasePlanList) {
    phasePlanList.innerHTML = generatePhasePlan(normalizedProfile).map((item) => `<li>${item}</li>`).join('');
  }

  reviewBadge.textContent = normalizedProfile.reviewRecommended ? 'Professional review recommended' : 'Review recommended';
  reviewBadge.dataset.level = normalizedProfile.reviewRecommended ? 'critical' : 'watch';

  renderSafetyPanel(normalizedProfile);
  renderComparisonTrend(normalizedProfile);

  const nextStepsPanel = document.getElementById('next-steps-panel');
  if (nextStepsPanel) {
    const phaseInfo = PHASES[normalizedProfile.currentPhase] || PHASES.operation;
    const links = getPhaseLinks(normalizedProfile.currentPhase);

    const checklistLink = document.getElementById('next-steps-checklist-link');
    const resourcesLink = document.getElementById('next-steps-resources-link');
    const overviewLink = document.getElementById('next-steps-overview-link');
    const summaryText = document.getElementById('next-steps-summary');

    if (summaryText) summaryText.textContent = `${phaseInfo.title} focus: ${phaseInfo.guidance}`;
    if (checklistLink) checklistLink.href = links.checklist;
    if (resourcesLink) resourcesLink.href = links.resources;
    if (overviewLink) overviewLink.href = links.overview;

    nextStepsPanel.classList.remove('hidden');
  }

  trackEvent('dashboard_rendered', {
    currentPhase: normalizedProfile.currentPhase,
    healthScore: scoreValue,
    reviewRecommended: normalizedProfile.reviewRecommended,
    businessName: normalizedProfile.businessName
  });

  dashboard.classList.remove('hidden');
  const intakeSection = document.getElementById('intake');
  if (intakeSection) intakeSection.classList.add('hidden');
};

const saveProfile = (profile) => {
  const normalized = normalizeProfile(profile);
  if (!normalized) return;

  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    // Ignore localStorage write failures in constrained browsers.
  }

  const history = readProfileHistory();
  const snapshot = {
    ...normalized,
    savedAt: new Date().toISOString()
  };
  history.unshift(snapshot);
  writeProfileHistory(history.slice(0, 10));
};

const bindActions = () => {
  document.getElementById('start-review-btn')?.addEventListener('click', () => {
    trackEvent('cta_click', { target: 'start-review-btn' });
    const intake = document.getElementById('intake');
    if (intake) intake.classList.remove('hidden');
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('hero-start-btn')?.addEventListener('click', () => {
    trackEvent('cta_click', { target: 'hero-start-btn' });
    const intake = document.getElementById('intake');
    if (intake) {
      intake.classList.remove('hidden');
      intake.scrollIntoView({ behavior: 'smooth' });
    }
  });

  document.getElementById('learn-more-btn')?.addEventListener('click', () => {
    trackEvent('cta_click', { target: 'learn-more-btn' });
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('cancel-form-btn')?.addEventListener('click', () => {
    trackEvent('form_cancelled', {});
    const intake = document.getElementById('intake');
    if (intake) intake.classList.add('hidden');
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
    trackEvent('edit_profile_clicked', {});
    const dashboard = document.getElementById('dashboard');
    const intake = document.getElementById('intake');
    if (dashboard) dashboard.classList.add('hidden');
    if (intake) {
      intake.classList.remove('hidden');
      intake.scrollIntoView({ behavior: 'smooth' });
    }
  });

  document.getElementById('export-profile-btn')?.addEventListener('click', () => {
    const profile = loadProfile();
    if (profile) downloadProfileSummary(profile);
  });

  document.getElementById('business-form')?.addEventListener('submit', handleFormSubmit);
};

const initialize = () => {
  bindRangeValues();
  bindActions();
  bindFeedbackWidget();
  updateScoreRing(72);
  trackEvent('app_loaded', { userAgent: navigator.userAgent });

  const savedProfile = loadProfile();
  if (savedProfile) {
    renderProfile(savedProfile);
  }
};

initialize();

if (typeof globalThis !== 'undefined') {
  globalThis.trackEvent = trackEvent;
  globalThis.getAnalytics = () => readStoredCollection(ANALYTICS_KEY, []);
  globalThis.getFeedback = () => readStoredCollection(FEEDBACK_KEY, []);
  globalThis.getProfileHistory = () => readProfileHistory();
}
