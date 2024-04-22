import Action from "./action.js";
import {CantFind} from "./helpers.js";
import {generateRandomComment} from "./commentsGen.js";

async function writeComment(page) {
    const newComment = generateRandomComment();
    let error = null;
    let errorDescription = '';

    try {
        await page.waitForSelector('title', {timeout: 400});
        errorDescription = CantFind("input for entering comment.")
        const contentInput = await page.waitForSelector('textarea#comment-text', {timeout: 100});
        await contentInput.type(newComment);

        errorDescription = CantFind("button for submit.")
        const saveComment = await page.waitForSelector('button#comment-save', {timeout: 100});
        await saveComment.click()

        await page.waitForSelector("title");
        const allComments = await page.evaluate(() => {
            const res = [];
            document.querySelectorAll('.comment').forEach((e) => {
                res.push(e.textContent)
            })
            return res;
        });
        if (allComments.indexOf(newComment) < 0) {
            return {"data": {"errorDescription": " I'm not seeing my comment."}, "error": true};
        }
    } catch (e) {
        error = true
    }

    return {data: {comment: newComment.split(" ").slice(0, 8).join(" ") + "...", errorDescription}, error: error};
}

const WriteCommentAction = new Action(
    "writecomment",
    "Found an interesting article and decided to leave a comment. 🤔",
    '😃 My comment "{{comment}}" posted without any issues. Love engaging with the community here.',
    "😣 Tried posting a comment, but it just vanished. No error message, nothing.{{errorDescription}}",
    writeComment
)

export default WriteCommentAction;