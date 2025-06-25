import dotenv from 'dotenv';
dotenv.config();

// Common capabilities for all browsers
const commonCapabilities = {
  'browserstack.user': process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
  'build': `Opinion Articles Test - ${new Date().toISOString()}`,
  'project': 'El País Testing',
  'browserstack.debug': true,
  'browserstack.console': 'errors',
  'browserstack.networkLogs': true
};

// Define 5 different browser/device configurations
export const browserConfigurations = [
  // Desktop browsers
  {
    ...commonCapabilities,
    'browserName': 'Chrome',
    'os': 'Windows',
    'os_version': '11',
    'resolution': '1920x1080',
    'name': 'Win11-Chrome'
  },
  {
    ...commonCapabilities,
    'browserName': 'Firefox',
    'os': 'Windows',
    'os_version': '10',
    'resolution': '1920x1080',
    'name': 'Win10-Firefox'
  },
  {
    ...commonCapabilities,
    'browserName': 'Safari',
    'os': 'OS X',
    'os_version': 'Ventura',
    'resolution': '1920x1080',
    'name': 'Mac-Safari'
  },
  
  // Mobile devices
  {
    ...commonCapabilities,
    'device': 'iPhone 14',
    'os_version': '16',
    'real_mobile': 'true',
    'browserName': 'iPhone',
    'name': 'iPhone14-Safari'
  },
  {
    ...commonCapabilities,
    'device': 'Samsung Galaxy S22',
    'os_version': '12.0',
    'real_mobile': 'true',
    'browserName': 'Android',
    'name': 'GalaxyS22-Chrome'
  }
];

export default {
  baseUrl: process.env.BASE_URL || 'https://elpais.com/',
  browserstack: {
    username: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    server: 'hub.browserstack.com',
    capabilities: browserConfigurations
  }
};