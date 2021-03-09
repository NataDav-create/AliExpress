document.addEventListener('DOMContentLoaded', function () {

  const search = document.querySelector('.search');
  const cartBtn = document.getElementById('cart');
  const wishlistBtn = document.getElementById('wishlist');
  const goodsWrapper = document.querySelector('.goods-wrapper');
  const cart = document.querySelector('.cart');
  const category = document.querySelector('.category');
  const cardCounter = cartBtn.querySelector('.counter');
  const wishlistCounter = wishlistBtn.querySelector('.counter');
  const cartWrapper = document.querySelector('.cart-wrapper');

  let wishlist = [];
  let goodsBasket = {};

  const loading = () => {
    goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
</div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`
  };

  const createCardGoods = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = `
                <div class="card">
									<div class="card-img-wrapper">
										<img class="card-img-top" src="${img}" alt="">
										<button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"  data-goods-id="${id}"></button>
									</div>
									<div class="card-body justify-content-between">
										<a href="#" class="card-title">${title}</a>
										<div class="card-price">${price} ₽</div>
										<div>
											<button class="card-add-cart" data-goods-id="${id}">Добавить в корзину</button>
										</div>
									</div>
								</div>
    `;
    return card;
  };

  const renderCard = items => {

    goodsWrapper.textContent = '';

    if (items.length) {
      items.forEach((item) => {
        const {
          id,
          title,
          price,
          imgMin
        } = item;
        goodsWrapper.append(createCardGoods(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = 'Goods are not found by your request...';
    }
  }

  //render goods in cart
  const createCardGoodsBasket = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = `
          <div class="goods-img-wrapper">
						<img class="goods-img" src="${img}" alt="">
					</div>
					<div class="goods-description">
						<h2 class="goods-title">${title}</h2>
						<p class="goods-price">${price} ₽</p>
					</div>
					<div class="goods-price-count">
						<div class="goods-trigger">
							<button class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : ''}" data-goods-id="${id}"></button>
							<button class="goods-delete" data-goods-id="${id}"></button>
						</div>
						<div class="goods-count">1</div>
					</div>
    `;
    return card;
  };

  const renderBasket = items => {

    cartWrapper.textContent = '';

    if (items.length) {
      items.forEach((item) => {
        const {
          id,
          title,
          price,
          imgMin
        } = item;
        cartWrapper.append(createCardGoodsBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = `<div id="cart-empty">
					Ваша корзина пока пуста
				</div>`;
    }
  }

  const closeCart = (e) => {
    const target = e.target;
    if (target === cart ||
      target.classList.contains('cart-close') ||
      e.keyCode === 27) {
      cart.style.display = '';
      document.removeEventListener('keyup', closeCart);
    }
  };

  const showCardBasket = goods => goods.filter(item => goodsBasket.hasOwnProperty(item.id));

  const openCart = (e) => {
    e.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeCart);
    getGoods(renderBasket, showCardBasket);
  };

  const getGoods = (handler, filter) => {
    // loading();
    fetch('db/db.json')
      .then((response) => {
        return response.json()
      })
      .then(filter)
      .then(handler)
  };

  const randomSort = item => {
    return item.sort(() => Math.random() - 0.5);
  }

  const chooseCategory = (e) => {
    e.preventDefault();
    const target = e.target;

    if (target.classList.contains('category-item')) {
      const category = target.dataset.category;
      getGoods(renderCard, (goods) => {
        return goods.filter(item => {
          return item.category.includes(category);
        });
      })
    }
  };

  const searchGoods = e => {
    e.preventDefault();
    const input = e.target.elements.searchGoods;
    const inputValue = input.value.trim();
    if (inputValue !== '') {
      const searchString = new RegExp(inputValue, 'i')
      getGoods(renderCard, goods => goods.filter((item) => searchString.test(item.title)));
    } else {
      search.classList.add('error');
      setTimeout(() => {
        search.classList.remove('error');
      }, 2000)
    }
    input.value = '';
  };

  const getCookie = (name) => {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  const cookieQuery = get => {
    if (get) {
      goodsBasket = JSON.parse(getCookie('goodsBasket'));
      checkCounter();
    } else {
      document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)};max-age=86400e3`;
    }
    console.log(goodsBasket);
  };

  const checkCounter = () => {
    wishlistCounter.textContent = wishlist.length;
    cardCounter.textContent = Object.keys(goodsBasket).length;
  };

  const storageQuery = (get) => {
    if (get) {
      if (localStorage.getItem('wishlist')) {
        const wishlistStorage = JSON.parse(localStorage.getItem('wishlist'));
        wishlistStorage.forEach(id => wishlist.push(id));
      }
      checkCounter();
    } else {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  };

  const toggleWishlist = (id, elem) => {
    if (wishlist.includes(id)) {
      wishlist.splice(wishlist.indexOf(id), 1);
      elem.classList.remove('active');
    } else {
      wishlist.push(id);
      elem.classList.add('active');
    }
    checkCounter();
    storageQuery();
  };

  const addBasket = id => {
    if (goodsBasket[id]) {
      goodsBasket[id] += 1;
    } else {
      goodsBasket[id] = 1;
    }
    console.log(goodsBasket[id])
    checkCounter();
    cookieQuery();
  }

  const handlerGoods = (e) => {
    const target = e.target;
    if (target.classList.contains('card-add-wishlist')) {
      toggleWishlist(target.dataset.goodsId, target)
    };
    if (target.classList.contains('card-add-cart')) {
      addBasket(target.dataset.goodsId);
    }
  };

  const showWishlist = () => {
    getGoods(renderCard, goods => goods.filter(item => wishlist.includes(item.id)));
  };

  cartBtn.addEventListener('click', openCart);
  cart.addEventListener('click', closeCart);
  category.addEventListener('click', chooseCategory);
  search.addEventListener('submit', searchGoods);
  goodsWrapper.addEventListener('click', handlerGoods);
  wishlistBtn.addEventListener('click', showWishlist);

  getGoods(renderCard, randomSort);
  storageQuery(true);
  cookieQuery(true);


});