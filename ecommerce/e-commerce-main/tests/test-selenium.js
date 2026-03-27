const { Builder } = require('selenium-webdriver');

async function test() {
  console.log("1. Attempting to launch Chrome...");
  try {
    let driver = await new Builder().forBrowser("chrome").build();
    console.log("2. Chrome launched successfully!");
    
    console.log("3. Navigating to localhost:5173...");
    await driver.get("http://localhost:5173/");
    console.log("4. Page loaded successfully!");
    
    let title = await driver.getTitle();
    console.log("5. Page title:", title);
    
    await driver.quit();
    console.log("6. Test complete!");
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Full error:", error);
  }
}

test();