import dotenv from 'dotenv';
dotenv.config();


// config/config.js
export default {
  baseUrl: process.env.BASE_URL || 'https://elpais.com/',
  browser: process.env.BROWSER || 'chrome',
  browserstack: {
    username: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    capabilities: {
      'browserName': 'chrome',
      'browserstack.user': process.env.BROWSERSTACK_USERNAME,
      'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
      'os': 'OS X',
      'os_version': 'Ventura',
      'build': 'Selenium Tests',
      'name': 'articlesList.test.js'
    }
  }
};