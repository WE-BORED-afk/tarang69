const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log('🧪 Starting Mobile & iPad Redesign Verification Suite...');

const projectDir = __dirname;
const htmlPath = path.join(projectDir, '6_9.html');
assert(fs.existsSync(htmlPath), '6_9.html exists');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 1. Task 1 Check: Now/Next Banner Markup & Logic
console.log('\n--- Checking Task 1: Now/Next Banner ---');
assert(htmlContent.includes('id="nowNextBanner"'), 'HTML contains #nowNextBanner element');
assert(htmlContent.includes('updateNowNextBanner'), 'HTML defines updateNowNextBanner function');
assert(htmlContent.includes('autoScrollToActivePeriod'), 'HTML defines autoScrollToActivePeriod function');

// Extract Script to run in VM
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>[\s\r\n]*<\/body>/i);
assert(scriptMatch, 'Found main script in 6_9.html');
const jsCode = scriptMatch[1];

const createdRows = [];

const mockElements = {
    nowNextBanner: { innerHTML: '', classList: { add() {}, remove() {} } },
    dailySwipeArea: { addEventListener() {} },
    dailyProgressBar: { style: {} },
    dailyProgressPercent: {},
    dailyProgressBadge: {},
    dailyHeaderTitle: {},
    dailyHeaderSub: {},
    dailyTodayBadge: { classList: { add() {}, remove() {} } },
    dailyPeriodsList: {
        innerHTML: '',
        classList: { add() {}, remove() {} },
        appendChild(row) { createdRows.push(row); }
    },
    highlightFilter: { value: 'all' },
    currentPlanTitle: {},
    currentPlanDesc: {},
    compactPlanBtn: { addEventListener() {} },
    compactPlanLabel: {},
    planBottomSheetModal: { classList: { add() {}, remove() {} } },
    planBottomSheet: { classList: { add() {}, remove() {} }, style: {} },
    bottomSheetBackdrop: { classList: { add() {}, remove() {} }, style: {} },
    'plan-btn-plan1': { className: '' },
    'plan-btn-plan2': { className: '' },
    'plan-btn-plan3': { className: '' },
    'plan-btn-plan4': { className: '' },
    'sheet-plan-btn-plan1': { className: '', querySelector() { return { classList: { add() {}, remove() {} } }; } },
    'sheet-plan-btn-plan2': { className: '', querySelector() { return { classList: { add() {}, remove() {} } }; } },
    'sheet-plan-btn-plan3': { className: '', querySelector() { return { classList: { add() {}, remove() {} } }; } },
    'sheet-plan-btn-plan4': { className: '', querySelector() { return { classList: { add() {}, remove() {} } }; } },
    'tab-mon': { scrollIntoView() {} },
    'tab-tue': { scrollIntoView() {} },
    'tab-wed': { scrollIntoView() {} },
    'tab-thu': { scrollIntoView() {} },
    'tab-fri': { scrollIntoView() {} }
};

const mockDocument = {
    body: { classList: { add() {}, remove() {}, contains(c) { return c === 'daily-mode'; } } },
    getElementById(id) {
        if (!mockElements[id]) mockElements[id] = { classList: { add() {}, remove() {} }, style: {}, innerHTML: '', addEventListener() {}, querySelector() { return null; } };
        return mockElements[id];
    },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    addEventListener() {},
    createElement() {
        return {
            classList: { add() {}, remove() {} },
            style: {},
            innerHTML: '',
            appendChild() {},
            addEventListener() {},
            setAttribute(k, v) { this[k] = v; }
        };
    }
};

const mockLocalStorage = {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    clear() { this.store = {}; }
};

const sandbox = {
    document: mockDocument,
    window: {
        location: { search: '' },
        innerWidth: 390,
        addEventListener() {},
        setInterval() {},
        requestAnimationFrame(fn) { fn(); },
        setTimeout(fn) { fn(); },
        navigator: { serviceWorker: { register: () => Promise.resolve() } }
    },
    localStorage: mockLocalStorage,
    navigator: { serviceWorker: { register: () => Promise.resolve() } },
    console: console,
    Date: Date,
    parseInt: parseInt,
    Math: Math,
    String: String,
    Object: Object,
    URLSearchParams: URLSearchParams,
    requestAnimationFrame(fn) { fn(); },
    setTimeout(fn) { fn(); }
};

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);

// 1. Test computeNowNextState on Tuesday
// 1.1 Before School (07:30 = 450 mins)
const beforeSchool = vm.runInContext("computeNowNextState('อังคาร', 450, 0)", sandbox);
assert(beforeSchool, 'computeNowNextState returns result');
assert.strictEqual(beforeSchool.status, 'before_school', 'Status is before_school');
assert(beforeSchool.nextItem, 'Points to first period as next');

// 1.2 During Period 1 (08:40 = 520 mins in Plan 1: Period 1 is 500-550)
const duringP1 = vm.runInContext("computeNowNextState('อังคาร', 520, 0)", sandbox);
assert.strictEqual(duringP1.status, 'in_progress', 'Status is in_progress');
assert.strictEqual(duringP1.currentItem.name, 'สังคมศึกษาพื้นฐาน', 'Current item is Period 1');
assert(duringP1.nextItem, 'Has next item (Period 2)');

