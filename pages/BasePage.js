import { By, until } from 'selenium-webdriver';

export default class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async visit(url) {
    await this.driver.get(url);
  }

  async find(locator) {
    await this.driver.wait(until.elementLocated(locator), 10000);
    return this.driver.findElement(locator);
  }

  async getText(locator) {
    const element = await this.find(locator);
    return element.getText();
  }


}
