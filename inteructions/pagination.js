import Action from "./action.js";
import {RESULT_TYPE} from "../localDB.js";

class MultipleActions {
    /**
     * @param {Action} actionOne
     * @param {Action} actionTwo
     */
    constructor(actionOne, actionTwo) {
        this.actionOne = actionOne;
        this.acthionTwo = actionTwo;
    }

    async run(page, UserData, SiteData, AdditionalData) {
        const firstResult = await this.actionOne.run(page, UserData, SiteData, AdditionalData)
        if (firstResult.result_type === RESULT_TYPE.NEGATIVE) {
            return firstResult
        }
        const secondResult = await this.acthionTwo.run(page, UserData, SiteData, AdditionalData)
        secondResult.action = firstResult.action + " " + secondResult.action;
        secondResult.result = firstResult.result + " " + secondResult.result;
        return secondResult;
    }
}

async function openRandomPage(page, UserData) {
    const element = await page.waitForSelector('title', {timeout: 400});
    const pageNumber = await page.evaluate(() => {
        const allPages = document.querySelectorAll('#pagination a');
        let pageNumber = null;
        if (allPages.length > 0) {
            const selectedArticle = allPages[Math.floor(Math.random() * allPages.length)];
            pageNumber = selectedArticle.textContent;
            selectedArticle.click();
        }
        return pageNumber

    });
    if (pageNumber === null) {
        return {"data": {"errorDescription": " No pagination found."}, "error": true};
    }

    return {
        "data": {"pageNumber": pageNumber},
        "error": false
    };
}

const OpenRandomPage = new Action(
    'mainpage',
    'Decided to open random page.🎉',
    'Successfully opened the page number "{{pageNumber}}".',
    "😣 Couldn't open random page. {{errorDescription}}",
    openRandomPage,
    0.1,
);

export {OpenRandomPage, MultipleActions};
