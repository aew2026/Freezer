import {
  getItemList, getItemByName,
  addInventoryItem, addToItemList, incrementItemUseCount,
  getSettings,
} from '../store.js';
import { today, addMonths, debounce } from '../utils.js';
import {
  CATEGORIES, CATEGORY_ICONS, CATEGORY_DEFAULTS_MONTHS,
  UNIT_OPTIONS, DEFAULT_UNIT,
} from '../defaults.js';
import { classifyItem } from '../claude.js';

// References to other tabs for cross-tab refresh (set by app.js)
export let _refreshHome = null;
export let _refreshInventory = null;
export function setRefreshCallbacks(home, inventory) {
  _refreshHome = home;
  _refreshInventory = inventory;
}

let container = null;
let selectedCategory = null;
let quantity = 1;
let classifyController = null;

export function mount(el) {
  container = el;
  el.innerHTML = buildFormHTML();
  bindListeners(el);
  resetForm();
}

export function refresh() {
  // Re-populate autocomplete list in case item list changed
}

function buildFormHTML() {
  const categoryChips = CATEGORIES.map(c => `
    <button type="button" class="chip" data-cat="${c}">
      ${CATEGORY_ICONS[c]} ${c}
    </button>`).join('');

  const unitSelect = `<select class="input" id="addUnit" style="width:120px;flex-shrink:0"></select>`;

  return `
    <h2 style="font-size:18px;font-weight:600;margin-bottom:20px">Add to Freezer</h2>

    <div class="form-row">
      <div class="input-group">
        <label class="input-label" for="addName">Item Name</label>
        <div class="autocomplete-wrap">
          <input class="input" id="addName" type="text" placeholder="e.g. Chicken thighs" autocomplete="off" autocorrect="off">
          <ul class="autocomplete-list" id="addAutocomplete" hidden></ul>
        </div>
      </div>
    </div>

    <div class="form-row">
      <div class="input-label" style="margin-bottom:8px">Category</div>
      <div class="chip-group" id="catChips">
        ${categoryChips}
      </div>
    </div>

    <div class="form-row">
      <div class="input-label" style="margin-bottom:8px">Quantity</div>
      <div style="display:flex;gap:12px;align-items:center">
        <div class="stepper">
          <button type="button" class="stepper__btn" id="addQtyMinus">−</button>
          <span class="stepper__val" id="addQtyVal">1</span>
          <button type="button" class="stepper__btn" id="addQtyPlus">+</button>
        </div>
        ${unitSelect}
      </div>
    </div>

    <div class="form-row form-row--inline">
      <div class="input-group">
        <label class="input-label" for="addDateFrozen">Date Frozen</label>
        <input class="input" id="addDateFrozen" type="date">
      </div>
      <div class="input-group">
        <label class="input-label" for="addUseBy">Use By</label>
        <input class="input" id="addUseBy" type="date">
      </div>
    </div>

    <div style="margin-top:8px">
      <button class="btn btn--primary" id="addSaveBtn" type="button">Save to Freezer</button>
    </div>
  `;
}

function bindListeners(el) {
  const nameInput    = el.querySelector('#addName');
  const autocomplete = el.querySelector('#addAutocomplete');
  const catChips     = el.querySelector('#catChips');
  const minusBtn     = el.querySelector('#addQtyMinus');
  const plusBtn      = el.querySelector('#addQtyPlus');
  const qtyVal       = el.querySelector('#addQtyVal');
  const saveBtn      = el.querySelector('#addSaveBtn');

  // Name input
  const debouncedClassify = debounce(async (name) => {
    if (!name || name.length < 3) return;
    const settings = getSettings();
    if (!settings.anthropicApiKey) return;

    if (classifyController) classifyController.abort();
    classifyController = new AbortController();

    catChips.classList.add('is-loading');
    try {
      const cat = await classifyItem(name, classifyController.signal);
      catChips.classList.remove('is-loading');
      if (cat) selectCategory(cat);
    } catch (e) {
      catChips.classList.remove('is-loading');
      if (e.name !== 'AbortError') console.warn('Classify failed', e);
    }
  }, 500);

  nameInput.addEventListener('input', e => {
    const val = e.target.value.trim();
    populateAutocomplete(val);
    debouncedClassify(val);
  });

  nameInput.addEventListener('focusout', () => {
    setTimeout(() => {
      autocomplete.hidden = true;
    }, 150);
  });

  // Autocomplete item click
  autocomplete.addEventListener('click', e => {
    const item = e.target.closest('.autocomplete-item');
    if (!item) return;
    const name = item.dataset.name;
    const cat  = item.dataset.cat;
    nameInput.value = name;
    autocomplete.hidden = true;
    if (cat) selectCategory(cat);
    else autoSetCategoryFromList(name);
  });

  // Category chips
  catChips.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    selectCategory(chip.dataset.cat);
  });

  // Stepper
  minusBtn.addEventListener('click', () => {
    if (quantity > 0.5) {
      quantity = Math.max(0.5, quantity - 1);
      qtyVal.textContent = formatQty(quantity);
    }
  });

  plusBtn.addEventListener('click', () => {
    quantity += 1;
    qtyVal.textContent = formatQty(quantity);
  });

  // Save
  saveBtn.addEventListener('click', handleSave);
}

