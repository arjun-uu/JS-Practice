export function setAccount(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getAccount(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}
