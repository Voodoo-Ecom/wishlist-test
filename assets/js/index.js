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

    // const img = images[0]?.src ? images[0]?.src : 'https://cdn-icons-png.flaticon.com/512/8676/8676496.png';

    const cardMarkup = `<li class="cats__item" id=${id}]>
            <div class="cats__image-wrapper">
              <img class="cats__image"
                src="${url}"
                alt="cat" width="272" height="122">
              <button class="cats__like-btn"></button>
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

// RENDER
// const paginationEl = document.getElementById('pagination');
const cardListEl = document.querySelector('.cats__list');
// const errorMsgEl = document.getElementById('error-msg');

const renderList = async (page) => {
  // paginationEl.classList.add('pointer-events-none');

  const cats = await getAllCats(page);

  // if (!cats) {
  //   cardListEl.classList.add('hidden');
  //   paginationEl.classList.add('hidden');
  //   errorMsgEl.classList.remove('hidden');
  // } else {
  //   cardListEl.classList.remove('hidden');
  //   paginationEl.classList.remove('hidden');
  //   errorMsgEl.classList.add('hidden');
  // }

  const markup = createCatsListMarkup(cats);
  cardListEl.innerHTML = markup;

  // paginationEl.classList.remove('pointer-events-none');
};

renderList();
