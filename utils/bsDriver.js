import { Builder } from 'selenium-webdriver';
import config from '../config/config.js';

export default async function createBrowserStackDriver(capability) {
  return await new Builder()
    .usingServer(`http://${config.browserstack.username}:${config.browserstack.accessKey}@${config.browserstack.server}/wd/hub`)
    .withCapabilities(capability)
    .build();
}