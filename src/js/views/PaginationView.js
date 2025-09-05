// src/js/views/PaginationView.js
import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // Controller will pass the whole search object: {query, results, page, resultsPerPage}
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are more pages -> only NEXT
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
        </button>
      `;
    }

    // Last page (curPage === numPages) and > 1 page -> only PREV
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn pagination__btn--prev">
          <svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }

    // Other page (middle) -> PREV + NEXT
    if (curPage < numPages) {
      return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn pagination__btn--prev">
          <svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
        </button>
      `;
    }

    // Page 1 and only 1 page -> no buttons
    return '';
  }

  // Pub/sub: controller provides handler to respond to clicks
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = Number(btn.dataset.goto);
      // console.log('goToPage:', goToPage); // uncomment to debug
      handler(goToPage);
    });
  }
}

export default new PaginationView();
