const Apify = require('apify');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await Apify.launchPuppeteer({ launchOptions: {   
    headless: false,   
    stealth: true,   
    useChrome: true,
  }});

  const page = await browser.newPage();
  await page.goto('https://www.coingecko.com/en/coins/recently_added', { waitUntil: 'networkidle0' });
  const tokenPage = await browser.newPage();

  let tokenListLength = await page.$$eval('body > div.container > div.gecko-table-container > div.coingecko-table > div.position-relative > div > table > tbody > tr', a => a.length);
  console.log(tokenListLength)

  for (let i = 1; i <= tokenListLength; i++) {
    console.log(i);
    if (await page.$(`body > div.container > div.gecko-table-container > div.coingecko-table > div.position-relative > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5) > div > div > span > span`) != null) {
      if (await page.$eval(`body > div.container > div.gecko-table-container > div.coingecko-table > div.position-relative > div > table > tbody > tr:nth-child(${i}) > td:nth-child(5) > div > div > span > span`, e => e.getAttribute('data-content')) == 'BSC') {
        let coingeckoLink = await page.$eval(`table > tbody > tr:nth-child(${i}) > td.py-0.coin-name > div > div:nth-child(2) > a.tw-hidden.tw-items-center.tw-justify-between`, e => e.getAttribute('href'));
        
        console.log('https://www.coingecko.com/' + coingeckoLink)
        await tokenPage.goto('https://www.coingecko.com/' + coingeckoLink, { waitUntil: 'networkidle0' });
        let smartcontract = await tokenPage.$eval('body > div.container > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div > i', e => e.getAttribute('data-address'));
        console.log('https://poocoin.app/tokens/' + smartcontract);

        /*await page.evaluate((selector) => {
          const element = document.querySelector(selector).scrollIntoView();
        }, 'body > div:nth-child(5) > div:nth-child(7) > div > div:nth-child(2) > div > div > div > div > div:nth-child(3)');
        await delay(10000)*/
      }
    } else {
      console.log('Not a BSC token');
    }
    console.log('---')
  }
})();

function delay(time) {
  return new Promise(function(resolve) { 
    setTimeout(resolve, time)
  });
}