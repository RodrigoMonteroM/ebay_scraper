import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { Cheerio } from 'cheerio';
import { IProduct } from './interface/types';
import { Browser } from 'puppeteer';
import { getCurrency, parsePrice } from './helpers/parse.js';
import mysql from 'mysql';
import { Database } from './db/db.js';
import dotenv from "dotenv";

dotenv.config();

puppeteer.use(StealthPlugin());


const dbConfig: mysql.ConnectionConfig = {
    password: process.env.DB_PASS,
    user: process.env.DB_USER,
    database: "products",
    host: process.env.DB_HOST,
}

const scraperDB = new Database(dbConfig);

async function run() {
    scraperDB.connect();

    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        slowMo: 0,
        args: [
            '--window-size=1400,900',
            '--remote-debugging-port=9222',
            "--remote-debugging-address=0.0.0.0",
            '--disable-gpu',
            "--disable-features=IsolateOrigins,site-per-process",
            '--blink-settings=imagesEnabled=true'
        ],
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        userDataDir: "C:/Users/rodri/AppData/Local/Google/Chrome/User Data/Default"

    });


    await scrapeMultipages(browser);

    await browser.close();

    scraperDB.close();

}

run();

function getProducts($cherio: cheerio.CheerioAPI, $container: Cheerio<cheerio.Element>) {

    $container.find(".s-item").each((i, $item) => {

        let $product = $cherio($item);

        const title = $product.find(".s-item__title span").text();
        const htmlPrice = $product.find(".s-item__price").text();
        const price = parsePrice(htmlPrice);
        const currency = getCurrency(htmlPrice);
        const link = $product.find("a.s-item__link").attr("href") || "";
        const img = $product.find("div.s-item__image-wrapper img").attr("src") || "";

        const product: IProduct = {
            title,
            price,
            currency,
            link,
            img
        }


        scraperDB.upload(product);


    })
}

async function scrapeMultipages(browser: Browser) {
    for (let i = 1; i <= 2; i++) {
        const page = await browser.newPage();

        await page.goto(`https://www.ebay.com/sch/i.html?_from=R40&_nkw=realme+buds+air+3&_sacat=0&_pgn=${i}`);

        const content = await page.content();

        const $ = cheerio.load(content);


        const $resultContiner = $("#srp-river-results");
        getProducts($, $resultContiner);

       // await page.close();
    }
}

async function scrapeSinglePage(browser: Browser) {
    const page = await browser.newPage();

    await page.goto(`https://www.ebay.it/sch/i.html?_from=R40&_sacat=0&_nkw=raspberry+pi&rt=nc&_pgn=1`);
    // await page.goto(`https://www.ebay.co.uk/sch/i.html?_from=R40&_trksid=p4432023.m570.l1311&_nkw=raspberry+pi+4&_sacat=0`);

    const content = await page.content();

    const $ = cheerio.load(content);


    const $resultContiner = $("#srp-river-results");
    getProducts($, $resultContiner);

    await page.close();
}