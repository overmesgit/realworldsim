import Action from "./action.js";

async function openArticle(page, UserData) {
    await page.goto('http://127.0.0.1:8080/');
    const clickedArticleTitle = await page.evaluate(() => {
        const allArticles = document.querySelectorAll('.article .title');
        let articleName = null;
        if (allArticles.length > 0) {
            const selectedArticle = allArticles[Math.floor(Math.random() * allArticles.length)];
            articleName = selectedArticle.textContent;
            selectedArticle.click();
        }
        return articleName

    });
    if (clickedArticleTitle === null) {
        return {"data": {"errorDescription": " No articles found to open."}, "error": true};
    }

    await page.waitForSelector(".title");
    const firstTitle = await page.evaluate(() => {
        return document.querySelector('.title').textContent || null
    });
    if (clickedArticleTitle !== firstTitle) {
        return {"data": {"errorDescription": " I'm seeing different article."}, "error": true};
    }

    const content = await page.evaluate(() => {
        return document.querySelector('.content').textContent || null
    });
    if (!content) {
        return {"data": {"errorDescription": " I don't see content of the article."}, "error": true};
    }

    return {
        "data": {"title": clickedArticleTitle, "content": content.split(" ").slice(0, 5).join(" ") + "..."},
        "error": false
    };
}

const OpenRandomArticle = new Action(
    'openarticle',
    'Decided to open random article from the main page.👀',
    'Successfully opened the article titled "{{title}}" and read its content: "{{content}}"',
    "😣 Couldn't open random article. {{errorDescription}}",
    openArticle,
    1,
);

export default OpenRandomArticle;
