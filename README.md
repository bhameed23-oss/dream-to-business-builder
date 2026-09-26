# Dream to Business Builder MVP

This project is a working MVP for a business lifecycle review app that helps founders and small business owners understand their current business phase, surface major risks, and identify the next most important actions.

## Project purpose

The app helps a user:
- choose their business situation
- answer a short intake
- generate a business profile
- determine their current lifecycle phase
- view a business health score
- review key risks and next actions
- return later to update the same profile

## Current status

The core MVP is implemented in the browser with:
- homepage and hero section
- onboarding questionnaire
- business profile generation logic
- phase recommendation engine
- health score and risk summary
- action items based on business state
- persistence using localStorage

## MVP structure

```text
/
├── app/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── README.md
├── product/
│   ├── mvp-product-spec.md
│   ├── mvp-implementation-plan.md
│   ├── business-profile-schema.md
│   ├── app-structure.md
│   └── onboarding-questions.md
├── website/
│   ├── homepage-wireframe.md
│   ├── landing-page-blueprint.md
│   └── final-product-narrative.md
└── framework/
    └── final-lifecycle-experience-summary.md
```

## How to run

Open `app/index.html` in a browser, or serve the folder with a simple local web server.

Example:

```bash
cd dream-to-business-builder
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/app/
```

## MVP value proposition

The product gives people a practical way to answer a simple question:

What phase is my business in right now, what is the main risk, and what should I do next?

This is the foundation for a broader lifecycle system that can later grow into deeper guidance, more advanced scoring, and workflow integration.

## Future roadmap

Planned next steps:
- improve UI polish and product copy
- add stronger phase detail screens
- add more realistic lifecycle logic and scoring
- support editing and resetting the saved profile
- add sample business profiles
- add deeper privacy, compliance, and automation modules

## Notes

This is an MVP and should be treated as a product foundation rather than a final production app.