// 1.3 During Break 1 (10:10 = 610 mins: Break 1 is 600-620)
const duringBreak = vm.runInContext("computeNowNextState('อังคาร', 610, 0)", sandbox);
assert.strictEqual(duringBreak.status, 'in_progress', 'Status is in_progress');
assert(duringBreak.currentItem.title && duringBreak.currentItem.title.includes('พัก'), 'Current item is break');

// 1.4 After School (17:00 = 1020 mins)
const afterSchool = vm.runInContext("computeNowNextState('อังคาร', 1020, 0)", sandbox);
assert.strictEqual(afterSchool.status, 'after_school', 'Status is after_school');

console.log('✅ Task 1 Now/Next logic verified successfully');

// 2. Task 2 Check: Clean Timeline Rows & Active Green Beacon
console.log('\n--- Checking Task 2: Clean Timeline Rows & Active Green Beacon ---');
// Simulate Period 2 (09:30 = 570 mins) on Tuesday
createdRows.length = 0;
vm.runInContext("dailySimulatedMins = 570", sandbox);
vm.runInContext("renderDailyCards('อังคาร', false)", sandbox);

assert(createdRows.length > 0, 'renderDailyCards populated rows');

// Check that no row contains bulky "Pending" or "In Progress" or "Completed" badge
createdRows.forEach((row, i) => {
    assert(!row.innerHTML.includes('>Pending<'), `Row ${i} does not have bulky Pending badge`);
    assert(!row.innerHTML.includes('>In Progress<'), `Row ${i} does not have bulky In Progress badge`);
    assert(!row.innerHTML.includes('>Completed<'), `Row ${i} does not have bulky Completed badge`);
    assert(!row.innerHTML.includes('ห้องเรียนปกติ'), `Row ${i} does not display redundant ห้องเรียนปกติ`);
});

// Period 1 is completed -> must have dark checkmark circle (bg-slate-900)
const p1Row = createdRows[0];
assert(p1Row.innerHTML.includes('bg-slate-900'), 'Completed row 1 has dark slate circle');
assert(p1Row.innerHTML.includes('line-through'), 'Completed row 1 has line-through title');

// Period 2 is active -> must have Emerald Green styling (#10b981 / border-emerald-500)
const p2Row = createdRows[1];
assert(p2Row.innerHTML.includes('border-emerald-500'), 'Active period row has emerald green border');
assert(p2Row.innerHTML.includes('ring-emerald-100'), 'Active period row has emerald pulse/ring');
assert(p2Row.innerHTML.includes('activeCountdownTimer'), 'Active period row has active countdown timer');

// Future period (Period 3) -> clean theme border-slate-300
const p3Row = createdRows[3]; // row 2 is break 1
assert(p3Row.innerHTML.includes('border-slate-300'), 'Future period row has clean pastel slate-300 border');

console.log('✅ Task 2 Clean Timeline Rows & Emerald Beacon verified successfully');

// 3. Task 3 Check: Compact Plan Selector & Bottom Sheet Modal
console.log('\n--- Checking Task 3: Compact Plan Selector & Bottom Sheet Modal ---');
assert(htmlContent.includes('id="compactPlanBtn"'), 'HTML contains compact plan button #compactPlanBtn');
assert(htmlContent.includes('id="compactPlanLabel"'), 'HTML contains plan label #compactPlanLabel');
assert(htmlContent.includes('id="planBottomSheetModal"'), 'HTML contains bottom sheet modal #planBottomSheetModal');
assert(htmlContent.includes('id="planBottomSheet"'), 'HTML contains bottom sheet container #planBottomSheet');
assert(htmlContent.includes('openPlanBottomSheet'), 'Script defines openPlanBottomSheet');
assert(htmlContent.includes('closePlanBottomSheet'), 'Script defines closePlanBottomSheet');
assert(htmlContent.includes('selectPlanFromSheet'), 'Script defines selectPlanFromSheet');

// Verify switching plan via sheet
vm.runInContext("selectPlanFromSheet('plan2')", sandbox);
assert.strictEqual(vm.runInContext("currentBellPlan", sandbox), 'plan2', 'Plan switched to plan2');
assert.strictEqual(mockElements.compactPlanLabel.textContent, 'แผน 2 ประชุมท้ายวัน', 'Label updated to Plan 2');

vm.runInContext("selectPlanFromSheet('plan1')", sandbox);
assert.strictEqual(vm.runInContext("currentBellPlan", sandbox), 'plan1', 'Plan switched back to plan1');
assert.strictEqual(mockElements.compactPlanLabel.textContent, 'แผน 1 ปกติ', 'Label updated to Plan 1');

console.log('✅ Task 3 Compact Plan Selector & Bottom Sheet verified successfully');

// 4. Task 4 Check: iPad Responsive & Overall Ergonomics
console.log('\n--- Checking Task 4: iPad Responsive & Layout ---');
assert(htmlContent.includes('max-w-2xl'), 'dailyView uses max-w-2xl for iPad ergonomics');
assert(htmlContent.includes('mx-auto'), 'dailyView is centered with mx-auto');

console.log('✅ Task 4 iPad Responsive verified successfully');

console.log('\n🎉 ALL MOBILE & IPAD REDESIGN VERIFICATION TESTS PASSED!');
