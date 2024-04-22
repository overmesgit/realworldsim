import Action from "./action.js";
import {RESULT_TYPE} from "../localDB.js";

class MultipleActions {
    /**
     * @param {Action} actions
     */
    constructor(...actions) {
        this.actions = actions;
        this.action = actions.slice(-1)[0].action
    }

    async run(page, UserData, SiteData, AdditionalData) {
        let prevResult = null;
        let result = null;
        for (let action of this.actions) {
            result = await action.run(page, UserData, SiteData, AdditionalData)
            if (prevResult) {
                result.action = prevResult.action + " " + result.action;
                result.result = prevResult.result + " " + result.result;
            }
            if (result.result_type === RESULT_TYPE.NEGATIVE) {
                return result
            }
            prevResult = result;
        }
        return result;
    }
}

async function openRandomPage(page, UserData) {
    await page.waitForSelector('title', {timeout: 400});
    const [pageNumber, total] = await page.evaluate(() => {
        const allPages = document.querySelectorAll('#pagination a');
        let pageNumber = null;
        if (allPages.length > 0) {
            const selectedArticle = allPages[Math.floor(Math.random() * allPages.length)];
            pageNumber = selectedArticle.textContent;
            selectedArticle.click();
        }
        return [pageNumber, allPages.length]

    });
    if (pageNumber === null) {
        return {"data": {"errorDescription": " No pagination found."}, "error": true};
    }

    return {
        "data": {pageNumber, total},
        "error": false
    };
}

const OpenRandomPage = new Action(
    'mainpage',
    'Decided to open random page.🎉',
    'Successfully opened page {{pageNumber}} from {{total}} pages.',
    "😣 Couldn't open random page. {{errorDescription}}",
    openRandomPage,
    0.1,
);

export {OpenRandomPage, MultipleActions};
