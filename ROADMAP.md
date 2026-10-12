# Dream to Business Builder Roadmap

This roadmap keeps the project focused on the highest-value outcomes before expanding beyond the MVP.

## Milestone 1: Stabilize the MVP

Status: In progress

Goals:
- Validate the business assessment flow end-to-end
- Make profile generation resilient to empty and partial inputs
- Confirm the decision logic matches the intended lifecycle phases
- Keep the app accessible, readable, and predictable across devices

Completed:
- Hardened profile normalization and localStorage handling
- Added defensive validation before render and save
- Reduced risk of broken output from malformed or partial profile data
- Improved dashboard rendering stability

Next checks:
- Run all QA scenarios in `TEST_PLAN.md`
- Confirm the scoring logic feels realistic in real-world use
- Fix any mismatches between phase recommendations and user expectations

## Milestone 2: Industry-aware assessment

Status: Planned

Goals:
- Connect the full `business-packs/` library to the assessment workflow
- Tailor questions and guidance by industry type
- Surface specific compliance, tooling, and workflow considerations

Priority tasks:
- Add an industry selector in the intake flow
- Map business types to relevant pack metadata
- Add industry-specific guidance to risk and action outputs
- Test the flow for at least 3 industry packs end-to-end

## Milestone 3: Profile management

Status: Planned

Goals:
- Let users save, revisit, and compare multiple business profiles
- Improve long-term usefulness beyond one-time scoring
- Support repeated use as the business evolves

Planned work:
- Add multiple profile management in localStorage or saved JSON
- Add edit/delete flows and profile history
- Add comparison or summary export features for changing states

## Milestone 4: Experience and website polish

Status: Planned

Goals:
- Make the app easier to understand and trust
- Improve onboarding and explanation of the lifecycle model
- Create a public-facing website that converts visitors into users

Planned work:
- Better onboarding copy and walkthrough flow
- More polished dashboard layouts and phase explanation panels
- Landing page and SEO-friendly guides
- FAQ, testimonials, and conversion paths

## Milestone 5: Trust, safety, and compliance

Status: Planned

Goals:
- Add credibility through transparent safety guidance
- Make compliance direction more practical and easier to trust
- Protect users who may be handling sensitive business data

Planned work:
- Security best practices docs
- Privacy/data handling guidance
- Industry-specific compliance checklists
- Clear limitations language and review recommendations

## Milestone 6: Release readiness

Status: Planned

Goals:
- Ship a stable version of the app to GitHub Pages or static hosting
- Validate full user flow on desktop and mobile
- Prepare the repo for broader sharing and external use

Final checkpoints:
- QA pass completed
- Core user flows work reliably
- Docs are clear and complete
- Deployment is configured and tested
- Launch messaging and support path are ready

## Recommended sequence

1. Finish MVP stabilization
2. Integrate business packs
3. Add profile management
4. Polish experience and marketing
5. Add compliance and trust materials
6. Ship and monitor

This keeps the project moving without prematurely expanding complexity before the core flow is reliable.
