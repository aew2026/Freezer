# FrostTrack — Product Requirements Document
### For Claude Code

---

## Overview

**FrostTrack** is a mobile-first, browser-only web app for managing a home freezer inventory. It helps the user know what to eat before it goes bad, and what to buy when they're at the store.

**One-line pitch:** Your freezer's memory, always in your pocket.

**Technical constraints:**
- Browser-only. No backend, no server, no build step.
- All data persists in `localStorage`.
- Plain HTML + CSS + vanilla JavaScript (single repo, minimal dependencies).
- Must work offline after first load.
- PWA-ready: include `manifest.json` and correct `<meta>` viewport tags so it can be added to an iPhone home screen.
- Uses the Anthropic Claude API (client-side fetch) for one specific feature: auto-categorization of items on add. The API key will be provided by the user at runtime via a settings screen (stored in localStorage). Use `claude-sonnet-4-20250514`.

---

## User Mental Model

The user interacts with this app in two distinct physical contexts:

1. **At home / at the freezer** — adding items after cooking or putting away groceries, or marking things off after using them. Speed and minimal typing are critical.
2. **At the grocery store** — checking what they already have to avoid duplicates, and working through their shopping list. Read-speed and scannability are critical.

The app should feel instant and thumb-friendly in both contexts.

---

## Navigation Structure

Bottom navigation bar with five tabs. Icons + labels. Large tap targets (min 48px).

| Tab | Icon | Purpose |
|---|---|---|
| **Home** | 🏠 | Attention dashboard — what needs action today |
| **Inventory** | 🧊 | Full scannable inventory, grouped by category |
| **Add** | ＋ | Add a new item (center tab, most prominent) |
| **Shopping** | 🛒 | Shopping list — build at home, check off at store |
| **Meals** | 🍽️ | Meal suggestions — two modes |

---

## Views & Features

### 1. Home Tab

The default screen. Answers: "What needs my attention right now?"

**Expiring Soon section:**
- Shows all items expiring within 30 days, sorted soonest first
- Each item shows: name, category badge, days remaining (large and prominent), quantity
- Color coding:
  - 🔴 Red: 7 days or fewer
  - 🟡 Yellow: 8–30 days
- If nothing is expiring soon, show an encouraging empty state ("Your freezer looks good!")

**Quick Actions:**
- "Just heat something up" button → jumps to Meals tab in Heat Up mode
- "I'm cooking" button → jumps to Meals tab in Cooking mode

**Summary strip** at top (small, subtle):
- Total items in freezer
- Count of items expiring within 7 days (red badge if > 0)
- Count of items on shopping list

---

### 2. Inventory Tab

Scannable read-first view of everything in the freezer. This screen is used at the store, so clarity beats density.

**Layout:**
- Grouped by category with clear section headers: Protein, Produce, Full Meals, Desserts, Other
- Within each category, sorted by expiring soonest first
- Each item card shows: name, quantity + unit, days remaining (color-coded), a subtle expiry date

**Search:**
- Always-visible search bar at top
- Filters cards live as user types
- Searches across item name only

**Item card interactions:**
- **Minus button (−)** directly on the card: decrements quantity by 1 unit. No confirmation needed. If quantity reaches 0, trigger "Used it all?" confirmation (see below).
- **Swipe left** on a card: reveals two actions — "Used it all" (primary, green) and "Delete" (secondary, red). "Delete" is for mistakes / data cleanup; "Used it all" is for consumption.
- **"Used it all" action**: removes item from inventory. Then shows a subtle, non-blocking toast: "Gone! Add [item name] to your shopping list?" with a single tap to add. Toast dismisses automatically after 4 seconds.
- **Tap card** (not on − button): opens edit sheet (see Edit Item below)

**Edit Item (bottom sheet):**
- Slide-up panel, not a new page
- Editable fields: name, category (dropdown), quantity, unit, date frozen, use-by date
- "Save" and "Cancel" buttons
- No deletion from this screen (use swipe on card)

---

### 3. Add Item Tab

The most frequent interaction. Must be completable in under 10 seconds for a known item.

