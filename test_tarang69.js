const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting TARANG69 Verification Suite...');

const projectDir = __dirname;
const htmlPath = path.join(projectDir, '6_9.html');
const manifestPath = path.join(projectDir, 'manifest.json');
const swPath = path.join(projectDir, 'sw.js');
const iconSvgPath = path.join(projectDir, 'icon.svg');
const icon192Path = path.join(projectDir, 'icon-192.png');
const icon512Path = path.join(projectDir, 'icon-512.png');
const appleIconPath = path.join(projectDir, 'apple-touch-icon.png');

// 1. Test Assets & Manifest
console.log('\n--- 1. Testing Manifest & Assets ---');
assert(fs.existsSync(manifestPath), 'manifest.json must exist');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert.strictEqual(manifest.name, 'TARANG69 - ตารางเรียน ม.6/9', 'manifest name matches');
assert.strictEqual(manifest.short_name, 'TARANG69', 'manifest short_name matches');
assert.strictEqual(manifest.display, 'standalone', 'manifest display is standalone');
assert(manifest.icons && manifest.icons.length >= 3, 'manifest has icons');
assert(fs.existsSync(iconSvgPath), 'icon.svg exists');
assert(fs.existsSync(icon192Path), 'icon-192.png exists');
assert(fs.existsSync(icon512Path), 'icon-512.png exists');
assert(fs.existsSync(appleIconPath), 'apple-touch-icon.png exists');
console.log('✅ Manifest & Asset files verified');

// 2. Test Service Worker
console.log('\n--- 2. Testing Service Worker (sw.js) ---');
assert(fs.existsSync(swPath), 'sw.js must exist');
const swContent = fs.readFileSync(swPath, 'utf8');
assert(swContent.includes('CACHE_NAME'), 'sw.js has CACHE_NAME');
assert(swContent.includes('6_9.html'), 'sw.js caches 6_9.html');
assert(swContent.includes('manifest.json'), 'sw.js caches manifest.json');
assert(swContent.includes('icon-192.png'), 'sw.js caches icon-192.png');
assert(swContent.includes('icon-512.png'), 'sw.js caches icon-512.png');
console.log('✅ Service Worker verified');

// 3. Test 6_9.html PWA tags & content
console.log('\n--- 3. Testing 6_9.html PWA Integration & UI ---');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

assert(htmlContent.includes('<link rel="manifest" href="manifest.json">'), 'HTML includes manifest link');
assert(htmlContent.includes('apple-touch-icon'), 'HTML includes apple-touch-icon link');
assert(htmlContent.includes('TARANG69'), 'HTML includes TARANG69 title/brand');
assert(htmlContent.includes('serviceWorker.register'), 'HTML registers service worker');
assert(htmlContent.includes('bellPlans'), 'HTML defines bellPlans');
assert(htmlContent.includes('plan-btn-plan1'), 'HTML has plan1 button');
assert(htmlContent.includes('plan-btn-plan2'), 'HTML has plan2 button');
assert(htmlContent.includes('plan-btn-plan3'), 'HTML has plan3 button');
assert(htmlContent.includes('plan-btn-plan4'), 'HTML has plan4 button');
assert(htmlContent.includes('currentPlanTitle'), 'HTML has currentPlanTitle element');
console.log('✅ HTML markup & script references verified');

// 4. Test Bell Plans Logic & Auto-Reset in Isolated VM
console.log('\n--- 4. Testing Bell Plans Calculations & Auto-Reset ---');
// Extract JavaScript block from 6_9.html
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>[\s\r\n]*<\/body>/i);
assert(scriptMatch, 'Found main script in 6_9.html');
const jsCode = scriptMatch[1];

// Mock minimal browser environment
const mockLocalStorage = {
    store: {},
    getItem(k) { return this.store[k] || null; },
    setItem(k, v) { this.store[k] = String(v); },
    clear() { this.store = {}; }
};

const mockElements = {
    dailySwipeArea: { addEventListener() {} },
    dailyProgressBar: { style: {} },
    dailyProgressPercent: {},
    dailyProgressBadge: {},
    dailyHeaderTitle: {},
    dailyHeaderSub: {},
    dailyTodayBadge: { classList: { add() {}, remove() {} } },
    dailyPeriodsList: { innerHTML: '', classList: { add() {}, remove() {} }, appendChild() {} },
    highlightFilter: { value: 'all' },
    currentPlanTitle: {},
    currentPlanDesc: {},
    'plan-btn-plan1': { className: '' },
    'plan-btn-plan2': { className: '' },
    'plan-btn-plan3': { className: '' },
    'plan-btn-plan4': { className: '' },
    'tab-mon': { scrollIntoView() {} },
    'tab-tue': { scrollIntoView() {} },
    'tab-wed': { scrollIntoView() {} },
    'tab-thu': { scrollIntoView() {} },
    'tab-fri': { scrollIntoView() {} }
};

