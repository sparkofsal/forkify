// src/js/model.js

// App state lives here (recipe, search, bookmarks etc.)
export const state = {
  recipe: {},       // current recipe
  search: {         // (placeholder for later)
    query: '',
    results: [],
  },
  bookmarks: [],    // (placeholder for later)
};

// Utility: small timeout in case you want to reuse here later
const timeout = s =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request took too long! Timeout after ${s} second(s)`)), s * 1000)
  );

/**
 * Load a single recipe by id and put it into state.recipe (normalized).
 * @param {string} id
 */
export const loadRecipe = async function (id) {
  try {
    const url = `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`;
    // a) declaration of res
    const res = await Promise.race([fetch(url), timeout(10)]);

    // c) validate res
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    // b) declaration of data
    const data = await res.json();

    // d) state receives the normalized recipe
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // d-ii) log to verify
    console.log('model.state.recipe:', state.recipe);
  } catch (err) {
    // 2) catch -> alert or rethrow so controller handles UI
    throw err;
  }
};
