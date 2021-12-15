const absents = require('./absents.json');
module.exports = () => {
    let summary = {}
    for (const key in absents) {
        const lectures = absents[key];
        for (const subject in lectures) {
            if (summary.hasOwnProperty(subject)) {
                summary[subject] = summary[subject] + lectures[subject]
            } else {
                summary[subject] = lectures[subject]
            }
        }
    }
    return summary
}