# FrostTrack — Full Implementation Plan

## Architectural Decisions (Read First)

### File Structure

The app uses no build step, so every module is a native ES module loaded via `<script type="module">`. The entry point `index.html` loads `js/app.js` as the root module, which imports everything else. All paths are relative.

```
/
├── index.html
├── manifest.json
├── sw.js                        (service worker)
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── css/
│   ├── reset.css
│   ├── variables.css            (design tokens: colors, fonts, spacing)
│   ├── layout.css               (bottom nav, page shells, bottom sheet)
│   ├── components.css           (cards, badges, chips, steppers, toasts)
│   └── animations.css           (slide-in, fade, swipe reveal)
└── js/
    ├── app.js                   (router + tab switching)
    ├── store.js                 (all localStorage read/write)
    ├── utils.js                 (uuid, date math, debounce)
    ├── claude.js                (Claude API fetch wrapper)
    ├── defaults.js              (default item list, category defaults)
    ├── tabs/
    │   ├── home.js
    │   ├── inventory.js
    │   ├── add.js
    │   ├── shopping.js
    │   └── meals.js
    ├── components/
    │   ├── bottomSheet.js       (generic slide-up sheet)
    │   ├── toast.js
    │   └── swipeReveal.js
    └── settings.js
```

### Module Pattern

Each tab file exports a single `mount(container)` function and a `refresh()` function. `app.js` calls `mount()` once on first activation and `refresh()` on every subsequent activation. This avoids re-rendering the entire DOM on tab switch while keeping state current.

```js
// Pattern every tab follows
export function mount(container) { /* build DOM once */ }
export function refresh() { /* update data-driven parts */ }
```

### Router / Tab Switching

No URL routing needed. `app.js` maintains `activeTab` state. Each tab's HTML shell lives in `index.html` as a `<section id="tab-*" class="tab-panel">`. Tab switching adds/removes `is-active` class. The bottom nav's `data-tab` attributes drive the event delegation.

### Data Flow

All reads and writes go through `store.js`. No component touches `localStorage` directly. Store functions return plain JS objects/arrays (never references to internal state). This makes it safe to mutate the return value without corrupting storage.

### Swipe Gesture Implementation (non-obvious)

Vanilla swipe on mobile requires tracking `touchstart`/`touchmove`/`touchend`. The `swipeReveal.js` component:

1. On `touchstart`: records `startX`, `startY`, sets `isSwiping = false`
2. On `touchmove`: calculates `deltaX` and `deltaY`. If `|deltaY| > |deltaX|` on the first meaningful move, marks the gesture as a vertical scroll and ignores remaining events (calls `event.preventDefault()` only after confirming it is a horizontal swipe). Translates the card's inner content layer via `element.style.transform = translateX(${deltaX}px)` with a `max` clamp at 0 (no swipe right) and `-160px` (max reveal width).
3. On `touchend`: if `deltaX < -80px`, snaps to `-160px` (fully revealed); otherwise snaps back to `0`. Uses CSS `transition: transform 200ms ease` toggled on/off (off during drag, on during snap).
4. The reveal layer sits behind the card content in the DOM. It has fixed width `160px` with two action buttons (80px each). Only one card can be open at a time — opening a new card closes any previously open card.

### Bottom Sheet Implementation

The generic `bottomSheet.js` component manages a single `<div class="bottom-sheet">` that sits at the root of `<body>`. It is not recreated per use — its inner content is swapped. Implementation:

1. `show(contentHTML, onSave, onCancel)` — injects HTML, adds `is-open` class (triggers CSS `transform: translateY(0)` transition from `translateY(100%)`), attaches listeners.
2. `hide()` — removes `is-open` class, clears content after the 300ms transition ends (via `transitionend` event).
3. A backdrop `<div class="sheet-backdrop">` sits behind it. Tapping the backdrop calls `hide()`.
4. The sheet uses `max-height: 85vh` and `overflow-y: auto` so tall forms scroll within the sheet.

### Debounce Pattern for Claude API

The debounce lives in `utils.js` as a standard closure debounce. In `add.js`, the name input's `input` event fires the debounced Claude call. The Claude call is wrapped in an abort controller so that if a new call fires before the old one resolves, the old fetch is aborted.

```js
// Conceptual flow in add.js
let abortController = null;
const debouncedClassify = debounce(async (name) => {
  if (abortController) abortController.abort();
  abortController = new AbortController();
  const category = await classifyItem(name, abortController.signal);
  // update UI chip
}, 500);
```

### UUID Generation

Use `crypto.randomUUID()` — available in all modern browsers with no polyfill needed.

### Date Arithmetic

All dates are stored as `YYYY-MM-DD` strings. `utils.js` provides:
- `daysUntil(dateStr)` — returns integer days from today (negative if past)
- `addMonths(dateStr, months)` — returns a new `YYYY-MM-DD` string
- `today()` — returns today as `YYYY-MM-DD`

The `daysUntil` function does the subtraction in whole days using midnight UTC to avoid timezone drift:

```js
function daysUntil(dateStr) {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0,0,0,0);
  return Math.ceil((target - now) / 86400000);
}
```

---

## Phase 1 — Core Inventory

