function CantFind(elementName) {
    return " Can't find " + elementName;
}

async function getFormErrors(page) {
    return await page.evaluate(() => {
        let allTexts = [];
        document.querySelectorAll('.error').forEach((el) => {
            allTexts.push(el.textContent)
        });
        return allTexts.join(", ")
    })
}

export {CantFind, getFormErrors}

