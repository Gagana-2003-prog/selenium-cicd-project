import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const WAIT_TIME = 15000;

async function createDriver() {
  const options = new chrome.Options();

  options.addArguments(
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--window-size=1920,1080"
  );

  // Run headless only when in GitHub Actions (CI), keep it visible on your own PC
  if (process.env.CI) {
    options.addArguments("--headless=new");
  }

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  return driver;
}

async function runTests() {
  console.log("🚀 Starting Selenium Tests - Demo Run\n");
  let passed = 0, failed = 0;

  // ==================== WEBSITE 1: SWAG LABS ====================
  console.log("🌐 WEBSITE 1: Swag Labs (E-Commerce)\n");
  let driver = await createDriver();
  try {
    console.log("📋 TEST 1: Checking if Swag Labs loads...");
    try {
      await driver.get("https://www.saucedemo.com");
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
      await driver.findElement(By.id("user-name")).sendKeys("standard_user");
      await driver.findElement(By.id("password")).sendKeys("secret_sauce");
      await driver.findElement(By.id("login-button")).click();
      await driver.wait(until.elementLocated(By.className("inventory_list")), WAIT_TIME);
      console.log("   ✅ PASSED — Login successful!"); passed++;
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 4: Checking products...");
    try {
      const products = await driver.findElements(By.className("inventory_item"));
      if (products.length === 6) { console.log("   ✅ PASSED — Found", products.length, "products!"); passed++; }
      else { console.log("   ❌ FAILED — Expected 6 products, found:", products.length); failed++; }
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

  // ==================== WEBSITE 2: TODOmvc ====================
  console.log("\n🌐 WEBSITE 2: TodoMVC (Todo Application)\n");
  driver = await createDriver();
  try {
    console.log("📋 TEST 6: Checking if TodoMVC loads...");
    try {
      await driver.get("https://todomvc.com/examples/react/dist/");
      const title = await driver.getTitle();
      if (title.includes("TodoMVC")) { console.log("   ✅ PASSED — Website loaded! Title:", title); passed++; }
      else { console.log("   ❌ FAILED — Unexpected title:", title); failed++; }
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 7: Adding a todo item...");
    try {
      const input = await driver.wait(until.elementLocated(By.className("new-todo")), WAIT_TIME);
      await input.sendKeys("Buy groceries\n");
      await driver.sleep(1000);
      const todos = await driver.findElements(By.className("todo-list"));
      console.log("   ✅ PASSED — Todo item added successfully!"); passed++;
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 8: Checking todo item exists...");
    try {
      const items = await driver.findElements(By.css(".todo-list li"));
      if (items.length > 0) { console.log("   ✅ PASSED — Found", items.length, "todo item(s)!"); passed++; }
      else { console.log("   ❌ FAILED — No todo items found!"); failed++; }
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }
  } finally { await driver.quit(); }

  // ==================== WEBSITE 3: ORANGEHRM ====================
  console.log("\n🌐 WEBSITE 3: OrangeHRM (HR Management System)\n");
  driver = await createDriver();
  try {
    console.log("📋 TEST 9: Checking if OrangeHRM loads...");
    try {
      await driver.get("https://opensource-demo.orangehrmlive.com");
      const title = await driver.getTitle();
      if (title.includes("OrangeHRM")) { console.log("   ✅ PASSED — Website loaded! Title:", title); passed++; }
      else { console.log("   ❌ FAILED — Unexpected title:", title); failed++; }
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 10: Checking login form exists...");
    try {
      await driver.wait(until.elementLocated(By.name("username")), WAIT_TIME);
      await driver.findElement(By.name("password"));
      console.log("   ✅ PASSED — Login form found!"); passed++;
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 11: Testing OrangeHRM login...");
    try {
      await driver.findElement(By.name("username")).sendKeys("Admin");
      await driver.findElement(By.name("password")).sendKeys("admin123");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.wait(until.elementLocated(By.className("oxd-topbar-header")), WAIT_TIME);
      console.log("   ✅ PASSED — OrangeHRM Login successful!"); passed++;
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }

    console.log("\n📋 TEST 12: Checking dashboard loads...");
    try {
      const dashboard = await driver.findElement(By.className("oxd-topbar-header"));
      if (dashboard) { console.log("   ✅ PASSED — Dashboard loaded successfully!"); passed++; }
    } catch (err) { console.log("   ❌ FAILED:", err.message); failed++; }
  } finally { await driver.quit(); }

  // ==================== RESULTS ====================
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
