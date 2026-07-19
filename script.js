const PRODUCTS = [
  {
    id: 'scrunchie-red',
    name: 'Резинка для волос',
    desc: 'Вязаная резинка крючком, красно-белая, мягкая и объёмная — украсит любую причёску.',
    price: 150,
    image: 'rezinka-krasnaya.jpg',
  },
  {
    id: 'elochnie-igrushki',
    name: 'Ёлочные игрушки',
    desc: 'Вязаные подвески-карамельки на брелоке — яркое украшение для ёлки или сумки.',
    price: 100,
    image: 'elochnie-igrushki.jpg',
  },
  {
    id: 'zmeyka-mashka',
    name: 'Змейка Машка',
    desc: 'Мягкая вязаная змейка с короной — забавный и необычный подарок.',
    price: 450,
    image: 'zmeyka-mashka.jpg',
  },
  {
    id: 'kapibary',
    name: 'Капибары Вика и Полина',
    desc: 'Плюшевые капибары из мягкой плюшевой пряжи, зелёная и розовая — продаются парой.',
    price: 300,
    image: 'kapibary.jpg',
  },
  {
    id: 'limonnaya-koala',
    name: 'Лимонная коала',
    desc: 'Плюшевая коала нежного лимонного цвета с большими ушками.',
    price: 450,
    image: 'limonnaya-koala.jpg',
  },
  {
    id: 'pasxalnaya-kurochka',
    name: 'Пасхальная курочка',
    desc: 'Вязаная курочка с красным гребешком и крылышком — отличный подарок к Пасхе.',
    price: 300,
    image: 'pasxalnaya-kurochka.jpg',
  },
  {
    id: 'serdechki',
    name: 'Сердечки',
    desc: 'Пара вязаных сердечек на шнурке — милый аксессуар или подвеска в подарок.',
    price: 200,
    image: 'serdechki.jpg',
  },
  {
    id: 'stilnaya-lyagushka',
    name: 'Стильная лягушка',
    desc: 'Вязаная лягушка в стильном розовом наряде — маленькая и очень характерная игрушка.',
    price: 370,
    image: 'stilnaya-lyagushka.jpg',
  },
  {
    id: 'ciplenok-pio',
    name: 'Циплёнок ПИО',
    desc: 'Пушистый маленький цыплёнок с оранжевым клювиком — мягкий и приятный на ощупь.',
    price: 250,
    image: 'ciplenok-pio.jpg',
  },
  {
    id: 'cherepashka-lili',
    name: 'Черепашка ЛиЛи',
    desc: 'Вязаная черепашка из плюшевой пряжи, зелёно-жёлтая — устойчиво стоит на лапках.',
    price: 380,
    image: 'cherepashka-lili.jpg',
  },
];

function toyFace(color = '#d8c3a5', darkColor = '#b89a72') {
  return `
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="92" fill="#f3e9da" opacity="0.5"/>
      <ellipse cx="100" cy="120" rx="60" ry="55" fill="${color}"/>
      <circle cx="100" cy="72" r="46" fill="${color}"/>
      <circle cx="58" cy="34" r="16" fill="${color}"/>
      <circle cx="142" cy="34" r="16" fill="${darkColor}"/>
      <circle cx="58" cy="34" r="8" fill="${darkColor}"/>
      <circle cx="142" cy="34" r="8" fill="#fff" opacity="0.35"/>
      <circle cx="82" cy="68" r="6" fill="#3a2a20"/>
      <circle cx="118" cy="68" r="6" fill="#3a2a20"/>
      <ellipse cx="100" cy="84" rx="11" ry="8" fill="${darkColor}"/>
      <path d="M88 96 Q100 106 112 96" stroke="#3a2a20" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="46" cy="126" r="18" fill="${darkColor}"/>
      <circle cx="154" cy="126" r="18" fill="${darkColor}"/>
    </svg>
  `;
}

function formatPrice(price) {
  return price.toLocaleString('ru-RU') + ' ₽';
}

function toyThumb(product) {
  if (product.image) {
    return `<img src="images/${product.image}" alt="${product.name}" loading="lazy">`;
  }
  return toyFace(product.color, product.darkColor);
}

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  const select = document.getElementById('product');

  const cards = PRODUCTS.map((product, index) => `
    <article class="toy-card" style="transition-delay: ${Math.min(index, 6) * 0.06}s">
      <div class="toy-thumb">${toyThumb(product)}</div>
      <div class="toy-info">
        <h3>${product.name}</h3>
        <p class="toy-desc">${product.desc}</p>
        <div class="toy-footer">
          <span class="toy-price">${formatPrice(product.price)}</span>
          <button type="button" class="toy-order-btn" data-product-id="${product.id}">Заказать</button>
        </div>
      </div>
    </article>
  `).join('');
  grid.innerHTML = cards;
  observeReveal(grid.querySelectorAll('.toy-card'));

  const options = PRODUCTS.map((product) =>
    `<option value="${product.id}">${product.name} — ${formatPrice(product.price)}</option>`
  ).join('');
  select.insertAdjacentHTML('beforeend', options);

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-product-id]');
    if (!button) return;
    select.value = button.dataset.productId;
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('name').focus({ preventScroll: true });
  });
}

function setupOrderForm() {
  const form = document.getElementById('orderForm');
  const note = document.getElementById('formNote');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const product = PRODUCTS.find((p) => p.id === data.get('product'));
    const payload = {
      name: data.get('name'),
      phone: data.get('phone'),
      product: product ? product.name : data.get('product'),
      quantity: data.get('quantity'),
      comment: data.get('comment'),
    };

    submitButton.disabled = true;
    note.classList.remove('visible');
    note.textContent = 'Отправляем заказ...';
    requestAnimationFrame(() => note.classList.add('visible'));

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('request failed');
      note.textContent = `Спасибо, ${payload.name}! Заказ «${payload.product}» принят, мы свяжемся с вами по телефону ${payload.phone}.`;
      form.reset();
    } catch (err) {
      note.textContent = 'Не удалось отправить заказ. Попробуйте ещё раз или напишите нам напрямую.';
    } finally {
      submitButton.disabled = false;
    }
  });
}

function observeReveal(elements) {
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((el) => observer.observe(el));
}

function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

document.getElementById('year').textContent = new Date().getFullYear();
renderCatalog();
setupOrderForm();
setupHeaderScroll();
observeReveal(document.querySelectorAll('.reveal'));
