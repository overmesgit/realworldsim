import Action from "./action.js";


async function checkArticles(page) {
    await page.goto('http://127.0.0.1:8080/');
    const elements = await page.evaluate(() => Array.from(document.querySelectorAll('.article .title')));
    const metrics = await page.metrics();
    return {"data": {"count": elements.length, "renderingTime": metrics.TaskDuration.toFixed(2)}, "error": false};
}

const CheckMainPageArticles = new Action(
    'mainpage',
    'Decided to check available articles on the blog site.🤔',
    "It was thrilling to see {{count}} articles on the front page. It took {{renderingTime}}s for page to finish rendering.",
    "😣 Couldn't find any articles on the main page. Something's not right.{{errorDescription}}",
    checkArticles,
    0.1,
)

export default CheckMainPageArticles;