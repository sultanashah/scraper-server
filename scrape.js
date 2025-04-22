const puppeteer = require("puppeteer");
const fs = require("fs");

const url = process.env.SCRAPE_URL || "https://example.com";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
    return {
      title: document.title,
      heading: document.querySelector("h1")?.innerText || "No H1 found",
    };
  });

  fs.writeFileSync("scraped_data.json", JSON.stringify(data, null, 2));
  await browser.close();
})();

