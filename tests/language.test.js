import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import HomePage from '../pages/HomePage.js';
import config from '../config/config.js';

describe('Language Validation', () => {
  let driver;
  let home;

  before(async function () {
    this.timeout(30000); // Increase timeout for setup
    driver = await new Builder().forBrowser(config.browser).build();
    await driver.manage().window().maximize();
    home = new HomePage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
      driver = null;
    }
  });

  it('should load homepage in Spanish', async () => {
    await home.visit(config.baseUrl);
    expect(await home.isInSpanish()).to.be.true;
  }).timeout(60000);

  it('should navigate to Articles section', async () => {
    // Assumes you are already on the homepage from the previous test
    await home.goToArticles();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/opinion/');
  }).timeout(60000);
});
