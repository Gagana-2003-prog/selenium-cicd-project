import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const WEBSITE_URL = "https://www.saucedemo.com";
const USERNAME = "standard_user";
const PASSWORD = "secret_sauce";
const WAIT_TIME = 15000;

async function runTests() {
  console.log("🚀 Starting Selenium Tests...\n");
  const options = new chrome.Options();
  options.addArguments("--headless=new","--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--window-size=1920,1080");
const service = new chrome.ServiceBuilder("/home/gagana-br/selenium-cicd-project/chromedriver-linux64/chromedriver");
const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).setChromeService(service).build();
  let passed = 0, failed = 0;
  try {
    console.log("📋 TEST 1: Checking if website loads...");
    try {
      await driver.get(WEBSITE_URL);
      const title = await driver.getTitle();
      if (title.includes("Swag Labs")) { console.log("   ✅ PASSED — Website loaded! Title:", title); passed++; }
      else { console.log("   ❌ FAILED — Unexpected title:", title); failed++; }
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 2: Checking login form elements...");
    try {
      await driver.findElement(By.id("user-name"));
      await driver.findElement(By.id("password"));
      await driver.findElement(By.id("login-button"));
      console.log("   ✅ PASSED — All form elements found!"); passed++;
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 3: Testing login...");
    try {
      await driver.findElement(By.id("user-name")).sendKeys(USERNAME);
      await driver.findElement(By.id("password")).sendKeys(PASSWORD);
      await driver.findElement(By.id("login-button")).click();
      await driver.wait(until.elementLocated(By.className("inventory_list")), WAIT_TIME);
      console.log("   ✅ PASSED — Login successful!"); passed++;
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 4: Checking products...");
    try {
      const products = await driver.findElements(By.className("inventory_item"));
      if (products.length ===10) { console.log("   ✅ PASSED — Found", products.length, "products!"); passed++; }
      else { console.log("   ❌ FAILED — No products found!"); failed++; }
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 5: Testing logout...");
    try {
      await driver.executeScript("document.getElementById('react-burger-menu-btn').click();");
      await driver.sleep(2000);
      await driver.executeScript("document.getElementById('logout_sidebar_link').click();");
      await driver.sleep(3000);
      const url = await driver.getCurrentUrl();
      if (!url.includes("inventory")) { console.log("   ✅ PASSED — Logout successful!"); passed++; }
      else { throw new Error("Still on inventory page after logout"); }
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

  } finally { await driver.quit(); }

  console.log("\n════════════════════════════════════");
  console.log("📊 TEST RESULTS SUMMARY");
  console.log("════════════════════════════════════");
  console.log("✅ Passed :", passed);
  console.log("❌ Failed :", failed);
  console.log("📝 Total  :", passed + failed);
  console.log("════════════════════════════════════");
  if (failed > 0) { process.exit(1); }
  else { console.log("\n🎉 All tests PASSED!"); process.exit(0); }
}
runTests().catch((err) => { console.error("💥 Unexpected error:", err); process.exit(1); });
