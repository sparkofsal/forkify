// src/js/controller.js
import '../sass/main.scss';
import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import searchView from './views/SearchView.js';
import resultsView from './views/ResultsView.js';

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error('controlRecipes error:', err);
    recipeView.renderError?.(err.message);
  }
};

// NEW: search controller
const controlSearchResults = async () => {
  try {
    // 1) get query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) show spinner
    resultsView.renderSpinner();

    // 3) load results
    await model.loadSearchResults(query);

    // 4) render first page of results
    resultsView.render(model.getSearchResultsPage(1));
  } catch (err) {
    console.error('controlSearchResults error:', err);
    resultsView.renderError(err.message);
  }
};

const init = () => {
  ['hashchange', 'load'].forEach(ev =>
    window.addEventListener(ev, controlRecipes)
  );
  searchView.addHandlerSearch(controlSearchResults);
};

init();
