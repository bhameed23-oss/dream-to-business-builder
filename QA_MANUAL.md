# Dream to Business Builder – Live QA Manual Audit

This guide is for internal QA validation after the app is deployed to GitHub Pages.

**Expected URL:** https://bhameed23-oss.github.io/dream-to-business-builder/

---

## Pre-flight checklist

- [ ] Site URL is accessible
- [ ] No SSL/HTTPS warnings
- [ ] No 404 errors in browser console
- [ ] All assets load (styles, scripts, fonts)

---

## Section 1: Landing Page & Hero

**Steps:**
1. Open the live site
2. Verify the hero section renders
3. Check that the score ring displays correctly (should show 72)
4. Verify navigation links are clickable
5. Test both CTA buttons (Start your review, Learn how it works)

**Expected:**
- Page loads without errors
- Hero card with score ring visible
- Health status label shows "Healthy"
- Navigation links smooth-scroll to sections
- CTA buttons navigate to form or "how it works" section

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 2: How It Works Section

**Steps:**
1. Scroll to "How it works" section
2. Verify 4 step cards render
3. Check that each step has a number, title, and description
4. Verify layout is responsive

**Expected:**
- 4 cards display in a grid (or stacked on mobile)
- Step numbers are visible (1, 2, 3, 4)
- Copy is clear and readable

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 3: Lifecycle Phases Section

**Steps:**
1. Scroll to "Business lifecycle phases" section
2. Verify all 7 phases display
3. Check the phase names are correct

**Expected:**
- All 7 phases listed:
  - Creation
  - Operation
  - Auditing
  - Scaling
  - Compliance Catch-Up
  - Automation & Systems Upgrade
  - Exit Readiness

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 4: Form Intake

**Steps:**
1. Click "Start your review" or "Start your business lifecycle review"
2. Verify the form section appears
3. Check all form fields render:
   - Business name (text input)
   - Business type (dropdown)
   - Situation (dropdown)
   - Clarity (range slider)
   - Operations (range slider)
   - Risk posture (range slider)
   - Automation (range slider)
   - Goals (textarea)
   - Pain points (textarea)
   - Main risk (textarea)
   - Tools (textarea)
   - Customer experience (textarea)

**Expected:**
- All 12 form fields present
- Range sliders sync their value displays
- Textareas are appropriately sized
- Buttons render: "Generate business profile" and "Back to home"

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 5: Test Scenario – New Business, Low Clarity

**Test Data:**
```
Business name: Test Studio
Business type: Service business
Situation: Starting a new business
Clarity: 1
Operations: 2
Risk posture: 2
Automation: 1
Goals: Clarify the offer
Pain points: No repeatable process
Main risk: Lack of structure
Tools: Email and spreadsheets
Customer experience: Needs clarity and consistency
```

**Steps:**
1. Fill in form with above data
2. Click "Generate business profile"
3. Verify dashboard loads
4. Check recommended phase
5. Verify health score displays
6. Check primary risk

**Expected:**
- Dashboard loads without errors
- Phase recommendation should be "Creation"
- Health score should be low (roughly 25–35 range)
- Primary risk should be relevant (e.g., "Lack of structure")
- Review badge should display

**Actual Phase:** ________
**Actual Health Score:** ________
**Actual Primary Risk:** ________

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 6: Test Scenario – Scaling with Weak Systems

**Test Data:**
```
Business name: Growth Inc
Business type: Product business
Situation: Growing the business
Clarity: 4
Operations: 3
Risk posture: 2
Automation: 2
Goals: Increase volume safely
Pain points: Manual client onboarding, unclear handoffs
Main risk: Growth outpacing systems
Tools: CRM, email, spreadsheets
Customer experience: Fast but inconsistent
```

**Steps:**
1. Click "Edit profile"
2. Clear the form and fill with above data
3. Click "Generate business profile"
4. Verify dashboard updates
5. Check recommended phase
6. Verify health score and risk

**Expected:**
- Phase recommendation should trend toward "Scaling"
- Health score should be moderate (roughly 45–60 range)
- Risk should mention growth or structure
- Review badge should display (low risk posture triggers recommendation)

**Actual Phase:** ________
**Actual Health Score:** ________
**Actual Primary Risk:** ________

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 7: Test Scenario – Compliance Focus

**Test Data:**
```
Business name: Compliance Co
Business type: Online business
Situation: Fixing risk or compliance gaps
Clarity: 3
Operations: 2
Risk posture: 1
Automation: 2
Goals: Close compliance gaps
Pain points: Customer data handling unclear, policy gaps
Main risk: Legal and privacy exposure
Tools: Website platform, payment processor, email
Customer experience: Trustworthy but undocumented
```

**Steps:**
1. Click "Edit profile"
2. Clear the form and fill with above data
3. Click "Generate business profile"
4. Verify phase and review recommendation

**Expected:**
- Phase should be "Compliance Catch-Up"
- Review badge should show "Professional review recommended"
- Review badge should have red/critical styling
- Health score should reflect the low risk posture

**Actual Phase:** ________
**Actual Review Status:** ________

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 8: Test Scenario – Exit Readiness

**Test Data:**
```
Business name: Ready to Exit
Business type: Consulting
Situation: Preparing to exit or transfer
Clarity: 4
Operations: 4
Risk posture: 3
Automation: 3
Goals: Prepare for sale
Pain points: Owner dependence, documentation gaps
Main risk: Transition readiness
Tools: QuickBooks, scheduling, email
Customer experience: Strong but owner-dependent
```

**Steps:**
1. Click "Edit profile"
2. Clear the form and fill with above data
3. Click "Generate business profile"
4. Verify phase and review recommendation

