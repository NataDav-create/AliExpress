document.addEventListener('DOMContentLoaded', function () {

  const search = document.querySelector('.search');
  const cartBtn = document.getElementById('cart');
  const wishlistBtn = document.getElementById('wishlist');
  const goodsWrapper = document.querySelector('.goods-wrapper');
  const cart = document.querySelector('.cart');
  const category = document.querySelector('.category');

  const createCartGoods = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = `
                <div class="card">
									<div class="card-img-wrapper">
										<img class="card-img-top" src="${img}" alt="">
										<button class="card-add-wishlist" data-goods-id="${id}"></button>
									</div>
									<div class="card-body justify-content-between">
										<a href="#" class="card-title">${title}</a>
										<div class="card-price">${price} ₽</div>
										<div>
											<button class="card-add-cart" data-goods-id="${id}>Добавить в корзину</button>
										</div>
									</div>
								</div>
    `;
    return card;
  };

  const closeCart = (e) => {
    const target = e.target;
    if (target === cart ||
      target.classList.contains('cart-close') ||
      e.keyCode === 27) {
      cart.style.display = '';
      document.removeEventListener('keyup', closeCart);
    }
  };

  const openCart = (e) => {
    e.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeCart);
  };

  const renderCard = items => {
    goodsWrapper.textContent = '';
    items.forEach((item) => {
      const {
        id,
        title,
        price,
        imgMin
      } = item;
      goodsWrapper.append(createCartGoods(id, title, price, imgMin));
    })
  }

  const getGoods = (handler, filter) => {
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

  cartBtn.addEventListener('click', openCart);
  cart.addEventListener('click', closeCart);
  category.addEventListener('click', chooseCategory);

  getGoods(renderCard, randomSort)


});