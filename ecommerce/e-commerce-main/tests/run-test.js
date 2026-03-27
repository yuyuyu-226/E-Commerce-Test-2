const { Builder, By, until } = require("selenium-webdriver");

async function runTest() {
  console.log("📄 Test started");
  let driver = null;
  
  try {
    console.log("🚀 Creating driver...");
    driver = await new Builder().forBrowser("chrome").build();
    console.log("✅ Driver created");
    
    console.log("🌐 Navigating to homepage...");
    await driver.get("http://localhost:5173/");
    console.log("✅ Homepage loaded");
    
    console.log("🔍 Looking for aboutLink...");
    const aboutLink = await driver.findElement({ id: "aboutLink" });
    console.log("✅ Found aboutLink");
    
    console.log("🖱️ Clicking aboutLink...");
    await aboutLink.click();
    console.log("✅ Clicked aboutLink");
    
    console.log("⏳ Waiting for navigation...");
    await driver.sleep(2000);
    
    console.log("📊 Getting current URL...");
    const currentUrl = await driver.getCurrentUrl();
    console.log(`📍 Current URL: ${currentUrl}`);
    
    if (currentUrl === "http://localhost:5173/about") {
      console.log("🎉 Test passed!");
      process.exit(0);
    } else {
      console.log("❌ Test failed: URL doesn't match");
      process.exit(1);
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    if (driver) {
      console.log("🧹 Closing driver...");
      await driver.quit();
    }
  }
}

runTest();