const { Builder, By, until } = require("selenium-webdriver");

jest.setTimeout(60000);

test("should navigate to the about page", async () => {
  console.log("📄 Test started");
  
  // Small delay to ensure Jest is ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let driver = null;
  
  try {
    console.log("🚀 Creating driver...");
    driver = await new Builder().forBrowser("chrome").build();
    console.log("✅ Driver created");
    
    await driver.get("http://localhost:5173/");
    console.log("✅ Homepage loaded");
    
    // Use a more robust way to find and click the element
    const aboutLink = await driver.wait(
      until.elementLocated({ id: "aboutLink" }),
      10000
    );
    
    await driver.wait(until.elementIsVisible(aboutLink), 10000);
    await driver.wait(until.elementIsEnabled(aboutLink), 10000);
    
    console.log("🖱️ Clicking aboutLink...");
    await aboutLink.click();
    
    // Wait for URL to change
    await driver.wait(until.urlContains("/about"), 10000);
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toBe("http://localhost:5173/about");
    console.log("🎉 Test passed!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  } finally {
    if (driver) {
      console.log("🧹 Closing driver...");
      await driver.quit();
    }
  }
}, 60000);