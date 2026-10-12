const PHASES = {
  creation: {
    title: 'Creation',
    description: 'You are building the foundation of the business and clarifying the offer, market, and early systems.',
    guidance: 'Focus on clarifying the value proposition, defining the customer, and creating a simple delivery rhythm before adding more complexity.'
  },
  operation: {
    title: 'Operation',
    description: 'You are running the business and need better systems, stability, and a less chaotic operating rhythm.',
    guidance: 'Document the core process, improve visibility, and reduce manual effort so the business becomes more reliable and easier to run.'
  },
  auditing: {
    title: 'Auditing',
    description: 'You need to evaluate whether the business is structurally sound and identify weak points before growth.',
    guidance: 'Review the business as a system. Look for process gaps, ownership gaps, inconsistent handoffs, and decision bottlenecks before taking on more scale.'
  },
  scaling: {
    title: 'Scaling',
    description: 'You are ready to grow, but need clearer ownership, systems, and risk management.',
    guidance: 'Before growing, tighten your process, define who owns what, and make sure your systems can handle more volume without extra chaos.'
  },
  compliance: {
    title: 'Compliance Catch-Up',
    description: 'You need to identify and address legal, privacy, and compliance gaps before they turn into serious risk.',
    guidance: 'Review where customer data, obligations, or sensitive workflows are exposed. If compliance gaps are significant, bring in professional review.'
  },
  automation: {
    title: 'Automation & Systems Upgrade',
    description: 'You are improving workflows, reducing manual effort, and building the systems that support sustainable growth.',
    guidance: 'Automate repeatable work only after you understand the workflow. The goal is consistency, visibility, and less operational drag.'
  },
  exit: {
    title: 'Exit Readiness',
    description: 'You are preparing for transfer, sale, succession, or strategic transformation and need a clear readiness review.',
    guidance: 'Get the business into a clearer, more legible state. Review documentation, operations, key dependencies, and value-driving systems before a transition.'
  }
};

const PHASE_FOLDERS = {
  creation: '01-creation',
  operation: '02-operation',
  auditing: '03-auditing',
  scaling: '04-scaling',
  compliance: '05-compliance-catch-up',
  automation: '06-automation-and-systems-upgrade',
  exit: '07-exit-readiness'
};

const REPO_BLOB_BASE = 'https://github.com/bhameed23-oss/dream-to-business-builder/blob/main/framework/business-lifecycle';
const ANALYTICS_KEY = 'dreamToBusinessBuilderAnalytics';
const FEEDBACK_KEY = 'dreamToBusinessBuilderFeedback';
const PROFILE_STORAGE_KEY = 'dreamToBusinessBuilderProfile';

const asNumber = (value, fallback = 3) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const htmlSafe = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  const stringValue = String(value).trim();
  return stringValue || fallback;
};

const normalizeProfile = (profile) => {
  if (!profile || typeof profile !== 'object') return null;

  const currentPhase = PHASES[profile.currentPhase] ? profile.currentPhase : 'operation';
  const normalized = {
    ...profile,
    currentPhase,
    businessName: htmlSafe(profile.businessName, 'Untitled Business'),
    businessType: htmlSafe(profile.businessType, 'service-business'),
    situation: htmlSafe(profile.situation, 'new-business'),
    customerSummary: htmlSafe(profile.customerSummary, 'The business needs a clearer and more reliable customer experience.'),
    primaryRisk: htmlSafe(profile.primaryRisk, 'Unclear operating rhythm'),
    reviewRecommended: Boolean(profile.reviewRecommended),
    riskFlags: Array.isArray(profile.riskFlags) ? profile.riskFlags.filter(Boolean).slice(0, 4) : [],
    actionItems: Array.isArray(profile.actionItems) ? profile.actionItems.filter(Boolean).slice(0, 5) : [],
    healthScore: Number.isFinite(Number(profile.healthScore)) ? Number(profile.healthScore) : 0
  };

  if (normalized.healthScore < 0) normalized.healthScore = 0;
  if (normalized.healthScore > 100) normalized.healthScore = 100;

  return normalized;
};

const readStoredCollection = (key, fallback = []) => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
};

const writeStoredCollection = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    // Ignore localStorage write failures in constrained browsers.
  }
};

