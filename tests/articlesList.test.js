import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import HomePage from '../pages/HomePage.js';
import OpinionPage from '../pages/OpinionPage.js';
import config from '../config/config.js';

describe('Opinion Articles List', () => {
  let driver;
  let home;
  let opinionPage;

  before(async function () {
    this.timeout(30000);
    driver = await new Builder().forBrowser(config.browser).build();
    await driver.manage().window().maximize();
    home = new HomePage(driver);
    opinionPage = new OpinionPage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
      driver = null;
    }
  });

  it('should get top 10 articles from the Opinion section', async function () {
    this.timeout(60000);
    await home.visit(config.baseUrl);

    // Wait for the consent button to be visible and clickable
    try {
      const agreeButton = await driver.wait(
        until.elementIsVisible(
          await driver.wait(until.elementLocated(By.id('didomi-notice-agree-button')), 10000)
        ),
        10000
      );
      await agreeButton.click();
    } catch (e) {
      // If the button is not found or not interactable, continue (maybe already accepted)
      console.warn('Consent button not found or not interactable:', e.message);
    }

    await home.goToArticles();
    const articles = await opinionPage.getTop10Articles();
    expect(articles).to.be.an('array').that.has.lengthOf.at.most(10);
    articles.forEach(article => {
      expect(article).to.have.property('title').that.is.a('string').and.is.not.empty;
      expect(article).to.have.property('translatedTitle').that.is.a('string').and.is.not.empty;
      expect(article).to.have.property('url').that.is.a('string').and.is.not.empty;
      expect(article).to.have.property('summary');
      console.log(
        `Original Title : ${article.title}\n` +
        `Translated     : ${article.translatedTitle}\n` +
        `URL           : ${article.url}\n` +
        `Summary       : ${article.summary}\n` +
        `${'-'.repeat(60)}`
      );
    });
  });
});