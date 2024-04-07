require('dotenv').config()
const puppeteer = require('puppeteer')

async function refreshListings( username, password) {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  console.log('username: ', username)
  await login (page, username, password)

  await sleep(10000)
  await page.goto('https://live.spitogatos.gr/properties/manage')
  await sleep(5000)
  await skipPromt(page)
  await sleep(2000)
  
  pressRefreshButton(page, 0)

//   await browser.close();
}

async function pressRefreshButton(page, index, page_index = 1) {
  const refreshButtons = await page.$$('[title="Ανανέωση"]');
  const numButtons = refreshButtons.length
  if (index >= numButtons ) {
    console.log('allakse selida')
    const allakseselida= await page.$$('[title="Next Page"]');
    if (allakseselida.length == 0 ) {
      console.log("Next page NOT FOUND! Running whole process from beginning")
      await sleep(7200000)
      await page.goto('https://live.spitogatos.gr/properties/manage')
      await sleep(5000)
      await skipPromt(page)
      await sleep(2000)
      pressRefreshButton(page, 0)
    }
    else {
      try {
        await allakseselida[0].click()
        await sleep(5000)
        pressRefreshButton(page, 0, page_index+1)
      } catch(e) {
        console.error(e)
        await sleep(2000)
        pressRefreshButton(page, index, page_index)
      }  
    }
  } else {
    try {
      await refreshButtons[index].click()
      console.log(`Page ${page_index}: Clicked button number ${index+1} out of ${numButtons}`)
      // Wait 5 to 15 seconds
      await sleep(getRandomNumber(5000, 15000))
      pressRefreshButton(page, index+1, page_index)
    } catch(e) {
      console.error(e)
      await sleep(2000)
      pressRefreshButton(page, index, page_index)
    }
  }
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
async function login(page, username, password) {
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