function populateAutocomplete(val) {
  const autocomplete = container.querySelector('#addAutocomplete');
  if (!val || val.length < 1) {
    autocomplete.hidden = true;
    return;
  }
  const matches = getItemList()
    .filter(i => i.name.toLowerCase().startsWith(val.toLowerCase()))
    .slice(0, 8);

  if (matches.length === 0) {
    autocomplete.hidden = true;
    return;
  }

  autocomplete.innerHTML = matches.map(i => `
    <li class="autocomplete-item" data-name="${escHtml(i.name)}" data-cat="${escHtml(i.category || '')}">
      <span>${escHtml(i.name)}</span>
      <span class="autocomplete-item__badge">${i.category || ''}</span>
    </li>`).join('');
  autocomplete.hidden = false;
}

function autoSetCategoryFromList(name) {
  const item = getItemByName(name);
  if (item?.category) selectCategory(item.category);
}

function selectCategory(cat) {
  selectedCategory = cat;
  container.querySelectorAll('#catChips .chip').forEach(c => {
    c.classList.toggle('is-selected', c.dataset.cat === cat);
  });
  updateUnitOptions(cat);
  updateUseByDate(cat);
}

function updateUnitOptions(cat) {
  const unitSelect = container.querySelector('#addUnit');
  if (!unitSelect) return;
  const units = UNIT_OPTIONS[cat] || UNIT_OPTIONS['Other'];
  unitSelect.innerHTML = units.map(u => `<option value="${u}">${u}</option>`).join('');
  unitSelect.value = DEFAULT_UNIT[cat] || units[0];
}

function updateUseByDate(cat) {
  const useByInput = container.querySelector('#addUseBy');
  if (!useByInput) return;
  const settings = getSettings();
  const months = (settings.categoryDefaults && settings.categoryDefaults[cat])
    || CATEGORY_DEFAULTS_MONTHS[cat]
    || 3;
  useByInput.value = addMonths(today(), months);
}

function handleSave() {
  const nameInput = container.querySelector('#addName');
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    nameInput.style.borderColor = 'var(--color-red)';
    setTimeout(() => nameInput.style.borderColor = '', 1500);
    return;
  }

  const cat = selectedCategory;
  if (!cat) {
    container.querySelector('#catChips').style.outline = '2px solid var(--color-red)';
    container.querySelector('#catChips').style.borderRadius = '8px';
    setTimeout(() => {
      container.querySelector('#catChips').style.outline = '';
    }, 1500);
    return;
  }

  const unit       = container.querySelector('#addUnit')?.value || DEFAULT_UNIT[cat] || 'servings';
  const dateFrozen = container.querySelector('#addDateFrozen').value || today();
  const useByDate  = container.querySelector('#addUseBy').value || addMonths(dateFrozen, CATEGORY_DEFAULTS_MONTHS[cat] || 3);

  addInventoryItem({ name, category: cat, quantity, unit, dateFrozen, useByDate });
  incrementItemUseCount(name);

  // Add to item list if new
  const existing = getItemByName(name);
  if (!existing) {
    addToItemList({ name, category: cat, defaultUnit: unit, isDefault: false, useCount: 1 });
  }

  // Success flash
  const saveBtn = container.querySelector('#addSaveBtn');
  saveBtn.textContent = 'Saved! ✓';
  saveBtn.disabled = true;
  setTimeout(() => {
    saveBtn.textContent = 'Save to Freezer';
    saveBtn.disabled = false;
    resetForm();
  }, 1500);

  // Refresh sibling tabs
  if (_refreshHome)      _refreshHome();
  if (_refreshInventory) _refreshInventory();
}

function resetForm() {
  if (!container) return;
  container.querySelector('#addName').value = '';
  container.querySelector('#addAutocomplete').hidden = true;
  container.querySelector('#addDateFrozen').value = today();
  quantity = 1;
  container.querySelector('#addQtyVal').textContent = '1';
  selectedCategory = null;
  container.querySelectorAll('#catChips .chip').forEach(c => c.classList.remove('is-selected'));
  container.querySelector('#addUnit').innerHTML = '';
  container.querySelector('#addUseBy').value = '';
  container.querySelector('#addName').focus();
}

function formatQty(n) {
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

function escHtml(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
