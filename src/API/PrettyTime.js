

const prettyTime = (timeUgly) => {
    if (timeUgly) {
        return timeUgly.split('T')[0].split('-').reverse().join('.');
    }
}

export default prettyTime;