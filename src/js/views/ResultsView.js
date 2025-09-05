// src/js/views/ResultsView.js
import View from './View.js';
import icons from '../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query';
  _message = '';

  _generateMarkup() {
    // data is an array of results
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview(result) {
    return `
      <li class="preview" data-id="${result.id}">
        <a class="preview__link" href="#${result.id}">
          <figure class="preview__fig">
            <img src="${result.image}" alt="${result.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${result.title}</h4>
            <p class="preview__publisher">${result.publisher}</p>
            <!-- (If your HTML includes user-generated badge, keep it but WITHOUT preview__link--active) --> 
          </div>
        </a>
      </li>
    `;
  }
}

export default new ResultsView();
