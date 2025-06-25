import { By, until } from 'selenium-webdriver';
import BasePage from './BasePage.js';
import fs from 'fs';
import path from 'path';
import { downloadImage } from '../utils/downloadImage.js';
import { translateText } from '../utils/translate.js';

class OpinionPage extends BasePage {
  get articleElements() {
    return By.css('article.c.c-d');
  }

  async getTop10Articles(downloadDir = './downloaded_images') {
    await this.driver.wait(until.elementsLocated(this.articleElements), 10000);
    const articles = await this.driver.findElements(this.articleElements);
    const top10 = articles.slice(0, 10);

    // Ensure download directory exists
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const results = [];
    const translatedTitles = [];
    for (let i = 0; i < top10.length; i++) {
      const article = top10[i];
      const titleElem = await article.findElement(By.css('h2.c_t a'));
      const title = await titleElem.getText();
      const translatedTitle = await translateText(title, 'en');
      translatedTitles.push(translatedTitle);
      const url = await titleElem.getAttribute('href');
      let summary = '';
      try {
        const pElem = await article.findElement(By.css('p.c_d'));
        summary = await pElem.getText();
      } catch (e) {
        summary = '';
      }

      // Try to get the first <img> in the article
      let imgSrc = null;
      let imgPath = null;
      try {
        const imgElem = await article.findElement(By.css('img'));
        imgSrc = await imgElem.getAttribute('src');
        if (imgSrc) {
          const ext = path.extname(new URL(imgSrc).pathname) || '.jpg';
          const filename = `article_${i + 1}${ext}`;
          imgPath = await downloadImage(imgSrc, downloadDir, filename);
        }
      } catch (e) {
        imgSrc = null;
      }

      results.push({ title, translatedTitle, url, summary, imgSrc, imgPath });
    }

    // Count repeated words in translated headers
    const wordCounts = {};
    translatedTitles.forEach(header => {
      header
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .forEach(word => {
          if (word.length > 0) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
          }
        });
    });

    Object.entries(wordCounts)
      .filter(([_, count]) => count > 2)
      .forEach(([word, count]) => {
        console.log(
        `Repeated word: "${word}" - ${count} times\n` +
        `${'-'.repeat(60)}`
      );
      });

    return results;
  }
}

export default OpinionPage;