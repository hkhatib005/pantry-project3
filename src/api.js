export const API = 'https://dummyjson.com';
export const validRecipe = value => value && Number.isInteger(value.id) && typeof value.name === 'string' && Array.isArray(value.ingredients) && value.ingredients.every(x => typeof x === 'string') && Array.isArray(value.instructions) && value.instructions.every(x => typeof x === 'string') && typeof value.cuisine === 'string' && typeof value.image === 'string' && Number.isFinite(value.prepTimeMinutes) && Number.isFinite(value.cookTimeMinutes);
export const validList = value => value && Array.isArray(value.recipes) && value.recipes.every(validRecipe);
export function deriveRecipes(recipes, query, cuisine, quick, sort) {
  const term = query.trim().toLocaleLowerCase();
  return recipes.filter(recipe => (cuisine === 'All cuisines' || recipe.cuisine === cuisine) && (!quick || recipe.prepTimeMinutes + recipe.cookTimeMinutes <= 30) && [recipe.name, recipe.cuisine, ...recipe.ingredients].some(value => value.toLocaleLowerCase().includes(term))).sort((a, b) => sort === 'time' ? (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes) : sort === 'name' ? a.name.localeCompare(b.name) : (b.rating || 0) - (a.rating || 0));
}
