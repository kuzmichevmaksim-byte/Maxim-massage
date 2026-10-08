'use strict';
const telegramUsername = 'maximtk2';
const services = {
  body: {description: 'Общий сеанс для проработки мышц и расслабления. Выбирайте, когда хочется уделить внимание всему телу, а не одной зоне.', name: 'Массаж всего тела', price: 3500},
  relax: {description: 'Спокойный темп и мягкая интенсивность. Выбирайте, когда главный запрос — расслабиться после напряжённого дня, без акцента на интенсивную проработку.', name: 'Расслабляющий массаж', price: 2500},
  back: {description: 'Акцент на мышцах спины. Выбирайте, если после сидячей работы или привычной нагрузки хочется уделить основное внимание этой зоне.', name: 'Массаж спины', price: 2000},
  legs: {description: 'Акцент на мышцах ног. Выбирайте, если усталость сосредоточена в ногах после долгой ходьбы или работы стоя.', name: 'Массаж ног', price: 2000},
  neck: {description: 'Локальная проработка шейно-воротниковой зоны. Выбирайте, когда хочется размять шею и плечи после работы за компьютером или за рулём.', name: 'Массаж шейно-воротниковой зоны', price: 1500},
  pack5: {name: 'Абонемент на 5 сеансов', price: 12000, count: 5, duration: 45},
  pack10: {name: 'Абонемент на 10 сеансов', price: 23000, count: 10, duration: 45}
};
const state = {service: 'body', day: 'День уточню'};
const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
const telegram = text => 'https://t.me/' + telegramUsername + '?text=' + encodeURIComponent(text);
function orderMessage() {
  const service = services[state.service];
  const timing = state.day === 'День уточню' ? 'Подскажите ближайшее свободное время.' : `Удобно: ${state.day.toLowerCase()}.`;
  if (service.count) return `Максим, здравствуйте! Интересует ${service.name.toLowerCase()}, по ${service.duration} минут, за ${money(service.price)}. ${timing} Подскажите, какие виды массажа входят и какие условия абонемента?`;
  return `Максим, здравствуйте! Хочу записаться: ${service.name.toLowerCase()}, ${money(service.price)}. ${timing} Сколько длится сеанс и какое время есть?`;
}
function renderOrder() {
  const service = services[state.service];
  document.querySelector('#order-focus').textContent = service.name;
  document.querySelector('#order-description').textContent = service.count ? `${service.count} сеансов · по ${service.duration} минут` : service.description;
  document.querySelector('#order-total').textContent = money(service.price);
  document.querySelector('#order-rate').textContent = service.count ? `за абонемент · ${money(service.price / service.count)} за сеанс` : 'за сеанс';
  document.querySelector('#order-day').textContent = state.day;
  document.querySelector('#order-link').href = telegram(orderMessage());
  document.querySelector('#booking-draft').value = orderMessage();
  document.querySelector('#booking-copy-status').textContent = '';
  document.querySelector('#booking-draft').hidden = true;
}
function choose(key, value) {
  if (key === 'service' && !services[value]) return;
  if (key === 'day' && !['Будний вечер', 'Выходные', 'День уточню'].includes(value)) return;
  state[key] = value;
  document.querySelectorAll(`[data-${key}]`).forEach(button => {
    const selected = button.dataset[key] === value;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  renderOrder();
}
for (const key of ['service', 'day']) {
  document.querySelectorAll(`[data-${key}]`).forEach(button => button.addEventListener('click', () => choose(key, button.dataset[key])));
}
document.querySelectorAll('[data-recommend]').forEach(link => link.addEventListener('click', () => choose('service', link.dataset.recommend)));
document.querySelectorAll('#mobile-nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#mobile-nav').open = false;
}));
document.addEventListener('keydown', event => {
  const menu = document.querySelector('#mobile-nav');
  if (event.key === 'Escape' && menu.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});
document.querySelector('#copy-booking').addEventListener('click', async () => {
  const field = document.querySelector('#booking-draft');
  const status = document.querySelector('#booking-copy-status');
  try {
    await navigator.clipboard.writeText(orderMessage());
    status.textContent = 'Сообщение скопировано. Откройте MAX и вставьте его в чат.';
  } catch {
    field.hidden = false;
    field.focus();
    field.select();
    status.textContent = 'Выделите и скопируйте сообщение ниже.';
  }
});
renderOrder();
const inquiries = {
  'gift-link': 'Максим, здравствуйте! Хочу подарочный сертификат на один визит: массаж всего тела. Подскажите стоимость и условия оформления.',
  'parking-link': 'Максим, здравствуйте! Приеду на массаж на машине. Нужна парковка у Среднерогатской, 11. Откроете шлагбаум? Время визита: ',
  'outcall-link': 'Максим, здравствуйте! Интересует массаж с выездом. Выезд за 3 000 ₽ — это полная стоимость или доплата? Какие условия и районы выезда?',
  'repeat-link': 'Максим, здравствуйте! Уже был у вас и хочу записаться снова. Какие свободные вечера или выходные есть?'
};
Object.entries(inquiries).forEach(([id, message]) => {
  document.getElementById(id).href = telegram(message);
});
document.querySelectorAll('[data-telegram]').forEach(link => {
  link.href = telegram('Максим, здравствуйте! Хочу записаться на массаж у Звёздной. Подскажите ближайшее свободное время.');
});

document.querySelector('#copy-address').addEventListener('click', async () => {
  const address = 'Санкт-Петербург, ул. Среднерогатская, 11. Подъезд 6 — вход рядом с КБ. Квартира 566, 5 этаж. Если нужна парковка, напишите Максиму заранее — он откроет шлагбаум.';
  const addressStatus = document.querySelector('#address-status');
  try {
    await navigator.clipboard.writeText(address);
    addressStatus.textContent = 'Адрес скопирован.';
  } catch {
    addressStatus.textContent = address;
  }
});

// Navigation anchors are native HTML links; scripts do not capture their clicks.
document.querySelector('#copy-max-link').addEventListener('click', async () => {
  const field = document.querySelector('#max-link-fallback');
  const status = document.querySelector('#chat-status');
  try {
    await navigator.clipboard.writeText(field.value);
    status.textContent = 'Ссылка MAX скопирована. Вставьте её в адресную строку браузера.';
  } catch {
    field.hidden = false;
    field.focus();
    field.select();
    status.textContent = 'Выделите и скопируйте ссылку ниже.';
  }
});
