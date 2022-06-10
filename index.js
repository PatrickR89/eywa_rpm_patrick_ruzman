require("dotenv").config();

const webdriver = require("selenium-webdriver");
const { logger } = require("./logger");
const By = webdriver.By;
const until = webdriver.until;
const companies = require("./input.json");

logger.info("linkedIn_worker SCRIPT START");

const chrome = require("selenium-webdriver/chrome");

//         await driver.quit();

try {
    const options = new chrome.Options();
    const service = new chrome.ServiceBuilder().build();
    const driver = chrome.Driver.createSession(options, service);
    let loggingPreferences = new webdriver.logging.Preferences();
    loggingPreferences.setLevel(
        webdriver.logging.Type.BROWSER,
        webdriver.logging.Level.INFO
    );
    let capabilities = webdriver.Capabilities.chrome();
    capabilities.setLoggingPrefs(loggingPreferences);

    driver
        .manage()
        .logs()
        .get(webdriver.logging.Type.BROWSER)
        .then(function (entries) {
            entries.forEach(function (entry) {
                logger.info("[%s] %s", entry.level.name, entry.message);
            });
        });
    // driver.manage().window().maximize();
    driver.get("https://www.linkedin.com");
    driver
        .sleep(300)
        .then(async () => {
            try {
                await driver
                    .findElement(By.id("session_key"))
                    .sendKeys(process.env.LINKEDIN_EMAIL);
            } catch (err) {
                logger.error(err);
            }

            try {
                await driver
                    .findElement(By.id("session_password"))
                    .sendKeys(process.env.LINKEDIN_PASSWORD);
            } catch (err) {
                logger.error(err);
            }

            try {
                await driver
                    .findElement(By.className("sign-in-form__submit-button"))
                    .click();

                logger.info("Logged in to LinkedIn");
            } catch (err) {
                logger.error(err);
            }
        })
        .then(() => {
            try {
                // driver.findElement(By.id("ember25")).click();
                // instead of dropdown menu, upper left image anchor used to enter own profile
                var viewProfile = driver.wait(
                    until.elementLocated(By.className("ember-view block"), 2000)
                );
                //dropdown menu link id changes with every dropdown! -> not a reference
                viewProfile.click();
                logger.info("View profile entered");
            } catch (error) {
                logger.error(error);
            }
        })
        .then(() => {
            // Write next step code here etc.
        });
} catch (err) {
    console.log(err);
    logger.info(err);
}

logger.info("linkedIn_worker SCRIPT END \n");
