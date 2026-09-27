# Dream to Business Builder QA Test Plan

This checklist is designed to validate the MVP before adding more features or launching. The goal is to test the business profile logic, dashboard output, and usability of the review flow.

## 1. Core test flow

### Test 1: New business, low clarity
- Business type: Service business
- Situation: Starting a new business
- Clarity: 1
- Operations: 2
- Risk posture: 2
- Automation: 1
- Goals: "Clarify the offer"
- Pain points: "No process yet"
- Main risk: "Lack of structure"
- Tools: "Spreadsheet and email"

Expected:
- Phase should trend toward Creation or Operation
- Health score should be low to moderate
- Review should be recommended
- Primary risk should be relevant
- Actions should be practical and early-stage

### Test 2: Stable operating business
- Business type: Consulting
- Situation: Improving an existing business
- Clarity: 4
- Operations: 4
- Risk posture: 4
- Automation: 3
- Goals: "Improve delivery consistency"
- Pain points: "Inconsistent follow-up"
- Main risk: "Operational drift"
- Tools: "CRM, scheduling, invoicing"

Expected:
- Phase should reflect Operation or Auditing
- Health score should sit in a healthy range
- Review may or may not be recommended depending on the scoring logic
- Action list should focus on process and visibility

### Test 3: Scaling business with weak structure
- Business type: Product business
- Situation: Growing the business
- Clarity: 4
- Operations: 3
- Risk posture: 2
- Automation: 2
- Goals: "Increase volume without chaos"
- Pain points: "Manual client onboarding"
- Main risk: "Growth outpacing systems"
- Tools: "Sheets, email, CRM"

Expected:
- Phase should lean toward Scaling
- Risk should mention structure, ownership, or growth strain
- Review should likely be recommended
- Action list should emphasize systems before more growth

### Test 4: Compliance-heavy situation
- Business type: Online business
- Situation: Fixing risk or compliance gaps
- Clarity: 3
- Operations: 2
- Risk posture: 1
- Automation: 2
- Goals: "Reduce risk and clean up policy gaps"
- Pain points: "Customer data and unclear process"
- Main risk: "Policy and privacy exposure"
- Tools: "Website platform, email, payments"

Expected:
- Phase should resolve to Compliance Catch-Up
- Review should definitely be recommended
- Risk flags should mention legal, privacy, or process gaps
- Action plan should be risk-oriented

### Test 5: Exit readiness scenario
- Business type: Local business
- Situation: Preparing to exit or transfer
- Clarity: 4
- Operations: 4
- Risk posture: 3
- Automation: 3
- Goals: "Prepare for sale or succession"
- Pain points: "Owner dependence and unclear documentation"
- Main risk: "Transition readiness"
- Tools: "QuickBooks, spreadsheets, scheduling"

Expected:
- Phase should resolve to Exit Readiness
- Review should be recommended
- Guidance should emphasize documentation and transferability

## 2. Edge-case tests

### Test 6: Empty or near-empty form
- Leave most fields blank
- Business name blank
- Situation default
- Range values left at defaults

Expected:
- App should not crash
- Default values should be used sensibly
- Dashboard still renders
- Risk and action list should still be valid

### Test 7: Long-form input
- Goal, pain point, and risk fields contain long text blocks with multiple sentences
- Tools field includes many platforms and variations

Expected:
- Output remains readable
- Lists remain manageable
- No layout breakage
- Risk and action items still stay relevant

### Test 8: Multiple pain points in one text block
- Pain points includes several comma-separated issues

Expected:
- `splitField` should cleanly parse and keep the best 2–4 items
- No empty list items
- No duplication

### Test 9: Browser refresh / saved profile
- Submit a profile
- Refresh the page
- Reopen the app

Expected:
- Saved profile loads correctly from localStorage
- Dashboard re-renders accurately
- Existing review state remains intact

## 3. UX and interaction checks

### Test 10: Navigation flow
- Open the app on home page
- Click Start your review
- Fill in form
- Submit
- Click Edit profile
- Return to form
- Update values and resubmit

Expected:
- Screen transitions are smooth
- Hidden sections appear and disappear correctly
- Form data remains editable
- Dashboard updates without stale values

### Test 11: Mobile layout
- Inspect on narrow viewport widths
- Test stacked layout for form and dashboard

Expected:
- No overlapping content
- Buttons remain readable
- Dashboard cards stack correctly
- No text clipping or broken spacing

## 4. Logic checks

### Score confidence
Check whether the health score feels aligned with the inputs:
- Low clarity + low operations should create a lower score
- Strong clarity + strong operations should produce a stronger score
- Risk posture should influence health in a realistic manner

### Phase confidence
Check whether the chosen phase matches the user’s situation and the data pattern:
- New business should not usually become scaling
- Growth state with weak systems should not become a compliance phase
- Exit intent should clearly map to Exit Readiness

### Review recommendation
Check whether review triggers in meaningful situations:
- Compliance or exit should always strongly recommend review
- Very low risk posture and weak operations should also trigger review
- Healthy operations with stable conditions should not over-trigger review

## 5. Definition of done

The MVP is ready for broader use when all of the following are true:

- Every core scenario produces a sensible phase
- Health score feels proportional and understandable
- Review recommendation triggers only in meaningful situations
- Dashboard content reads naturally and is not overly generic
- Empty, short, and long inputs are handled gracefully
- Mobile layout remains stable
- Saved profile refresh behavior works reliably

## 6. Recommended next steps after QA

After the test pass:

1. Fix any logic mismatches
2. Tighten wording in dashboard summaries and risk outputs
3. Build a small deployment plan for GitHub Pages or a static host
4. Add a short README with app usage and testing notes
5. Consider a simple export/share flow if the MVP proves strong enough

## 7. Test tracker

Use this quick list while validating:

- [ ] New business scenario
- [ ] Existing business improvement scenario
- [ ] Scaling scenario
- [ ] Compliance scenario
- [ ] Exit-readiness scenario
- [ ] Empty-form scenario
- [ ] Long-input scenario
- [ ] Refresh / saved profile scenario
- [ ] Navigation flow scenario
- [ ] Mobile layout scenario
- [ ] Score logic check
- [ ] Phase logic check
- [ ] Review recommendation check

This plan gives the product a clear QA pass before feature expansion or launch.
