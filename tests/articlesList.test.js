import { expect } from 'chai';
import HomePage from '../pages/HomePage.js';
import OpinionPage from '../pages/OpinionPage.js';
import config from '../config/config.js';
import createBrowserStackDriver from '../utils/bsDriver.js';

describe('Opinion Articles List', () => {
  let driver;
  let home;
  let opinionPage;

  before(async function () {
    this.timeout(30000);
    driver = await createBrowserStackDriver();
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

  it('should navigate to the Opinion section', async function() { 
    this.timeout(60000);
    await home.visit(config.baseUrl);
    await home.acceptConsentIfPresent();
    await home.goToArticles();
  });


  it('should get top 10 articles from the Opinion section with translations', async function () {
    this.timeout(60000);
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