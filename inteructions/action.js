import {Interaction, RESULT_TYPE} from "../localDB.js";

function replaceTemplate(message, data) {
    for (const key in data) {
        message = message.replace(`{{${key}}}`, data[key]);
    }
    return message
}

export default class Action {
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
     * @param {Object} [AdditionalData]
     * @returns {Interaction}
     */
    async run(page, UserData, SiteData, AdditionalData) {
        let message, result, resultType = '';
        let reward = 0;
        let res = {'data': {}, error: true};
        try {
            res = await this.func(page, UserData, SiteData);
        } catch (e) {
            console.log("action error run", this.action, e.message, e)
            return {}
        }

        message = replaceTemplate(this.action, res['data']);
        const resultTemplate = res.error ? this.fail : this.success;
        result = replaceTemplate(resultTemplate, res['data']);
        if (!res.error) {
            resultType = RESULT_TYPE.POSITIVE;
            reward = this.reward;
        } else {
            resultType = RESULT_TYPE.NEGATIVE;
        }
        return new Interaction(this.name, UserData.name, UserData.id, message, result, reward, resultType)
    }

}