**Flow:**

**Step 1 — Name**
- Large, auto-focused search-as-you-type input
- Dropdown shows matching items from the user's personal item list (see Item List below)
- If no match, user can type a new name and proceed
- Typing triggers Claude API call (debounced, 500ms after last keystroke) to auto-assign category

**Step 2 — Category (auto-filled, confirm or correct)**
- Shows inferred category as a tappable chip: e.g. `🥩 Protein`
- Other categories shown as smaller chips below — one tap to switch
- Categories: Protein, Produce, Full Meals, Desserts, Other
- Claude API prompt (internal): `Given the food item name "{name}", classify it into exactly one of these freezer categories: Protein, Produce, Full Meals, Desserts, Other. Respond with only the category name, nothing else.`

**Step 3 — Quantity**
- Stepper (− / number / +) with a unit selector next to it
- Unit options depend on category:
  - Protein → lbs, oz, pieces, servings
  - Produce → bags, cups, oz, lbs
  - Full Meals → servings, portions, containers
  - Desserts → servings, pieces, containers
  - Other → servings, cups, oz, lbs, pieces
- Default unit is pre-set per category (Protein → lbs, Full Meals → servings, etc.)

**Step 4 — Dates**
- "Date Frozen" defaults to today (editable)
- "Use By" auto-calculated based on category default, shown as a readable date (editable):
  - Protein: 4 months
  - Produce: 10 months
  - Full Meals: 3 months
  - Desserts: 6 months
  - Other: 3 months
- User can tap the use-by date to change it (date picker or +/− month buttons)

**Save button** — large, full-width, at the bottom. On save: adds item, clears form, shows brief success state, stays on Add tab ready for next item.

---

### 4. Shopping List Tab

Built at home, checked off at the store.

**Layout:**
- Simple checklist, grouped by category (same five categories as inventory)
- Each item shows: name, optional note field (e.g. "get the big bag")
- Checkbox to mark off while shopping — checked items move to the bottom and are visually struck through

**Adding items:**
- Text input at top: type item name, hit Add
- No Claude API call needed here — it's a simple list

**Triggered additions:**
- When "Used it all" is confirmed in inventory, a toast offers to add to shopping list (one tap)
- Items added this way pre-populate with the item name

**Actions:**
- "Clear completed" button to remove all checked items
- "Copy list" button: copies the full list as plain text to clipboard, grouped by category, for sharing via iMessage etc.

**Copy format:**
```
FrostTrack Shopping List

PROTEIN
- Chicken thighs
- Ground beef

PRODUCE
- Peas (get the big bag)
```

---

### 5. Meals Tab

Two distinct modes, selectable at the top of the screen via a segmented control.

**Mode A: "Just heat it up"**
- Shows up to 3 Full Meals from inventory, prioritizing soonest-to-expire
- Each card shows: meal name, servings available, days until expiry
- "Shuffle" button to cycle through other options
- Tap a meal → shows item detail with option to mark as used
- Empty state if no Full Meals in inventory: "No freezer meals right now — add some!"

**Mode B: "I'm cooking"**
- Suggests a combination: 1 Protein + 1 Produce + optionally 1 Other
- All items prioritized by soonest expiring first
- Combination shown as a simple "Tonight's combo" card
- Below each item: a "Search recipes →" link that opens Google search for "[protein] [produce] recipe" in a new tab
- "Shuffle" button to get a different combination
- Each item in the combo has a small "Mark as used" button
- Empty state if missing a category: "You don't have any [Produce] right now — check your shopping list"

---

## Item List (User's Personal Dropdown)

The searchable dropdown on the Add screen is powered by a personal item list stored in localStorage (`frosttrack_items`).

**Pre-populated defaults (ship with app):**
Chicken breasts, Chicken thighs, Ground beef, Salmon fillets, Shrimp, Pork chops, Steak, Sausages, Bacon, Edamame, Peas, Corn, Spinach, Broccoli, Mixed vegetables, Berries, Mango chunks, Lasagna, Soup, Chili, Curry, Pasta sauce, Stir fry, Burritos, Waffles, Pie, Ice cream, Cookies, Bread, Tortillas, Stocks / broth, Butter

