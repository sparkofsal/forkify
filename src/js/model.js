// src/js/model.js
import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],       // array of {id,title,publisher,image_url}
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
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
  } catch (err) {
    console.log(`${err} 💥💥💥💥`);
    throw err;
  }
};

// NEW: search loader
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    state.search.page = 1;

    const data = await getJSON(`${API_URL}?search=${query}`);
    // Normalize results to only the fields you need
    state.search.results = data.data.recipes.map(r => ({
      id: r.id,
      title: r.title,
      publisher: r.publisher,
      image: r.image_url,
    }));
  } catch (err) {
    console.log(`${err} 💥💥💥💥`);
    throw err;
  }
};

// Helper for pagination (we’ll use it next)
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
