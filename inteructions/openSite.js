import Action from "./action.js";

async function openBlogPage(page) {
    const element = await page.waitForSelector('title', {timeout: 400});
    let title = await element?.evaluate(el => el.textContent);
    return {"data": {"title": title}, "error": false};
}

const OpenBlogPage = new Action(
    'opensite',
    'Decided to check out the blog site today. 🤔',
    "😃 The site with title \"{{title}}\" loaded quickly, and everything's displayed beautifully. It's easy to navigate through.",
    "😣 Had a tough time getting the site to load. Either it's down, or my connection is acting up.",
    openBlogPage,
    0.1,
)

export default OpenBlogPage;