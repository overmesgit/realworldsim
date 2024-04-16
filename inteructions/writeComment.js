import ArticleGenerator from "./article.js";
import Action from "./action.js";

async function writeComment(page) {
    const generator = new ArticleGenerator();
    const article = generator.generateArticle();
    let error = null;
    let errorDescription = '';

    try {
        await page.goto('http://127.0.0.1:8080/');
        errorDescription = " Can't find button for creating new article."
        const newArticle = await page.waitForSelector('a#new-article', {timeout: 100});
        await newArticle.click(newArticle);
      
    } catch (e) {
        console.log("write article error", e.message)
        error = true
    }

    return {data: {title: article.title, errorDescription}, error: error};
}

const WriteCommentAction = new Action(
    "writecomment",
    "Felt inspired, so I started drafting a new article \"{{title}}\". 🤔",
    "😃 The article editor was user-friendly, and I published my piece without a hitch!",
    "😣 Ran into some glitches while trying to save my draft.{{errorDescription}}",
    writeComment
)

export default WriteCommentAction;