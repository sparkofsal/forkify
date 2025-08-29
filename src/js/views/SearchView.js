// src/js/views/SearchView.js
class SearchView {
  #parentElement = document.querySelector('.search');
  #input = this.#parentElement.querySelector('.search__field');

  getQuery() {
    const q = this.#input.value.trim();
    this.#input.value = '';
    return q;
  }

  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
