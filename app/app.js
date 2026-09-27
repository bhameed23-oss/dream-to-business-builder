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

// ---------------------------------------------------------------------------
// NEXT STEPS / BUSINESS PACK LINKING
// ---------------------------------------------------------------------------
// Every phase key above (creation, operation, auditing, etc.) has a matching
// folder inside /framework/business-lifecycle/ in this same GitHub repo.
// Each of those folders holds three files:
//   - README.md      -> the "why this phase matters" explanation
//   - checklist.md    -> a step-by-step, actionable to-do list for the phase
//   - resources.md    -> real, free external resources (SBA, SCORE, FTC, etc.)
//
// This section builds the links from a phase key to those three files so the
// dashboard can show the user exactly where to go next, instead of just
// telling them the phase name and leaving them to figure out the rest.
// ---------------------------------------------------------------------------

// Maps each internal phase key to its folder name on GitHub.
const PHASE_FOLDERS = {
  creation: '01-creation',
  operation: '02-operation',
  auditing: '03-auditing',
  scaling: '04-scaling',
  compliance: '05-compliance-catch-up',
  automation: '06-automation-and-systems-upgrade',
  exit: '07-exit-readiness'
};

// Base URL for viewing files in this repo on GitHub (renders Markdown nicely,
// unlike a raw.githubusercontent.com link which shows plain text).
const REPO_BLOB_BASE = 'https://github.com/bhameed23-oss/dream-to-business-builder/blob/main/framework/business-lifecycle';

// Given a phase key (e.g. "operation"), returns an object with direct links
// to that phase's overview, checklist, and resources page.
// If the phase key is unknown, this falls back to the "operation" phase so
// the dashboard never ends up with a broken/empty link.
const getPhaseLinks = (phaseKey) => {
  const folder = PHASE_FOLDERS[phaseKey] || PHASE_FOLDERS.operation;
  const base = `${REPO_BLOB_BASE}/${folder}`;
  return {
    overview: `${base}/README.md`,
    checklist: `${base}/checklist.md`,
    resources: `${base}/resources.md`
  };
};

// ---------------------------------------------------------------------------
// HEALTH SCORE — how it's calculated (plain-language explanation)
// ---------------------------------------------------------------------------
// The form asks 7 simple questions, each answered on a 1-to-5 slider:
//   1. clarity              - how clear is your business direction?
//   2. operations           - how stable are your day-to-day operations?
//   3. riskPosture          - how strong is your risk/compliance posture?
//   4. automation           - how mature are your systems/automation?
//   5. customerExperience   - how well are you treating your customers?
//   6. growthReadiness      - how ready are you to get bigger?
//   7. exitReadiness        - how easy would it be to sell or hand off today?
//
// To keep the math easy to explain to anyone (no advanced weighting formula
// to justify), the health score is simply the average of all 7 answers,
// turned into a score out of 100. Every question counts the same amount.
// Example: if someone answers "3" on every question, that's 21 out of a
// possible 35 points, which becomes 60 out of 100.
// ---------------------------------------------------------------------------
const getProfileFromForm = (formData) => {
  const clarity = Number(formData.clarity || 3);
  const operations = Number(formData.operations || 3);
  const riskPosture = Number(formData.riskPosture || 3);
  const automation = Number(formData.automation || 2);
  const customerExperience = Number(formData.customerExperience || 3);
  const growthReadiness = Number(formData.growthReadiness || 3);
  const exitReadiness = Number(formData.exitReadiness || 3);

  const totalPoints = clarity + operations + riskPosture + automation + customerExperience + growthReadiness + exitReadiness;
  const maxPossiblePoints = 5 * 7; // 7 questions, each worth up to 5 points
  const healthScore = Math.min(100, Math.max(0, Math.round((totalPoints / maxPossiblePoints) * 100)));

  const situation = formData.situation || 'new-business';
  const phase = recommendPhase(situation, clarity, operations, riskPosture, automation, customerExperience, growthReadiness, exitReadiness);
  const riskFlags = generateRiskFlags(phase, formData.mainRisk, formData.painPoints, formData.tools, customerExperience, growthReadiness, exitReadiness);
  const actionItems = generateActionItems(phase, formData.goals, formData.painPoints, formData.tools, customerExperience, growthReadiness, exitReadiness);
  const reviewRecommended = shouldRecommendReview(phase, riskPosture, operations, healthScore, exitReadiness);

  const profile = {
    id: `profile-${Date.now()}`,
    businessName: formData.businessName || 'Untitled Business',
    businessType: formData.businessType || 'service-business',
    situation,
    currentPhase: phase,
    goals: splitField(formData.goals, ['Clarify direction', 'Improve operations']),
    painPoints: splitField(formData.painPoints, ['Operational inconsistency']),
    mainRisk: formData.mainRisk || 'Operational instability',
    customerSummary: formData.customerSummary || 'The business needs a clearer and more reliable customer experience.',
    toolSummary: formData.tools || 'Essential tools are being used, but process consistency is still developing.',
    healthScore,
    riskFlags,
    actionItems,
    primaryRisk: riskFlags[0] || 'Unclear operating rhythm',
    reviewRecommended,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return profile;
};

const splitField = (value, fallback) => {
  if (!value) return fallback;
  return value
    .split(/\n|,/) 
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4) || fallback;
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

  // A business that says it's ready to get bigger (growthReadiness) leans
  // toward the Scaling phase; one that isn't ready yet points back to
  // Operation or Auditing so the basics get shored up first.
  if (growthReadiness >= 4 && operations >= 3) weighted.scaling += 2;
  if (growthReadiness <= 2) weighted.operation += 1;

  // A low "how easy would it be to sell/hand off today" answer is a strong
  // signal toward Exit Readiness work, even outside the "preparing to exit"
  // situation, because exit-readiness gaps are worth surfacing early.
  if (exitReadiness <= 2) weighted.exit += 2;

  // Poor customer experience points toward tightening day-to-day operations
  // or doing a fuller audit, since customer problems are usually a symptom
  // of an operational gap.
  if (customerExperience <= 2) weighted.operation += 1;
  if (customerExperience <= 2 && operations >= 3) weighted.auditing += 1;

  const phase = Object.entries(weighted).sort((a, b) => b[1] - a[1])[0][0];
  return phase;
};

