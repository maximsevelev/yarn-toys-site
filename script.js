const PRODUCTS = [
  {
    id: 'bear',
    name: 'Мишка Тёпа',
    desc: 'Плюшевый мишка из мягкой бежевой пряжи, набит гипоаллергенным холлофайбером.',
    price: 1800,
    color: '#c99a6c',
    darkColor: '#a97a4d',
  },
  {
    id: 'bunny',
    name: 'Зайка Стёпа',
    desc: 'Длинноухий зайка пастельного розового цвета, идеален для малышей.',
    price: 1600,
    color: '#f2c9d1',
    darkColor: '#e3a3b0',
  },
  {
    id: 'cat',
    name: 'Кот Барсик',
    desc: 'Полосатый вязаный кот с вышитыми усами и мягким хвостом.',
    price: 1500,
    color: '#e8dcc7',
    darkColor: '#cbb98f',
  },
  {
    id: 'elephant',
    name: 'Слонёнок Тоша',
    desc: 'Голубой слонёнок с большими ушами — любимец детской комнаты.',
    price: 2000,
    color: '#cfe3f0',
    darkColor: '#a9c8de',
  },
  {
    id: 'fox',
    name: 'Лисёнок',
    desc: 'Рыжий лисёнок с белой грудкой и пушистым хвостиком.',
    price: 1700,
    color: '#eaa06a',
    darkColor: '#d9803f',
  },
  {
    id: 'owl',
    name: 'Совёнок Умка',
    desc: 'Круглый совёнок с большими глазами из бежево-коричневой пряжи.',
    price: 1550,
    color: '#d8c3a5',
    darkColor: '#b89a72',
  },
  {
    id: 'unicorn',
    name: 'Единорог Искра',
    desc: 'Белый единорог с разноцветной гривой из остатков пряжи.',
    price: 2200,
    color: '#f5eef7',
    darkColor: '#e0c9ea',
  },
  {
    id: 'penguin',
    name: 'Пингвинёнок Лёд',
    desc: 'Чёрно-белый пингвинёнок с оранжевым клювом и лапками.',
    price: 1650,
    color: '#3f4a56',
    darkColor: '#2a323b',
  },
];

function toyFace(color, darkColor) {
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

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  const select = document.getElementById('product');

  const cards = PRODUCTS.map((product) => `
    <article class="toy-card">
      <div class="toy-thumb">${toyFace(product.color, product.darkColor)}</div>
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
    note.textContent = 'Отправляем заказ...';

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

document.getElementById('year').textContent = new Date().getFullYear();
renderCatalog();
setupOrderForm();
