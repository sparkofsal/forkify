// src/js/controller.js

import '../sass/main.scss';
import * as model from './model.js';
import recipeView from './views/RecipeView.js';

/**
 * Controller: get recipe id from hash, ask model to load it, then ask view to render
 */
const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // show spinner
    recipeView.renderSpinner();

    // load recipe into state
    await model.loadRecipe(id);

    // render recipe from model.state
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
  }
};

// Init listeners
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