const generateRiskFlags = (phase, mainRisk, painPoints, tools, customerExperience = 3, growthReadiness = 3, exitReadiness = 3) => {
  const flags = [];

  if (mainRisk) flags.push(mainRisk);
  if (phase === 'scaling') flags.push('Growth is outpacing internal structure');
  if (phase === 'compliance') flags.push('Legal, privacy, or risk reviews may be behind');
  if (phase === 'automation') flags.push('Manual workflows are creating drag and inconsistency');
  if (phase === 'operation') flags.push('Operating rhythm is not yet stable');
  if (customerExperience <= 2) flags.push('Customers may not feel fully taken care of');
  if (growthReadiness <= 2) flags.push('The business may not be ready to handle more growth yet');
  if (exitReadiness <= 2) flags.push('The business would be hard to sell or hand off today');
  if (painPoints) flags.push(...splitField(painPoints, []).slice(0, 2));
  if (tools) flags.push('Tool stack may need better integration or standardization');

  return [...new Set(flags)].slice(0, 4);
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

  const result = [...baseActions[phase] || baseActions.operation];

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

  return [...new Set(result)].slice(0, 5);
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

  const clamped = Math.max(0, Math.min(100, score));
  const level = clamped >= 80 ? 'strong' : clamped >= 60 ? 'healthy' : clamped >= 40 ? 'watch' : 'critical';
  const color = clamped >= 80 ? 'var(--accent)' : clamped >= 60 ? '#3b82f6' : clamped >= 40 ? 'var(--warning)' : 'var(--danger)';

  ring.style.background = `conic-gradient(${color} 0 ${clamped}%, var(--panel-soft) ${clamped}% 100%)`;
  ring.dataset.level = level;
  ring.innerHTML = `<span class="ring-value">${clamped}</span>`;
};

const renderPhaseText = (phaseKey) => {
  const phase = PHASES[phaseKey] || PHASES.operation;
  return phase.title + ': ' + phase.description;
};

const renderPhaseDetail = (phaseKey) => {
  const phase = PHASES[phaseKey] || PHASES.operation;
  return phase.guidance;
};