**Goal:** Working app with inventory and add-item flow. No Claude API, no expiry logic beyond storing dates.

### Step 1.1 — `index.html`

Build the full HTML skeleton. Do not fill in tab content yet — each tab section is an empty shell. This file is never substantially edited again after this step.

Structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- charset, viewport (width=device-width, initial-scale=1, viewport-fit=cover) -->
  <!-- theme-color meta: #0d1117 -->
  <!-- apple-mobile-web-app-capable, apple-mobile-web-app-status-bar-style -->
  <!-- link to manifest.json -->
  <!-- Google Fonts: IBM Plex Sans 400,500,600; DM Mono 400 -->
  <!-- CSS links in order: reset, variables, layout, components, animations -->
</head>
<body>
  <div id="app">
    <header class="app-header">
      <!-- page title (updates per tab) + gear icon button -->
    </header>

    <main class="tab-content">
      <section id="tab-home"      class="tab-panel" data-tab="home"></section>
      <section id="tab-inventory" class="tab-panel" data-tab="inventory"></section>
      <section id="tab-add"       class="tab-panel" data-tab="add"></section>
      <section id="tab-shopping"  class="tab-panel" data-tab="shopping"></section>
      <section id="tab-meals"     class="tab-panel" data-tab="meals"></section>
    </main>

    <nav class="bottom-nav" aria-label="Main navigation">
      <!-- 5 buttons with data-tab attribute, icon + label -->
      <!-- Add tab button gets class "bottom-nav__add" for special styling -->
    </nav>

    <!-- Bottom sheet (single instance, content swapped) -->
    <div class="sheet-backdrop" id="sheetBackdrop" hidden></div>
    <div class="bottom-sheet"   id="bottomSheet"   aria-modal="true" role="dialog"></div>

    <!-- Toast container -->
    <div class="toast-container" id="toastContainer" aria-live="polite"></div>
  </div>

  <!-- Settings panel (full-screen overlay, not a tab) -->
  <div class="settings-overlay" id="settingsOverlay" hidden></div>

  <script type="module" src="js/app.js"></script>
</body>
</html>
```

Key decisions:
- `viewport-fit=cover` handles iPhone notch/home bar.
- Settings is a full-screen overlay, not a tab, so the bottom nav stays visible on all tabs.
- `aria-live="polite"` on toast container gives screen reader announcements for free.

### Step 1.2 — `css/reset.css`

Standard minimal reset: box-sizing border-box on everything, margin/padding 0, list-style none, no specific component styles.

### Step 1.3 — `css/variables.css`

Define all CSS custom properties on `:root`:

```css
--color-bg: #0d1117;
--color-surface: #161b22;
--color-surface-2: #21262d;      /* slightly lighter for inputs, elevated cards */
--color-accent: #58a6ff;
--color-amber: #d29922;
--color-red: #f85149;
--color-green: #3fb950;
--color-text-primary: #e6edf3;
--color-text-secondary: #8b949e;
--color-border: #30363d;

--font-body: 'IBM Plex Sans', system-ui, sans-serif;
--font-mono: 'DM Mono', 'Courier New', monospace;

--nav-height: 64px;
--header-height: 52px;
--sheet-radius: 20px;
--card-radius: 12px;
--transition-fast: 150ms ease;
--transition-med: 250ms ease;
--transition-slow: 350ms ease;
```

### Step 1.4 — `css/layout.css`

- `body`: `background: var(--color-bg); color: var(--color-text-primary); font-family: var(--font-body); overscroll-behavior: none;`
- `#app`: `display: flex; flex-direction: column; height: 100dvh; max-width: 480px; margin: 0 auto;` (caps width on desktop while remaining mobile-native)
- `.app-header`: `height: var(--header-height); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: var(--color-bg); border-bottom: 1px solid var(--color-border); position: sticky; top: 0; z-index: 10;`
- `.tab-content`: `flex: 1; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch;`
- `.tab-panel`: `display: none; padding: 16px 16px calc(var(--nav-height) + 16px);`
- `.tab-panel.is-active`: `display: block;`
- `.bottom-nav`: `height: var(--nav-height); display: grid; grid-template-columns: repeat(5, 1fr); position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto; background: var(--color-surface); border-top: 1px solid var(--color-border); padding-bottom: env(safe-area-inset-bottom);`
- Bottom sheet: `position: fixed; bottom: 0; left: 0; right: 0; max-width: 480px; margin: 0 auto; background: var(--color-surface); border-radius: var(--sheet-radius) var(--sheet-radius) 0 0; transform: translateY(100%); transition: transform var(--transition-slow); z-index: 50; max-height: 85vh; overflow-y: auto;`
- `.bottom-sheet.is-open`: `transform: translateY(0);`
- `.sheet-backdrop`: `position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 49; opacity: 0; transition: opacity var(--transition-slow);`
- Backdrop visible state: `.sheet-backdrop.is-open { opacity: 1; }`

### Step 1.5 — `css/components.css`

Define reusable component classes (no JS yet, pure CSS):

