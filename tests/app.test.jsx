// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeCollection from '../src/components/RecipeCollection';
import { deriveRecipes } from '../src/api';
const pizza = { id: 1, name: 'Tomato Pizza', cuisine: 'Italian', ingredients: ['Tomato'], instructions: ['Bake it.'], image: 'pizza.webp', prepTimeMinutes: 10, cookTimeMinutes: 15, servings: 2, rating: 4.8, difficulty: 'Easy' };
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals(); });
function respond(value, ok = true) { return { ok, status: ok ? 200 : 404, json: async () => value }; }
describe('async recipe experience', () => {
  it('shows loading, fetched cards, derived search empty state and reset without more fetches', async () => {
    let finish;
    const fetch = vi.fn(() => new Promise(resolve => { finish = resolve; }));
    vi.stubGlobal('fetch', fetch);
    const user = userEvent.setup();
    render(<RecipeCollection demo={false}/>);
    expect(screen.getByLabelText('Loading recipes')).toBeTruthy();
    finish(respond({ recipes: [pizza] }));
    expect(await screen.findByRole('button', { name: 'View Tomato Pizza' })).toBeTruthy();
    await user.type(screen.getByRole('searchbox'), 'no such food');
    expect(screen.getByText('No recipes on the menu.')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('button', { name: 'View Tomato Pizza' })).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('handles HTTP errors and retry recovery', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(respond(null, false)).mockResolvedValue(respond({ recipes: [pizza] })));
    render(<RecipeCollection demo={false}/>);
    expect(await screen.findByRole('alert')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('button', { name: 'View Tomato Pizza' })).toBeTruthy();
  });
  it('handles network failure and malformed response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValue(respond({ unexpected: true })));
    render(<RecipeCollection demo={false}/>);
    expect((await screen.findByRole('alert')).textContent).toContain('Failed to fetch');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('unexpected response'));
  });
  it('triggers the broken endpoint on demand and restores the correct endpoint', async () => {
    const fetch = vi.fn(url => Promise.resolve(url.includes('not-a-real') ? respond(null, false) : respond({ recipes: [pizza] })));
    vi.stubGlobal('fetch', fetch);
    const { rerender } = render(<RecipeCollection demo={false}/>);
    await screen.findByRole('button', { name: 'View Tomato Pizza' });
    rerender(<RecipeCollection demo/>);
    expect(await screen.findByRole('alert')).toBeTruthy();
    rerender(<RecipeCollection demo={false}/>);
    expect(await screen.findByRole('button', { name: 'View Tomato Pizza' })).toBeTruthy();
  });
  it('filters ingredients, combines filters and does not mutate original data', () => {
    const other = { ...pizza, id: 2, name: 'Stew', cuisine: 'French', cookTimeMinutes: 60 };
    const original = [other, pizza];
    expect(deriveRecipes(original, 'tomato', 'Italian', true, 'time')).toEqual([pizza]);
    expect(deriveRecipes(original, '', 'All cuisines', false, 'name')[0]).toEqual(other);
    expect(original[0]).toEqual(other);
  });
});

it('persists favorites and combines saved and difficulty filters without requests', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respond({ recipes: [pizza, { ...pizza, id: 2, name: 'Soup', difficulty: 'Medium' }] })));
  const user = userEvent.setup();
  const { unmount } = render(<RecipeCollection demo={false}/>);
  await screen.findByRole('button', { name: 'Save Tomato Pizza', exact: true });
  await user.click(screen.getByRole('button', { name: 'Save Tomato Pizza', exact: true }));
  expect(JSON.parse(localStorage.getItem('pantry-favorites'))).toEqual([1]);
  await user.click(screen.getByRole('button', { name: '♥ Saved recipes (1)' }));
  expect(screen.queryByRole('button', { name: 'View Soup' })).toBeNull();
  await user.selectOptions(screen.getByRole('combobox', { name: 'Difficulty' }), 'Medium');
  expect(screen.getByText('No recipes on the menu.')).toBeTruthy();
  expect(fetch).toHaveBeenCalledTimes(1);
  unmount();
  render(<RecipeCollection demo={false}/>);
  expect(await screen.findByRole('button', { name: 'Unsave Tomato Pizza', exact: true })).toBeTruthy();
});
