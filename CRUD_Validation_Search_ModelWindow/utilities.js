// local storage 
function getStudent(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setStudent(key, value) {
    localStorage.setItem(key, JSON.stringify(value));

}

// check shortlisted studens
function checkShortlisted(marks) {
    if (marks > 70) return true;
    else return false;
}





export { getStudent, setStudent, checkShortlisted};