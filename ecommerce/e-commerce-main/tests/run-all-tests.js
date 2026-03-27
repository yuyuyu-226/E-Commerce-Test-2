const { Builder, By, until } = require("selenium-webdriver");

const tests = [
  {
    name: "Navigate from Signup to Login",
    run: async (driver) => {
      await driver.get("http://localhost:5173/signup");
      const loginLink = await driver.wait(
        until.elementLocated({ id: "loginLinkk" }),
        10000
      );
      await loginLink.click();
      await driver.wait(until.urlContains("/login"), 10000);
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl !== "http://localhost:5173/login") {
        throw new Error(`Expected login URL but got ${currentUrl}`);
      }
    }
  },
  {
    name: "Navigate from Home to About",
    run: async (driver) => {
      await driver.get("http://localhost:5173/");
      const aboutLink = await driver.wait(
        until.elementLocated({ id: "aboutLink" }),
        10000
      );
      await aboutLink.click();
      await driver.wait(until.urlContains("/about"), 10000);
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl !== "http://localhost:5173/about") {
        throw new Error(`Expected about URL but got ${currentUrl}`);
      }
    }
  }
];

async function runAllTests() {
  console.log("🚀 Running Test Suite\n");
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`[${i + 1}/${tests.length}] Running: ${test.name}`);
    
    let driver = null;
    try {
      driver = await new Builder().forBrowser("chrome").build();
      await test.run(driver);
      console.log(`  ✅ PASSED\n`);
      passed++;
    } catch (error) {
      console.log(`  ❌ FAILED: ${error.message}\n`);
      failed++;
    } finally {
      if (driver) await driver.quit();
    }
  }
  
  console.log("=".repeat(50));
  console.log(`📊 Results: ${passed} passed, ${failed} failed, ${tests.length} total`);
  console.log("=".repeat(50));
  
  process.exit(failed > 0 ? 1 : 0);
}

runAllTests();