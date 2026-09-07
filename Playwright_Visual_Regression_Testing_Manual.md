# Playwright Visual Regression Testing Manual

*Written and maintained by Andrzej Schillings*

## 1. Overview

This project demonstrates several **Playwright screenshot and snapshot testing techniques** using a local HTML website.

The tests show how to:

- Compare an entire webpage against a stored screenshot.
- Compare a specific web element against a stored screenshot.
- Run the same visual tests in **Chromium, Firefox, and WebKit**.
- Hide elements during screenshot comparison.
- Mask dynamic web elements.
- Set a maximum number of allowed differing pixels.
- Detect a single-pixel difference.
- Compare text against stored snapshot files.
- Intentionally test scenarios that should fail.

The project uses **TypeScript**, **Playwright**, and a local HTML test website, so no internet connection is required for the actual website under test.

---

# 2. Prerequisites

Before using this project on another computer, make sure the following software is installed.

## Required

### Node.js

Install a current **LTS version of Node.js**.

Verify the installation:

```bash
node --version
npm --version
```

Both commands should return a version number.

### Visual Studio Code

Visual Studio Code is recommended for editing and running the tests, although another code editor can also be used.

### Git

Git is only required if the project is being cloned from a Git repository.

Verify it with:

```bash
git --version
```

---

# 3. Project Setup

## 3.1 Open the project

Open the project folder in Visual Studio Code.

A typical project structure could look like this:

```text
Project/
│
├── package.json
├── package-lock.json
├── tsconfig.json
│
├── playwrightTests/
│   ├── TestWebsite/
│   │   ├── website.html
│   │   └── cat.html
│   │
│   ├── screenshots/
│   │   ├── screenshot.png
│   │   ├── screenshotWebElement.png
│   │   ├── screenshotWithHiddenElements.png
│   │   └── screenshot1px.png
│   │
│   ├── hideWebElements.css
│   └── visualTests.spec.ts
```

The exact folder structure can differ, but the paths referenced in the test file must exist.

---

# 4. Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

This installs the dependencies listed in `package.json`.

If Playwright has not yet been installed in the project, install it with:

```bash
npm install -D @playwright/test
```

---

# 5. Install the Playwright Browsers

Installing the Playwright package does not necessarily mean that all required browser binaries are available.

Install Chromium, Firefox, and WebKit with:

```bash
npx playwright install
```

This project specifically uses all three browsers:

- Chromium
- Firefox
- WebKit

If you only need Chromium:

```bash
npx playwright install chromium
```

For this project, however, use:

```bash
npx playwright install
```

---

# 6. TypeScript Configuration

The project uses TypeScript.

A basic `tsconfig.json` can look like this:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

The important part for this project is that TypeScript can resolve Node.js modules such as `path`.

If TypeScript reports:

```text
Cannot find name 'path'
```

make sure Node.js type definitions are installed:

```bash
npm install -D @types/node
```

The import used by the test is:

```typescript
import * as path from "path";
```

---

# 7. Running the Tests

Run all Playwright tests with:

```bash
npx playwright test
```

Run the tests with the browser visible:

```bash
npx playwright test --headed
```

Open the Playwright UI:

```bash
npx playwright test --ui
```

Run a specific test file:

```bash
npx playwright test visualTests.spec.ts
```

---

# 8. Understanding the Browser Setup

The project manually launches a browser depending on the test name.

```typescript
if (testInfo.title.includes("Firefox")) {
  browser = await firefox.launch({ headless: false });
} else if (testInfo.title.includes("Webkit")) {
  browser = await webkit.launch({ headless: false });
} else {
  browser = await chromium.launch({ headless: false });
}
```

This means:

| Test title contains | Browser |
|---|---|
| `Firefox` | Firefox |
| `Webkit` | WebKit |
| Neither | Chromium |

For example:

```text
Compare a screenshot ... using Firefox
```

runs in Firefox.

A normal test such as:

```text
Compare a screenshot ...
```

runs in Chromium.

A test containing:

```text
using Webkit
```

runs in WebKit.

## Why is this done?

It allows the same visual test to be executed against different browser engines.

This is particularly useful for visual regression testing because a page can render slightly differently between browser engines.

---

# 9. Browser Window Size

The browser context is created with:

```typescript
context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
});
```

This gives the page a fixed viewport of:

**1920 × 1080 pixels**

Using a fixed viewport is important for screenshot testing because changing the viewport can change the layout and therefore the screenshot.

---

# 10. Test Setup and Cleanup

## `beforeEach`

Before every test:

1. The appropriate browser is launched.
2. A browser context is created.
3. A new page is created.

```typescript
test.beforeEach(async ({}, testInfo) => {
  // Browser selection

  // Create context

  // Create page
});
```

## `afterEach`

After every test:

```typescript
await browser.close();
```

This closes the browser even when the test fails.

The test result is also printed to the terminal:

```text
Test : Compare a screenshot...
Result: ✅
```

or:

```text
Test : Compare a screenshot...
Result: ❌
```

