export const CATEGORIES = ['Protein', 'Produce', 'Full Meals', 'Desserts', 'Other'];

export const CATEGORY_DEFAULTS_MONTHS = {
  'Protein':    4,
  'Produce':    10,
  'Full Meals': 3,
  'Desserts':   6,
  'Other':      3,
};

export const UNIT_OPTIONS = {
  'Protein':    ['lbs', 'oz', 'pieces', 'servings'],
  'Produce':    ['bags', 'cups', 'oz', 'lbs'],
  'Full Meals': ['servings', 'portions', 'containers'],
  'Desserts':   ['servings', 'pieces', 'containers'],
  'Other':      ['servings', 'cups', 'oz', 'lbs', 'pieces'],
};

export const DEFAULT_UNIT = {
  'Protein':    'lbs',
  'Produce':    'bags',
  'Full Meals': 'servings',
  'Desserts':   'servings',
  'Other':      'servings',
};

export const CATEGORY_ICONS = {
  'Protein':    '🥩',
  'Produce':    '🥦',
  'Full Meals': '🍱',
  'Desserts':   '🍰',
  'Other':      '📦',
};

export const CATEGORY_BADGE_CLASS = {
  'Protein':    'badge--protein',
  'Produce':    'badge--produce',
  'Full Meals': 'badge--meals',
  'Desserts':   'badge--desserts',
  'Other':      'badge--other',
};

export const DEFAULT_ITEMS = [
  { name: 'Chicken breasts',  category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Chicken thighs',   category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Ground beef',      category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Salmon fillets',   category: 'Protein',    defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Shrimp',           category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Pork chops',       category: 'Protein',    defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Steak',            category: 'Protein',    defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Sausages',         category: 'Protein',    defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Bacon',            category: 'Protein',    defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
  { name: 'Edamame',          category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Peas',             category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Corn',             category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Spinach',          category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Broccoli',         category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Mixed vegetables', category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Berries',          category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Mango chunks',     category: 'Produce',    defaultUnit: 'bags',     isDefault: true, useCount: 0 },
  { name: 'Lasagna',          category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Soup',             category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Chili',            category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Curry',            category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Pasta sauce',      category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Stir fry',        category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Burritos',         category: 'Full Meals', defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Waffles',          category: 'Desserts',   defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Pie',              category: 'Desserts',   defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Ice cream',        category: 'Desserts',   defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Cookies',          category: 'Desserts',   defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Bread',            category: 'Other',      defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Tortillas',        category: 'Other',      defaultUnit: 'pieces',   isDefault: true, useCount: 0 },
  { name: 'Stocks / broth',   category: 'Other',      defaultUnit: 'servings', isDefault: true, useCount: 0 },
  { name: 'Butter',           category: 'Other',      defaultUnit: 'lbs',      isDefault: true, useCount: 0 },
];
