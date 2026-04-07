import { initStore } from './store.js';
import { mount as mountHome,      refresh as refreshHome }      from './tabs/home.js';
import { mount as mountInventory, refresh as refreshInventory } from './tabs/inventory.js';
import { mount as mountAdd,       refresh as refreshAdd,
         setRefreshCallbacks }                                   from './tabs/add.js';
import { mount as mountShopping,  refresh as refreshShopping }  from './tabs/shopping.js';
import { mount as mountMeals,     refresh as refreshMeals,
         setMode as setMealsMode }                               from './tabs/meals.js';
import { initSettings } from './settings.js';

// ── Bootstrap ─────────────────────────────────────────────────────────────────

initStore();

// Wire cross-tab refresh into Add tab
setRefreshCallbacks(refreshHome, refreshInventory);

// ── Tab Config ────────────────────────────────────────────────────────────────

const TAB_CONFIG = {
  home:      { title: 'FrostTrack', mount: mountHome,      refresh: refreshHome },
  inventory: { title: 'Inventory',  mount: mountInventory, refresh: refreshInventory },
  add:       { title: 'Add Item',   mount: mountAdd,       refresh: refreshAdd },
  shopping:  { title: 'Shopping',   mount: mountShopping,  refresh: refreshShopping },
  meals:     { title: 'Meals',      mount: mountMeals,     refresh: refreshMeals },
};

const mounted  = new Set();
let activeTab  = null;

// ── Navigation ────────────────────────────────────────────────────────────────

export function switchTab(tabId, mealsMode) {
  if (tabId === activeTab && !mealsMode) return;

  // Update panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('is-active'));
  document.querySelector(`#tab-${tabId}`)?.classList.add('is-active');

  // Update nav buttons
  document.querySelectorAll('.bottom-nav__item').forEach(b => {
    b.classList.toggle('is-active', b.dataset.tab === tabId);
  });

  const config    = TAB_CONFIG[tabId];
  const container = document.querySelector(`#tab-${tabId}`);
  if (!config || !container) return;

  if (!mounted.has(tabId)) {
    config.mount(container);
    mounted.add(tabId);
  } else {
    config.refresh();
  }

  // Set meals mode if provided
  if (tabId === 'meals' && mealsMode) {
    setMealsMode(mealsMode);
  }

  document.querySelector('.app-header__title').textContent = config.title;
  activeTab = tabId;

  // Scroll tab content to top
  document.querySelector('.tab-content')?.scrollTo(0, 0);
}

// Expose globally for inline handlers and home quick-actions
window.switchToTab = switchTab;

// ── Bottom Nav ────────────────────────────────────────────────────────────────

document.querySelector('.bottom-nav').addEventListener('click', e => {
  const btn = e.target.closest('[data-tab]');
  if (!btn) return;
  switchTab(btn.dataset.tab);
});

// ── Settings ──────────────────────────────────────────────────────────────────

document.querySelector('.gear-btn').addEventListener('click', () => {
  initSettings(() => {
    // Refresh active tab when settings closes (API key or defaults may have changed)
    if (activeTab) TAB_CONFIG[activeTab]?.refresh();
  });
});

// ── Data Reset ────────────────────────────────────────────────────────────────

window.addEventListener('frosttrack:datareset', () => {
  // Clear mount cache so all tabs re-mount with fresh data
  mounted.clear();
  switchTab('home');
});

// ── Start ─────────────────────────────────────────────────────────────────────

switchTab('home');
