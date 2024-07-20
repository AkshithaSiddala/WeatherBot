require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatid = msg.chat.id;
  console.log(chatid);
  bot.sendMessage(chatid, "Welcome! I am your weather bot and I keep you posted on weather updates");
});

bot.onText(/\/help/, (msg) => {
  const chatid = msg.chat.id;
  console.log(chatid);
  bot.sendMessage(chatid, "Available commands: /start,/help,/echo,/weather");
});

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatid = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatid, resp);
});

bot.onText(/\/weather (.+)/, async (msg, match) => {
  const chatid = msg.chat.id;
  const city = match[1];
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    const weather = response.data;

    const weatherMessage = `
Weather in ${city}:
Temperature: ${weather.main.temp}°C
Description: ${weather.weather[0].description}
Humidity: ${weather.main.humidity}%
Wind Speed: ${weather.wind.speed} m/s
        `;
    bot.sendMessage(chatid, weatherMessage);
  } catch (error) {
    bot.sendMessage(
      chatid,
      "Sorry, I couldn't get the weather information. Please make sure the city name is correct."
    );
  }
});