const trackEvent = (eventName, payload = {}) => {
  const entries = readStoredCollection(ANALYTICS_KEY, []);
  entries.push({
    eventName,
    payload,
    timestamp: new Date().toISOString()
  });

  if (entries.length > 200) {
    entries.splice(0, entries.length - 200);
  }

  writeStoredCollection(ANALYTICS_KEY, entries);
};

const saveFeedback = (profile, rating, note = '') => {
  const payload = {
    rating,
    note,
    businessName: htmlSafe(profile?.businessName, 'Untitled Business'),
    currentPhase: PHASES[profile?.currentPhase] ? profile.currentPhase : 'operation',
    healthScore: Number.isFinite(Number(profile?.healthScore)) ? Number(profile.healthScore) : 0,
    timestamp: new Date().toISOString()
  };

  const entries = readStoredCollection(FEEDBACK_KEY, []);
  entries.push(payload);
  writeStoredCollection(FEEDBACK_KEY, entries.slice(-100));
  return payload;
};

const getPhaseLinks = (phaseKey) => {
  const folder = PHASE_FOLDERS[phaseKey] || PHASE_FOLDERS.operation;
  const base = `${REPO_BLOB_BASE}/${folder}`;
  return {
    overview: `${base}/README.md`,
    checklist: `${base}/checklist.md`,
    resources: `${base}/resources.md`
  };
};

