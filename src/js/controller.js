// ─────────────────────────────────────────────────────────────
// Assets
// ─────────────────────────────────────────────────────────────
import icons from '../img/icons.svg';   // SVG sprite (Parcel will rewrite path)
import '../sass/main.scss';             // Global styles

// ─────────────────────────────────────────────────────────────
// DOM cache (query once, reuse)
// ─────────────────────────────────────────────────────────────
const els = {
  recipe: document.querySelector('.recipe'),
  resultsList: document.querySelector('.results'),
  searchForm: document.querySelector('.search'),
  searchField: document.querySelector('.search__field'),
};

// ─────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────

/**
 * Reject after s seconds so fetches don’t hang forever.
 */
const timeout = s =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request took too long! Timeout after ${s} second(s)`)), s * 1000)
  );

/**
 * Fetch JSON with basic error handling + timeout (senior-dev pattern).
 */
const fetchJSON = async (url, seconds = 10) => {
  const res = await Promise.race([fetch(url), timeout(seconds)]);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

/**
 * Render a spinner inside a container.
 */
const renderSpinner = parentEl => {
  if (!parentEl) throw new Error('renderSpinner called without a valid parentEl');
  const markup = `
    <div class="spinner">
      <svg><use href="${icons}#icon-loader"></use></svg>
    </div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

/**
 * Render a user-friendly error box.
 */
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

// ─────────────────────────────────────────────────────────────
// Renderers
// ─────────────────────────────────────────────────────────────

/**
 * Render the full recipe view.
 * Assumes a normalized recipe object (mapped fields).
 */
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
  els.recipe.innerHTML = '';
  els.recipe.insertAdjacentHTML('afterbegin', markup);
};

/**
 * Render the search results list (left column).
 * `recipes` is the array from search endpoint (raw items have image_url/title/publisher/id).
 */
const renderResults = recipes => {
  const markup = recipes
    .map(
      r => `
      <li class="preview" data-id="${r.id}">
        <a class="preview__link" href="#">
          <figure class="preview__fig">
            <img src="${r.image_url}" alt="${r.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${r.title}</h4>
            <p class="preview__publisher">${r.publisher}</p>
          </div>
        </a>
      </li>`
    )
    .join('');

  els.resultsList.innerHTML = '';
  els.resultsList.insertAdjacentHTML('afterbegin', markup);
};

// ─────────────────────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────────────────────

/**
 * Controller: Run a search based on the form input, then render results.
 */
const controlSearch = async e => {
  e.preventDefault();

  // 1) Read and validate query
  const query = els.searchField.value.trim();
  if (!query) return;

  try {
    // 2) UI: spinner in results list
    renderSpinner(els.resultsList);

    // 3) Fetch results
    const data = await fetchJSON(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`);

    // 4) Guard: empty results
    if (!data?.data?.recipes?.length) {
      renderError(els.resultsList, `No results for "${query}". Try another keyword.`);
      return;
    }

    // 5) Render list
    renderResults(data.data.recipes);
  } catch (err) {
    console.error(err);
    renderError(els.resultsList, err.message);
  }
};

/**
 * Controller: Load a single recipe by id and render it.
 */
const controlRecipe = async id => {
  if (!id) return;

  try {
    // 1) UI: spinner in recipe area
    renderSpinner(els.recipe);

    // 2) Fetch single recipe
    const data = await fetchJSON(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);

    // 3) Normalize response -> UI model
    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // 4) Render
    renderRecipe(recipe);
  } catch (err) {
    console.error(err);
    renderError(els.recipe, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// Event listeners (init)
// ─────────────────────────────────────────────────────────────

// Submit search form -> fetch & show results
els.searchForm.addEventListener('submit', controlSearch);

// Click a result -> load its recipe
els.resultsList.addEventListener('click', e => {
  const li = e.target.closest('.preview');
  if (!li) return;
  const id = li.dataset.id;
  controlRecipe(id);
});

// NOTE: We intentionally DO NOT auto-load any recipe on startup.
// The page will show the default message until the user searches.
