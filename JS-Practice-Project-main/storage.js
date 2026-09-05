function getReservationData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setReservationData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export { getReservationData, setReservationData }