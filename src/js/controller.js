// src/js/controller.js

// Assets
import icons from '../img/icons.svg';
import '../sass/main.scss';

// Import everything as "model"
import * as model from './model.js';

// DOM cache
const recipeContainer = document.querySelector('.recipe');

// View helpers
const renderSpinner = parentEl => {
  const markup = `
    <div class="spinner">
      <svg><use href="${icons}#icon-loader"></use></svg>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const renderError = (parentEl, message = 'Something went wrong 😔') => {
  const markup = `
    <div class="error">
      <div><svg><use href="${icons}#icon-alert-triangle"></use></svg></div>
      <p>${message}</p>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

const renderRecipe = recipe => {
  const markup = `
    <figure class="recipe__fig">
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
      <h1 class="recipe__title"><span>${recipe.title}</span></h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon"><use href="${icons}#icon-clock"></use></svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon"><use href="${icons}#icon-users"></use></svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text">servings</span>
      </div>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${recipe.ingredients
          .map(
            ing => `
            <li class="recipe__ingredient">
              <svg class="recipe__icon"><use href="${icons}#icon-check"></use></svg>
              <div class="recipe__quantity">${ing.quantity ?? ''}</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit ?? ''}</span>
                ${ing.description}
              </div>
            </li>`
          )
          .join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
        directions at their website.
      </p>
      <a class="btn--small recipe__btn" href="${recipe.sourceUrl}" target="_blank" rel="noreferrer">
        <span>Directions</span>
        <svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
      </a>
    </div>
  `;
  recipeContainer.innerHTML = '';
  recipeContainer.insertAdjacentHTML('afterbegin', markup);
};

/**
 * Controller: read id from hash, ask model to load it, then render view
 */
const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    renderSpinner(recipeContainer);

    // ii) await model.loadRecipe(id)
    await model.loadRecipe(id);

    // iii) destructure from model.state
    const { recipe } = model.state;

    renderRecipe(recipe);
  } catch (err) {
    console.error(err);
    renderError(recipeContainer, err.message);
  }
};

// Init: hashchange + load
['hashchange', 'load'].forEach(ev => window.addEventListener(ev, controlRecipe));
