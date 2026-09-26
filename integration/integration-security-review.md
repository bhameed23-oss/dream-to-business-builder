# Integration Security Review

This file is meant to help users assess the risk of connecting business tools together.

## Questions to review

- What tools are being connected?
- What data will flow between them?
- Is the data sensitive or personal?
- Is access limited to the minimum needed?
- Are credentials stored securely?
- Are audit logs available?
- Are there approval and review points in place?

## Red flags

- connecting all tools with broad access
- sending customer data to tools without review
- using no logging or no rollback plan
- trusting automation to act without human approval in sensitive cases

## Review principle

If it touches customer data, regulated information, payments, or critical operations, it needs more deliberate review.
