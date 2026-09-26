# MVP Implementation Plan

This file defines the concrete implementation plan for the first version of the product.

## Product objective

Build a simple, guided web app that helps a user:
- choose their business situation
- answer a short intake
- generate a business profile
- see the business lifecycle phase and current health
- review the next most important actions
- return later and continue from the same profile

## MVP scope

### Phase 1: Onboarding
- landing page
- start flow
- intake form
- saved session state

### Phase 2: Business profile
- create business profile
- store profile in local app state or simple persisted storage
- update business summary on revisit

### Phase 3: Lifecycle recommendation
- map answers to lifecycle phase
- assign business health score
- identify risk flags
- generate priority actions

### Phase 4: Dashboard
- current phase banner
- health score card
- risk summary
- next actions list
- tool overview

### Phase 5: Phase detail view
- summary of phase
- recommended actions
- review reminders
- clear output for the user

### Phase 6: Save and continue
- profile persistence
- ability to edit and refresh the profile later
- continue from previous state

## Data model

Each business profile should include:
- id
- createdAt
- updatedAt
- businessName
- businessType
- situation
- currentPhase
- goals
- painPoints
- mainRisk
- customerSummary
- toolSummary
- healthScore
- riskFlags
- actionItems
- nextReviewDate

## Recommended logic

### Health score logic
A simple score is enough for MVP:
- business clarity
- operational health
- customer clarity
- risk posture
- growth readiness
- automation maturity

Score each category from 1-5 and average them.

### Phase recommendation logic
Use a rule-based approach for the MVP:
- if high risk or high compliance gap => compliance catch-up or auditing
- if growth is the main goal => scaling
- if workflow friction is dominant => automation and systems upgrade
- if business is newly forming => creation
- if business is mature but not strategic => operation
- if exit is the plan => exit readiness

### Action ranking logic
Sort by:
1. business risk
2. time sensitivity
3. clarity impact
4. operational drag
5. opportunity for scale

## MVP implementation stack

The MVP can be built with a lightweight stack such as:
- frontend: React or simple HTML + JS
- data storage: localStorage or a small JSON-backed local store
- styling: simple CSS or a lightweight design system

Use the simplest stack that still makes the product feel polished and understandable.

## Launch definition

The MVP is ready when a user can do all of the following without confusion:
- start a review
- answer the intake questions
- get a recommended lifecycle phase
- view a dashboard with health and risk indicators
- see a clear next step list
- return and continue later with the same business profile

## Next work items

1. Create the basic app frontend shell
2. Build the intake form
3. Add business profile state management
4. Implement lifecycle recommendation logic
5. Build dashboard cards
6. Build phase detail screen
7. Add persistence
8. Validate the flow with sample business profiles

## Success measure

The MVP succeeds when it reliably helps a user understand:
- where they are
- what the main business issue is
- what the best next move is
- whether the business should pause for review
