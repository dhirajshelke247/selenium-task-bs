import { Builder } from 'selenium-webdriver';
import config from '../config/config.js';

export default async function createBrowserStackDriver() {
  const { username, accessKey, capabilities } = config.browserstack;
  const bsUrl = `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;
  return await new Builder()
    .usingServer(bsUrl)
    .withCapabilities(capabilities)
    .build();
}