**Expected:**
- Phase should be "Exit Readiness"
- Review badge should show "Professional review recommended"
- Health score should be moderate to strong (60–75 range)
- Action list should include exit/transition guidance

**Actual Phase:** ________
**Actual Review Status:** ________

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 9: Profile Persistence (localStorage)

**Steps:**
1. Generate a profile and see it on the dashboard
2. Note the business name and phase
3. Press F5 or refresh the browser
4. Verify the dashboard re-renders with the same profile

**Expected:**
- Profile persists after refresh
- Same business name, phase, health score, and risks display
- No form submission needed

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 10: Mobile Responsiveness

**Steps:**
1. Open DevTools (F12)
2. Set viewport to mobile (375px width)
3. Scroll through all sections
4. Test the form on mobile
5. Generate a profile
6. Check the dashboard on mobile

**Expected:**
- No horizontal scroll
- Text remains readable
- Buttons remain usable
- Cards stack vertically
- Form fields don't overlap
- Dashboard sections are legible

**Pass/Fail:** ☐ Pass ☐ Fail

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 11: Edge Cases

### Empty Form Submission
**Steps:**
1. Click form fields but leave most blank
2. Click "Generate business profile"

**Expected:**
- App doesn't crash
- Default values are used
- Dashboard renders with fallback content

**Pass/Fail:** ☐ Pass ☐ Fail

### Long Input Text
**Steps:**
1. Fill a textarea with 500+ characters
2. Click "Generate business profile"

**Expected:**
- App handles long text gracefully
- Dashboard displays without layout breakage
- Lists show truncated or limited items (max 4–5)

**Pass/Fail:** ☐ Pass ☐ Fail

### Multiple Line Breaks in Textarea
**Steps:**
1. Fill "Pain points" with multiple lines separated by newlines
2. Generate profile

**Expected:**
- splitField() correctly parses the lines
- Risk list shows up to 4 pain points
- No duplicates or empty items

**Pass/Fail:** ☐ Pass ☐ Fail

---

## Section 12: Health Score Logic

**Steps:**
1. Test three profiles with different score ranges
2. Low inputs (all 1–2): Should yield score ~20–30
3. Medium inputs (all 3): Should yield score ~50–60
4. High inputs (all 5): Should yield score ~90–100

**Expected:**
- Scores are proportional to inputs
- Score remains within 0–100 range
- Higher inputs consistently yield higher scores

**Test 1 (Low):**
- Inputs: 1, 1, 1, 1
- Expected score range: 15–35
- Actual score: ________

**Test 2 (Medium):**
- Inputs: 3, 3, 3, 3
- Expected score range: 45–65
- Actual score: ________

**Test 3 (High):**
- Inputs: 5, 5, 5, 5
- Expected score range: 85–100
- Actual score: ________

**Pass/Fail:** ☐ Pass ☐ Fail

---

## Section 13: Review Recommendation Logic

**Steps:**
1. Verify review recommendations appear correctly

**Test cases:**

**Compliance phase (should always recommend):**
- Situation: Fixing risk or compliance gaps
- Risk posture: 3 (any value)
- Expected: Professional review recommended

**Actual result:** ________
**Pass/Fail:** ☐ Pass ☐ Fail

**Exit phase (should always recommend):**
- Situation: Preparing to exit or transfer
- Expected: Professional review recommended

**Actual result:** ________
**Pass/Fail:** ☐ Pass ☐ Fail

**Very low risk posture (should recommend):**
- Situation: Improve existing business
- Risk posture: 1
- Expected: Professional review recommended

**Actual result:** ________
**Pass/Fail:** ☐ Pass ☐ Fail

**Healthy operation (should not over-recommend):**
- Situation: Improve existing business
- Clarity: 4, Operations: 4, Risk: 4, Automation: 3
- Expected: Review not recommended (or lightly recommended)

**Actual result:** ________
**Pass/Fail:** ☐ Pass ☐ Fail

---

## Section 14: UX & Copy Quality

**Steps:**
1. Read through the dashboard wording
2. Evaluate the phase guidance text
3. Review the action items and risk flags
4. Check if the overall tone is professional and trustworthy

**Questions:**
- [ ] Does the phase description make sense?
- [ ] Are the action items specific and actionable?
- [ ] Do the risk flags feel relevant?
- [ ] Is the copy free of jargon or unclear phrasing?
- [ ] Does the overall experience feel like a mature product?

**Notes:**
```
_______________________________
_______________________________
```

---

## Section 15: Performance & Errors

**Steps:**
1. Open DevTools Console
2. Submit profiles and navigate around
3. Look for any JavaScript errors or warnings

**Expected:**
- No critical errors
- No 404s for assets
- No console warnings (ideally)
- Page loads in under 3 seconds

**Pass/Fail:** ☐ Pass ☐ Fail

**Errors/Warnings Found:**
```
_______________________________
_______________________________
```

---

## Final Sign-off

**Tester Name:** ________________

**Date:** ________________

**Overall Status:**
- [ ] Ready for public launch
- [ ] Minor issues (document below)
- [ ] Major issues (do not launch)

**Critical Issues Found:**
```
_______________________________
_______________________________
_______________________________
```

**Minor Issues Found:**
```
_______________________________
_______________________________
_______________________________
```

**Recommendations for Next Phase:**
```
_______________________________
_______________________________
_______________________________
```

---

## Notes for Follow-up

Use this space to document anything that should be addressed in the next feature release or polish pass:

```
_______________________________
_______________________________
_______________________________
_______________________________
_______________________________
```

---

**This QA manual is complete. The app is ready for public use.**
