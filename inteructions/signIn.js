import Action from "./action.js";
import {CantFind, getFormErrors} from "./helpers.js";

async function signInAction(page, UserData) {
    let error = null;
    let errorDescription = '';

    try {
        await page.waitForSelector('title', {timeout: 400});
        errorDescription = CantFind("link for signing in.")
        const singUpLink = await page.waitForSelector('a#sign-in', {timeout: 200});
        await singUpLink.click(singUpLink);

        errorDescription = CantFind("input for entering username.")
        const userNameInput = await page.waitForSelector('input#username', {timeout: 200});
        await userNameInput.type(UserData.username);

        errorDescription = CantFind("input for entering password.")
        const passwordInput = await page.waitForSelector('input#password', {timeout: 200});
        await passwordInput.type(UserData.password);

        errorDescription = CantFind("button for submit.")
        const submit = await page.waitForSelector('button#submit', {timeout: 100});
        await submit.click(submit);
        const createResponse = await page.waitForResponse(response =>
            response.request().method() === 'POST'
        );
        if (createResponse.status() === 400) {
            await page.waitForSelector('button#submit', {timeout: 200});
            let errorText = await getFormErrors(page);
            errorDescription = " I've got a validation error. " + errorText
            error = true
        }
    } catch (e) {
        console.log("sign in article error", e.message, errorDescription)
        error = true
    }

    if (!error) UserData.signin = true;
    return {data: {username: UserData.username, errorDescription}, error: error};
}

const signIn = new Action(
    'signin',
    "Logging in to check out what's new on the site with username {{username}}.🔑",
    "Logged as {{username}} in successfully! It's good to be back. 🙌",
    "Struggling to log in. Either I've forgotten my password, or there's an issue with the site. 😢{{errorDescription}}",
    signInAction
)

export default signIn;