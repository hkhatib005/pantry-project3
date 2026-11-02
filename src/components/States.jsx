export function ErrorState({ error, retry, demo }) {
  return <div className="state error" role="alert"><span className="state-icon" aria-hidden="true">↻</span><h3>A little kitchen interruption.</h3><p>{error} Check your connection and try again.</p>{demo && <p>Error demo is on. Switch it off to restore live recipes.</p>}<button onClick={retry}>Try again</button></div>;
}
export function EmptyState({ reset }) {
  return <div className="state"><span className="state-icon" aria-hidden="true">⌕</span><h3>No recipes on the menu.</h3><p>Try another ingredient or clear your filters for a fresh start.</p><button onClick={reset}>Clear filters</button></div>;
}
export function Skeleton({ detail = false }) {
  return <div role="status" aria-label={detail ? 'Loading recipe' : 'Loading recipes'}><span className="sr-only">{detail ? 'Loading recipe…' : 'Loading recipes…'}</span><div className={detail ? 'detail-skeleton' : 'grid'}>{Array.from({ length: detail ? 1 : 6 }, (_, i) => <div className="skeleton" key={i}><div/><p/><p/></div>)}</div></div>;
}