- `.card`: surface background, card-radius, padding 12px 16px, border 1px solid border color
- `.badge`: small pill with category color. Add modifier classes: `.badge--protein` (blue-tinted), `.badge--produce` (green-tinted), `.badge--meals` (purple-tinted), `.badge--desserts` (pink-tinted), `.badge--other` (grey). These use `background-color` at 20% opacity with matching text color.
- `.days-chip`: monospace font, large for expiry countdown. Modifier classes: `.days-chip--urgent` (red), `.days-chip--soon` (amber), `.days-chip--ok` (green/muted)
- `.stepper`: displays `−`, number, `+` in a row. The number span has `min-width: 40px; text-align: center; font-family: var(--font-mono);`
- `.chip-group` and `.chip`: for category selection. `.chip.is-selected` gets accent background.
- `.btn`: base button reset. `.btn--primary`: full-width, accent background. `.btn--ghost`: transparent, border. `.btn--icon`: square, no border.
- `.input`: full-width text input styling.
- `.swipe-card`: wrapper with `position: relative; overflow: hidden;`. Inner `.swipe-card__content` translates on swipe. `.swipe-card__actions` is absolutely positioned behind, right-aligned, showing "Used it all" and "Delete".
- `.toast`: positioned in toast container, slide-up animation.

### Step 1.6 — `css/animations.css`

```css
@keyframes slideUp    { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes fadeIn     { from { opacity: 0; } to { opacity: 1; } }
@keyframes toastSlide { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.animate-slide-up { animation: slideUp var(--transition-med) ease both; }
.animate-fade-in  { animation: fadeIn var(--transition-fast) ease both; }
```

Staggered card load: assign `animation-delay: calc(var(--i) * 60ms)` via inline style `style="--i: 3"` on each card, set in the JS render loop.

### Step 1.7 — `js/defaults.js`

Export two constants:

```js
export const DEFAULT_ITEMS = [ /* array of item objects per PRD */ ];
export const CATEGORY_DEFAULTS_MONTHS = { Protein: 4, Produce: 10, "Full Meals": 3, Desserts: 6, Other: 3 };
export const UNIT_OPTIONS = { Protein: ['lbs','oz','pieces','servings'], /* etc */ };
export const DEFAULT_UNIT = { Protein: 'lbs', Produce: 'bags', "Full Meals": 'servings', Desserts: 'servings', Other: 'servings' };
export const CATEGORIES = ['Protein', 'Produce', 'Full Meals', 'Desserts', 'Other'];
```

This file has zero side effects and zero imports. It is the first file to write.

### Step 1.8 — `js/utils.js`

Export these pure functions:

- `generateId()` — `return crypto.randomUUID()`
- `today()` — returns `YYYY-MM-DD` string
- `daysUntil(dateStr)` — integer days (see implementation above)
- `addMonths(dateStr, months)` — parse date, add months, return string. Tricky: adding months can overflow (Jan 31 + 1 month). Use `Date` object and clamp to last day of month.
- `debounce(fn, ms)` — standard closure debounce returning a new function
- `formatDate(dateStr)` — e.g. `"Jul 1"` or `"Jul 1, 2025"` depending on whether year differs from current year. Used for display.

### Step 1.9 — `js/store.js`

This is the most critical file. It provides the full data API. All functions are synchronous. No other file touches `localStorage`.

Export these functions:

```js
// Initialization
export function initStore()        // called once on app load; seeds defaults if keys absent

// Inventory
export function getInventory()     // returns array, sorted by useByDate ascending
export function addInventoryItem(item)   // item is a partial object; function adds id, addedAt
export function updateInventoryItem(id, changes)
export function removeInventoryItem(id)

// Shopping
export function getShoppingList()
export function addShoppingItem(item)
export function updateShoppingItem(id, changes)
export function toggleShoppingItem(id)
export function removeShoppingItem(id)
export function clearCompletedShopping()

// Item list (autocomplete)
export function getItemList()      // user-added first (isDefault: false), then defaults, sorted by useCount desc
export function addToItemList(item)
export function removeFromItemList(name)
export function incrementItemUseCount(name)

// Settings
export function getSettings()
export function saveSettings(changes)  // partial merge
```

