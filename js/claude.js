import { getSettings } from './store.js';

const VALID_CATEGORIES = ['Protein', 'Produce', 'Full Meals', 'Desserts', 'Other'];

export async function classifyItem(name, signal) {
  const settings = getSettings();
  if (!settings.anthropicApiKey) return null;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal,
      headers: {
        'x-api-key':                            settings.anthropicApiKey,
        'anthropic-version':                    '2023-06-01',
        'content-type':                         'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [{
          role:    'user',
          content: `Given the food item name "${name}", classify it into exactly one of these freezer categories: Protein, Produce, Full Meals, Desserts, Other. Respond with only the category name, nothing else.`,
        }],
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.content?.[0]?.text?.trim();
    return VALID_CATEGORIES.includes(text) ? text : null;
  } catch (e) {
    if (e.name === 'AbortError') throw e; // re-throw so callers can detect cancellation
    return null;
  }
}
