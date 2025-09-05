// src/js/controller.js
import '../sass/main.scss';
import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import searchView from './views/SearchView.js';
import resultsView from './views/ResultsView.js';
import paginationView from './views/PaginationView.js'; // 👈 NEW

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
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    // 👇 render first page of results
    resultsView.render(model.getSearchResultsPage());

    // 👇 render pagination controls (pass whole search state)
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err.message);
  }
};

// 👇 NEW: respond to next/prev clicks
const controlPagination = (goToPage) => {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) Render NEW buttons
  paginationView.render(model.state.search);
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);

  // esta parte sirve para que al hacer click en next o prev se ejecute la funcion controlPagination
  paginationView.addHandlerClick(controlPagination);
};
init();
