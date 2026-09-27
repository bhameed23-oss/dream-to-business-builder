# Dental Office — Tools and Integrations

Real tools, roughly ordered from simpler/lower-cost to full-featured practice management platforms. Because this industry involves protected health information (PHI), tool choice here has real compliance implications — see compliance-guidance.md before adopting anything that stores or transmits patient data.

## Practice management (the core system)

- **Open Dental** — Widely used, one-time-license practice management software (as opposed to a monthly subscription model), popular with practices that want more control over cost and customization.
- **Dentrix** — Paid, one of the most widely used practice management systems in U.S. dental offices, handling scheduling, charting, billing, and insurance in one system.
- **Eaglesoft** — Paid alternative to Dentrix, also widely used, similar core feature set.

All three of the above are built with HIPAA-relevant features (access controls, audit logs) as a baseline expectation for the industry — but the practice is still responsible for configuring them correctly (see compliance-guidance.md).

## Patient communication and recall

- Most practice management systems above include built-in appointment reminders and recall tracking — this is usually the single highest-value feature to actually turn on and use consistently, since recall drop-off is one of the biggest revenue leaks in a dental practice.
- **Solutionreach** or **Weave** — Paid, purpose-built patient communication platforms that layer on top of (or alongside) practice management software, focused specifically on reminders, recall, and two-way patient texting.

## Insurance verification

- Many practice management systems offer built-in or add-on insurance eligibility verification (checking coverage before the appointment rather than discovering issues at checkout). Ask your practice management vendor what's available, since this varies by system and version.

## Patient intake

- Online, pre-visit intake forms (offered by most modern practice management systems, or standalone tools like **Lighthouse 360**) reduce clipboard time and paperwork errors at check-in.

## Reviews and reputation

- **Google Business Profile** (free) — Set this up first. Reviews mentioning gentleness, communication, and staff friendliness carry particular weight for anxious dental patients.

## Security basics for this industry

Because this business handles Protected Health Information under HIPAA:
- Any software storing or transmitting patient data must be evaluated for HIPAA compliance (ask the vendor directly for a Business Associate Agreement, or "BAA" — a real, standard document in this industry)
- Access to patient records should be limited by role, not open to all staff by default
- See the compliance-guidance.md file in this folder before adopting any new patient-facing communication tool
