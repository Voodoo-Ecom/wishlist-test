(function () {
  const wishlistManager = {
    cfg: {
      API_KEY: 'live_ST09boZt58lcEhnCapTTn4JAcUEB72aRfAuLhpU5pxAiAImePNDmuCEvlyaNB56Q',
      BASE_URL: 'https://api.thecatapi.com/v1/images/search',
      totalCatsCountFromAPI: 100,
      maxPaginationBtnNumber: 7,
      catsPerPageLimit: 12,
    },
    catsApi: {
      getAllCats: async (page = 1) => {
        try {
          const catsData = [];
          const res = await fetch(
            `${wishlistManager.cfg.BASE_URL}?limit=${wishlistManager.cfg.catsPerPageLimit}&page=${page}&order=ASC&has_breeds=1&api_key=${wishlistManager.cfg.API_KEY}`
          );
          const data = await res.json();
          catsData.push(...data);
          return catsData;
        } catch (error) {
          console.error('Error occured on fetching products:', error);
          return null;
        }
      },
    },
    dom: {
      selectors: {
        activeLikedBtn: '.liked',
        catsCardList: '.cats__list',
        likeBtn: '.cats__like-btn',
        paginationId: 'pagination',
        resetButtonId: 'reset-button',
        wishlistCounter: '.header__favorites-counter',
      },
      functions: {
        getPaginationEl: () => document.getElementById(wishlistManager.dom.selectors.paginationId),
        getResetBtnEl: () => document.getElementById(wishlistManager.dom.selectors.resetButtonId),
        getCatsCardList: () => document.querySelector(wishlistManager.dom.selectors.catsCardList),
        getLikeBtnByCatId: (catId) =>
          document.getElementById(catId).querySelector(wishlistManager.dom.selectors.likeBtn),
        getLikedButtonsElems: () => document.querySelectorAll(wishlistManager.dom.selectors.activeLikedBtn),
        getWishlistCounterEl: () => document.querySelector(wishlistManager.dom.selectors.wishlistCounter),
        createCatsListMarkup: (cats) => {
          const listMarkup = cats.reduce((markup, cat) => {
            const { id, url } = cat;
            const { name, description } = cat.breeds[0];
            const likedClassName = wishlistManager.functions.wishlist.checkIfCatIsInLocalStorage(id) ? 'liked' : '';
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
        },
        createPaginationBtnMarkup: (pageNumber) => {
          const currentPage = wishlistManager.functions.pagination.getCurrentPageFromSearchParams();
          return `<li class="pagination__item">
            <button data-page="${pageNumber}" class="${pageNumber === currentPage ? 'active' : ''} pagination__button">
              ${pageNumber}
            </button>
          </li>`;
        },
        createGapPaginationBtnMarkup: () => '<li class="pagination__item">...</li>',
        createPaginationMarkup: () => {
          let markup = '';
          const currentPage = wishlistManager.functions.pagination.getCurrentPageFromSearchParams();
          const numberOfBtns = wishlistManager.functions.pagination.getNumberOfBtns();
          const maxPaginationBtnNumber = wishlistManager.cfg.maxPaginationBtnNumber;
          const gapPaginationBtnMarkup = wishlistManager.dom.functions.createGapPaginationBtnMarkup();
          const createBtnMarkup = wishlistManager.dom.functions.createPaginationBtnMarkup;

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

          wishlistManager.dom.functions.getPaginationEl().innerHTML = markup;
        },
        renderList: async () => {
          const page = wishlistManager.functions.pagination.getCurrentPageFromSearchParams();
          const cats = await wishlistManager.catsApi.getAllCats(page);
          const markup = wishlistManager.dom.functions.createCatsListMarkup(cats);
          wishlistManager.dom.functions.getCatsCardList().innerHTML = markup;
        },
        renderCatsInWishlistQuantity: () => {
          const wishlistCounterEl = wishlistManager.dom.functions.getWishlistCounterEl();
          wishlistCounterEl.innerText = wishlistManager.functions.wishlist.getQuantityOfCatsInLocalStorage()
            ? wishlistManager.functions.wishlist.getQuantityOfCatsInLocalStorage()
            : '';
        },
        resetLikes: () => {
          const likedButtonsElems = wishlistManager.dom.functions.getLikedButtonsElems();
          likedButtonsElems.forEach((btn) => btn.classList.remove('liked'));
        },
      },
    },
    functions: {
      wishlist: {
        addCatToLocalStorage: (catId) => {
          const catsInWishlistIds = wishlistManager.functions.wishlist.getCatsFromLocalStorage();
          if (catsInWishlistIds.find((likedCatId) => likedCatId === catId)) return;

          const catCardEl = wishlistManager.dom.functions.getLikeBtnByCatId(catId);
          catCardEl.classList.add('liked');
          localStorage.setItem('catsInWishlist', JSON.stringify([...catsInWishlistIds, catId]));
          wishlistManager.dom.functions.renderCatsInWishlistQuantity();
        },
        checkIfCatIsInLocalStorage: (catId) => {
          const catsInWishlistIds = wishlistManager.functions.wishlist.getCatsFromLocalStorage();
          return catsInWishlistIds.find((likedCatId) => likedCatId === catId);
        },
        getCatsFromLocalStorage: () => {
          const storedCats = localStorage.getItem('catsInWishlist')
            ? JSON.parse(localStorage.getItem('catsInWishlist'))
            : [];
          return storedCats;
        },
        getQuantityOfCatsInLocalStorage: () => {
          const catsInWishlistIds = wishlistManager.functions.wishlist.getCatsFromLocalStorage();
          return catsInWishlistIds.length;
        },
        removeCatFromLocalStorage: (catId) => {
          const catsInWishlistIds = wishlistManager.functions.wishlist.getCatsFromLocalStorage();
          const catCardEl = document.getElementById(catId).querySelector('.cats__like-btn');
          const catIndex = catsInWishlistIds.findIndex((likedCatId) => likedCatId === catId);
          catsInWishlistIds.splice(catIndex, 1);

          localStorage.setItem('catsInWishlist', JSON.stringify(catsInWishlistIds));
          catCardEl.classList.remove('liked');
          wishlistManager.dom.functions.renderCatsInWishlistQuantity();
        },
        clearWishlist: () => {
          localStorage.setItem('catsInWishlist', []);
          wishlistManager.dom.functions.renderCatsInWishlistQuantity();
          wishlistManager.dom.functions.resetLikes();
        },
        onCatsListClick: (e) => {
          if (e.target.nodeName !== 'BUTTON') return;
          const catId = e.target.closest('li').getAttribute('id');
          const isLiked = e.target.closest('li').querySelector('button').classList.contains('liked');

          isLiked
            ? wishlistManager.functions.wishlist.removeCatFromLocalStorage(catId)
            : wishlistManager.functions.wishlist.addCatToLocalStorage(catId);
        },
      },
      pagination: {
        getNumberOfBtns: () =>
          Math.ceil(wishlistManager.cfg.totalCatsCountFromAPI / wishlistManager.cfg.catsPerPageLimit),
        getCurrentPageFromSearchParams: () => {
          const searchParams = new URLSearchParams(document.location.search);
          return Number(searchParams.get('page'));
        },
        setCurrentPageToSearchParams: (page) => {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.set('page', page);
          history.replaceState(null, null, '?' + searchParams.toString());
        },
        onPaginationClick: async (e) => {
          if (e.target.nodeName !== 'BUTTON') return;

          const page = Number(e.target.dataset.page);
          if (page === wishlistManager.functions.pagination.getCurrentPageFromSearchParams()) return;

          wishlistManager.functions.pagination.setCurrentPageToSearchParams(page);

          scrollTo({ behavior: 'smooth', top: 0 });

          wishlistManager.dom.functions.renderList();
          wishlistManager.dom.functions.createPaginationMarkup();
        },
      },
      init: () => {
        wishlistManager.dom.functions.renderList();
        wishlistManager.functions.pagination.getCurrentPageFromSearchParams();
        wishlistManager.dom.functions.renderCatsInWishlistQuantity();
        wishlistManager.dom.functions.createPaginationMarkup();

        wishlistManager.dom.functions
          .getCatsCardList()
          .addEventListener('click', wishlistManager.functions.wishlist.onCatsListClick);
        wishlistManager.dom.functions
          .getResetBtnEl()
          .addEventListener('click', wishlistManager.functions.wishlist.clearWishlist);
        wishlistManager.dom.functions
          .getPaginationEl()
          .addEventListener('click', wishlistManager.functions.pagination.onPaginationClick);
      },
    },
  };

  wishlistManager.functions.init();
})();