const getProfileFromForm = (formData) => {
  const clarity = asNumber(formData.clarity, 3);
  const operations = asNumber(formData.operations, 3);
  const riskPosture = asNumber(formData.riskPosture, 3);
  const automation = asNumber(formData.automation, 2);
  const customerExperience = asNumber(formData.customerExperience, 3);
  const growthReadiness = asNumber(formData.growthReadiness, 3);
  const exitReadiness = asNumber(formData.exitReadiness, 3);

  const totalPoints = clarity + operations + riskPosture + automation + customerExperience + growthReadiness + exitReadiness;
  const maxPossiblePoints = 5 * 7;
  const healthScore = Math.min(100, Math.max(0, Math.round((totalPoints / maxPossiblePoints) * 100)));

  const situation = htmlSafe(formData.situation, 'new-business');
  const phase = recommendPhase(situation, clarity, operations, riskPosture, automation, customerExperience, growthReadiness, exitReadiness);
  const riskFlags = generateRiskFlags(phase, formData.mainRisk, formData.painPoints, formData.tools, customerExperience, growthReadiness, exitReadiness);
  const actionItems = generateActionItems(phase, formData.goals, formData.painPoints, formData.tools, customerExperience, growthReadiness, exitReadiness);
  const reviewRecommended = shouldRecommendReview(phase, riskPosture, operations, healthScore, exitReadiness);

  const profile = {
    id: `profile-${Date.now()}`,
    businessName: htmlSafe(formData.businessName, 'Untitled Business'),
    businessType: htmlSafe(formData.businessType, 'service-business'),
    situation,
    currentPhase: phase,
    goals: splitField(formData.goals, ['Clarify direction', 'Improve operations']),
    painPoints: splitField(formData.painPoints, ['Operational inconsistency']),
    mainRisk: htmlSafe(formData.mainRisk, 'Operational instability'),
    customerSummary: htmlSafe(formData.customerSummary, 'The business needs a clearer and more reliable customer experience.'),
    toolSummary: htmlSafe(formData.tools, 'Essential tools are being used, but process consistency is still developing.'),
    healthScore,
    riskFlags,
    actionItems,
    primaryRisk: riskFlags[0] || 'Unclear operating rhythm',
    reviewRecommended,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return normalizeProfile(profile);
};

const splitField = (value, fallback) => {
  if (!value) return Array.isArray(fallback) ? fallback : [];
  const items = String(value)
    .split(/\n|,/) 
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  return items.length ? items : (Array.isArray(fallback) ? fallback : []);
};

const shouldRecommendReview = (phase, riskPosture, operations, healthScore, exitReadiness = 3) => {
  if (phase === 'compliance') return true;
  if (phase === 'exit') return true;
  if (riskPosture <= 2) return true;
  if (operations <= 2 && healthScore < 60) return true;
  if (exitReadiness <= 2 && healthScore < 60) return true;
  return false;
};

const recommendPhase = (situation, clarity, operations, riskPosture, automation, customerExperience = 3, growthReadiness = 3, exitReadiness = 3) => {
  const weighted = {
    creation: 0,
    operation: 0,
    auditing: 0,
    scaling: 0,
    compliance: 0,
    automation: 0,
    exit: 0
  };

  if (situation === 'new-business') weighted.creation += 4;
  if (situation === 'improve-existing') weighted.operation += 3;
  if (situation === 'grow-business') weighted.scaling += 4;
  if (situation === 'fix-risk') weighted.compliance += 3;
  if (situation === 'system-upgrade') weighted.automation += 4;
  if (situation === 'prepare-exit') weighted.exit += 4;

  if (operations <= 2) weighted.operation += 2;
  if (clarity <= 2) weighted.creation += 1;
  if (riskPosture <= 2) weighted.compliance += 2;
  if (riskPosture >= 4 && operations >= 3) weighted.auditing += 2;
  if (automation <= 2 && operations >= 3) weighted.automation += 2;
  if (clarity >= 4 && operations >= 3) weighted.scaling += 2;
  if (growthReadiness >= 4 && operations >= 3) weighted.scaling += 2;
  if (growthReadiness <= 2) weighted.operation += 1;
  if (exitReadiness <= 2) weighted.exit += 2;
  if (customerExperience <= 2) weighted.operation += 1;
  if (customerExperience <= 2 && operations >= 3) weighted.auditing += 1;

  return Object.entries(weighted).sort((a, b) => b[1] - a[1])[0][0];
};

const generateRiskFlags = (phase, mainRisk, painPoints, tools, customerExperience = 3, growthReadiness = 3, exitReadiness = 3) => {
  const flags = [];

  if (mainRisk) flags.push(String(mainRisk).trim());
  if (phase === 'scaling') flags.push('Growth is outpacing internal structure');
  if (phase === 'compliance') flags.push('Legal, privacy, or risk reviews may be behind');
  if (phase === 'automation') flags.push('Manual workflows are creating drag and inconsistency');
  if (phase === 'operation') flags.push('Operating rhythm is not yet stable');
  if (customerExperience <= 2) flags.push('Customers may not feel fully taken care of');
  if (growthReadiness <= 2) flags.push('The business may not be ready to handle more growth yet');
  if (exitReadiness <= 2) flags.push('The business would be hard to sell or hand off today');
  if (painPoints) flags.push(...splitField(painPoints, []).slice(0, 2));
  if (tools) flags.push('Tool stack may need better integration or standardization');

  return [...new Set(flags.map((flag) => String(flag).trim()).filter(Boolean))].slice(0, 4);
};

const generateActionItems = (phase, goals, painPoints, tools, customerExperience = 3, growthReadiness = 3, exitReadiness = 3) => {
  const baseActions = {
    creation: [
      'Clarify the offer and the customer problem.',
      'Create a simple service or delivery process.',
      'Define the first version of a business profile and operating rhythm.'
    ],
    operation: [
      'Document the repeatable operating system.',
      'Improve customer follow-up and service consistency.',
      'Review which tasks create drag or confusion.'
    ],
    auditing: [
      'Review business processes for weak points and bottlenecks.',
      'Assess what is working versus what is fragile.',
      'Create a clear action list before scaling or major changes.'
    ],
    scaling: [
      'Clarify what is essential before growth.',
      'Document ownership and decision-making structure.',
      'Build stronger systems before adding more volume.'
    ],
    compliance: [
      'Review legal, privacy, customer data, and operational risk exposures.',
      'Create a review plan for compliance gaps and sensitive areas.',
      'Bring in professional review where policy or legal exposure is significant.'
    ],
    automation: [
      'Identify repetitive manual work that should be standardized.',
      'Map the biggest workflow bottlenecks.',
      'Automate where it reduces risk and improves consistency.'
    ],
    exit: [
      'Review business value, operation quality, and transfer readiness.',
      'Assess financial, legal, and operational documentation gaps.',
      'Prepare for a strong exit or succession process.'
    ]
  };

  const result = [...(baseActions[phase] || baseActions.operation)];

  const parsedGoals = splitField(goals, []);
  if (parsedGoals.length) {
    result.push(`Prioritize the goal: ${parsedGoals[0]}`);
  }

  const parsedPainPoints = splitField(painPoints, []);
  if (parsedPainPoints.length) {
    result.push(`Address the biggest issue: ${parsedPainPoints[0]}`);
  }

  if (tools) {
    result.push('Review whether the current tool stack is actually supporting the workflow or adding friction.');
  }

  if (customerExperience <= 2) {
    result.push('Improve the customer experience: follow up faster and make the process feel more reliable.');
  }

  if (growthReadiness <= 2) {
    result.push('Shore up the basics (systems, staffing, cash flow) before pushing for more growth.');
  }

  if (exitReadiness <= 2) {
    result.push('Start documenting the business (finances, processes, key contacts) so it would be easier to sell or hand off later.');
  }

  return [...new Set(result.filter(Boolean))].slice(0, 5);
};

const getHealthBand = (score) => {
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Healthy';
  if (score >= 40) return 'Watchlist';
  return 'Critical';
};

const updateScoreRing = (score) => {
  const ring = document.querySelector('.score-ring');
  if (!ring) return;

  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  const level = clamped >= 80 ? 'strong' : clamped >= 60 ? 'healthy' : clamped >= 40 ? 'watch' : 'critical';
  const color = clamped >= 80 ? 'var(--accent)' : clamped >= 60 ? 'var(--moss)' : clamped >= 40 ? 'var(--warning)' : 'var(--danger)';

  ring.style.background = `conic-gradient(${color} 0 ${clamped}%, var(--panel-soft) ${clamped}% 100%)`;
  ring.dataset.level = level;
  ring.innerHTML = `<span class="ring-value">${clamped}</span>`;
};

const renderPhaseText = (phaseKey) => {
  const phase = PHASES[phaseKey] || PHASES.operation;
  return `${phase.title}: ${phase.description}`;
};

const renderPhaseDetail = (phaseKey) => {
  const phase = PHASES[phaseKey] || PHASES.operation;
  return phase.guidance;
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

  reviewBadge.textContent = normalizedProfile.reviewRecommended ? 'Professional review recommended' : 'Review recommended';
  reviewBadge.dataset.level = normalizedProfile.reviewRecommended ? 'critical' : 'watch';

  const nextStepsPanel = document.getElementById('next-steps-panel');
  if (nextStepsPanel) {
    const phaseInfo = PHASES[normalizedProfile.currentPhase] || PHASES.operation;
    const links = getPhaseLinks(normalizedProfile.currentPhase);

    const checklistLink = document.getElementById('next-steps-checklist-link');
    const resourcesLink = document.getElementById('next-steps-resources-link');
    const overviewLink = document.getElementById('next-steps-overview-link');
    const summaryText = document.getElementById('next-steps-summary');

    if (summaryText) {
      summaryText.textContent = `${phaseInfo.title} focus: ${phaseInfo.guidance}`;
    }
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
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalizeProfile(profile)));
  } catch (error) {
    // Ignore localStorage write failures in constrained browsers.
  }
};