const renderProfile = (profile) => {
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

  phaseTitle.textContent = PHASES[profile.currentPhase]?.title || 'Business phase';
  const scoreValue = Number(profile.healthScore || 0);
  healthScore.textContent = `${scoreValue}/100`;
  primaryRisk.textContent = profile.primaryRisk;
  recommendation.textContent = renderPhaseText(profile.currentPhase);
  phaseDetail.textContent = renderPhaseDetail(profile.currentPhase);

  if (healthStatus) {
    healthStatus.textContent = getHealthBand(scoreValue);
    healthStatus.dataset.level = scoreValue >= 80 ? 'strong' : scoreValue >= 60 ? 'healthy' : scoreValue >= 40 ? 'watch' : 'critical';
  }

  updateScoreRing(scoreValue);

  const summary = [
    `${profile.businessName} is a ${profile.businessType.replace('-', ' ')} business.`,
    `Current focus: ${profile.situation.replace('-', ' ')}.`,
    `Customer expectation: ${profile.customerSummary}`
  ].join(' ');

  profileSummary.textContent = summary;
  riskFlags.innerHTML = profile.riskFlags.map((item) => `<li>${item}</li>`).join('');
  actionItems.innerHTML = profile.actionItems.map((item) => `<li>${item}</li>`).join('');

  reviewBadge.textContent = profile.reviewRecommended ? 'Professional review recommended' : 'Review recommended';
  reviewBadge.dataset.level = profile.reviewRecommended ? 'critical' : 'watch';

  // --- Next Steps panel -----------------------------------------------
  // This is the part that turns a phase NAME into something the user can
  // actually act on. It points to the real checklist and resources file
  // for whatever phase they landed in, instead of leaving them to guess
  // what to do with the recommendation.
  const nextStepsPanel = document.getElementById('next-steps-panel');
  if (nextStepsPanel) {
    const phaseInfo = PHASES[profile.currentPhase] || PHASES.operation;
    const links = getPhaseLinks(profile.currentPhase);

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

  dashboard.classList.remove('hidden');
  document.getElementById('intake').classList.add('hidden');
};

const saveProfile = (profile) => {
  localStorage.setItem('dreamToBusinessBuilderProfile', JSON.stringify(profile));
};

const loadProfile = () => {
  const profileString = localStorage.getItem('dreamToBusinessBuilderProfile');
  if (!profileString) return null;

  try {
    const parsed = JSON.parse(profileString);
    return parsed;
  } catch (error) {
    return null;
  }
};

// ---------------------------------------------------------------------------
// DOWNLOAD SUMMARY (the "exportable summary" feature)
// ---------------------------------------------------------------------------
// Turns a saved profile object into a plain-text report the user can save,
// print, or send to someone else (an advisor, a business partner, an
// accountant). Everything here runs in the browser — no server, no data
// leaves the user's machine.
// ---------------------------------------------------------------------------

// Formats a value like "new-business" into "new business" for readability.
const humanize = (value) => (value || '').toString().replace(/-/g, ' ');

// Builds the full text report from a saved profile. Kept as its own function
// (separate from the click handler below) so it's easy to test or reuse.
const buildProfileSummaryText = (profile) => {
  const phaseInfo = PHASES[profile.currentPhase] || PHASES.operation;
  const links = getPhaseLinks(profile.currentPhase);
  const generatedOn = new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const lines = [
    'Dream to Business Builder — Business Profile Summary',
    `Generated: ${generatedOn}`,
    '',
    `Business: ${profile.businessName || 'Untitled Business'}`,
    `Type: ${humanize(profile.businessType)}`,
    `Situation: ${humanize(profile.situation)}`,
    '',
    `Current Phase: ${phaseInfo.title}`,
    `${phaseInfo.description}`,
    '',
    `Business Health Score: ${profile.healthScore}/100 (${getHealthBand(profile.healthScore)})`,
    `Primary Risk: ${profile.primaryRisk}`,
    `Professional Review: ${profile.reviewRecommended ? 'Recommended' : 'Not urgently needed right now'}`,
    ''
  ];

  lines.push('Top Risks:');
  (profile.riskFlags || []).forEach((item) => lines.push(`  - ${item}`));
  lines.push('');

  lines.push('Recommended Next Actions:');
  (profile.actionItems || []).forEach((item) => lines.push(`  - ${item}`));
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

// Triggers an actual file download in the browser. Uses a Blob + temporary
// <a> tag, which is the standard way to save a generated file client-side
// without needing a server to produce it.
const downloadProfileSummary = (profile) => {
  const text = buildProfileSummaryText(profile);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const safeName = (profile.businessName || 'business')
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

  // Free the memory the browser set aside for the download link.
  URL.revokeObjectURL(url);
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = Object.fromEntries(new FormData(form).entries());
  const profile = getProfileFromForm(formData);

  saveProfile(profile);
  renderProfile(profile);
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

const bindActions = () => {
  document.getElementById('start-review-btn')?.addEventListener('click', () => {
    document.getElementById('intake').classList.remove('hidden');
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('hero-start-btn')?.addEventListener('click', () => {
    document.getElementById('intake').classList.remove('hidden');
    document.getElementById('intake').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('learn-more-btn')?.addEventListener('click', () => {
    document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('cancel-form-btn')?.addEventListener('click', () => {
    document.getElementById('intake').classList.add('hidden');
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('intake').classList.remove('hidden');
    document.getElementById('intake').scrollIntoView({ behavior: 'smooth' });
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
  updateScoreRing(72);

  const savedProfile = loadProfile();
  if (savedProfile) {
    renderProfile(savedProfile);
  }
};

initialize();
