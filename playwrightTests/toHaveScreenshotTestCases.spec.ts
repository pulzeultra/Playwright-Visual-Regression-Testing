import { test, expect, chromium, firefox, webkit } from "@playwright/test";
import * as path from "path";

let browser;
let context;
let page;

test.beforeEach(async ({}, testInfo) => {
  // Choose the browser based on the test title
  if (testInfo.title.includes("Firefox")) {
    browser = await firefox.launch({ headless: false });
  } else if (testInfo.title.includes("Webkit")) {
    browser = await webkit.launch({ headless: false });
  } else {
    browser = await chromium.launch({ headless: false });
  }

  // Create the context and page once, regardless of browser
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  page = await context.newPage();
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status === "passed") {
    console.log(`Test : ${testInfo.title}\nResult: ✅`);
  } else {
    console.log(`Test : ${testInfo.title}\nResult: ❌`);
  }

  await browser.close();
});

test("Compare a screenshot to the website it was taken from", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page against the stored screenshot
  await expect(page).toHaveScreenshot("screenshot.png", {
    fullPage: true,
  });
});

test("Compare a screenshot to the website it was taken from using Firefox", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page against the stored screenshot
  await expect(page).toHaveScreenshot("screenshot.png", {
    fullPage: true,
  });
});

test("Compare a screenshot to the website it was taken from using Webkit", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page against the stored screenshot
  await expect(page).toHaveScreenshot("screenshot.png", {
    fullPage: true,
  });
});

test("Compare a screenshot to the web element it was taken from", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the web element against the stored screenshot
  const webElement = page.locator(".hero");
  await expect(webElement).toHaveScreenshot("screenshotWebElement.png");
});

test("Compare a screenshot to the web element it was taken from using Firefox", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the web element against the stored screenshot
  const webElement = page.locator(".hero");
  await expect(webElement).toHaveScreenshot("screenshotWebElement.png");
});

test("Compare a screenshot to the web element it was taken from using Webkit", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the web element against the stored screenshot
  const webElement = page.locator(".hero");
  await expect(webElement).toHaveScreenshot("screenshotWebElement.png");
});

test("Compare a screenshot to the website it was taken from while hiding certain web elements", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page against the stored screenshot
  await expect(page).toHaveScreenshot("screenshotHiddenElements.png", {
    fullPage: true,
    stylePath: "../Playwright-Visual-Regression-Testing/playwrightTests/hideWebElements.css",
  });
});

test("Compare a screenshot to the website it was taken from while hiding certain web elements using Firefox", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page against the stored screenshot
  await expect(page).toHaveScreenshot("screenshotHiddenElements.png", {
    fullPage: true,
    stylePath: "../Playwright-Visual-Regression-Testing/playwrightTests/hideWebElements.css",
  });
});

test("Compare a screenshot to the website it was taken from while hiding certain web elements using Webkit", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page against the stored screenshot
  await expect(page).toHaveScreenshot("screenshotHiddenElements.png", {
    fullPage: true,
    stylePath: "../Playwright-Visual-Regression-Testing/playwrightTests/hideWebElements.css",
  });
});

test("Compare a screenshot to the website it was taken from while masking certain web elements", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page with masked web elements against the stored screenshot
  await expect(page).toHaveScreenshot("screenshotMaskedElements.png", {
    fullPage: true,
    mask: [page.locator(".tour-banner"), page.locator(".site-header")],
    maskColor: "#005E8A",
  });
});

test("Compare a screenshot to the website it was taken from while masking certain web elements using Firefox", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page with masked web elements against the stored screenshot
  await expect(page).toHaveScreenshot("screenshotMaskedElements.png", {
    fullPage: true,
    mask: [page.locator(".tour-banner"), page.locator(".site-header")],
    maskColor: "#005E8A",
  });
});

test("Compare a screenshot to the website it was taken from while masking certain web elements using Webkit", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page with masked web elements against the stored screenshot
  await expect(page).toHaveScreenshot("screenshotMaskedElements.png", {
    fullPage: true,
    mask: [page.locator(".tour-banner"), page.locator(".site-header")],
    maskColor: "#005E8A",
  });
});


test("Compare a 1px-altered screenshot to the website it was taken from with 0px tolerance", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page against the altered screenshot with 0px tolerance
  await expect(page).toHaveScreenshot("screenshot1px.png", {
    fullPage: true,
    maxDiffPixels: 0,
  });
});

test("Compare a 1px-altered screenshot to the website it was taken from with 100px tolerance", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the entire page against the altered screenshot with 100px tolerance
  await expect(page).toHaveScreenshot("screenshot1px.png", {
    fullPage: true,
    maxDiffPixels: 100,
  });
});

test("Compare the stored screenshot to a different website", async () => {
  // Navigate to a website that does not match the screenshot
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/cat.html")}`
  );

  // Compare a different website against the stored screenshot
  await expect(page).toHaveScreenshot("screenshot.png", {
    fullPage: true,
  });
});

test("Compare the footer tagline with a text file containing the same text", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the footer tagline with a text file containing the same text
  expect(await page.textContent(".footer-tagline")).toMatchSnapshot(
    "footer-tagline.txt"
  );
});

test("Compare the footer tagline with a text file containing different text", async () => {
  // Navigate to the website
  await page.goto(
    `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  );

  // Compare the footer tagline with a text file containing different text
  expect(await page.textContent(".footer-tagline")).toMatchSnapshot(
    "test.txt"
  );
});
