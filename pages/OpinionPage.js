import { By, until } from 'selenium-webdriver';
import BasePage from './BasePage.js';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import axios from 'axios';

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    mod.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function translateText(text, to = 'en') {
  const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/text';
  const headers = {
    'content-type': 'application/json',
    'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
    'x-rapidapi-key': '27b494050fmsha4e52d25c7b5fb0p1c69eajsn5a1efb82fd3a'
  };
  const data = {
    from: 'auto',
    to,
    text
  };
  try {
    const response = await axios.post(url, data, { headers });
    return response.data.trans || text;
  } catch (err) {
    console.error('Translation error:', err.message);
    return text;
  }
}

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
      try {
        const imgElem = await article.findElement(By.css('img'));
        imgSrc = await imgElem.getAttribute('src');
        if (imgSrc) {
          // Download the image
          const imgExt = path.extname(new URL(imgSrc).pathname) || '.jpg';
          const imgPath = path.join(downloadDir, `article_${i + 1}${imgExt}`);
          await downloadImage(imgSrc, imgPath);
        }
      } catch (e) {
        imgSrc = null;
      }

      results.push({ title, translatedTitle, url, summary, imgSrc });
    }

    // Count repeated words in translated headers
    const wordCounts = {};
    translatedTitles.forEach(header => {
      header
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
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
        console.log(`Repeated word: "${word}" - ${count} times`);
      });

    return results;
  }
}

export default OpinionPage;