const { Builder, By } = require("selenium-webdriver");

async function debugPage() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:5173/");
    
    console.log("Page loaded. Looking for elements...\n");
    
    // Check if there's an element with id="aboutLink"
    let aboutLinkExists = await driver.findElements({ id: "aboutLink" });
    console.log(`Element with id="aboutLink" found: ${aboutLinkExists.length > 0}`);
    
    // If not found, let's look for all links on the page
    if (aboutLinkExists.length === 0) {
      console.log("\nSearching for all links on the page:");
      let links = await driver.findElements(By.tagName("a"));
      for (let i = 0; i < links.length; i++) {
        let text = await links[i].getText();
        let href = await links[i].getAttribute("href");
        let id = await links[i].getAttribute("id");
        console.log(`Link ${i + 1}: Text="${text}", Href="${href}", Id="${id}"`);
      }
      
      console.log("\nSearching for buttons:");
      let buttons = await driver.findElements(By.tagName("button"));
      for (let i = 0; i < buttons.length; i++) {
        let text = await buttons[i].getText();
        let id = await buttons[i].getAttribute("id");
        console.log(`Button ${i + 1}: Text="${text}", Id="${id}"`);
      }
      
      // Get page title
      let title = await driver.getTitle();
      console.log(`\nPage title: ${title}`);
      
      // Get current URL
      let url = await driver.getCurrentUrl();
      console.log(`Current URL: ${url}`);
    }
    
  } finally {
    await driver.quit();
  }
}

debugPage();