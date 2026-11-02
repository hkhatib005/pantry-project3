import { useCallback, useEffect, useState } from 'react';

// One resource state prevents loading, error, and data from appearing together.
export function useFetch(url, validate) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ url, attempt, data: null, loading: true, error: null });
  const retry = useCallback(() => setAttempt(value => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ url, attempt, data: null, loading: true, error: null });
    const timeout = setTimeout(() => controller.abort(), 15000);
    async function load() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`The recipe service returned HTTP ${response.status}.`);
        const data = await response.json();
        if (!validate(data)) throw new Error('The recipe service returned an unexpected response.');
        if (active) setState({ url, attempt, data, loading: false, error: null });
      } catch (error) {
        if (active) setState({ url, attempt, data: null, loading: false, error: error.name === 'AbortError' ? 'The request took too long. Please try again.' : error.message || 'Unable to reach the recipe service.' });
      } finally {
        clearTimeout(timeout);
      }
    }
    load();
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [url, attempt, validate]);
  // Hide old data immediately when the URL or retry changes, before the effect runs.
  if (state.url !== url || state.attempt !== attempt) return { data: null, loading: true, error: null, retry };
  return { ...state, retry };
}