const loadProfile = () => {
  const profileString = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!profileString) return null;

  try {
    const parsed = JSON.parse(profileString);
    return normalizeProfile(parsed);
  } catch (error) {
    return null;
  }
};

const humanize = (value) => (value || '').toString().replace(/-/g, ' ');

const buildProfileSummaryText = (profile) => {
  const normalizedProfile = normalizeProfile(profile);
  if (!normalizedProfile) return 'No profile available.';

  const phaseInfo = PHASES[normalizedProfile.currentPhase] || PHASES.operation;
  const links = getPhaseLinks(normalizedProfile.currentPhase);
  const generatedOn = new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const lines = [
    'Dream to Business Builder — Business Profile Summary',
    `Generated: ${generatedOn}`,
    '',
    `Business: ${normalizedProfile.businessName || 'Untitled Business'}`,
    `Type: ${humanize(normalizedProfile.businessType)}`,
    `Situation: ${humanize(normalizedProfile.situation)}`,
    '',
    `Current Phase: ${phaseInfo.title}`,
    `${phaseInfo.description}`,
    '',
    `Business Health Score: ${normalizedProfile.healthScore}/100 (${getHealthBand(normalizedProfile.healthScore)})`,
    `Primary Risk: ${normalizedProfile.primaryRisk}`,
    `Professional Review: ${normalizedProfile.reviewRecommended ? 'Recommended' : 'Not urgently needed right now'}`,
    ''
  ];

  lines.push('Top Risks:');
  (normalizedProfile.riskFlags || []).forEach((item) => lines.push(`  - ${item}`));
  lines.push('');

  lines.push('Recommended Next Actions:');
  (normalizedProfile.actionItems || []).forEach((item) => lines.push(`  - ${item}`));
  lines.push('');

  lines.push('Continue working on this phase:');
  lines.push(`  Checklist:  ${links.checklist}`);
  lines.push(`  Resources:  ${links.resources}`);
  lines.push(`  Full guide: ${links.overview}`);
  lines.push('');
  lines.push('This summary is a starting point for planning, not professional legal,');
  lines.push('financial, or compliance advice.');

  return lines.join('\n');
};

