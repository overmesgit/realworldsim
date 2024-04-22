import Action from "./action.js";
import {CantFind, getFormErrors} from "./helpers.js";
import SignIn from "./signIn.js";


export class CheckAuth {
    constructor(action) {
        this.action = action.action;
        this.actionObj = action;
    }

    run(page, UserData) {
        if (!UserData.signup && !UserData.checkSignup && !UserData.signin) {
            UserData.checkSignup = true;
            return SignUp.run(page, UserData)
        }
        if (!UserData.signin) {
            return SignIn.run(page, UserData)
        }
        return this.actionObj.run(page, UserData)
    }
}


async function signUpAction(page, UserData) {
    let error = null;
    let errorDescription = '';

    try {
        await page.waitForSelector('title', {timeout: 400});
        errorDescription = CantFind("link for signing up.")
        const singUpLink = await page.waitForSelector('a#sign-up', {timeout: 200});
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
        if (createResponse.status() === 500) {
            errorDescription = " I've got a server error."
            error = true
        }
    } catch (e) {
        console.log("sign up error", e.message, errorDescription)
        error = true
    }
    if (!error) UserData.signup = true;
    return {data: {username: UserData.username, errorDescription}, error: error};
}

export const SignUp = new Action(
    "signup",
    "Decided it was time to join the community, so I went ahead to sign up with user name {{username}}.🌟",
    "Just signed up with username {{username}}! The process was super smooth, and I'm excited to be a part of this community. 🎉",
    "Tried to sign up, but it kept giving me errors. Not sure what's going wrong. 😕{{errorDescription}}",
    signUpAction
)