Implementation notes for `initStore()`:
- Check if `frosttrack_inventory` key exists. If not, set it to `[]` and set `frosttrack_items` to the default items array from `defaults.js`. Always ensure `frosttrack_settings` has all keys present (merge with defaults so new settings keys added in future aren't undefined).
- Call `initStore()` as the first line of `app.js` before anything else.

### Step 1.10 — `js/components/bottomSheet.js`

```js
let onSaveCallback = null;
let onCancelCallback = null;

export function showSheet(contentHTML, { onSave, onCancel } = {}) { ... }
export function hideSheet() { ... }
```

Implementation:
- `showSheet` sets `innerHTML` of `#bottomSheet`, registers button click listeners inside the sheet content (look for `[data-action="save"]` and `[data-action="cancel"]` buttons), adds `is-open` to both `#bottomSheet` and `#sheetBackdrop`, removes `hidden` from backdrop.
- `hideSheet` removes `is-open`. On `transitionend`, clears `innerHTML` and sets backdrop to `hidden`.
- Gear-icon and backdrop click in `app.js` call `hideSheet`.
- Export a `getSheetForm()` helper that returns `document.querySelector('#bottomSheet form')` for reading values in the `onSave` callback.

### Step 1.11 — `js/components/toast.js`

```js
export function showToast(message, { action, actionLabel, duration = 4000 } = {}) { ... }
```

- Creates a `<div class="toast">` with message text and optional action button.
- Appends to `#toastContainer`, adds `is-visible` class after a 10ms frame (for CSS transition).
- After `duration`ms, removes `is-visible`, then removes the element after transition ends.
- Action button click fires `action()` callback and dismisses immediately.
- Max 3 toasts visible; if more arrive, oldest is removed first.

### Step 1.12 — `js/components/swipeReveal.js`

```js
export function initSwipeReveal(cardElement, { onUsedItAll, onDelete }) { ... }
```

- Selects `.swipe-card__content` within `cardElement`.
- Attaches `touchstart`, `touchmove`, `touchend` listeners.
- Tracks swipe state in closure variables: `startX`, `startY`, `currentX`, `isDragging`, `isDecided` (whether this gesture is horizontal or vertical).
- On `touchmove`: the first call where `Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5` decides the gesture direction. If vertical, sets a flag and returns on all subsequent moves. If horizontal and `deltaX < 0`, calls `event.preventDefault()` to stop scroll, applies `transform`.
- On `touchend`: if `deltaX < -80`, animate to `-160px` (snap open); else animate to `0` (snap close). Opening a card emits a custom `swipeopen` event on the card element. `initSwipeReveal` listens for `swipeopen` on `document` and closes any other open cards.
- Action buttons inside the reveal layer also have click handlers that call the callbacks. `onUsedItAll` and `onDelete` are called with the item id.

Tricky detail: `event.preventDefault()` on `touchmove` must be called in a non-passive listener. The default in modern browsers is passive, so you must explicitly pass `{ passive: false }` to `addEventListener`. If you forget this, you'll get a console error and scroll won't be blocked.

```js
element.addEventListener('touchmove', onTouchMove, { passive: false });
```

### Step 1.13 — `js/tabs/inventory.js`

Export `mount(container)` and `refresh()`.

`mount(container)`:
1. Inject the static search bar HTML and an empty `<div class="item-list">` into `container`.
2. Attach `input` listener on search bar — calls `renderItems(filterText)`.
3. Attach event delegation on `.item-list` for:
   - Click on `.minus-btn` → call `handleDecrement(itemId)`
   - Click on `.item-card` (not `.minus-btn`) → call `openEditSheet(itemId)`
4. Call `renderItems('')` to do initial render.

`renderItems(filterText)`:
1. Call `getInventory()`, filter by name if filterText is non-empty.
2. Group by category.
3. For each category that has items, render a `<h2>` header and then cards using `renderCard(item, index)`.
4. Set `innerHTML` of `.item-list`.
5. After setting innerHTML, iterate cards and call `initSwipeReveal` on each.

`renderCard(item, index)` returns an HTML string. Includes:
- `.swipe-card` wrapper with `data-id` attribute and animation delay `style="--i: ${index}"`
- `.swipe-card__actions` with "Used it all" and "Delete" buttons, each with `data-id` and `data-action`
- `.swipe-card__content` with:
  - Category badge
  - Item name (h3)
  - Quantity + unit
  - Days chip (color class determined by `daysUntil`)
  - Expiry date (small, secondary text)
  - Minus button (separate from swipe, always visible)

`handleDecrement(itemId)`:
1. Get item from inventory.
2. If `quantity > 1`, call `updateInventoryItem(id, { quantity: quantity - 1 })`, re-render just that card (or full re-render for simplicity in Phase 1 — optimize later if needed).
3. If `quantity === 1`, show a confirmation inline (or use the sheet) — "Used it all?". On confirm, call `handleUsedItAll(itemId)`.

`handleUsedItAll(itemId)`:
1. Get item name from store.
2. Call `removeInventoryItem(itemId)`.
3. Re-render the list.
4. Show toast: `"Gone! Add ${name} to your shopping list?"` with action `() => addShoppingItem({ name, category })`.

`openEditSheet(itemId)`:
1. Get item from store.
2. Build form HTML with pre-filled values. Include hidden `data-id` field.
3. Call `showSheet(formHTML, { onSave: handleSaveEdit, onCancel: hideSheet })`.

`handleSaveEdit()`:
1. Read form values from `#bottomSheet form`.
2. Call `updateInventoryItem(id, changes)`.
3. Call `hideSheet()`.
4. Call `refresh()`.

Note on category unit selects: the edit sheet form should update the unit dropdown options when category changes (via a `change` listener on the category select, attached after the sheet is shown). This is a tricky event-wiring detail — attach listeners to sheet content *inside* the `onSave`/sheet setup, not at mount time.

### Step 1.14 — `js/tabs/add.js`

Export `mount(container)` and `refresh()`.

`mount(container)`:
1. Inject the full multi-step form HTML. All steps are visible simultaneously as a single scrollable form (not wizard steps) — this matches the "under 10 seconds" goal.
2. Attach listeners.

Form sections (rendered as a single scrolling form):
1. **Name input** with autocomplete dropdown
2. **Category chips** (6 chips: 5 categories + unset state)
3. **Quantity stepper** + unit select
4. **Date frozen** (date input defaulting to today)
5. **Use-by date** (date input, auto-updated when category changes)
6. **Save button**

Name input and autocomplete:
- `<input id="itemName">` with `autocomplete="off"`
- Below it: `<ul class="autocomplete-list" id="autocompleteList" hidden>`
- On `input` event: filter `getItemList()` by prefix match, render up to 6 suggestions, show list.
- On suggestion click: populate input, collapse list, set category chip if item has known category, update use-by date.
- On `focusout` with delay (100ms `setTimeout`) collapse list (delay needed so clicks on list items fire before blur collapses the list).

Category chips:
- Render 5 chips. Clicking a chip sets `selectedCategory` variable in closure, adds `is-selected` class, updates the unit dropdown options (via `updateUnitOptions(category)`), and recalculates the use-by date (via `updateUseByDate(category)`).

Quantity stepper:
- `−` and `+` buttons update a `quantity` number variable and the display span. Minimum quantity is 1.

`updateUnitOptions(category)`:
- Clears and rebuilds the `<select>` for units using `UNIT_OPTIONS[category]`.
- Sets the selected option to `DEFAULT_UNIT[category]`.

`updateUseByDate(category)`:
- Calls `addMonths(today(), CATEGORY_DEFAULTS_MONTHS[category])`.
- Sets the use-by date input value.

Save handler:
- Validate: name is required, category is required.
- Build item object.
- Call `addInventoryItem(item)`.
- Call `incrementItemUseCount(name)`.
- If item name is not in item list, call `addToItemList({ name, category, defaultUnit, isDefault: false })`.
- Show a brief success flash on the save button (change text to "Saved!" for 1.5s, re-enable).
- Reset form (but stay on Add tab — do not navigate away).
- Call `home.refresh()` and `inventory.refresh()` so other tabs update. (Import them in `add.js` — all tab modules can import each other since there are no circular dependencies here.)

### Step 1.15 — `js/app.js`

The root orchestrator. Executed once on load.

```js
import { initStore } from './store.js';
import { mount as mountHome, refresh as refreshHome } from './tabs/home.js';
// ... other tabs
import { initSettings } from './settings.js';

const TAB_CONFIG = {
  home:      { title: 'FrostTrack', mount: mountHome,      refresh: refreshHome },
  inventory: { title: 'Inventory',  mount: mountInventory, refresh: refreshInventory },
  add:       { title: 'Add Item',   mount: mountAdd,       refresh: refreshAdd },
  shopping:  { title: 'Shopping',   mount: mountShopping,  refresh: refreshShopping },
  meals:     { title: 'Meals',      mount: mountMeals,     refresh: refreshMeals },
};

const mounted = new Set();
let activeTab = 'home';

initStore();

// Bottom nav event delegation
document.querySelector('.bottom-nav').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-tab]');
  if (!btn) return;
  switchTab(btn.dataset.tab);
});

function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
  document.querySelectorAll('.bottom-nav [data-tab]').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tabId));
  document.querySelector(`#tab-${tabId}`).classList.add('is-active');

  const config = TAB_CONFIG[tabId];
  const container = document.querySelector(`#tab-${tabId}`);

  if (!mounted.has(tabId)) {
    config.mount(container);
    mounted.add(tabId);
  } else {
    config.refresh();
  }

  document.querySelector('.app-header__title').textContent = config.title;
  activeTab = tabId;
}

