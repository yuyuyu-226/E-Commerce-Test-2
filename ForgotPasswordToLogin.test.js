const { Builder } = require("selenium-webdriver");
const assert = require("assert");

jest.setTimeout(30000); 

test("should navigate to the login page", async () => {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:5174/forgot-password");
    
    await driver.findElement({ id: "backToLoginButtonFP" }).click();
    
    let currentUrl = await driver.getCurrentUrl();
    let expectedUrl = "http://localhost:5174/login";
    
    expect(currentUrl).toBe(expectedUrl);
    
    console.log("Test passed: Navigation to Login page successful.");
  } finally {
    await driver.quit();
  }
});
