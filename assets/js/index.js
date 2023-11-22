const cardListEl = document.querySelector('.cats__list');
const resetButtonEl = document.getElementById('reset-button');

// API
const BASE_URL = 'https://api.thecatapi.com/v1/images/search';
const API_KEY = 'live_ST09boZt58lcEhnCapTTn4JAcUEB72aRfAuLhpU5pxAiAImePNDmuCEvlyaNB56Q';
const limit = 11;

const getAllCats = async (page = 1) => {
  try {
    const catsData = [];
    const res = await fetch(`${BASE_URL}?limit=${limit}&has_breeds=1&api_key=${API_KEY}`);
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

const getQuantutyOfCatsInLocalStorage = () => {
  const catsInWishlistIds = getCatsFromLocalStorage();
  return catsInWishlistIds.length;
};

const clearWishlist = () => {
  localStorage.setItem('catsInWishlist', []);
  renderCatsInWishlistQuantity();
};

// RENDER
const renderList = async (page) => {
  const cats = await getAllCats(page);
  const markup = createCatsListMarkup(cats);
  cardListEl.innerHTML = markup;
};

const renderCatsInWishlistQuantity = () => {
  const wishlistConterEl = document.querySelector('.header__favorites-counter');
  wishlistConterEl.innerText = getQuantutyOfCatsInLocalStorage() ? getQuantutyOfCatsInLocalStorage() : '';
};

// FUNCTIONS AND LISTENERS
const onCatsListClick = (e) => {
  if (e.target.nodeName !== 'BUTTON') return;
  const catId = e.target.closest('li').getAttribute('id');
  const isLiked = e.target.closest('li').querySelector('button').classList.contains('liked');

  isLiked ? removeCatFromLocalStorage(catId) : addCatToLocalStorage(catId);
};

renderCatsInWishlistQuantity();
renderList();
cardListEl.addEventListener('click', onCatsListClick);
resetButtonEl.addEventListener('click', clearWishlist);
