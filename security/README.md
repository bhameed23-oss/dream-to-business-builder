# Security and Compliance Overview

This section exists because users are likely to build systems that involve customer information, payments, service records, or regulated activity.

## Why this matters

A person can build something exciting and useful without understanding the risks of:
- collecting personal information
- sending emails or texts to customers
- accepting payments
- storing documents and files
- protecting schedules or appointments
- handling legal or regulated information

## Project position

This project is designed to encourage safety and clarity.

It should not tell people to ignore risk. It should inform them clearly and guide them toward the right professional help when needed.

## Security-first requirements

The framework should require the following before launch for sensitive systems:

- HTTPS only
- strong authentication
- least privilege access
- data minimization
- secure backups
- review of payment, privacy, and customer data needs
- incident response planning
- clear human review for legal or regulated processes

## Compliance review approach

We recommend a structured review path:

1. identify the data involved
2. identify the industry or regulatory context
3. identify the possible risk
4. show what the person has done already
5. show what is missing
6. provide a reviewer-friendly checklist
7. recommend a lawyer, compliance reviewer, or specialist where needed

## Core modules

- security-training.md
- lessons-from-real-projects.md — concrete, plain-language security patterns pulled from an actual, previously-audited project in this account's portfolio, not just theory
- technical-pitfall-checklist.md — a checklist for anyone getting custom software built (a website login, an app, an internal tool), especially AI-assisted builds
- data-protection.md
- compliance-checklist.md
- incident-response.md
- legal-review-trigger.md
- access-control.md
- secure-website-setup.md
- third-party-tool-vetting.md
- industry-specific-guidance

## Important warning

This repository is not a substitute for legal advice, security review, or regulated compliance review.

It is designed to help make the process easier, more organized, and safer.

## Recommended design pattern

The system should include openable gates before launch for major risk categories.

Example gate language:

> Important: This workflow may involve customer or business data. Please review the security and compliance guidance before continuing. You should not proceed unless you understand the data handling, risk, and professional-review needs.

Then:
- first acknowledgment
- second acknowledgment
- optional professional review escalation

## Read next

- [security/README.md](./security/README.md)
- [security/security-training.md](./security/security-training.md)
- [security/lessons-from-real-projects.md](./security/lessons-from-real-projects.md)
- [security/technical-pitfall-checklist.md](./security/technical-pitfall-checklist.md)
- [security/compliance-checklist.md](./security/compliance-checklist.md)
- [security/incident-response.md](./security/incident-response.md)
