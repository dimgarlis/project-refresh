require('dotenv').config()
const puppeteer = require('puppeteer')

async function refreshListings(username, password) {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  // Navigate the login page
  await page.goto('https://www.spitogatos.gr/guru/en/login');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  // Click accept cookie button
  const cookieAcceptButtonSelector = '.css-193muge'
  await page.waitForSelector(cookieAcceptButtonSelector);
  await page.click(cookieAcceptButtonSelector)

  // Enter username and password to login page
  await page.type('#fieldEmail', username);
  await page.type('#fieldPassword', password);

  // Wait and click on first result
  const loginButtonSelector = 'button.login__btn';
  await page.waitForSelector(loginButtonSelector);
  await page.click(loginButtonSelector);

//   await browser.close();
}

refreshListings(process.env.USERNAME, process.env.PASSWORD)