---

# 11. Using a Local HTML Website

Instead of navigating to an online website, the tests open a local HTML file.

```typescript
await page.goto(
  `file://${path.resolve("playwrightTests/TestWebsite/website.html")}`
);
```

`path.resolve()` converts the relative path into an absolute path.

For example:

```text
playwrightTests/TestWebsite/website.html
```

might become:

```text
C:\Projects\PlaywrightTest\playwrightTests\TestWebsite\website.html
```

The `file://` prefix tells Playwright to open the file locally.

## Important

The referenced HTML file must exist at the specified location.

If the HTML file is moved, update the path in the test.

---

# 12. Full-Page Screenshot Comparison

The basic visual comparison is:

```typescript
await expect(page).toHaveScreenshot("screenshot.png", {
  fullPage: true,
});
```

This takes a screenshot of the entire page and compares it with:

```text
screenshot.png
```

If the screenshots match within the configured tolerance, the test passes.

If they differ beyond the tolerance, the test fails.

---

# 13. Screenshot Snapshots

The screenshot specified here:

```typescript
"screenshot.png"
```

is a **reference snapshot**.

The first time a snapshot is created, Playwright stores the expected image.

Later test runs compare the current page against that stored image.

If the website changes visually, Playwright detects the difference.

---

# 14. Updating Snapshots

If a visual change is intentional, the stored screenshot can be updated.

Use:

```bash
npx playwright test --update-snapshots
```

Short form:

```bash
npx playwright test -u
```

**Be careful when doing this.**

Updating snapshots means that the new screenshot becomes the expected result. An accidental visual change could therefore be accepted as the new baseline.

---

# 15. Element Screenshot Comparison

The project also demonstrates comparing only a specific web element.

```typescript
const webElement = page.locator(".hero");

await expect(webElement).toHaveScreenshot(
  "screenshotWebElement.png"
);
```

Instead of comparing the entire page, Playwright compares only:

```css
.hero
```

This is useful when only one component needs visual regression testing.

Examples include:

- Header
- Footer
- Button
- Card
- Navigation menu
- Hero section
- Form
- Dialog

---

# 16. Hiding Elements During Comparison

The project uses `stylePath` to temporarily apply CSS during the screenshot.

```typescript
await expect(page).toHaveScreenshot(
  "screenshotWithHiddenElements.png",
  {
    fullPage: true,
    stylePath:
      "../toHaveScreenshot/playwrightTests/hideWebElements.css",
  }
);
```

The CSS file contains rules for elements that should not appear in the screenshot comparison.

For example:

```css
.tour-banner {
  display: none !important;
}

.site-header {
  display: none !important;
}
```

This is useful when certain elements are irrelevant to the visual comparison.

For example:

- Cookie notifications
- Tour banners
- Advertisements
- Dynamic notifications
- Temporary UI elements

---

# 17. Masking Dynamic Elements

Another approach is to mask elements rather than hide them.

```typescript
await expect(page).toHaveScreenshot("screenshot.png", {
  fullPage: true,
  mask: [
    page.locator(".tour-banner"),
    page.locator(".site-header"),
  ],
  maskColor: "#005E8A",
});
```

The selected elements are covered by the specified mask color.

### Hide vs. Mask

| Method | What happens? |
|---|---|
| `stylePath` | Element is hidden/modified using CSS |
| `mask` | Element remains in the layout but its contents are covered |

Masking is useful when the element's position and size are important but its content is dynamic.

---

# 18. Pixel Difference Tolerance

The project contains two tests that demonstrate pixel tolerance.

## 0 Pixel Tolerance

```typescript
await expect(page).toHaveScreenshot("screenshot1px.png", {
  fullPage: true,
  maxDiffPixels: 0,
});
```

This allows **zero differing pixels**.

Therefore, even a single changed pixel causes the test to fail.

### Example

```text
Expected screenshot
████████████████

Actual screenshot
███████████████░

Difference: 1 pixel

maxDiffPixels: 0
Result: ❌ FAIL
```

---

# 19. 100 Pixel Tolerance

The second test uses:

```typescript
maxDiffPixels: 100
```

This means up to 100 different pixels are allowed.

If the difference is:

```text
1 pixel → PASS
50 pixels → PASS
100 pixels → PASS
101 pixels → FAIL
```

This is useful when very small rendering differences are acceptable.

---

# 20. Comparing Against a Completely Different Website

This test intentionally compares the wrong website with the screenshot:

```typescript
await page.goto(
  `file://${path.resolve("playwrightTests/TestWebsite/cat.html")}`
);

