import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { API, validList, deriveRecipes } from '../api';
import { EmptyState, ErrorState, Skeleton } from './States';
import RecipeDetail from './RecipeDetail';

export default function RecipeCollection({ demo, setDemo }) {
  const { data, loading, error, retry } = useFetch(`${API}/${demo ? 'recipes/not-a-real-endpoint' : 'recipes?limit=0'}`, validList);
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('All cuisines');
  const [quick, setQuick] = useState(false);
  const [sort, setSort] = useState('rating');
  const [difficulty, setDifficulty] = useState('All difficulties');
  const [savedOnly, setSavedOnly] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [saved, setSaved] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem('pantry-favorites') || '[]');
      return Array.isArray(value) ? value.filter(Number.isInteger) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem('pantry-favorites', JSON.stringify(saved)); setStorageError(''); }
    catch { setStorageError('Favorites are available for this visit, but this browser could not save them.'); }
  }, [saved]);
  function toggleSaved(id) { setSaved(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]); }
  const [selected, setSelected] = useState(null);
  const recipes = data?.recipes || [];
  // Derived view: fetched data stays untouched; no duplicate filtered state/effect.
  const visible = deriveRecipes(recipes, query, cuisine, quick, sort).filter(recipe => (difficulty === 'All difficulties' || recipe.difficulty === difficulty) && (!savedOnly || saved.includes(recipe.id)));
  const cuisines = [...new Set(recipes.map(recipe => recipe.cuisine))].sort();
  function reset() { setQuery(''); setCuisine('All cuisines'); setQuick(false); setDifficulty('All difficulties'); setSavedOnly(false); }
  return <section id="collection" aria-labelledby="collection-title"><div className="section-heading"><div><p className="eyebrow">THE RECIPE COLLECTION</p><h2 id="collection-title">Find your next favorite.</h2></div><button className="text-button" onClick={retry}>↻ Refresh recipes</button></div><div className="filters"><label className="search"><span aria-hidden="true">⌕</span><span className="sr-only">Search recipes or ingredients</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="A dish, an ingredient, a little inspiration…" type="search"/></label><label><span className="sr-only">Cuisine</span><select value={cuisine} onChange={event => setCuisine(event.target.value)}><option>All cuisines</option>{cuisines.map(item => <option key={item}>{item}</option>)}</select></label><button className={quick ? 'quick active' : 'quick'} aria-pressed={quick} onClick={() => setQuick(value => !value)}>◷ Under 30 min</button></div><div className="extra-filters"><label><span className="sr-only">Difficulty</span><select aria-label="Difficulty" value={difficulty} onChange={event => setDifficulty(event.target.value)}><option>All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label><button className={savedOnly ? 'quick active' : 'quick'} aria-pressed={savedOnly} onClick={() => setSavedOnly(value => !value)}>♥ Saved recipes ({saved.length})</button><button className="text-button" onClick={reset}>Reset filters</button></div>{storageError && <p role="status">{storageError}</p>}<div className="results-bar"><p role="status">{loading ? 'Gathering something delicious…' : error ? 'Recipes are temporarily unavailable' : `${visible.length} recipes to make your own`}</p><label>Sort by <select value={sort} onChange={event => setSort(event.target.value)}><option value="rating">Top rated</option><option value="time">Cooking time</option><option value="name">Name A–Z</option></select></label></div>{loading ? <Skeleton/> : error ? <ErrorState error={error} retry={retry} demo={demo}/> : visible.length === 0 ? <EmptyState reset={reset}/> : <div className="grid">{visible.map(recipe => <div className="card-wrapper" key={recipe.id}><button className="save-button" aria-label={`${saved.includes(recipe.id) ? 'Unsave' : 'Save'} ${recipe.name}`} aria-pressed={saved.includes(recipe.id)} onClick={() => toggleSaved(recipe.id)}>{saved.includes(recipe.id) ? '♥' : '♡'}</button><button className="recipe-card" onClick={() => setSelected(recipe.id)} aria-label={`View ${recipe.name}`}><div className="photo"><img src={recipe.image} alt="" loading="lazy"/><span className="difficulty">{recipe.difficulty}</span></div><div className="card-body"><div className="card-kicker"><span>{recipe.cuisine}</span><span className="rating">★ {recipe.rating ?? '—'}</span></div><h3>{recipe.name}</h3><div className="card-footer"><span>◷ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min <span className="dot">·</span> {recipe.servings} servings</span><span aria-hidden="true">↗</span></div></div></button></div>)}</div>}{selected !== null && <RecipeDetail id={selected} demo={demo} setDemo={setDemo} close={() => setSelected(null)}/>}</section>;
}
