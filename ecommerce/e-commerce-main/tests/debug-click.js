const { Builder, By, until } = require("selenium-webdriver");

async function debugClick() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    console.log("1. Loading page...");
    await driver.get("http://localhost:5173/");
    
    console.log("2. Looking for aboutLink element...");
    let aboutLink = await driver.findElement({ id: "aboutLink" });
    
    console.log("3. Checking if element is displayed...");
    let isDisplayed = await aboutLink.isDisplayed();
    console.log(`   Element displayed: ${isDisplayed}`);
    
    console.log("4. Checking if element is enabled...");
    let isEnabled = await aboutLink.isEnabled();
    console.log(`   Element enabled: ${isEnabled}`);
    
    console.log("5. Getting element text...");
    let text = await aboutLink.getText();
    console.log(`   Element text: "${text}"`);
    
    console.log("6. Getting current URL before click...");
    let beforeUrl = await driver.getCurrentUrl();
    console.log(`   URL before click: ${beforeUrl}`);
    
    console.log("7. Clicking the element...");
    await aboutLink.click();
    console.log("   Click executed!");
    
    console.log("8. Waiting for navigation to complete...");
    // Wait for URL to change
    await driver.wait(until.urlContains("about"), 10000);
    
    console.log("9. Getting current URL after click...");
    let afterUrl = await driver.getCurrentUrl();
    console.log(`   URL after click: ${afterUrl}`);
    
    if (afterUrl.includes("about")) {
      console.log("✅ Navigation successful!");
    } else {
      console.log("❌ Navigation failed or URL didn't change");
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await driver.quit();
  }
}

debugClick();