# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: toHaveScreenshotTestCases.spec.ts >> Compare a screenshot to the web element it was taken from using Firefox
- Location: playwrightTests\toHaveScreenshotTestCases.spec.ts:83:5

# Error details

```
Error: expect(locator).toHaveScreenshot(expected) failed

Locator: locator('.hero')
  Expected an image 1905px by 629px, received 1920px by 629px. 28943 pixels (ratio 0.03 of all image pixels) are different.

  Snapshot: screenshotWebElement.png

Call log:
  - Expect "toHaveScreenshot(screenshotWebElement.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - waiting for locator('.hero')
    - locator resolved to <section class="hero">…</section>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - Expected an image 1905px by 629px, received 1920px by 629px. 28943 pixels (ratio 0.03 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - waiting for locator('.hero')
    - locator resolved to <section class="hero">…</section>
  - taking element screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
  - captured a stable screenshot
  - Expected an image 1905px by 629px, received 1920px by 629px. 28943 pixels (ratio 0.03 of all image pixels) are different.

```

# Test source

```ts
  1   | import { test, expect, chromium, firefox, webkit } from "@playwright/test";
  2   | import * as path from "path";
  3   | 
  4   | let browser;
  5   | let context;
  6   | let page;
  7   | 
  8   | test.beforeEach(async ({}, testInfo) => {
  9   |   // Choose the browser based on the test title
  10  |   if (testInfo.title.includes("Firefox")) {
  11  |     browser = await firefox.launch({ headless: false });
  12  |   } else if (testInfo.title.includes("Webkit")) {
  13  |     browser = await webkit.launch({ headless: false });
  14  |   } else {
  15  |     browser = await chromium.launch({ headless: false });
  16  |   }
  17  | 
  18  |   // Create the context and page once, regardless of browser
  19  |   context = await browser.newContext({
  20  |     viewport: { width: 1920, height: 1080 },
  21  |   });
  22  | 
  23  |   page = await context.newPage();
  24  | });
  25  | 
  26  | test.afterEach(async ({}, testInfo) => {
  27  |   if (testInfo.status === "passed") {
  28  |     console.log(`Test : ${testInfo.title}\nResult: ✅`);
  29  |   } else {
  30  |     console.log(`Test : ${testInfo.title}\nResult: ❌`);
  31  |   }
  32  | 
  33  |   await browser.close();
  34  | });
  35  | 
  36  | test("Compare a screenshot to the website it was taken from", async () => {
  37  |   // Navigate to the website
  38  |   await page.goto(
  39  |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  40  |   );
  41  | 
  42  |   // Compare the entire page against the stored screenshot
  43  |   await expect(page).toHaveScreenshot("screenshot.png", {
  44  |     fullPage: true,
  45  |   });
  46  | });
  47  | 
  48  | test("Compare a screenshot to the website it was taken from using Firefox", async () => {
  49  |   // Navigate to the website
  50  |   await page.goto(
  51  |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  52  |   );
  53  | 
  54  |   // Compare the entire page against the stored screenshot
  55  |   await expect(page).toHaveScreenshot("screenshot.png", {
  56  |     fullPage: true,
  57  |   });
  58  | });
  59  | 
  60  | test("Compare a screenshot to the website it was taken from using Webkit", async () => {
  61  |   // Navigate to the website
  62  |   await page.goto(
  63  |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  64  |   );
  65  | 
  66  |   // Compare the entire page against the stored screenshot
  67  |   await expect(page).toHaveScreenshot("screenshot.png", {
  68  |     fullPage: true,
  69  |   });
  70  | });
  71  | 
  72  | test("Compare a screenshot to the web element it was taken from", async () => {
  73  |   // Navigate to the website
  74  |   await page.goto(
  75  |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  76  |   );
  77  | 
  78  |   // Compare the web element against the stored screenshot
  79  |   const webElement = page.locator(".hero");
  80  |   await expect(webElement).toHaveScreenshot("screenshotWebElement.png");
  81  | });
  82  | 
  83  | test("Compare a screenshot to the web element it was taken from using Firefox", async () => {
  84  |   // Navigate to the website
  85  |   await page.goto(
  86  |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  87  |   );
  88  | 
  89  |   // Compare the web element against the stored screenshot
  90  |   const webElement = page.locator(".hero");
> 91  |   await expect(webElement).toHaveScreenshot("screenshotWebElement.png");
      |                            ^ Error: expect(locator).toHaveScreenshot(expected) failed
  92  | });
  93  | 
  94  | test("Compare a screenshot to the web element it was taken from using Webkit", async () => {
  95  |   // Navigate to the website
  96  |   await page.goto(
  97  |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  98  |   );
  99  | 
  100 |   // Compare the web element against the stored screenshot
  101 |   const webElement = page.locator(".hero");
  102 |   await expect(webElement).toHaveScreenshot("screenshotWebElement.png");
  103 | });
  104 | 
  105 | test("Compare a screenshot to the website it was taken from while hiding certain web elements", async () => {
  106 |   // Navigate to the website
  107 |   await page.goto(
  108 |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  109 |   );
  110 | 
  111 |   // Compare the entire page against the stored screenshot
  112 |   await expect(page).toHaveScreenshot("screenshotWithHiddenElements.png", {
  113 |     fullPage: true,
  114 |     stylePath: "../Playwright Visual Regression Testing/playwrightTests/hideWebElements.css",
  115 |   });
  116 | });
  117 | 
  118 | test("Compare a screenshot to the website it was taken from while hiding certain web elements using Firefox", async () => {
  119 |   // Navigate to the website
  120 |   await page.goto(
  121 |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  122 |   );
  123 | 
  124 |   // Compare the entire page against the stored screenshot
  125 |   await expect(page).toHaveScreenshot("screenshotWithHiddenElements.png", {
  126 |     fullPage: true,
  127 |     stylePath: "../Playwright Visual Regression Testing/playwrightTests/hideWebElements.css",
  128 |   });
  129 | });
  130 | 
  131 | test("Compare a screenshot to the website it was taken from while hiding certain web elements using Webkit", async () => {
  132 |   // Navigate to the website
  133 |   await page.goto(
  134 |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  135 |   );
  136 | 
  137 |   // Compare the entire page against the stored screenshot
  138 |   await expect(page).toHaveScreenshot("screenshotWithHiddenElements.png", {
  139 |     fullPage: true,
  140 |     stylePath: "../Playwright Visual Regression Testing/playwrightTests/hideWebElements.css",
  141 |   });
  142 | });
  143 | 
  144 | test("Compare a screenshot to the website it was taken from while masking certain web elements", async () => {
  145 |   // Navigate to the website
  146 |   await page.goto(
  147 |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  148 |   );
  149 | 
  150 |   // Compare the entire page with masked web elements against the stored screenshot
  151 |   await expect(page).toHaveScreenshot("screenshot.png", {
  152 |     fullPage: true,
  153 |     mask: [page.locator(".tour-banner"), page.locator(".site-header")],
  154 |     maskColor: "#005E8A",
  155 |   });
  156 | });
  157 | 
  158 | test("Compare a 1px-altered screenshot to the website it was taken from with 0px tolerance", async () => {
  159 |   // Navigate to the website
  160 |   await page.goto(
  161 |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  162 |   );
  163 | 
  164 |   // Compare the entire page against the altered screenshot with 0px tolerance
  165 |   await expect(page).toHaveScreenshot("screenshot1px.png", {
  166 |     fullPage: true,
  167 |     maxDiffPixels: 0,
  168 |   });
  169 | });
  170 | 
  171 | test("Compare a 1px-altered screenshot to the website it was taken from with 100px tolerance", async () => {
  172 |   // Navigate to the website
  173 |   await page.goto(
  174 |     `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
  175 |   );
  176 | 
  177 |   // Compare the entire page against the altered screenshot with 100px tolerance
  178 |   await expect(page).toHaveScreenshot("screenshot1px.png", {
  179 |     fullPage: true,
  180 |     maxDiffPixels: 100,
  181 |   });
  182 | });
  183 | 
  184 | test("Compare the stored screenshot to a different website", async () => {
  185 |   // Navigate to a website that does not match the screenshot
  186 |   await page.goto(
  187 |     `file://${path.resolve("playwrightTests/TestWebsite/cat.html")}`
  188 |   );
  189 | 
  190 |   // Compare a different website against the stored screenshot
  191 |   await expect(page).toHaveScreenshot("screenshot.png", {
```