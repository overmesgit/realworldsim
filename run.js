import puppeteer from 'puppeteer';
import RunServer from "./agentServer/server.js";
import OpenBlogPage from "./inteructions/openSite.js";
import WriteArticle from "./inteructions/writeArticle.js";
import CheckMainPageArticles from "./inteructions/mainPageArticles.js";
import {getRandomObjectByDistribution, randomElement, sleep} from "./helpers.js";
import OpenRandomArticle from "./inteructions/openArticle.js";
import User from "./user.js";
import {CheckAuth} from "./inteructions/signUp.js";
import {Interaction, RESULT_TYPE, localDB} from "./localDB.js";
import {MultipleActions, OpenRandomPage} from "./inteructions/pagination.js";


class ProbableAction {
    action;
    probability;

    constructor(action, probability) {
        this.action = action;
        this.probability = probability;
    }
}

const INTERACTIONS = [
    new ProbableAction(OpenBlogPage, 1),
    new ProbableAction(CheckMainPageArticles, 1),
    new ProbableAction(new MultipleActions(OpenRandomPage, CheckMainPageArticles), 1),
    new ProbableAction(OpenRandomArticle, 1),
    new ProbableAction(new MultipleActions(OpenRandomPage, OpenRandomArticle), 1),
    new ProbableAction(new CheckAuth(WriteArticle), 0.5),
];

async function runInteruction(user, browser) {
    // TODO: logout
    const context = await browser.createBrowserContext();
    while (true) {
        const page = await context.newPage();
        await page.setViewport({width: 1080, height: 1024});

        let action = getRandomObjectByDistribution(INTERACTIONS)
        try {
            await page.goto('http://127.0.0.1:8080/');
            const interaction = await action.run(page, user);
            localDB.addInteruction(interaction);
        } catch (e) {
            console.log("action error main", action.action, e.message, e)
        }
        await page.close();
        await sleep(3000);
    }
    await context.close();
}

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--disable-gpu',
            '--disable-extensions',
            '--no-zygote',
            '--no-sandbox',
            '--disable-background-networking',
            '--disable-default-apps',
            '--disable-sync'
        ]
    });

    const users = [
        new User("1", "Jon Smith", "jon_smith", "jonpassword"),
        new User("2", "Hernandez Mary", "hernandez_mary", "marypassword"),
        new User("3", "Kelley David", "kelley_david", "davidpassword"),
        new User("4", "Harrell Victoria", "harrell_victoria", "victoriapassword"),
        new User("5", "Collins Rachel", "collins_rachel", "rachelpassword"),
    ]

    const promises = [];
    for (const u of users) {
        promises.push(runInteruction(u, browser))
    }
    await Promise.all(promises);
    await browser.close();
})();

RunServer();