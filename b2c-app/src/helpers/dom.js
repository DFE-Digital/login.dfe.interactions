//function with try/catch in case document is not defined as that was making the page stop loading in B2C
function getElementById(id) {
    try {
        return document.getElementById(id);
    }
    catch (e) { }
}

export function domHasElementWithId(id) {
    return !!getElementById(id);
}

export function getInnerTextById(id) {
    let elem = getElementById(id);
    if (elem) {
        return elem.innerText;
    }
}