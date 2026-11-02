# Pantry — Project 3 Async React

A responsive recipe explorer built with React and Vite. Search names, cuisines, and ingredients; combine cuisine and total-time filters; sort recipes; and open full cooking instructions.

## Run locally

Use Node 22.12+ (or Node 24 LTS).

```sh
npm ci
npm run dev
```

Open the local address printed by Vite.

```sh
npm test
npm run build
npm run preview
```

## Public API

[DummyJSON Recipes](https://dummyjson.com/docs/recipes), a real public HTTP API serving sample recipe data without authentication. The app fetches `/recipes?limit=0` and `/recipes/:id` directly from `https://dummyjson.com`. No secret keys, mock fallback, or server required. Recipe images come from DummyJSON's CDN. Google Fonts is optional; system font fallbacks are provided.

## Requirement map

- `src/hooks/useFetch.js`: shared asynchronous state, HTTP status checks, JSON parsing, response validation, 15-second timeout, stable retry callback, effect dependencies, abort cleanup and stale-response protection.
- `RecipeCollection` and `RecipeDetail` each use the hook. Both display loading skeletons, error messages with retry, and data/empty states.
- `src/api.js`: `deriveRecipes` computes a filtered, sorted view from fetched recipes and current controls. Filtered results are never stored in state. Typing makes no requests.
- Collection empty state handles both empty server arrays and filters with no matches. Detail view explains missing ingredient/instruction lists.
- Native modal dialog supports Escape, focus containment, focus restoration, backdrop dismissal, and an accessible title. Inputs are labeled, focus indicators visible, and animation respects reduced-motion preferences.

## Trigger the error state

Turn on **Error demo** in the header. This requests a deliberately invalid collection endpoint. The visible error includes a **Try again** button. Retry repeats the broken request until you turn the switch off, which reloads the valid endpoint.

To demonstrate the detail error, open any recipe and enable **Error demo** inside its dialog. It requests `/recipes/0`, which returns an HTTP error. Retry repeats the error; disable the switch to recover.

For slow loading, use browser network throttling and Refresh recipes or open a card. For an empty state, search `zzzz-no-match`. Clear filters restores recipes.

## Deploy to Netlify

Repository URL: https://github.com/hkhatib005/pantry-project3

Live URL: **Pending Netlify deployment**. Replace this line with the actual public URL after deploying; this project is not yet submitted or deployed.

1. Create a GitHub repository and push this source, excluding `node_modules` and `dist`.
2. In Netlify choose Add new project → Import an existing project → GitHub and select the repository.
3. Use build command `npm run build` and publish directory `dist`. `netlify.toml` includes these values.
4. Deploy, put the real live URL above, and check both URLs in an incognito window.
5. Submit the repository URL, live Netlify URL, and error note through Brightspace yourself.

Suggested submission comment: “I used the DummyJSON Recipes API; turn on Error demo in the header to show the error state, use Try again to retry, and turn the switch off to restore live recipes.”

## Explain the code before submitting

Trace `App` → `RecipeCollection` → `useFetch`. Explain why the effect depends on URL, retry attempt, and a module-level validator; why cleanup cancels obsolete requests; why HTTP errors need an explicit `response.ok` check; and why a filtered view is calculated rather than synchronized using another effect. `RecipeDetail` makes an independent request using the same hook.

Review the implementation and be ready to explain each part before submitting. Commit actual changes as development continues.
