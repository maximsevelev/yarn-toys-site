require('dotenv').config();
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.post('/api/order', async (req, res) => {
  const { name, phone, product, quantity, comment } = req.body || {};

  if (!name || !phone || !product || !quantity) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set');
    return res.status(500).json({ error: 'Сервис временно недоступен' });
  }

  const text = [
    '🧶 Новый заказ с сайта',
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Игрушка: ${product}`,
    `Количество: ${quantity}`,
    comment ? `Комментарий: ${comment}` : null,
  ].filter(Boolean).join('\n');

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
    const data = await telegramResponse.json();

    if (!data.ok) {
      console.error('Telegram API error', data);
      return res.status(502).json({ error: 'Не удалось отправить заказ' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Failed to reach Telegram API', err);
    res.status(502).json({ error: 'Не удалось отправить заказ' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
