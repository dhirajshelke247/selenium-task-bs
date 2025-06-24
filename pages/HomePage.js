import { By, until } from 'selenium-webdriver';
import BasePage from './BasePage.js';

class HomePage extends BasePage {
  get languageIndicator() { 
    return By.xpath('//li[@id="edition_head" and @data-edition="el-pais"]//span[text()="España"]'); 
  }
  get articlesMenu() { 
    return By.css('a[href*="/opinion/"]'); 
  }
  get consentButton() {
    return By.id('didomi-notice-agree-button');
  }

  async isInSpanish() {
    const langElement = await this.driver.wait(
      until.elementLocated(By.xpath('//li[@id="edition_head"]//span')),
      10000 // wait up to 10 seconds
    );
    const lang = await langElement.getText();
    return lang.toLowerCase().startsWith('es');
  }


  async acceptConsentIfPresent() {
    try {
      const agreeButton = await this.driver.wait(
        until.elementIsVisible(
          await this.driver.wait(until.elementLocated(this.consentButton), 10000)
        ),
        10000
      );
      await agreeButton.click();
    } catch (e) {
      // If the button is not found or not interactable, continue (maybe already accepted)
      console.warn('Consent button not found or not interactable:', e.message);
    }
  }

  async goToArticles() {
    const articlesMenuElem = await this.driver.findElement(this.articlesMenu);
    await articlesMenuElem.click();
  }
}

export default HomePage;