// Expose switchTab globally for Quick Action buttons on Home tab
window.switchToTab = switchTab;

// Settings gear icon
document.querySelector('.gear-btn').addEventListener('click', () => initSettings());

// Start on Home
switchTab('home');
```

Export `switchTab` for use by meals tab Quick Action buttons.

---

## Phase 2 — Home Tab + Expiration Logic

**Goal:** Home tab fully functional with expiry color coding and "Used it all" shopping list toast.

### Step 2.1 — Expiry helpers in `utils.js`

Add `getExpiryClass(daysLeft)`:
```js
export function getExpiryClass(days) {
  if (days <= 7)  return 'days-chip--urgent';
  if (days <= 30) return 'days-chip--soon';
  return 'days-chip--ok';
}
```

Add `getDaysLabel(days)`:
```js
export function getDaysLabel(days) {
  if (days < 0)  return `${Math.abs(days)}d ago`;
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
}
```

These are also used in `inventory.js` — update `renderCard` to use them (the functions existed in utils from Phase 1 but the class names can now be properly wired up).

### Step 2.2 — `js/tabs/home.js`

Export `mount(container)` and `refresh()`.

`mount(container)`:
- Injects a static HTML skeleton with placeholder sections: summary strip, expiring-soon section, quick-action buttons.
- Calls `refresh()`.

`refresh()`:
1. Get inventory. Compute `daysUntil` for each item.
2. **Summary strip**: count total items, count items where `daysUntil <= 7`, count shopping items. Update DOM spans.
3. **Expiring soon**: filter items where `daysUntil <= 30`, sort by `useByDate` ascending. Render cards. Each card shows name, category badge, large days chip, quantity.
4. If no expiring items: show empty state `<p class="empty-state">Your freezer looks good! Nothing expiring in the next 30 days.</p>`.
5. **Quick action buttons**: these are static HTML with `onclick="window.switchToTab('meals')"` (or attach listeners in mount). Each button should also set a `data-mode` that the meals tab reads on mount/refresh — store the pending mode in `sessionStorage` or a module-level variable in `app.js`.

Quick action wiring: the two buttons need to switch to Meals tab AND set the mode. Cleanest approach: export `setMealsMode(mode)` from `meals.js` and call it before `switchToTab('meals')` in the home tab's button handlers.

### Step 2.3 — Complete "Used it all" flow

In `inventory.js` `handleUsedItAll`, the toast action is already wired (from Phase 1). Ensure `addShoppingItem` also attempts to look up the item's category from `getItemList()` so the shopping list can group it properly.

---

## Phase 3 — Shopping List

**Goal:** Fully functional shopping list with grouping, copy, and cross-tab integration.

### Step 3.1 — `js/tabs/shopping.js`

Export `mount(container)` and `refresh()`.

`mount(container)`:
- Inject static shell: add-item input + button, "Clear completed" button, "Copy list" button, item list area.
- Attach listeners:
  - Add item form submit: calls `handleAddItem()`
  - Clear completed: calls `clearCompletedShopping()`, then `refresh()`
  - Copy list: calls `handleCopyList()`

`refresh()`:
1. Get shopping list.
2. Group items by category (uncompleted first, then completed at bottom).
3. Render category sections with item rows.
4. Each item row: checkbox, item name (struck through if completed), optional note, delete button.
5. Event delegation on item list for checkbox changes and delete clicks.

`handleAddItem()`:
- Read input value, trim.
- If empty, do nothing.
- Call `addShoppingItem({ name, category: null, note: '', completed: false })`. Category can be guessed from item list lookup.
- Clear input.
- Call `refresh()`.

`handleCopyList()`:
- Get shopping list.
- Group by category.
- Build text string in the format specified in the PRD.
- `navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'))`.
- Tricky: `navigator.clipboard` requires HTTPS or localhost. On iOS Safari, it requires the call to happen in a user gesture (which it does — button click — so this is fine). If it fails, fall back to `document.execCommand('copy')` using a temporary textarea.

