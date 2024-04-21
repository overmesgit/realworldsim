import {getRandomInt} from "./helpers.js";

class LocalDB {
    constructor() {
        this.inteructions = [];
        this.money = 0;
        this.subscriber = [];
    }

    /**
     * @param {Interaction} interuction
     */
    addInteruction(interuction) {
        this.money += interuction.reward;
        for (const listner of this.subscriber) {
            listner(interuction)
        }
    }

}

const RESULT_TYPE = {
    POSITIVE: 'positive',
    NEGATIVE: 'negative',
}


export class Interaction {
    /**
     * @param {string} name
     * @param {string} username
     * @param {string} userid
     * @param {string} action
     * @param {string} result
     * @param {number} reward
     * @param {string} result_type
     */
    constructor(name, username, userid, action, result, reward, result_type) {
        this.name = name;
        this.username = username;
        this.userid = userid;
        this.action = action;
        this.result = result;
        this.reward = reward;
        this.time = new Date();
        this.result_type = result_type;
    }

    getAvatar() {
        const emotion = this.result_type === RESULT_TYPE.POSITIVE ? 'Happy' : 'Sad';
        const num = getRandomInt(3);
        return `user${this.userid}_${emotion}_${num}.svg`;
    }
}

const localDB = new LocalDB();

export {localDB, RESULT_TYPE}