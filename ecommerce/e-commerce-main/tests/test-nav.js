const { Builder, By, until } = require("selenium-webdriver");

async function testNavigationToLogin() {
  console.log("🧪 Testing: Navigate from Signup to Login");
  console.log("=".repeat(50));
  
  let driver = null;
  
  try {
    // Launch browser
    console.log("🚀 Launching Chrome...");
    driver = await new Builder().forBrowser("chrome").build();
    console.log("✅ Chrome launched");
    
    // Go to signup page
    console.log("🌐 Navigating to signup page...");
    await driver.get("http://localhost:5173/signup");
    console.log("✅ Signup page loaded");
    
    // Find and click login link
    console.log("🔍 Looking for login link (id: loginLinkk)...");
    const loginLink = await driver.wait(
      until.elementLocated({ id: "loginLinkk" }),
      10000
    );
    
    await driver.wait(until.elementIsVisible(loginLink), 10000);
    console.log("✅ Login link found");
    
    console.log("🖱️ Clicking login link...");
    await loginLink.click();
    console.log("✅ Clicked");
    
    // Wait for navigation
    console.log("⏳ Waiting for navigation to login page...");
    await driver.wait(until.urlContains("/login"), 10000);
    
    // Verify URL
    const currentUrl = await driver.getCurrentUrl();
    const expectedUrl = "http://localhost:5173/login";
    
    console.log(`📍 Current URL: ${currentUrl}`);
    console.log(`🎯 Expected URL: ${expectedUrl}`);
    
    if (currentUrl === expectedUrl) {
      console.log("\n✅✅✅ TEST PASSED! ✅✅✅");
      console.log(`Successfully navigated from signup to login page`);
      return true;
    } else {
      throw new Error(`URL mismatch. Expected: ${expectedUrl}, Got: ${currentUrl}`);
    }
    
  } catch (error) {
    console.log("\n❌❌❌ TEST FAILED! ❌❌❌");
    console.log(`Error: ${error.message}`);
    return false;
    
  } finally {
    if (driver) {
      console.log("\n🧹 Closing browser...");
      await driver.quit();
      console.log("✅ Browser closed");
    }
  }
}

// Run the test
testNavigationToLogin()
  .then(success => {
    console.log("\n" + "=".repeat(50));
    if (success) {
      console.log("✨ Test completed successfully");
      process.exit(0);
    } else {
      console.log("💥 Test failed");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  });