const mockDocument = {
    body: { classList: { add() {}, remove() {} } },
    getElementById(id) {
        if (!mockElements[id]) mockElements[id] = { classList: { add() {}, remove() {} }, style: {}, addEventListener() {} };
        return mockElements[id];
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    createElement() {
        return {
            classList: { add() {}, remove() {} },
            style: {},
            innerHTML: '',
            appendChild() {},
            addEventListener() {}
        };
    }
};

const sandbox = {
    document: mockDocument,
    window: {
        location: { search: '' },
        innerWidth: 1024,
        addEventListener() {},
        setInterval() {},
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
    URLSearchParams: URLSearchParams
};

const vm = require('vm');
vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);

// Validate bellPlans exist
const bellPlans = vm.runInContext('bellPlans', sandbox);
assert(bellPlans, 'bellPlans defined in window scope');
assert(bellPlans.plan1 && bellPlans.plan2 && bellPlans.plan3 && bellPlans.plan4, 'All 4 plans exist');

// Verify Plan 1: Period 1 (500 - 550 = 08:20 - 09:10), Period 8 (920 - 970 = 15:20 - 16:10)
assert.strictEqual(bellPlans.plan1.periods[1].start, 500);
assert.strictEqual(bellPlans.plan1.periods[1].end, 550);
assert.strictEqual(bellPlans.plan1.periods[8].start, 920);
assert.strictEqual(bellPlans.plan1.periods[8].end, 970);

// Verify Plan 2: Period 1 (480 - 525 = 08:00 - 08:45), Period 8 (865 - 910 = 14:25 - 15:10)
assert.strictEqual(bellPlans.plan2.periods[1].start, 480);
assert.strictEqual(bellPlans.plan2.periods[1].end, 525);
assert.strictEqual(bellPlans.plan2.periods[8].start, 865);
assert.strictEqual(bellPlans.plan2.periods[8].end, 910);

// Verify Plan 3: Period 1 (525 - 570 = 08:45 - 09:30), Period 8 (910 - 960 = 15:10 - 16:00)
assert.strictEqual(bellPlans.plan3.periods[1].start, 525);
assert.strictEqual(bellPlans.plan3.periods[1].end, 570);
assert.strictEqual(bellPlans.plan3.periods[8].start, 910);
assert.strictEqual(bellPlans.plan3.periods[8].end, 960);

// Verify Plan 4: Lunch (680 - 790 = 11:20 - 13:10)
assert.strictEqual(bellPlans.plan4.periods.lunch.start, 680);
assert.strictEqual(bellPlans.plan4.periods.lunch.end, 790);

// Verify getPeriodTimeRange under Plan 1 vs Plan 2
vm.runInContext("setBellPlan('plan1')", sandbox);
const p1_p1 = vm.runInContext("getPeriodTimeRange({ period: 'คาบที่ 1 (08.20 - 09.10 น.)' })", sandbox);
assert.strictEqual(p1_p1.start, 500);
assert.strictEqual(p1_p1.end, 550);
assert.strictEqual(p1_p1.count, 1);
assert.strictEqual(p1_p1.label, '1');

// Double period: 1 - 2
const p1_1_2 = vm.runInContext("getPeriodTimeRange({ period: 'คาบที่ 1 - 2 (08.20 - 10.00 น.)' })", sandbox);
assert.strictEqual(p1_1_2.start, 500);
assert.strictEqual(p1_1_2.end, 600);
assert.strictEqual(p1_1_2.count, 2);
assert.strictEqual(p1_1_2.label, '1-2');

// Triple period in Plan 2: 6 - 8
vm.runInContext("setBellPlan('plan2')", sandbox);
const p2_6_8 = vm.runInContext("getPeriodTimeRange({ period: 'คาบที่ 6 - 8 (13.40 - 16.10 น.)' })", sandbox);
assert.strictEqual(p2_6_8.start, 775); // period 6 start in plan 2
assert.strictEqual(p2_6_8.end, 910); // period 8 end in plan 2
assert.strictEqual(p2_6_8.count, 3);
assert.strictEqual(p2_6_8.label, '6-8');

// Lunch in Plan 4
vm.runInContext("setBellPlan('plan4')", sandbox);
const p4_lunch = vm.runInContext("getPeriodTimeRange({ type: 'break', title: 'พักกลางวัน 50 นาที' })", sandbox);
assert.strictEqual(p4_lunch.start, 680);
assert.strictEqual(p4_lunch.end, 790);
assert.strictEqual(p4_lunch.count, 0);

// Test LocalStorage Daily Auto-Reset:
console.log('\n--- 5. Testing LocalStorage Daily Auto-Reset ---');
const todayDateStr = vm.runInContext('getTodayDateString()', sandbox);

// Scenario A: Stored today's date and plan2 -> Should restore plan2
mockLocalStorage.setItem('tarang69_plan_date', todayDateStr);
mockLocalStorage.setItem('tarang69_plan_key', 'plan2');
vm.runInContext('initBellPlan()', sandbox);
assert.strictEqual(vm.runInContext('currentBellPlan', sandbox), 'plan2', 'Restores plan2 on same day');

// Scenario B: Stored yesterday's date and plan2 -> Should auto-reset to plan1
mockLocalStorage.setItem('tarang69_plan_date', '2026-01-01');
mockLocalStorage.setItem('tarang69_plan_key', 'plan2');
vm.runInContext('initBellPlan()', sandbox);
assert.strictEqual(vm.runInContext('currentBellPlan', sandbox), 'plan1', 'Auto-resets to plan1 on new day');
assert.strictEqual(mockLocalStorage.getItem('tarang69_plan_key'), 'plan1', 'Persists reset plan1');
assert.strictEqual(mockLocalStorage.getItem('tarang69_plan_date'), todayDateStr, 'Updates date to today');

console.log('✅ Bell plans calculations & auto-reset verified successfully!');
console.log('\n🎉 ALL TARANG69 VERIFICATION TESTS PASSED!');
