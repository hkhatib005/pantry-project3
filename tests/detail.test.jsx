// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeDetail from '../src/components/RecipeDetail';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('renders detail loading, data, intentional error and retry', async () => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  let finish;
  const fetch = vi.fn().mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValue({ ok: false, status: 404 });
  vi.stubGlobal('fetch', fetch);
  const { rerender } = render(<RecipeDetail id={1} demo={false} close={() => {}}/>);
  expect(screen.getByLabelText('Loading recipe')).toBeTruthy();
  finish({ ok: true, json: async () => ({ id: 1, name: 'Pizza', ingredients: [], instructions: [], cuisine: 'Italian', image: 'pizza.webp', prepTimeMinutes: 10, cookTimeMinutes: 10 }) });
  expect(await screen.findByText('The recipe notes are empty.')).toBeTruthy();
  rerender(<RecipeDetail id={1} demo close={() => {}}/>);
  expect(await screen.findByRole('alert')).toBeTruthy();
  expect(fetch.mock.calls.at(-1)[0]).toBe('https://dummyjson.com/recipes/0');
  await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('alert')).toBeTruthy();
  expect(fetch).toHaveBeenCalledTimes(3);
});
