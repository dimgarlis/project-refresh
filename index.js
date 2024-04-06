require('dotenv').config()
const puppeteer = require('puppeteer')

async function refreshListings(username, password) {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await login()

  await sleep(10000)
  await page.goto( 'https://live.spitogatos.gr/properties/manage')

  // FIXME: This does not work
  const refreshButtons = await page.$$('[title="Ανανέωση"]');
  for (let i = 0; i < refreshButtons.length; i++) {
    await refreshButtons[i].click()
    console.log(`Clicked button number ${i} out of ${refreshButtons.length}`)

    // Wait 5 to 15 seconds
    await sleep(getRandomNumber(5000, 15000))
  }

//   await browser.close();
}

// This function waits for the given amount in milliseconds
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms))
}

// Returns a random number between min (inclusive) and max (exclusive)
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Logs into app
async function login(page) {
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
}

// Skips promt in my listings page
async function skipPromt(page) {
  const skipButtonSelector = "text/Παράβλεψη"
  try {
    await page.waitForSelector(skipButtonSelector)
    await page.click(skipButtonSelector)
  } catch(err) {
    console.error("Could not find promt button: " + err)
  }
}

refreshListings(process.env.USERNAME, process.env.PASSWORD)