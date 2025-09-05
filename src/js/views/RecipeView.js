// src/js/views/RecipeView.js
import icons from '../../img/icons.svg';

// ... keep your existing code (formatQuantity, class, etc.)

class RecipeView {
  #parentElement = document.querySelector('.recipe');
  #data;

  // Default UI messages
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = 'Success!';

  render(data) { /* ... as you already have ... */ }
  renderSpinner() { /* ... as you already have ... */ }

  /**
   * Publisher side of pub/sub: the view owns DOM events and
   * notifies the controller via the handler you pass in.
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev =>
      window.addEventListener(ev, handler)
    );
  }

  /**
   * Show a user-friendly error box inside the view.
   */
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg><use href="${icons}#icon-alert-triangle"></use></svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Show a generic success/info message (smiley icon).
   */
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg><use href="${icons}#icon-smile"></use></svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() { /* ... as you already have ... */ }
  #generateMarkup() { /* ... as you already have ... */ }
}

export default new RecipeView();