Checkbox change event delegation:
- Event delegation on the list container, listening for `change` on `input[type="checkbox"]`.
- Get item id from `data-id` on the checkbox or parent row.
- Call `toggleShoppingItem(id)`.
- Re-render item row in place (or full refresh — full refresh is fine since the list is not large).

Note management: the note field should be an `<input type="text" placeholder="Add note...">` inline. On `change` or `blur`, call `updateShoppingItem(id, { note: value })`.

---

## Phase 4 — Claude API Integration

**Goal:** Auto-categorization on the Add screen, with graceful degradation.

### Step 4.1 — `js/claude.js`

```js
export async function classifyItem(name, signal) {
  const settings = getSettings();
  if (!settings.anthropicApiKey) return null;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'x-api-key': settings.anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages: [{
        role: 'user',
        content: `Given the food item name "${name}", classify it into exactly one of these freezer categories: Protein, Produce, Full Meals, Desserts, Other. Respond with only the category name, nothing else.`
      }]
    })
  });

  if (!response.ok) return null;
  const data = await response.json();
  const text = data.content?.[0]?.text?.trim();
  const VALID = ['Protein', 'Produce', 'Full Meals', 'Desserts', 'Other'];
  return VALID.includes(text) ? text : null;
}
```

Key decisions:
- `anthropic-dangerous-direct-browser-access: true` header is required for direct browser fetch to Anthropic API (bypasses CORS restriction that Anthropic places on browser requests without this header).
- `max_tokens: 10` keeps the response tiny and fast.
- Return `null` on any error so callers can fall back to manual selection.
- `signal` is an `AbortSignal` for cancellation.

### Step 4.2 — Wire debounced classify into `add.js`

In `add.js`, after the name `input` event:

```js
let classifyController = null;
const debouncedClassify = debounce(async (name) => {
  if (!name || name.length < 3) return;
  if (classifyController) classifyController.abort();
  classifyController = new AbortController();

  setCategoryLoading(true);

  try {
    const category = await classifyItem(name, classifyController.signal);
    setCategoryLoading(false);
    if (category) selectCategory(category);
  } catch(e) {
    setCategoryLoading(false);
    if (e.name !== 'AbortError') console.warn('Classify failed', e);
  }
}, 500);

nameInput.addEventListener('input', (e) => {
  populateAutocomplete(e.target.value);
  debouncedClassify(e.target.value);
});
```

`setCategoryLoading(bool)`: adds/removes a `.is-loading` class on the category chips container. Add a CSS shimmer animation on `.chip-group.is-loading .chip`.

### Step 4.3 — `js/settings.js`

Export `initSettings()` — renders settings overlay and shows it.

`initSettings()`:
1. Build settings HTML and inject into `#settingsOverlay`.
2. Remove `hidden` attribute, add `is-open` class.
3. Attach close button listener.

Settings sections:

**API Key section:**
- `<input type="password" id="apiKeyInput">` pre-filled with masked value if set.
- Show/hide toggle button (eye icon) that switches `type` between `password` and `text`.
- `change` or `blur` listener saves to settings.
- Explanatory note below input.

**Category defaults section:**
- For each category, a number input (1–24) showing current month default.
- `change` listener saves each.

