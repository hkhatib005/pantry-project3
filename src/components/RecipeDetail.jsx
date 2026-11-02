import { useEffect, useRef } from 'react';
import { useFetch } from '../hooks/useFetch';
import { API, validRecipe } from '../api';
import { ErrorState, Skeleton } from './States';

export default function RecipeDetail({ id, demo, setDemo, close }) {
  const { data, loading, error, retry } = useFetch(`${API}/recipes/${demo ? '0' : id}`, validRecipe);
  const dialog = useRef(null);
  useEffect(() => { const previous = document.activeElement; dialog.current.showModal(); return () => previous?.focus(); }, []);
  return <dialog ref={dialog} onCancel={close} onClick={event => { if (event.target === event.currentTarget) close(); }} aria-labelledby="recipe-title"><div className="dialog-header"><span>FROM THE PANTRY</span>{setDemo && <label className="demo"><input type="checkbox" checked={demo} onChange={event => setDemo(event.target.checked)}/> Error demo</label>}<button className="close" onClick={close} aria-label="Close recipe">×</button></div><h2 id="recipe-title">{data?.name || 'Recipe details'}</h2>{loading ? <Skeleton detail/> : error ? <ErrorState error={error} retry={retry} demo={demo}/> : <><img className="detail-image" src={data.image} alt={data.name}/><p className="detail-meta">{data.cuisine} · {data.prepTimeMinutes + data.cookTimeMinutes} minutes · {data.servings} servings</p>{data.ingredients.length === 0 && data.instructions.length === 0 ? <div className="state"><h3>The recipe notes are empty.</h3><p>Choose another recipe from the collection.</p></div> : <div className="recipe-body"><section><h3>Ingredients</h3>{data.ingredients.length ? <ul>{data.ingredients.map((item, i) => <li key={i}>{item}</li>)}</ul> : <p>No ingredients supplied.</p>}</section><section><h3>Let’s cook</h3>{data.instructions.length ? <ol>{data.instructions.map((item, i) => <li key={i}>{item}</li>)}</ol> : <p>No instructions supplied.</p>}</section></div>}</>}</dialog>;
}
