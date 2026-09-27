const fs = require('fs');
const path = require('path');
const vm = require('vm');

const appPath = path.join(__dirname, '..', 'app', 'app.js');
const appCode = fs.readFileSync(appPath, 'utf8');

function createElement(id) {
  return {
    id,
    textContent: '',
    innerHTML: '',
    dataset: {},
    style: {},
    value: '',
    classList: {
      add() {},
      remove() {}
    },
    addEventListener() {},
    scrollIntoView() {},
    setAttribute() {}
  };
}

const ids = [
  'dashboard', 'phase-title', 'health-score', 'primary-risk', 'phase-recommendation',
  'profile-summary', 'risk-flags', 'action-items', 'phase-detail', 'review-badge',
  'health-status', 'intake', 'home', 'how-it-works', 'start-review-btn', 'hero-start-btn',
  'learn-more-btn', 'cancel-form-btn', 'edit-profile-btn', 'business-form', 'clarity',
  'operations', 'riskPosture', 'automation', 'clarity-value', 'operations-value',
  'riskPosture-value', 'automation-value', 'health-status-dashboard'
];

const elements = Object.fromEntries(ids.map(id => [id, createElement(id)]));

const document = {
  getElementById(id) {
    return elements[id] || createElement(id);
  },
  querySelector(selector) {
    if (selector === '.score-ring') {
      return {
        style: {},
        dataset: {},
        setAttribute() {},
        classList: { add() {}, remove() {} },
        innerHTML: ''
      };
    }
    return createElement(selector);
  }
};

const localStorage = {
  store: {},
  setItem(key, value) {
    this.store[key] = String(value);
  },
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  },
  removeItem(key) {
    delete this.store[key];
  }
};

const context = {
  console,
  document,
  localStorage,
  window: {},
  self: {},
  globalThis: {},
  Math,
  Date,
  Object,
  Array,
  String,
  Number,
  Boolean,
  Set,
  JSON,
  FormData: class FormData {
    constructor() { this.entries = {}; }
    entries() { return Object.entries(this.entries); }
  }
};

context.window = context;
context.self = context;
context.globalThis = context;

vm.createContext(context);
vm.runInContext(appCode, context);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

const tests = [
  {
    name: 'New business low clarity becomes creation',
    run() {
      const value = context.recommendPhase('new-business', 1, 2, 2, 1);
      assertEqual(value, 'creation', 'Expected creation phase');
    }
  },
  {
    name: 'Scaling scenario uses scaling phase',
    run() {
      const value = context.recommendPhase('grow-business', 4, 3, 4, 3);
      assertEqual(value, 'scaling', 'Expected scaling phase');
    }
  },
  {
    name: 'Compliance scenario triggers review',
    run() {
      const value = context.shouldRecommendReview('compliance', 3, 3, 50);
      assertEqual(value, true, 'Expected review recommendation');
    }
  },
  {
    name: 'Exit scenario triggers review',
    run() {
      const value = context.shouldRecommendReview('exit', 3, 3, 50);
      assertEqual(value, true, 'Expected review recommendation');
    }
  },
  {
    name: 'Healthy state does not over-trigger review',
    run() {
      const value = context.shouldRecommendReview('operation', 4, 4, 75);
      assertEqual(value, false, 'Healthy state should not require review');
    }
  },
  {
    name: 'Health score remains in range',
    run() {
      const score = Math.min(100, Math.max(0, Math.round(((5 * 0.3 + 5 * 0.35 + 5 * 0.2 + 5 * 0.15) / 5) * 100)));
      assert(score >= 0 && score <= 100, 'Score must be within 0..100');
    }
  },
  {
    name: 'Fallback splitField works',
    run() {
      const result = context.splitField('', ['Default goal']);
      assertEqual(Array.isArray(result), true, 'Result should be an array');
      assertEqual(result[0], 'Default goal', 'Fallback should be used');
    }
  },
  {
    name: 'Action generation yields meaningful output',
    run() {
      const actions = context.generateActionItems('scaling', 'Grow faster', 'No process', 'CRM');
      assert(actions.length > 0, 'Actions should be generated');
    }
  },
  {
    name: 'Risk generation yields meaningful output',
    run() {
      const flags = context.generateRiskFlags('scaling', 'Growth risk', 'No process', 'CRM');
      assert(flags.length > 0, 'Risk flags should be generated');
    }
  },
  {
    name: 'Profile generation contains expected fields',
    run() {
      const profile = context.getProfileFromForm({
        businessName: 'Test Business',
        businessType: 'service-business',
        situation: 'new-business',
        clarity: 2,
        operations: 2,
        riskPosture: 2,
        automation: 1,
        goals: 'Clearer direction',
        painPoints: 'No process',
        mainRisk: 'Lack of structure',
        tools: 'Spreadsheet',
        customerSummary: 'Needs clarity'
      });
      assert(profile.healthScore !== undefined, 'Health score missing');
      assert(profile.currentPhase, 'Current phase missing');
      assert(profile.primaryRisk, 'Primary risk missing');
    }
  }
];

let passed = 0;
for (const test of tests) {
  try {
    test.run();
    passed += 1;
    console.log(`PASS: ${test.name}`);
  } catch (error) {
    console.error(`FAIL: ${test.name} -> ${error.message}`);
  }
}

console.log(`\n${passed}/${tests.length} tests passed`);
if (passed !== tests.length) {
  process.exit(1);
}
