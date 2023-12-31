import { Builder, By, Capabilities, Key, until, WebDriver } from 'selenium-webdriver';
import { expect } from 'chai';
import { Options } from 'selenium-webdriver/chrome';
import exp from 'node:constants';

describe('Delete Tests', function() {
  this.timeout(100000);

  let driver: WebDriver;

  before(async function() {
    const options = new Options();
    options.headless().windowSize({
      height: 1080,
      width: 1920,
    });
    driver = await new Builder().withCapabilities(Capabilities.chrome()).setChromeOptions(options).build();
    await driver.get('http://localhost:3000');
  });

  describe('Login with valid credentials', function () {
    it('should redirect to the correct page', async function () {
      const usernameInput = await driver.findElement(By.id('username'));
      await usernameInput.sendKeys(process.env.TEST_VALID_ADMIN_USERNAME);
      const passwordInput = await driver.findElement(By.id('password'));
      await passwordInput.sendKeys(process.env.TEST_VALID_ADMIN_PASSWORD);
      const loginButton = await driver.findElement(By.id('loginSubmit'));
      await loginButton.click();
  
      const redirectedPage = await driver.wait(
        until.urlIs('http://localhost:3000/'),
        10000
      );
  
      expect(redirectedPage).to.be.true;
    });
  });
  

  describe('"Delete Job Roles" button', function() {
    it('should load job selector when clicked', async function() {
      await driver.get('http://localhost:3000');
      const button = await driver.findElement(By.id('deleteJobRolesButton'));
      await new Promise(resolve => setTimeout(resolve, 5000));
      await button.click();
      
      const jobSelectForm = await driver.wait(until.elementLocated(By.id('jobSelectForm')), 30000);
      expect(await jobSelectForm.isDisplayed()).to.be.true;
    });
  });

  describe('"Select First item in dropdown" button', function() {
    it('should redirect to the appropriate page when selected and delete button clicked', async function() {
      const jobId = 1;

      const jobDeleteInput = await driver.findElement(By.id('jobSelect'));
      await jobDeleteInput.click();
      await jobDeleteInput.sendKeys(Key.DOWN);
      await jobDeleteInput.sendKeys(Key.ENTER);

      const button = await driver.findElement(By.id('continueDelete'));
      
      await button.click();

      const redirectedPage = await driver.wait(
        until.urlContains('confirmdeletejob'), 
        10000
      );

      expect(redirectedPage).to.be.true;
    });
  });

  describe("Confirm delete button should be visible", () => {
    it("Should show the confirm delete button",async() => {
        const button = driver.findElement(By.id(`deleteRequestSubmit`))

        expect(await button.getText()).to.equal("Delete")
    })
  })

  

after(async function() {
  await driver.quit();
});
});