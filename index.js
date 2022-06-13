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
    {
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
    }
};

const handleEnterProfile = async () => {
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
        enterProfile.click();
        logger.info("View profile entered");
    } catch (error) {
        logger.error(error);
        logger.info("Exit script due to error");
        driver.close();
    }
};

const openAddExpirience = async () => {
    try {
        let button = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "/html/body/div[7]/div[3]/div/div/div[2]/div/div/main/section[6]/div[2]/div/div[2]/div[1]/div[1]/button"
                ),
                500
            )
        );
        button.click();
        await driver.sleep(500);
        let addPosition = await driver.wait(
            until.elementLocated(
                By.css("a.artdeco-dropdown__item--is-dropdown"),
                2000
            )
        );
        logger.info("Add position button found");
        addPosition.click();
        logger.info("linkedIn_worker SCRIPT END \n");
    } catch (error) {
        logger.error(error);
        logger.info("Exit script due to error");
        driver.close();
    }
};

const main = async () => {
    await driver.sleep(300).then(handleLogin());

    await driver.sleep(200).then(handleEnterProfile());

    await driver.sleep(200).then(openAddExpirience());
    // .then(async () => {
    //     try {
    //         let viewProfile = driver.wait(
    //             until.elementLocated(
    //                 By.css(
    //                     "button.artdeco-dropdown__trigger--placement-bottom"
    //                 ),
    //                 2000
    //             )
    //         );
    //         viewProfile.click();
    //         await driver.sleep(500);
    //         let enterProfile = driver.wait(
    //             until.elementLocated(
    //                 By.xpath(
    //                     "/html/body/div[7]/header/div/nav/ul/li[6]/div/div/div/header/a[2]"
    //                 ),
    //                 2000
    //             )
    //         );
    //         enterProfile.click();
    //         logger.info("View profile entered");
    //     } catch (error) {
    //         logger.error(error);
    //         logger.info("Exit script due to error");
    //         driver.close();
    //     }

    //     try {
    //         let button = await driver.wait(
    //             until.elementLocated(
    //                 By.xpath(
    //                     "/html/body/div[7]/div[3]/div/div/div[2]/div/div/main/section[6]/div[2]/div/div[2]/div[1]/div[1]/button"
    //                 ),
    //                 500
    //             )
    //         );
    //         button.click();
    //         await driver.sleep(500);
    //         let addPosition = await driver.wait(
    //             until.elementLocated(
    //                 By.css("a.artdeco-dropdown__item--is-dropdown"),
    //                 2000
    //             )
    //         );
    //         logger.info("Add position button found");
    //         addPosition.click();
    //         logger.info("linkedIn_worker SCRIPT END \n");
    //     } catch (error) {
    //         logger.error(error);
    //         logger.info("Exit script due to error");
    //         driver.close();
    //     }
    // });
};

main();

//
