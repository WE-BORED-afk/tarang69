# Mobile & iPad UX Timeline Redesign for TARANG69 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Daily View (`#dailyView`) of TARANG69 for mobile and iPad, adding a top Now/Next highlight banner, one-time auto-scroll to the active class, streamlined ~50px row cards with active-period green beacon styling, and a compact plan selector with a smooth Bottom Sheet modal.

**Architecture:** The UI in `6_9.html` will be restructured using Tailwind CSS and lightweight vanilla JavaScript. State is managed via existing `currentBellPlan`, `currentActiveDay`, and `scheduleData`. A new `updateNowNextBanner()` function computes real-time current and upcoming periods. The timeline nodes in `renderDailyCards()` are simplified by stripping out redundant badges (`Pending`, `• ห้องเรียนปกติ`, duplicate timestamps) and applying an Emerald Green theme exclusively to the active period. The plan selector is condensed into a minimal capsule button opening a bottom sheet overlay.

**Tech Stack:** HTML5, Vanilla JavaScript (ES6+), Tailwind CSS, PWA (Service Worker + Manifest), Node.js for unit testing.

**Spec:** `docs/superpowers/specs/2026-10-20-timetable-mobile-redesign.md`

## Global Constraints

- `#tableView` must remain untouched and fully accessible via the view toggle.
- `bellPlans` (4 plans) and localStorage daily auto-reset logic must remain 100% operational.
- Green styling (`#10b981`) must be used exclusively for the currently active/in-progress period.
- No bulky status text (`Pending`, `In Progress`) in the timeline list.
- Standard classrooms (`ห้องเรียนปกติ`) must never be displayed; only custom rooms (e.g. `📍 ห้อง Lab 327`, `📍 ห้องคอม 6`) are displayed.
- The app must default to `#dailyView` upon load.

## Review Focus

1. **Before school hours (e.g. 07:30 AM):** Now/Next banner shows a friendly morning greeting and points to Period 1; timeline shows all periods pending without errors.
2. **During break / lunch periods:** Now/Next banner accurately highlights the break as current and points to the next academic period.
3. **After school hours (e.g. 16:30 PM):** Now/Next banner shows a completion message (`🎉 หมดคาบเรียนของวันนี้แล้ว!`), and all periods are marked completed.
4. **Auto-scroll stability:** Auto-scroll triggers smoothly on initial view mount, never interrupting user scroll interactions during live timer ticks.
5. **Bottom Sheet accessibility:** Tapping outside the sheet or pressing Esc closes the sheet immediately.

---

### Task 1: Hero Now/Next Banner & Auto-Scroll Logic

**Files:**
- Modify: `C:\Users\Advice\Desktop\project\6_9.html`
- Test: `C:\Users\Advice\Desktop\project\test_timeline_redesign.js`

**Interfaces:**
- Consumes: `scheduleData`, `bellPlans`, `currentBellPlan`, `getPeriodTimeRange(item)`
- Produces: `updateNowNextBanner(dayKey)`, `autoScrollToActivePeriod()`

- [ ] **Step 1: Write the failing test for Now/Next computation**

Create `test_timeline_redesign.js` with simulated time scenarios (morning before school, during period 1, during lunch, after school):
```javascript
const assert = require('assert');
// Test computeNowNextPeriod(items, currentMins)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node test_timeline_redesign.js`
Expected: FAIL (functions not yet exported/defined)

- [ ] **Step 3: Implement Now/Next banner markup & calculation in `6_9.html`**

Add `#nowNextBanner` markup above `#dailyPeriodsList`. Implement `computeNowNextState(dayKey, currentMins)` and `updateNowNextBanner(dayKey)` to populate current period name, room badge, remaining countdown, and next period. Implement `autoScrollToActivePeriod()` with smooth scrolling.

- [ ] **Step 4: Run test to verify it passes**

Run: `node test_timeline_redesign.js`
Expected: PASS with all time scenarios returning correct Now and Next values.

- [ ] **Step 5: Commit/Checkpoint**

Record Task 1 completion.

---

### Task 2: Clean Timeline Row Layout & Active Green Beacon Styling

**Files:**
- Modify: `C:\Users\Advice\Desktop\project\6_9.html`
- Test: `C:\Users\Advice\Desktop\project\test_timeline_redesign.js`

**Interfaces:**
- Consumes: `renderDailyCards(dayKey)`, `getPeriodTimeRange(item)`
- Produces: Streamlined timeline rows (~50px), active green beacon node (`#10b981`), completed node (`✓`), upcoming node (theme outline)

