# Business Profile Schema

This file defines the business profile structure for the MVP.

## Example schema

```json
{
  "id": "bp_001",
  "createdAt": "2026-09-26T00:00:00Z",
  "updatedAt": "2026-09-26T00:00:00Z",
  "businessName": "Example Studio",
  "businessType": "service-business",
  "situation": "improve-existing-business",
  "currentPhase": "operation",
  "goals": [
    "improve operations",
    "reduce bottlenecks",
    "improve customer experience"
  ],
  "painPoints": [
    "manual scheduling",
    "inconsistent follow-up",
    "unclear process ownership"
  ],
  "mainRisk": "operational inconsistency",
  "customerSummary": "Small business customers need consistent follow-up and clear service delivery.",
  "toolSummary": "CRM, email platform, invoicing software, scheduling tool",
  "healthScore": 62,
  "riskFlags": [
    "process inconsistency",
    "manual follow-up"
  ],
  "actionItems": [
    "document the service flow",
    "automate follow-up steps",
    "review onboarding process"
  ],
  "nextReviewDate": "2026-10-26"
}
```

## Field definitions

### Core fields
- id: unique identifier
- createdAt: first created timestamp
- updatedAt: last update timestamp
- businessName: optional user-entered name
- businessType: category of business
- situation: user-selected starting context

### Lifecycle fields
- currentPhase: inferred or user-selected phase
- goals: top goals for the next period
- painPoints: current difficulties
- mainRisk: biggest current risk

### Operational fields
- customerSummary: what customers need and what the business provides
- toolSummary: current stack and tools in use
- healthScore: overall maturity indicator

### Action fields
- riskFlags: specific issues to pay attention to
- actionItems: recommended tasks
- nextReviewDate: suggested next review or check-in

## Why this matters

This schema is intentionally simple and practical. It gives the product enough structure for real guidance without becoming too complex for MVP use.
