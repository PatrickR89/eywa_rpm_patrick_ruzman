const webdriver = require("selenium-webdriver");
const { logger } = require("./logger");
const By = webdriver.By;
const until = webdriver.until;
const companies = require("./input.json");
// const driver = new webdriver.Builder()
//     .forBrowser("firefox")
//     .usingServer("http://localhost:4444/wd/hub")
//     .build();

const firefox = require("selenium-webdriver/firefox");

const options = new firefox.Options();
const service = new firefox.ServiceBuilder().build();
const driver = firefox.Driver.createSession(options, service);

logger.info("linkedIn_worker SCRIPT START");

const getTitile = async () => {
    // let driver = await new webdriver.Builder()
    //     .forBrowser(webdriver.Browser.FIREFOX)
    //     .usingServer("http://localhost:4444/wd/hub")
    //     .build();

    try {
        await driver.get("https://www.google.com/ncr");
        await driver
            .findElement(By.name("q"))
            .sendKeys("webdriver", Key.RETURN);
        await driver.wait(until.titleIs("webdriver - Google Search"), 1000);
        await driver.quit();
    } catch (err) {
        logger.info(err);
    }
};

try {
    // driver.manage().window().maximize();
    // driver.get("https://www.eywaonline.com/development");
    // driver
    //     .sleep(300)
    //     .then(() => {
    //         // Write EYWA login code here
    //     })
    //     .then(() => {
    //         // Write code that opens module "Kontakti" here
    //     })
    //     .then(() => {
    //         // Write next step code here etc.
    //     });
    getTitile();
} catch (err) {
    console.log(err);
    logger.info(err);
}

logger.info("linkedIn_worker SCRIPT END \n");
