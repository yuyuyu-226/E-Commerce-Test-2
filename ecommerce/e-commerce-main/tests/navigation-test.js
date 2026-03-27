const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// Test configuration
const FRONTEND_URL = "http://localhost:5173";

async function testNavigationToLogin() {
  console.log("\n🧪 TEST: Navigate from Signup to Login");
  console.log("=".repeat(60));
  
  let driver = null;
  let passed = false;
  
  try {
    // Set up Chrome options for better stability
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');
    
    console.log("🚀 Launching Chrome browser...");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    console.log("✅ Browser launched");
    
    console.log(`🌐 Navigating to: ${FRONTEND_URL}/signup`);
    await driver.get(`${FRONTEND_URL}/signup`);
    console.log("✅ Signup page loaded");
    
    // Wait for page to be fully loaded
    await driver.sleep(1000);
    
    console.log("🔍 Looking for login link with id='loginLinkk'...");
    
    // Try to find the element with explicit wait
    const loginLink = await driver.wait(
      until.elementLocated(By.id("loginLinkk")),
      10000,
      "Could not find login link with id 'loginLinkk'"
    );
    
    // Wait for element to be clickable
    await driver.wait(until.elementIsVisible(loginLink), 5000);
    await driver.wait(until.elementIsEnabled(loginLink), 5000);
    
    const linkText = await loginLink.getText();
    console.log(`📝 Found link with text: "${linkText}"`);
    
    console.log("🖱️ Clicking login link...");
    await loginLink.click();
    console.log("✅ Click executed");
    
    // Wait for navigation to login page
    console.log("⏳ Waiting for navigation to login page...");
    await driver.wait(until.urlContains("/login"), 10000);
    
    // Verify we're on the login page
    const currentUrl = await driver.getCurrentUrl();
    const expectedUrl = `${FRONTEND_URL}/login`;
    
    console.log(`📍 Current URL: ${currentUrl}`);
    console.log(`🎯 Expected URL: ${expectedUrl}`);
    
    if (currentUrl === expectedUrl) {
      console.log("\n✅✅✅ TEST PASSED! ✅✅✅");
      console.log(`Successfully navigated from signup to login page`);
      passed = true;
    } else {
      throw new Error(`URL mismatch. Expected: ${expectedUrl}, Got: ${currentUrl}`);
    }
    
  } catch (error) {
    console.log("\n❌❌❌ TEST FAILED! ❌❌❌");
    console.log(`Error: ${error.message}`);
    
    // Take a screenshot on failure if needed
    if (driver) {
      try {
        const screenshot = await driver.takeScreenshot();
        const fs = require('fs');
        fs.writeFileSync('error-screenshot.png', screenshot, 'base64');
        console.log("📸 Screenshot saved as error-screenshot.png");
      } catch (screenshotError) {
        console.log("Could not take screenshot:", screenshotError.message);
      }
    }
    passed = false;
    
  } finally {
    if (driver) {
      console.log("\n🧹 Closing browser...");
      await driver.quit();
      console.log("✅ Browser closed");
    }
  }
  
  return passed;
}

// Additional test: Navigation from Home to About
async function testNavigationToAbout() {
  console.log("\n🧪 TEST: Navigate from Home to About");
  console.log("=".repeat(60));
  
  let driver = null;
  let passed = false;
  
  try {
    const options = new chrome.Options();
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    console.log("🚀 Launching Chrome browser...");
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    console.log("✅ Browser launched");
    
    console.log(`🌐 Navigating to: ${FRONTEND_URL}`);
    await driver.get(FRONTEND_URL);
    console.log("✅ Homepage loaded");
    
    await driver.sleep(1000);
    
    console.log("🔍 Looking for about link with id='aboutLink'...");
    const aboutLink = await driver.wait(
      until.elementLocated(By.id("aboutLink")),
      10000,
      "Could not find about link with id 'aboutLink'"
    );
    
    await driver.wait(until.elementIsVisible(aboutLink), 5000);
    const linkText = await aboutLink.getText();
    console.log(`📝 Found link with text: "${linkText}"`);
    
    console.log("🖱️ Clicking about link...");
    await aboutLink.click();
    console.log("✅ Click executed");
    
    console.log("⏳ Waiting for navigation to about page...");
    await driver.wait(until.urlContains("/about"), 10000);
    
    const currentUrl = await driver.getCurrentUrl();
    const expectedUrl = `${FRONTEND_URL}/about`;
    
    console.log(`📍 Current URL: ${currentUrl}`);
    console.log(`🎯 Expected URL: ${expectedUrl}`);
    
    if (currentUrl === expectedUrl) {
      console.log("\n✅✅✅ TEST PASSED! ✅✅✅");
      console.log(`Successfully navigated from home to about page`);
      passed = true;
    } else {
      throw new Error(`URL mismatch. Expected: ${expectedUrl}, Got: ${currentUrl}`);
    }
    
  } catch (error) {
    console.log("\n❌❌❌ TEST FAILED! ❌❌❌");
    console.log(`Error: ${error.message}`);
    passed = false;
    
  } finally {
    if (driver) {
      console.log("\n🧹 Closing browser...");
      await driver.quit();
      console.log("✅ Browser closed");
    }
  }
  
  return passed;
}

// Run all tests
async function runAllTests() {
  console.log("\n🚀 Starting Selenium Test Suite");
  console.log("=".repeat(60));
  console.log(`📡 Frontend URL: ${FRONTEND_URL}`);
  console.log("=".repeat(60));
  
  const results = [];
  
  // Run tests
  results.push(await testNavigationToLogin());
  results.push(await testNavigationToAbout());
  
  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  
  const passed = results.filter(r => r === true).length;
  const failed = results.filter(r => r === false).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${results.length}`);
  
  if (failed === 0) {
    console.log("\n🎉 All tests passed!");
    process.exit(0);
  } else {
    console.log("\n💥 Some tests failed!");
    process.exit(1);
  }
}

// Run the test suite
runAllTests().catch(error => {
  console.error("Unexpected error:", error);
  process.exit(1);
});