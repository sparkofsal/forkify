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
    recipeView.renderError(err.message);
  }
};

const controlSearchResults = async () => {
  try {
    // UI gets the query from the view (pub/sub)
    const query = searchView.getQuery();
    if (!query) return;

    // Spinner in results area
    resultsView.renderSpinner();

    // Load search results into state (model)
    await model.loadSearchResults(query);

    // Render results (whole array; we’ll paginate later)
    resultsView.render(model.state.search.results);
  } catch (err) {
    resultsView.renderError(err.message);
  }
};

const init = () => {
  // Recipe rendering events owned by the view
  recipeView.addHandlerRender(controlRecipes);

  // Search submit owned by the view
  searchView.addHandlerSearch(controlSearchResults);
};
init();