**Item list management:**
- `getItemList()` and render as an editable list.
- Each item has a delete (×) button. User-added items have a different visual treatment.
- Clicking × calls `removeFromItemList(name)` and re-renders the list.

**Clear all data:**
- One button. Clicking shows an inline confirmation (`confirm()` dialog is acceptable here — it's a destructive, infrequent action).
- On confirmation: clear all four localStorage keys, call `initStore()`, close settings, navigate to home tab, call all tab `refresh()` functions.

Settings overlay close: clicking the X button or backdrop removes `is-open` class from overlay, waits for transition, adds `hidden`.

---

## Phase 5 — Meals Tab

**Goal:** Both meal modes working with shuffle and recipe links.

### Step 5.1 — `js/tabs/meals.js`

Export `mount(container)`, `refresh()`, and `setMode(mode)`.

Module-level: `let currentMode = 'heat'` and `let shuffleOffset = 0`.

`mount(container)`:
1. Inject segmented control (two buttons: "Just heat it up" / "I'm cooking") and content area.
2. Attach segmented control click listeners — call `setMode('heat')` or `setMode('cook')`.
3. Call `refresh()`.

`setMode(mode)`:
1. Update `currentMode`.
2. Update segmented control active button.
3. Call `renderModeContent()`.

`refresh()`:
- Calls `renderModeContent()`.
- Resets `shuffleOffset = 0` (so refreshing the tab shows top items again).

`renderModeContent()`:
- Branches on `currentMode`.

**Heat mode rendering:**
1. Get inventory items where `category === 'Full Meals'`, sorted by `useByDate` ascending.
2. Apply `shuffleOffset` to rotate the array: `items = [...items.slice(shuffleOffset), ...items.slice(0, shuffleOffset)]`.
3. Show first 3 items as cards (name, servings, days chip).
4. Each card has a "Mark as used" button → calls `handleMarkUsed(itemId)`.
5. Shuffle button: `shuffleOffset = (shuffleOffset + 3) % Math.max(items.length, 1)`, then re-render. Disable if `items.length <= 3`.
6. Empty state if no Full Meals items.

**Cook mode rendering:**
1. Get `Protein` items sorted by `useByDate`, `Produce` items sorted by `useByDate`, `Other` items sorted by `useByDate`.
2. Select items at `shuffleOffset % length` for each category.
3. If no Protein or no Produce: show appropriate empty state.
4. If both exist, show combo card with Protein item + Produce item + optional Other item.
5. Recipe search link: `https://www.google.com/search?q=${encodeURIComponent(proteinName + ' ' + produceName + ' recipe')}` opens in new tab.
6. "Mark as used" per item.
7. Shuffle button: `shuffleOffset++`, re-render.

`handleMarkUsed(itemId)`:
- Get item name.
- Call `removeInventoryItem(itemId)`.
- Show toast: `"Marked ${name} as used. Add to shopping list?"` with action.
- Call `renderModeContent()`.

---

## Phase 6 — Polish

**Goal:** PWA-ready, empty states everywhere, animations, mobile QA.

### Step 6.1 — `manifest.json`

```json
{
  "name": "FrostTrack",
  "short_name": "FrostTrack",
  "description": "Your freezer's memory, always in your pocket.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0d1117",
  "theme_color": "#0d1117",
  "orientation": "portrait",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Apple-specific meta tags in `index.html`:
```html
<link rel="apple-touch-icon" href="icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="FrostTrack">
```

### Step 6.2 — `sw.js` (Service Worker)

Cache-first strategy for app shell assets, network-first for API calls.

```js
const CACHE_NAME = 'frosttrack-v1';
const APP_SHELL = [
  '/', '/index.html', '/manifest.json',
  '/css/reset.css', '/css/variables.css', '/css/layout.css',
  '/css/components.css', '/css/animations.css',
  '/js/app.js', '/js/store.js', '/js/utils.js', '/js/defaults.js',
  '/js/claude.js', '/js/settings.js',
  '/js/tabs/home.js', '/js/tabs/inventory.js', '/js/tabs/add.js',
  '/js/tabs/shopping.js', '/js/tabs/meals.js',
  '/js/components/bottomSheet.js', '/js/components/toast.js',
  '/js/components/swipeReveal.js',
];

self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL))
));

