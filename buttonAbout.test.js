const { Builder } = require("selenium-webdriver");
const assert = require("assert");

jest.setTimeout(30000); 

test("should navigate to the login page", async () => {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:5174/");
    
    await driver.findElement({ id: "learnMoreLink" }).click();
    
    let currentUrl = await driver.getCurrentUrl();
    let expectedUrl = "http://localhost:5174/about";
    
    expect(currentUrl).toBe(expectedUrl);
    
    console.log("Test passed: Navigation using Button to About page successful.");
  } finally {
    await driver.quit();
  }
});
