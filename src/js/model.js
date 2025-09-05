import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {            // will use in step 4
    query: '',
    results: [],
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
    // Re-throw so controller can renderError
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    // a/b/c) fetch results
    const data = await getJSON(`${API_URL}?search=${query}`);

    // 2.a) store query
    state.search.query = query;

    // d / 2.b.ii) map results into normalized objects and store
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    // e/f) log and rethrow so the controller can show UI error
    console.log(`${err} 💥💥💥💥`);
    throw err;
  }
};
