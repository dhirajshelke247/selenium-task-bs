import { By, until } from 'selenium-webdriver';
import BasePage from './BasePage.js';

class HomePage extends BasePage {
  get languageIndicator() { 
    return this.driver.findElement(By.xpath('//li[@id="edition_head" and @data-edition="el-pais"]//span[text()="España"]')); 
  }
  get articlesMenu() { 
    return this.driver.findElement(By.css('a[href="https://elpais.com/opinion/"]')); 
  }

  async isInSpanish() {
    const langElement = await this.driver.wait(
      until.elementLocated(By.xpath('//li[@id="edition_head"]//span')),
      10000 // wait up to 10 seconds
    );
    const lang = await langElement.getText();
    return lang.toLowerCase().startsWith('es');
  }

  async goToArticles() {
    await (await this.articlesMenu).click();
  }
}

export default HomePage;