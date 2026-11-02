import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import RecipeCollection from './components/RecipeCollection';
import './styles.css';

function App() {
  const [demo, setDemo] = useState(false);
  return <><a className="skip" href="#collection">Skip to recipes</a><header><a className="brand" href="#" aria-label="Pantry home"><span aria-hidden="true">✳</span> pantry<span className="brand-period">.</span></a><span className="header-note">GOOD FOOD. EVERYDAY.</span><label className="demo"><input type="checkbox" checked={demo} onChange={event => setDemo(event.target.checked)}/> Error demo</label></header><main><section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="green-dot"/> A LITTLE INSPIRATION FOR YOUR KITCHEN</p><h1>Everyday ingredients.<br/><em>Extraordinary</em> meals.</h1><p className="hero-description">Good food starts with a little curiosity. Explore recipes from around the world and find something you’ll love to make.</p><a className="primary" href="#collection">Find something delicious <span aria-hidden="true">↘</span></a><div className="hero-footnote"><span aria-hidden="true">✳</span> Made for home cooks, everywhere.</div></div><div className="hero-art"><img src="https://cdn.dummyjson.com/recipe-images/1.webp" alt="Freshly baked Margherita pizza with tomatoes and basil"/><div className="hero-sticker">A little homemade<br/><em>goes a long way.</em></div><span className="image-caption">ON THE MENU / CLASSIC MARGHERITA</span></div></section><RecipeCollection demo={demo} setDemo={setDemo}/></main><footer><a className="brand" href="#">✳ pantry.</a><p>A world of recipes. Your kitchen.</p><a href="https://dummyjson.com/docs/recipes" target="_blank" rel="noreferrer">Sample recipe data by DummyJSON ↗</a></footer></>;
}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