**User-added items:**
- Any item typed that isn't in the list gets added automatically on save
- Over time the list becomes personalized
- User-added items appear at the top of dropdown results

**Item list management:**
- Accessible via Settings (gear icon in top-right of any screen)
- Simple editable list — user can delete items they never use

---

## Settings Screen

Accessible via gear icon. Not a main tab.

- **API Key** — text input for Anthropic API key (stored in localStorage, never sent anywhere except Anthropic). Show/hide toggle. Note: "Used only for auto-categorizing items. Optional — you can set categories manually."
- **Category defaults** — edit the default use-by duration per category (months)
- **Item list management** — see above
- **Clear all data** — with confirmation dialog

---

## Data Model (localStorage)

```js
frosttrack_inventory: [
  {
    id: "uuid",
    name: "Chicken thighs",
    category: "Protein",        // Protein | Produce | Full Meals | Desserts | Other
    quantity: 2,
    unit: "lbs",
    dateFrozen: "2025-03-01",
    useByDate: "2025-07-01",
    addedAt: "2025-03-01T12:00:00Z"
  }
]

frosttrack_shopping: [
  {
    id: "uuid",
    name: "Ground beef",
    category: "Protein",        // optional, for grouping
    note: "",
    completed: false,
    addedAt: "2025-03-15T09:00:00Z"
  }
]

frosttrack_items: [
  {
    name: "Chicken thighs",
    category: "Protein",
    defaultUnit: "lbs",
    isDefault: true,            // false for user-added items
    useCount: 4                 // incremented each time item is added to inventory
  }
]

frosttrack_settings: {
  anthropicApiKey: "",
  categoryDefaults: {
    Protein: 4,
    Produce: 10,
    "Full Meals": 3,
    Desserts: 6,
    Other: 3
  }
}
```

---

## Design Direction

**Aesthetic:** Clean, utilitarian, cold — like a well-organized freezer. Not clinical, not cute. Confident and functional.

**Color palette:**
- Background: very dark blue-grey (`#0d1117`)
- Surface / cards: slightly lighter (`#161b22`)
- Primary accent: ice blue (`#58a6ff`)
- Expiring soon: amber (`#d29922`)
- Urgent / expired: red (`#f85149`)
- Safe / good: muted green (`#3fb950`)
- Text primary: `#e6edf3`
- Text secondary: `#8b949e`

**Typography:** Something crisp and slightly technical. Suggest `IBM Plex Sans` or `DM Mono` for numbers/dates, clean sans-serif for body.

**Motion:** Subtle. Cards slide in on load. Bottom sheet slides up. Toast notifications fade in/out. Swipe reveals should feel physical.

**Mobile-first:** Design for 390px width (iPhone 14). Everything should be reachable with one thumb. Bottom nav keeps key actions in thumb zone.

---

## Build Order

Build and verify each phase before proceeding to the next.

**Phase 1 — Core inventory**
- Data model + localStorage helpers
- Inventory tab (view, swipe, minus button, edit sheet)
- Add Item tab (manual entry, no Claude API yet, static category selection)
- Basic bottom navigation

**Phase 2 — Home + expiration logic**
- Expiry calculation and color-coding
- Home tab dashboard
- "Used it all" flow + shopping list toast

**Phase 3 — Shopping List**
- Shopping List tab
- Copy to clipboard
- Category grouping

**Phase 4 — Claude API integration**
- Settings screen with API key input
- Auto-categorization on Add screen
- Graceful fallback if no API key set (manual category selection, no error state)

**Phase 5 — Meals**
- Meals tab, both modes
- Shuffle logic
- Recipe search links

**Phase 6 — Polish**
- PWA manifest + icons
- Empty states for all views
- Animations and transitions
- Test on mobile viewport

---

## Out of Scope (Phase 2+)

- Usage logging / variety tracking
- Barcode scanning
- Voice input
- Cross-device sync
- Push notifications for expiring items
- Recipe integration beyond Google search link
