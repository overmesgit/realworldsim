const randomProperty = function (obj) {
    const keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
};

const randomElement = function (items) {
    return items[Math.floor(Math.random() * items.length)];
};

/**
 * @param {[ProbableAction]} objects
 * @returns {Action}
 */
function getRandomObjectByDistribution(objects) {
    let totalWeight = objects.reduce((total, obj) => total + obj.probability, 0);
    let random = Math.random() * totalWeight;
    for (let obj of objects) {
        if (random < obj.probability) {
            return obj.action;
        }
        random -= obj.probability;
    }
}

function sleep(timeout) {
    return new Promise(r => setTimeout(r, timeout));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export {randomProperty, randomElement, getRandomObjectByDistribution, sleep, getRandomInt}