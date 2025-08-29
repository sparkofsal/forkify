// src/js/views/ResultsView.js
import icons from '../../img/icons.svg';

class ResultsView {
  #parentElement = document.querySelector('.results');

  render(data) {
    // data is an array of results
    const markup = data.map(this.#generateMarkupPreview).join('');
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg><use href="${icons}#icon-loader"></use></svg>
      </div>
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = 'No results found. Try another keyword.') {
    const markup = `
      <div class="error">
        <div><svg><use href="${icons}#icon-alert-triangle"></use></svg></div>
        <p>${message}</p>
      </div>
    `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  #generateMarkupPreview(result) {
    return `
      <li class="preview" data-id="${result.id}">
        <a class="preview__link" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
          </div>
        </a>
      </li>
    `;
  }
}

export default new ResultsView();
