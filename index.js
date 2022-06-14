require("dotenv").config();

const webdriver = require("selenium-webdriver");
const { logger } = require("./logger");
const By = webdriver.By;
const until = webdriver.until;
const companies = require("./input.json");

logger.info("linkedIn_worker SCRIPT START");

const chrome = require("selenium-webdriver/chrome");

//         await driver.quit();

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

const handleLogin = async () => {
    await driver.sleep(500);
    try {
        await driver
            .findElement(By.id("session_key"))
            .sendKeys(process.env.LINKEDIN_EMAIL);
        logger.info("Login to LinkedIn");
    } catch (err) {
        logger.error(err);
        logger.info("Exit script due to error");
        driver.close();
    }

    try {
        await driver
            .findElement(By.id("session_password"))
            .sendKeys(process.env.LINKEDIN_PASSWORD);
        await driver
            .findElement(By.className("sign-in-form__submit-button"))
            .click();

        logger.info("Logged in to LinkedIn");
    } catch (err) {
        logger.error(err);
        logger.info("Exit script due to error");
        driver.close();
    }
};

const handleEnterProfile = async () => {
    await driver.sleep(500);
    try {
        let viewProfile = driver.wait(
            until.elementLocated(
                By.css("button.artdeco-dropdown__trigger--placement-bottom"),
                2000
            )
        );
        viewProfile.click();
        await driver.sleep(500);
        let enterProfile = driver.wait(
            until.elementLocated(
                By.xpath(
                    "/html/body/div[7]/header/div/nav/ul/li[6]/div/div/div/header/a[2]"
                ),
                2000
            )
        );
        await enterProfile.click();
        await driver
            .findElement(
                By.xpath("/html/body/div[7]/div[3]/div/div/div[2]/div/div")
            )
            .click()
            .then(logger.info("View profile entered"));
        ///html/body/div[7]/div[3]/div/div/div[2]/div/div
    } catch (error) {
        logger.error(error);
        logger.info("Exit script due to error");
        driver.close();
    }
};

const openAddExpirience = async () => {
    try {
        await driver.sleep(500);
        let button = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "/html/body/div[7]/div[3]/div/div/div[2]/div/div/main/section[6]/div[2]/div/div[2]/div[1]/div[1]/button"
                ),
                500
            )
        ); // /html/body/div[7]/div[3]/div/div/div[2]/div/div/main/section[5]/div[2]/div/div[2]/div[1]/div[1]/button
        // /html/body/div[7]/div[3]/div/div/div[2]/div/div/main/section[6]/div[2]/div/div[2]/div[1]/div[1]/button
        await button.click();
        await driver.sleep(500);
        let addPosition = await driver.wait(
            until.elementLocated(
                By.css("a.artdeco-dropdown__item--is-dropdown"),
                2000
            )
        );
        logger.info("Add position button found");
        await addPosition.click();
    } catch (error) {
        logger.error(error);
        logger.info("Exit script due to error");
        driver.close();
    }
};

const handleAddExpirience = async () => {
    try {
        await driver.sleep(500);
        let titleInput = await driver.wait(
            until.elementLocated(
                By.id(
                    "single-typeahead-entity-form-component-profileEditFormElement-POSITION-profilePosition-ACoAADwYgkUB2ZEbcmjcNSsy-o3GgT8n2cYtofc-1-title"
                ),
                1000
            )
        );

        await titleInput.sendKeys("Junior software engineer");

        let companyName = await driver.wait(
            until.elementLocated(
                By.id(
                    "single-typeahead-entity-form-component-profileEditFormElement-POSITION-profilePosition-ACoAADwYgkUB2ZEbcmjcNSsy-o3GgT8n2cYtofc-1-requiredCompany"
                ),
                1000
            )
        );

        await companyName.sendKeys("Neyho Informatika d.o.o.");

        let startMonth = await driver.wait(
            until.elementLocated(
                By.id(
                    "date-range-form-component-profileEditFormElement-POSITION-profilePosition-ACoAADwYgkUB2ZEbcmjcNSsy-o3GgT8n2cYtofc-1-dateRange-start-date"
                ),
                1000
            )
        );

        await startMonth.sendKeys("May");

        let startYear = await driver.wait(
            until.elementLocated(
                By.id(
                    "date-range-form-component-profileEditFormElement-POSITION-profilePosition-ACoAADwYgkUB2ZEbcmjcNSsy-o3GgT8n2cYtofc-1-dateRange-start-date-year-select"
                ),
                1000
            )
        );

        await startYear.sendKeys("2022");

        let industry = await driver.wait(
            until.elementLocated(
                By.id(
                    "single-typeahead-entity-form-component-profileEditFormElement-POSITION-profilePosition-ACoAADwYgkUB2ZEbcmjcNSsy-o3GgT8n2cYtofc-1-industryId"
                ),
                2000
            )
        );

        await industry.sendKeys("IT System Testing and Evaluation");
        // Internet as a value is not an option for Industry input !!!

        let industryOption = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "/html/body/div[3]/div/div/div[2]/div/div[2]/div[1]/div[8]/div/div/div/div/div[2]/div/div"
                ),
                2000
            )
        );

        await industryOption.click();

        let saveBtn = await driver.wait(
            until.elementLocated(
                By.xpath("/html/body/div[3]/div/div/div[3]/button")
            ),
            3000
        );

        await saveBtn.click();
    } catch (error) {
        logger.error(error);
        logger.info("Exit script due to error");
        driver.close();
    }
};

const main = async () => {
    await driver.sleep(300).then(handleLogin());
    await driver.sleep(100).then(handleEnterProfile());
    await driver.sleep(100).then(openAddExpirience());
    await driver
        .sleep(500)
        .then(handleAddExpirience())
        .then(logger.info("linkedIn_worker SCRIPT END \n"));
};

main();
