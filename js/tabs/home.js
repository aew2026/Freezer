import { getInventory, getShoppingList } from '../store.js';
import { daysUntil, getExpiryClass, getDaysLabel, formatDate, groupBy } from '../utils.js';
import { CATEGORY_ICONS, CATEGORY_BADGE_CLASS } from '../defaults.js';

let container = null;

export function mount(el) {
  container = el;
  el.innerHTML = `
    <div id="summaryStrip" class="summary-strip"></div>
    <div id="expiringSection"></div>
    <div class="quick-actions" id="quickActions">
      <button class="btn" id="btnHeatUp">
        <span class="quick-action__icon">🔥</span>
        Just heat it up
      </button>
      <button class="btn" id="btnCooking">
        <span class="quick-action__icon">🍳</span>
        I'm cooking
      </button>
    </div>
  `;

  el.querySelector('#btnHeatUp').addEventListener('click', () => {
    window.switchToTab('meals', 'heat');
  });
  el.querySelector('#btnCooking').addEventListener('click', () => {
    window.switchToTab('meals', 'cook');
  });

  refresh();
}

export function refresh() {
  if (!container) return;
  renderSummary();
  renderExpiring();
}

function renderSummary() {
  const inventory = getInventory();
  const shopping  = getShoppingList();
  const urgent    = inventory.filter(i => daysUntil(i.useByDate) <= 7).length;
  const total     = inventory.length;
  const shopCount = shopping.filter(i => !i.completed).length;

  container.querySelector('#summaryStrip').innerHTML = `
    <div class="summary-pill">
      <div class="summary-pill__val">${total}</div>
      <div class="summary-pill__label">In Freezer</div>
    </div>
    <div class="summary-pill">
      <div class="summary-pill__val ${urgent > 0 ? 'has-alert' : ''}">${urgent}</div>
      <div class="summary-pill__label">Expiring Soon</div>
    </div>
    <div class="summary-pill">
      <div class="summary-pill__val">${shopCount}</div>
      <div class="summary-pill__label">To Buy</div>
    </div>
  `;
}

function renderExpiring() {
  const section  = container.querySelector('#expiringSection');
  const inventory = getInventory();
  const expiring  = inventory
    .filter(i => daysUntil(i.useByDate) <= 30)
    .sort((a, b) => a.useByDate.localeCompare(b.useByDate));

  if (expiring.length === 0) {
    section.innerHTML = `
      <div class="empty-state" style="padding:32px 0 16px">
        <div class="empty-state__icon">✅</div>
        <div class="empty-state__title">Your freezer looks good!</div>
        <div class="empty-state__subtitle">Nothing expiring in the next 30 days.</div>
      </div>`;
    return;
  }

  let html = `<div class="section-header">⏰ Expiring Soon</div>`;
  expiring.forEach((item, i) => {
    const days       = daysUntil(item.useByDate);
    const chipClass  = getExpiryClass(days);
    const daysLabel  = getDaysLabel(days);
    const badgeClass = CATEGORY_BADGE_CLASS[item.category] || 'badge--other';

    html += `
      <div class="expiry-card animate-slide-up" style="--i:${i}">
        <div class="expiry-card__info">
          <div class="expiry-card__name">${escHtml(item.name)}</div>
          <div class="expiry-card__qty">
            <span class="badge ${badgeClass}">${item.category}</span>
            &nbsp;${item.quantity} ${escHtml(item.unit)}
          </div>
        </div>
        <span class="days-chip days-chip--large ${chipClass}">${daysLabel}</span>
      </div>`;
  });

  section.innerHTML = html;
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
