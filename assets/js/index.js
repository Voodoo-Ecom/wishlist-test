const cardListEl = document.querySelector('.cats__list');
const resetButtonEl = document.getElementById('reset-button');

// API
const BASE_URL = 'https://api.thecatapi.com/v1/images/search';
const API_KEY = 'live_ST09boZt58lcEhnCapTTn4JAcUEB72aRfAuLhpU5pxAiAImePNDmuCEvlyaNB56Q';
const limit = 12;

const getAllCats = async (page = 1) => {
  try {
    const catsData = [];
    const res = await fetch(`${BASE_URL}?limit=${limit}&page=${page}&order=ASC&has_breeds=1&api_key=${API_KEY}`);
    const data = await res.json();
    catsData.push(...data);
    return catsData;
  } catch (error) {
    console.error('Error occured on fetching products:', error);
    return null;
  }
};

// MARKUP
const createCatsListMarkup = (cats) => {
  const listMarkup = cats.reduce((markup, cat) => {
    const { id, url } = cat;
    const { name, description } = cat.breeds[0];
    const likedClassName = checkIfCatIsInLocalStorage(id) ? 'liked' : '';

    const cardMarkup = `<li class="cats__item" id=${id}>
      <div class="cats__image-wrapper">
        <img class="cats__image"
          src="${url}"
          alt="cat" width="272" height="122">
        <button class="cats__like-btn ${likedClassName}"></button>
      </div>
      <div class="cats__info-wrapper">
        <h3 class="cats__title">${name}</h3>
        <p class="cats__description">${description}</p>
      </div>
    </li>`;

    return (markup += cardMarkup);
  }, '');

  return listMarkup;
};

// WISHLIST
const getCatsFromLocalStorage = () => {
  const storedCats = localStorage.getItem('catsInWishlist') ? JSON.parse(localStorage.getItem('catsInWishlist')) : [];
  return storedCats;
};

const addCatToLocalStorage = (catId) => {
  const catsInWishlistIds = getCatsFromLocalStorage();
  if (catsInWishlistIds.find((likedCatId) => likedCatId === catId)) return;

  const catCardEl = document.getElementById(catId).querySelector('.cats__like-btn');
  catCardEl.classList.add('liked');
  localStorage.setItem('catsInWishlist', JSON.stringify([...catsInWishlistIds, catId]));
  renderCatsInWishlistQuantity();
};

const removeCatFromLocalStorage = (catId) => {
  const catsInWishlistIds = getCatsFromLocalStorage();
  const catIndex = catsInWishlistIds.findIndex((likedCatId) => likedCatId === catId);
  catsInWishlistIds.splice(catIndex, 1);
  const catCardEl = document.getElementById(catId).querySelector('.cats__like-btn');

  localStorage.setItem('catsInWishlist', JSON.stringify(catsInWishlistIds));
  catCardEl.classList.remove('liked');
  renderCatsInWishlistQuantity();
};

const checkIfCatIsInLocalStorage = (catId) => {
  const catsInWishlistIds = getCatsFromLocalStorage();
  return catsInWishlistIds.find((likedCatId) => likedCatId === catId);
};

const getQuantityOfCatsInLocalStorage = () => {
  const catsInWishlistIds = getCatsFromLocalStorage();
  return catsInWishlistIds.length;
};

const clearWishlist = () => {
  localStorage.setItem('catsInWishlist', []);
  renderCatsInWishlistQuantity();
  resetLikes();
};

// PAGINATION
const paginationEl = document.getElementById('pagination');
const totalCatsCount = 100;
const maxPaginationBtnNumber = 7;
const numberOfBtns = Math.ceil(totalCatsCount / limit);

const gapPaginationBtnMarkup = '<li class="pagination__item">...</li>';

const getCurrentPageFromSearchParams = () => {
  const searchParams = new URLSearchParams(document.location.search);
  return Number(searchParams.get('page'));
};

const setCurrentPageToSearchParams = (page) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set('page', page);
  history.replaceState(null, null, '?' + searchParams.toString());
};

const createBtnMarkup = (pageNumber) => {
  const currentPage = getCurrentPageFromSearchParams();
  return `<li class="pagination__item">
    <button data-page="${pageNumber}" class="${pageNumber === currentPage ? 'active' : ''} pagination__button">
      ${pageNumber}
    </button>
  </li>`;
};

const createPaginationMarkup = () => {
  let markup = '';
  const currentPage = getCurrentPageFromSearchParams();

  if (numberOfBtns <= maxPaginationBtnNumber) {
    for (let i = 1; i <= numberOfBtns; i += 1) {
      markup += createBtnMarkup(i);
    }
  } else if (currentPage < maxPaginationBtnNumber - 2) {
    for (let i = 1; i <= maxPaginationBtnNumber - 2; i += 1) {
      markup += createBtnMarkup(i);
    }
    markup += gapPaginationBtnMarkup + createBtnMarkup(numberOfBtns);
  } else if (currentPage > numberOfBtns - maxPaginationBtnNumber + 3) {
    markup += createBtnMarkup(1) + gapPaginationBtnMarkup;
    for (let i = numberOfBtns - maxPaginationBtnNumber + 3; i <= numberOfBtns; i += 1) {
      markup += createBtnMarkup(i);
    }
  } else {
    markup += createBtnMarkup(1) + gapPaginationBtnMarkup;
    for (let i = currentPage - 1; i <= currentPage + 1; i += 1) {
      markup += createBtnMarkup(i);
    }
    markup += gapPaginationBtnMarkup + createBtnMarkup(numberOfBtns);
  }

  paginationEl.innerHTML = markup;
};

const onClick = async (e) => {
  if (e.target.nodeName !== 'BUTTON') return;

  const page = Number(e.target.dataset.page);
  if (page === getCurrentPageFromSearchParams()) return;

  setCurrentPageToSearchParams(page);

  scrollTo({ behavior: 'smooth', top: 0 });

  renderList();
  createPaginationMarkup();
};

// RENDER
const renderList = async () => {
  const page = getCurrentPageFromSearchParams();
  const cats = await getAllCats(page);
  const markup = createCatsListMarkup(cats);
  cardListEl.innerHTML = markup;
};

const renderCatsInWishlistQuantity = () => {
  const wishlistConterEl = document.querySelector('.header__favorites-counter');
  wishlistConterEl.innerText = getQuantityOfCatsInLocalStorage() ? getQuantityOfCatsInLocalStorage() : '';
};

const resetLikes = () => {
  const likedButtonsElems = document.querySelectorAll('.liked');
  likedButtonsElems.forEach((btn) => btn.classList.remove('liked'));
};

// FUNCTIONS AND LISTENERS
const onCatsListClick = (e) => {
  if (e.target.nodeName !== 'BUTTON') return;
  const catId = e.target.closest('li').getAttribute('id');
  const isLiked = e.target.closest('li').querySelector('button').classList.contains('liked');

  isLiked ? removeCatFromLocalStorage(catId) : addCatToLocalStorage(catId);
};

renderCatsInWishlistQuantity();
getCurrentPageFromSearchParams();
renderList();
createPaginationMarkup();

cardListEl.addEventListener('click', onCatsListClick);
resetButtonEl.addEventListener('click', clearWishlist);
paginationEl.addEventListener('click', onClick);
