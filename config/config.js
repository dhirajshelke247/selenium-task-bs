import dotenv from 'dotenv';
dotenv.config();

export default {
  baseUrl: process.env.BASE_URL || 'https://elpais.com/',
  browser: process.env.BROWSER || 'chrome'
};