- [ ] **Step 1: Write test for clean row formatting & room filtering**

Add tests to `test_timeline_redesign.js` verifying that:
1. Standard rooms (`ห้องเรียนปกติ`, `-`, `ตามอัธยาศัย`) produce no room HTML element.
2. Custom rooms (e.g. `ห้อง Lab 327`, `ห้องคอม 6`) produce badge `📍 ห้อง Lab 327`.
3. No `Pending` or `In Progress` text string exists in row HTML.
4. Active period has green class (`text-emerald-`, `border-emerald-`, or `#10b981`).

- [ ] **Step 2: Run test to verify it fails**

Run: `node test_timeline_redesign.js`
Expected: FAIL on previous verbose layout.

- [ ] **Step 3: Update `renderDailyCards()` in `6_9.html`**

Refactor the card rendering loop:
- Set row to compact flex layout with single line for subject name + code.
- Omit standard classroom text; render custom room badge when present.
- Set node circle:
  - Completed: `bg-slate-900 text-white` with `✓`
  - In Progress: `bg-white border-2 border-emerald-500 text-emerald-700 ring-4 ring-emerald-100` with pulse dot
  - Upcoming: `bg-white border-2 border-slate-200 text-slate-500`
- Place period countdown / time string neatly on the right.

- [ ] **Step 4: Run test to verify it passes**

Run: `node test_timeline_redesign.js`
Expected: PASS

- [ ] **Step 5: Commit/Checkpoint**

Record Task 2 completion.

---

### Task 3: Compact Plan Selector & Bottom Sheet Modal

**Files:**
- Modify: `C:\Users\Advice\Desktop\project\6_9.html`
- Test: `C:\Users\Advice\Desktop\project\test_timeline_redesign.js`

**Interfaces:**
- Consumes: `bellPlans`, `currentBellPlan`, `setBellPlan(planKey)`
- Produces: `openPlanBottomSheet()`, `closePlanBottomSheet()`, compact button `#compactPlanBtn`

- [ ] **Step 1: Write test for Bottom Sheet markup & modal toggle**

Add tests to `test_timeline_redesign.js` checking `#compactPlanBtn`, `#planBottomSheet`, backdrop element, and plan selection functions.

- [ ] **Step 2: Run test to verify it fails**

Run: `node test_timeline_redesign.js`
Expected: FAIL with missing Bottom Sheet elements.

- [ ] **Step 3: Implement Compact Pill & Bottom Sheet in `6_9.html`**

1. Replace the existing 4-grid button container with a compact pill button:
   `<button id="compactPlanBtn" onclick="openPlanBottomSheet()">🔔 <span id="compactPlanLabel">แผน 1 ปกติ</span> ▼</button>`
2. Add `#planBottomSheet` at the end of the body with dark backdrop overlay, drag handle, 4 selectable plan cards, and checkmark on the active plan.
3. Update `setBellPlan(planKey)` to update `#compactPlanLabel` and close the modal.
4. Add click outside and Esc key listeners to dismiss the modal.

- [ ] **Step 4: Run test to verify it passes**

Run: `node test_timeline_redesign.js`
Expected: PASS

- [ ] **Step 5: Commit/Checkpoint**

Record Task 3 completion.

---

### Task 4: Responsive Tablet/iPad Layout & Full Verification

**Files:**
- Modify: `C:\Users\Advice\Desktop\project\6_9.html`
- Test: `C:\Users\Advice\Desktop\project\test_tarang69.js`, `C:\Users\Advice\Desktop\project\test_timeline_redesign.js`

**Interfaces:**
- Consumes: All UI components
- Produces: Responsive container styles, verified visual preview

- [ ] **Step 1: Add responsive container styling in `6_9.html`**

Ensure `#dailyView` uses `max-w-xl md:max-w-2xl mx-auto` with balanced padding so it scales naturally on both phone (portrait 390-430px) and iPad (768-1024px) without excessive horizontal stretching.

- [ ] **Step 2: Run complete test suite**

Run: `node test_tarang69.js` and `node test_timeline_redesign.js`
Expected: 100% PASS on all tests (PWA, Bell Plans, Auto-reset, Now/Next, Clean Rows, Bottom Sheet).

- [ ] **Step 3: Capture screenshot of mobile & tablet view**

Run headless Edge to capture `preview_final_mobile.png` and inspect visually.

- [ ] **Step 4: Commit/Checkpoint**

Record Task 4 completion.
