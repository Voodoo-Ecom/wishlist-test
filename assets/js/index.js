// API
const BASE_URL = 'https://api.thecatapi.com/v1/images/search';
const API_KEY = 'live_ST09boZt58lcEhnCapTTn4JAcUEB72aRfAuLhpU5pxAiAImePNDmuCEvlyaNB56Q';

// https://api.thecatapi.com/v1/images/search?limit=11&page=2&api_key=live_ST09boZt58lcEhnCapTTn4JAcUEB72aRfAuLhpU5pxAiAImePNDmuCEvlyaNB56Q

const limit = 11;

const getAllCats = (page = 1) => {
  const catsData = [];
  try {
    fetch(`${BASE_URL}?limit=${limit}&api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        catsData.push(data);
      });
    return catsData;
  } catch (error) {
    console.error('Error occured on fetching products:', error);
    return null;
  }
};

// MARKUP
const createCatsListMarkup = (cats) => {
  const catsData = [...cats];
  const listMarkup = cats.reduce((markup, cat) => {
    const { id, url } = cat;
    console.log('🚀 ~ file: index.js:27 ~ listMarkup ~ url:', cat);

    // const img = images[0]?.src ? images[0]?.src : 'https://cdn-icons-png.flaticon.com/512/8676/8676496.png';

    const cardMarkup = `<li class="cats__item" id=${id}]>
            <div class="cats__image-wrapper">
              <img class="cats__image"
                src="${url}"
                alt="cat" width="272" height="122">
              <button class="cats__like-btn"></button>
            </div>
            <div class="cats__info-wrapper">
              <h3 class="cats__title">Lorem ipsum</h3>
              <p class="cats__description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit fermentum a accumsan,
                consequat vitae arcu velit, nunc,
                suspendisse.</p>
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

const renderList = (page) => {
  // paginationEl.classList.add('pointer-events-none');

  const cats = getAllCats(page);

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
