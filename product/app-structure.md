# App Structure for the MVP

This file defines the recommended app folder structure and responsibilities.

## Suggested structure

```text
/
├── app/
│   ├── components/
│   │   ├── Header
│   │   ├── Hero
│   │   ├── IntakeForm
│   │   ├── BusinessProfileSummary
│   │   ├── Dashboard
│   │   ├── PhaseDetail
│   │   └── RiskCard
│   ├── data/
│   │   ├── lifecyclePhases.js
│   │   ├── onboardingQuestions.js
│   │   └── exampleProfiles.js
│   ├── logic/
│   │   ├── recommendPhase.js
│   │   ├── calculateHealthScore.js
│   │   ├── generateActionItems.js
│   │   └── storage.js
│   ├── pages/
│   │   ├── HomePage
│   │   ├── IntakePage
│   │   ├── ProfilePage
│   │   ├── DashboardPage
│   │   └── PhaseDetailPage
│   └── App.js
├── public/
│   └── assets/
├── package.json
├── README.md
└── styles/
    └── main.css
```

## Responsibility map

### components
UI elements for the app experience.

### data
static phase data and question sets.

### logic
all scoring, recommendation, and persistence logic.

### pages
top-level screens for the MVP flow.

## Why this matters

A clean structure keeps the MVP manageable while making it easier to iterate once the real user experience is validated.