const downloadProfileSummary = (profile) => {
  const normalizedProfile = normalizeProfile(profile);
  if (!normalizedProfile) return;

  const text = buildProfileSummaryText(normalizedProfile);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const safeName = (normalizedProfile.businessName || 'business')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const dateStamp = new Date().toISOString().slice(0, 10);

  const link = document.createElement('a');
  link.href = url;
  link.download = `profile-${safeName}-${dateStamp}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
  trackEvent('profile_summary_downloaded', {
    businessName: normalizedProfile.businessName,
    currentPhase: normalizedProfile.currentPhase,
    healthScore: normalizedProfile.healthScore
  });
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = Object.fromEntries(new FormData(form).entries());

  const required = ['businessType', 'situation'];
  const missing = required.filter((key) => !formData[key]);
  if (missing.length) {
    const firstMissing = missing[0];
    const field = form.querySelector(`[name="${firstMissing}"]`);
    field?.focus();
    return;
  }

  const profile = getProfileFromForm(formData);
  saveProfile(profile);
  renderProfile(profile);
  trackEvent('profile_created', {
    currentPhase: profile.currentPhase,
    healthScore: profile.healthScore,
    businessName: profile.businessName,
    situation: profile.situation
  });
};

const bindRangeValues = () => {
  const controls = [
    { id: 'clarity', label: 'clarity-value' },
    { id: 'operations', label: 'operations-value' },
    { id: 'riskPosture', label: 'riskPosture-value' },
    { id: 'automation', label: 'automation-value' },
    { id: 'customerExperience', label: 'customerExperience-value' },
    { id: 'growthReadiness', label: 'growthReadiness-value' },
    { id: 'exitReadiness', label: 'exitReadiness-value' }
  ];

  for (const control of controls) {
    const input = document.getElementById(control.id);
    const output = document.getElementById(control.label);
    if (input && output) {
      const sync = () => {
        output.textContent = `${input.value} / 5`;
      };
      input.addEventListener('input', sync);
      sync();
    }
  }
};

const bindFeedbackWidget = () => {
  const panel = document.getElementById('feedback-panel');
  if (!panel) return;

  const voteButtons = panel.querySelectorAll('.feedback-btn');
  const noteField = document.getElementById('feedback-note');
  const submitButton = document.getElementById('submit-feedback-btn');
  const status = document.getElementById('feedback-status');

  let selectedRating = '';

  voteButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectedRating = button.dataset.rating;
      voteButtons.forEach((btn) => btn.classList.toggle('selected', btn === button));
    });
  });

  submitButton?.addEventListener('click', () => {
    const profile = loadProfile();
    if (!profile) {
      status.textContent = 'Submit a profile first so we have a result to rate.';
      status.classList.remove('hidden');
      return;
    }

    if (!selectedRating) {
      status.textContent = 'Please choose a rating first.';
      status.classList.remove('hidden');
      return;
    }

    const note = noteField?.value || '';
    saveFeedback(profile, selectedRating, note);
    status.textContent = 'Thanks — your feedback was saved locally.';
    status.classList.remove('hidden');
    trackEvent('feedback_submitted', {
      rating: selectedRating,
      phase: profile.currentPhase,
      healthScore: profile.healthScore
    });
  });
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
}
