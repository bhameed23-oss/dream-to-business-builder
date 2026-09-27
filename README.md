# Dream to Business Builder

A practical business lifecycle review tool for founders and small business owners. It helps users identify their current business phase, understand their biggest risks, and get a clear action plan.

## What it does

The app helps a user:
- determine their current lifecycle phase
- review a health score
- identify the primary business risk
- understand which actions matter most next
- decide when to bring in professional review
- save and revisit their business profile

## Categories in the tool

The app evaluates the business across these lifecycle phases:
- Creation
- Operation
- Auditing
- Scaling
- Compliance Catch-Up
- Automation & Systems Upgrade
- Exit Readiness

## Quick start

Open the app locally with a static server:

```bash
cd dream-to-business-builder
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## App structure

```text
/
├── app/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── .github/
│   └── workflows/
│       └── deploy.yml
├── tests/
│   └── test.js
├── README.md
├── TEST_PLAN.md
├── index.html
└── LICENSE
```

## How the recommendation logic works

The phase recommendation uses:
- the selected business situation
- clarity of direction
- operational stability
- risk posture
- automation maturity
- growth or transition signals

The health score is derived from these factors and is used to determine the recommended focus and review needs.

## Quality assurance

The project includes a lightweight test harness to validate:
- phase recommendation logic
- health score ranges
- review recommendation rules
- realistic edge cases and fallback behavior

See [TEST_PLAN.md](TEST_PLAN.md) for the full QA checklist.

## Deployment

The repository contains a GitHub Pages workflow for static deployment.

- workflow: `.github/workflows/deploy.yml`
- static root entry: `index.html`

Push to `main` and GitHub Pages will publish the app.

## Notes

This MVP is designed to be useful, practical, and easy to evaluate before expanding into more advanced workflow or market-specific features.
