// src/js/controller.js
import '../sass/main.scss';
import * as model from './model.js';
import recipeView from './views/RecipeView.js';

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

const init = () => {
  recipeView.addHandlerRender(controlRecipes); // <- pub/sub wiring
};
init();
