import {Interaction, RESULT_TYPE, localDB} from "../localDB.js";

function replaceTemplate(message, data) {
    for (const key in data) {
        message = message.replace(`{{${key}}}`, data[key]);
    }
    return message
}

export default class Action {
    action;
    success;
    fail;
    func;
    reward;

    constructor(name, action, success, fail, func, reward) {
        this.name = name;
        this.action = action;
        this.success = success;
        this.fail = fail;
        this.func = func;
        this.reward = reward || 0;
    }

    /**
     * @param {Object} page
     * @param {User} UserData
     * @param {Object} [SiteData]
     */
    async run(page, UserData, SiteData) {
        let message, result, resultType = '';
        let error = null;
        let reward = 0;
        let res = {'data': {}, error: true};
        try {
            res = await this.func(page, UserData, SiteData);
        } catch (e) {
            console.log("action error run", this.action, e.message, e)
            return
        }

        message = replaceTemplate(this.action, res['data']);
        error = res['error'];
        const resultTemplate = error ? this.fail : this.success;
        result = replaceTemplate(resultTemplate, res['data']);
        if (!error) {
            resultType = RESULT_TYPE.POSITIVE;
            reward = this.reward;
        } else {
            resultType = RESULT_TYPE.NEGATIVE;
        }
        localDB.addInteruction(new Interaction(this.name, UserData.name, UserData.id, message, result, reward, resultType));
    }

}