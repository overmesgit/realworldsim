import ArticleGenerator from "./article.js";
import Action from "./action.js";
import {CantFind, getFormErrors} from "./helpers.js";

async function writeArticle(page, UserData) {
    const generator = new ArticleGenerator();
    const article = generator.generateArticle();
    let error = null;
    let errorDescription = '';

    try {
        await page.waitForSelector('title', {timeout: 400});
        errorDescription = CantFind("button for creating new article.")
        const newArticle = await page.waitForSelector('a#new-article', {timeout: 200});
        await newArticle.click(newArticle);

        errorDescription = CantFind("input for entering title.")
        const titleInput = await page.waitForSelector('input#article-title', {timeout: 200});
        await titleInput.type(article.title);

        errorDescription = CantFind("input for entering content.")
        const contentInput = await page.waitForSelector('textarea#article-content', {timeout: 100});
        await contentInput.type(article.content);

        errorDescription = CantFind("button for submit.")
        const createArticle = await page.waitForSelector('button#save', {timeout: 100});
        await createArticle.click(createArticle);
        
        const createResponse = await page.waitForResponse(response =>
            response.request().method() === 'POST'
        );
        if (createResponse.status() === 400) {
            console.log("validation error")
            await page.waitForSelector('button#save', {timeout: 200});
            let errorText = await getFormErrors(page);
            errorDescription = " I've got a validation error. " + errorText
            error = true
        }
    } catch (e) {
        console.log("write article error", e.message)
        error = true
    }
    return {data: {title: article.title, errorDescription}, error: error};
}

const WriteArticle = new Action(
    "writearticle",
    "Felt inspired, so I started drafting a new article \"{{title}}\". 🤔",
    "😃 The article editor was user-friendly, and I published my piece without a hitch!",
    "😣 Ran into some glitches while trying to save my draft.{{errorDescription}}",
    writeArticle,
    5,
)

export default WriteArticle;