const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should create a variable named seasons that contains Summer, Fall, Winter and Spring', async function() {
    const seasons = await page.evaluate(() => seasons);
    expect(seasons).toBeDefined();
    expect(seasons.length).toBe(4);
  });

  it('should update the second item in the seasons array to be Autumn', async function() {
    const seasons = await page.evaluate(() => seasons);
    expect(seasons[0]).toBe('Summer');
    expect(seasons[1]).toBe('Autumn');
    expect(seasons[2]).toBe('Winter');
    expect(seasons[3]).toBe('Spring');
  });

  it('should assign the innerHTML of the HTML element with the id result to the second element in the seasons array', async function() {
    const seasons = await page.evaluate(() => seasons);
    const innerHtml = await page.$eval("#result", (result) => {
      return result.innerHTML;
    });

    expect(innerHtml).toBe(seasons[1]);
  });
});