await expect(page).toHaveScreenshot("screenshot.png", {
  fullPage: true,
});
```

Because `cat.html` does not visually match the stored screenshot, the test should fail.

This demonstrates that Playwright can detect major visual changes.

---

# 21. Text Snapshot Testing

Visual testing does not have to be limited to screenshots.

The project also compares text.

```typescript
expect(
  await page.textContent(".footer-tagline")
).toMatchSnapshot("footer-tagline.txt");
```

The text inside:

```css
.footer-tagline
```

is compared with:

```text
footer-tagline.txt
```

For example, if the expected text is:

```text
Making the web better, one test at a time.
```

and the website changes it to:

```text
Making the web better, one test at a time!
```

the snapshot comparison detects the difference.

---

# 22. Intentionally Failing Tests

Two tests are deliberately designed to fail:

### 1px difference with 0px tolerance

```typescript
maxDiffPixels: 0
```

This should fail because the screenshot contains a 1-pixel difference.

### Different website

The test compares `cat.html` against the screenshot of the original website.

This should also fail.

### Different text

The footer tagline is compared against a text snapshot containing different text.

This should fail.

These tests are useful for demonstrating that the visual and text comparisons are actually detecting changes.

---

# 23. What Each Test Demonstrates

| Test | Purpose |
|---|---|
| Full page screenshot | Basic visual comparison |
| Full page + Firefox | Visual comparison in Firefox |
| Full page + WebKit | Visual comparison in WebKit |
| Web element screenshot | Compare a specific element |
| Web element + Firefox | Element comparison in Firefox |
| Web element + WebKit | Element comparison in WebKit |
| Hidden elements | Ignore selected elements |
| Hidden elements + Firefox | Hidden elements in Firefox |
| Hidden elements + WebKit | Hidden elements in WebKit |
| Masked elements | Mask dynamic elements |
| 1px difference / 0 tolerance | Demonstrate strict comparison |
| 1px difference / 100 tolerance | Demonstrate allowed differences |
| Different website | Demonstrate large visual failure |
| Matching text | Successful text snapshot |
| Different text | Failed text snapshot |

---

# 24. Recommended Project Checklist

Before giving this project to someone else, make sure they have:

- [ ] Node.js installed
- [ ] npm available
- [ ] Visual Studio Code installed
- [ ] Project files copied/cloned
- [ ] `package.json` present
- [ ] `tsconfig.json` present
- [ ] Playwright installed
- [ ] Node.js type definitions installed
- [ ] Chromium installed through Playwright
- [ ] Firefox installed through Playwright
- [ ] WebKit installed through Playwright
- [ ] HTML test files present
- [ ] Screenshot files present
- [ ] CSS file for hidden elements present
- [ ] Screenshot paths correct
- [ ] Test file paths correct

---

# 25. Quick Setup for a New Computer

For someone who already has Node.js installed, the setup should generally be:

```bash
git clone <repository>
cd <project-folder>
npm install
npx playwright install
npx playwright test
```

To run with visible browsers:

```bash
npx playwright test --headed
```

To open Playwright's UI:

```bash
npx playwright test --ui
```

---

# 26. Troubleshooting

## `Cannot find module '@playwright/test'`

Run:

```bash
npm install
```

or:

```bash
npm install -D @playwright/test
```

---

## `Cannot find name 'path'`

Make sure the import exists:

```typescript
import * as path from "path";
```

If TypeScript still reports an error:

```bash
npm install -D @types/node
```

---

## Browser executable not found

Install the Playwright browsers:

```bash
npx playwright install
```

---

## Screenshot comparison fails unexpectedly

Check:

1. Browser type.
2. Viewport size.
3. Operating system.
4. Stored screenshot.
5. Font availability.
6. Dynamic content.
7. Animations.
8. Masked/hidden elements.
9. Screenshot path.

Visual tests can be sensitive to differences between environments.

---

# 27. Important Consideration: Different Computers

Although Playwright makes browser rendering reproducible, screenshots can still differ between computers because of:

- Operating system rendering
- Installed fonts
- Font versions
- Browser versions
- Graphics rendering
- Device scale factor
- Browser configuration

For the most reliable visual regression testing, it is best to run the screenshots in a consistent environment, especially in CI.

---

# 28. Useful Playwright Commands

### Run all tests

```bash
npx playwright test
```

### Run headed

```bash
npx playwright test --headed
```

### Run in UI mode

```bash
npx playwright test --ui
```

### Update screenshots

```bash
npx playwright test -u
```

### Run a specific test

```bash
npx playwright test -g "1px-altered"
```

### Run a specific browser project

If browser projects are configured in `playwright.config.ts`:

```bash
npx playwright test --project=chromium
```

---

# 29. Summary

This project is a small demonstration of **Playwright visual regression testing**.

The core idea is simple:

```text
Website
   ↓
Take screenshot
   ↓
Compare with stored screenshot
   ↓
Differences detected?
   ├── No → PASS
   └── Yes → FAIL
```

The project demonstrates increasingly advanced comparison techniques:

1. Full-page comparison
2. Element comparison
3. Cross-browser comparison
4. Hiding elements
5. Masking elements
6. Pixel tolerance
7. Intentional visual failures
8. Text snapshot comparison

The most important command for getting the project running on a new computer is:

```bash
npx playwright install
```

and the most important command for running the tests is:

```bash
npx playwright test
```