self.addEventListener('fetch', e => {
  if (e.request.url.includes('anthropic.com')) return; // never cache API calls
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

Register in `index.html` before the module script:
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

### Step 6.3 — Empty States

Audit every tab and add empty state markup in a `.empty-state` container (icon, title, subtitle):

| Location | Condition | Message |
|---|---|---|
| Home | No items expiring ≤ 30 days | "Your freezer looks good! Nothing expiring in the next 30 days." |
| Inventory | Inventory is empty | "Your freezer is empty. Tap + to add your first item." |
| Inventory (search) | Search returns nothing | "No items match your search." |
| Shopping | List is empty | "Your list is empty." |
| Meals (heat) | No Full Meals items | "No freezer meals right now — add some!" |
| Meals (cook, no protein) | No Protein items | "You don't have any Protein — check your shopping list." |
| Meals (cook, no produce) | No Produce items | "You don't have any Produce — check your shopping list." |

### Step 6.4 — Animation Audit

1. **Card load animation**: verify `--i` CSS variable is set on each card in the render loop.
2. **Bottom sheet**: verify `transitionend` cleanup fires and does not leave orphaned content.
3. **Toast**: verify it does not flash on initial load.
4. **Swipe reveal**: verify snap animation feels physical. If needed, tune to `180ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
5. **Tab switch**: optionally add a subtle fade between tab panels via `opacity: 0` + `animation: fadeIn 200ms ease forwards` on `.tab-panel.is-active`.

### Step 6.5 — Mobile QA Checklist

Test on 390px viewport (iPhone 14 size) in browser devtools and on a real device:

- [ ] All tap targets are at least 48px tall
- [ ] Bottom nav is reachable with one thumb
- [ ] Save button on Add form is visible above keyboard (iOS Safari raises viewport)
- [ ] Swipe reveal works without accidentally triggering scroll
- [ ] Bottom sheet does not get obscured by keyboard — use `scrollIntoView()` on focused inputs within the sheet, with a 300ms delay to let keyboard animate in
- [ ] Toast does not overlap bottom nav — set `bottom: calc(var(--nav-height) + 16px + env(safe-area-inset-bottom))` on toast container
- [ ] App works fully offline after first load
- [ ] "Add to Home Screen" produces correct icon and title

---

## Non-Obvious Implementation Details Summary

1. **`passive: false` on touchmove** — required for `preventDefault()` in swipe handler. Forgetting this breaks swipe on all modern browsers silently.

2. **AbortController for Claude API** — every new keystroke after debounce should abort the previous in-flight request. Without this, rapid typing causes race conditions where an early response for "Ch" overwrites a later response for "Chicken thighs".

3. **`daysUntil` midnight UTC math** — date string comparison without normalizing to midnight produces off-by-one errors near midnight. Always set hours to 0 before computing difference.

4. **`addMonths` overflow** — `new Date('2025-01-31')` + 1 month naively gives March 3 in JS. Clamp to the last day of the target month.

5. **One swipe card open at a time** — use a custom DOM event (`swipeopen`) dispatched on `document` so any `swipeReveal` instance can close other open instances without tight coupling.

6. **Settings overlay vs. tab** — settings is not in the tab system. Closing settings should call `refresh()` on the active tab (since API key or category defaults may have changed).

7. **Font loading and offline** — Google Fonts will fail offline unless cached by the service worker. The first offline load may show fallback fonts — this is acceptable behavior.

8. **iOS safe area insets** — `env(safe-area-inset-bottom)` must be used in `padding-bottom` of the bottom nav and in the toast container's `bottom` offset. Without it, content hides behind the iPhone home indicator bar.

9. **`crypto.randomUUID` availability** — only available over HTTPS or `localhost`. Over plain HTTP on a local network, it is unavailable — have a fallback UUID function ready for development.

10. **Clipboard API on iOS** — `navigator.clipboard.writeText()` works on iOS 13.4+ only from a synchronous user gesture. Do not call it from a timeout or async callback.

---

## Build Order Summary (Dependency-Ordered)

```
Phase 1:
  1.1  index.html (shell)
  1.2  css/reset.css
  1.3  css/variables.css
  1.4  css/layout.css
  1.5  css/components.css
  1.6  css/animations.css
  1.7  js/defaults.js              (no deps)
  1.8  js/utils.js                 (no deps)
  1.9  js/store.js                 (deps: defaults, utils)
  1.10 js/components/bottomSheet.js
  1.11 js/components/toast.js
  1.12 js/components/swipeReveal.js
  1.13 js/tabs/inventory.js        (deps: store, utils, bottomSheet, toast, swipeReveal)
  1.14 js/tabs/add.js              (deps: store, utils, defaults)
  1.15 js/app.js                   (deps: everything)

Phase 2:
  2.1  Update js/utils.js          (add getExpiryClass, getDaysLabel)
  2.2  js/tabs/home.js             (deps: store, utils)
  2.3  Update inventory.js         (wire used-it-all toast to shopping)

Phase 3:
  3.1  js/tabs/shopping.js         (deps: store, utils, toast)
  3.2  Update store.js             (add updateShoppingItem)

Phase 4:
  4.1  js/claude.js                (deps: store)
  4.2  Update add.js               (wire debounced classify)
  4.3  js/settings.js              (deps: store, defaults)

Phase 5:
  5.1  js/tabs/meals.js            (deps: store, utils, toast)

Phase 6:
  6.1  manifest.json
  6.2  icons/ (create PNG files)
  6.3  sw.js
  6.4  Update index.html           (SW registration, apple meta tags, manifest link)
  6.5  Audit all tabs for empty states
  6.6  Animation and mobile QA pass
```

### Critical Files (highest complexity, build carefully)

- `js/store.js` — foundation; every other file depends on it
- `js/app.js` — tab router and mount/refresh orchestration
- `js/tabs/inventory.js` — most complex tab: swipe gestures, edit sheet, decrement flow
- `js/components/swipeReveal.js` — non-trivial touch handling; must be correct before inventory works
- `js/tabs/add.js` — multi-field form, autocomplete, Claude API debounce, category/unit/date chain
