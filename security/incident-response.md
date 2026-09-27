# Incident Response

This module helps users plan what to do if their business systems are compromised, misused, or disrupted.

## Core response steps

1. Contain the issue
2. Identify what happened
3. Protect customer and business data
4. Notify the right people
5. Document what is occurring
6. Review what needs to be fixed
7. Notify any affected customers or regulators if required
8. Review and improve

## What to do quickly

- disable compromised accounts
- rotate passwords and credentials
- review access logs
- backup the system if needed
- isolate compromised tools
- contact a professional if data loss or payment compromise happened
- notify legal counsel if necessary

**A real-world detail worth planning for in advance:** the fastest possible way to cut someone off is when their access depends on exactly one thing you can find and remove — a single shared secret, key, or account entry — rather than being scattered across several systems you'd have to hunt through under pressure. If you're building or buying software, ask whoever built it: "if I needed to cut off one person's access right now, what's the one thing I'd go delete or change?" If nobody has a clear answer, that's a gap to close before an incident, not during one. See [security/lessons-from-real-projects.md](./lessons-from-real-projects.md) for a real example of this pattern.

## What to avoid

- ignoring a security issue and hoping it disappears
- storing data without any backup plan
- assuming one warning is enough
- telling customers too little too late

## When to call a lawyer

If sensitive customer data or regulated data has been exposed, or if there is a risk of legal claims or contractual issues, the user should get legal advice.

## Related docs

- [security/security-training.md](./security/security-training.md)
- [security/compliance-checklist.md](./security/compliance-checklist.md)
- [legal/README.md](./legal/README.md)
