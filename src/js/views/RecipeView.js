// src/js/views/RecipeView.js

import icons from '../../img/icons.svg';       // import icons for use in markup
import { Fraction } from 'fractional';        // for converting 0.5 -> 1/2 etc.

/**
 * RecipeView class responsible for rendering a single recipe
 */
class RecipeView {
  // Private fields
  #parentElement = document.querySelector('.recipe');
  #data;

  /**
   * Public method: render recipe into the DOM
   */
  render(data) {
    this.#data = data;                        // store the recipe data
    const markup = this.#generateMarkup();    // generate markup
    this.#clear();                            // clear container
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Public method: render a spinner while waiting
   */
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg><use href="${icons}#icon-loader"></use></svg>
      </div>
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // Private method: clear container
  #clear() {
    this.#parentElement.innerHTML = '';
  }

  // Private method: generate recipe HTML
  #generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this.#data.image}" alt="${this.#data.title}" class="recipe__img" />
        <h1 class="recipe__title"><span>${this.#data.title}</span></h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon"><use href="${icons}#icon-clock"></use></svg>
          <span class="recipe__info-data recipe__info-data--minutes">${this.#data.cookTime}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon"><use href="${icons}#icon-users"></use></svg>
          <span class="recipe__info-data recipe__info-data--people">${this.#data.servings}</span>
          <span class="recipe__info-text">servings</span>
        </div>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this.#data.ingredients
            .map(ing => {
              return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon"><use href="${icons}#icon-check"></use></svg>
                <div class="recipe__quantity">
                  ${
                    ing.quantity
                      ? new Fraction(ing.quantity).toString()
                      : ''
                  }
                </div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit ?? ''}</span>
                  ${ing.description}
                </div>
              </li>`;
            })
            .join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${this.#data.publisher}</span>. Please check out
          directions at their website.
        </p>
        <a class="btn--small recipe__btn" href="${this.#data.sourceUrl}" target="_blank" rel="noreferrer">
          <span>Directions</span>
          <svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
        </a>
      </div>
    `;
  }
}

// Export a singleton instance
export default new RecipeView();
