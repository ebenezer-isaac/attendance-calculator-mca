const fs = require('fs');
const reader = require('readline-sync');
const {google} = require('googleapis');
const absentCounter = require('./absentCounter')
const absents = absentCounter()
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';
const today = new Date();
let spiltDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const userInput = reader.question("Enter split date (yyyy-mm-dd) : ");
if (userInput.length !== 0) {
    spiltDate = userInput;
}

const pushToDict = (dict, key, value) => {
    if (dict.hasOwnProperty(key)) {
        dict[key] = dict[key] + value
    } else {
        dict[key] = value
    }
}
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), getEventsList);
});

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function getEventsList(auth) {
    let totalLectures = {}
    let conductedLectures = {}
    let remainingLectures = {}
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
        calendarId: 'fjdui6i1cbs5aqn1vp7ae817vc@group.calendar.google.com',
        singleEvents: true,
        orderBy: 'startTime',
        showDeleted: false
        , maxResults: 400
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        events.map((event, i) => {
            if (event.start.dateTime) {
                let subject = event.summary.toLowerCase().replaceAll(" ", "")
                if (subject.includes("assessment") || subject.includes("placement") || subject.includes("verification") || subject.includes("exam") || subject.includes("demo")) {
                } else {
                    if (subject === "cslab") {
                        subject = "cs"
                    } else if (subject === "iotlab") {
                        subject = "iot"
                    }
                    let startTime = event.start.dateTime.split("T")[1].split("+")[0]
                    let eventDate = event.start.dateTime.split("T")[0]
                    let endTime = event.end.dateTime.split("T")[1].split("+")[0]
                    let hour = 0
                    let flag = 0;
                    const eventDateObj = new Date(`${eventDate} 00:00:00`.replace(/-/g, '/'))
                    const splitDateObj = new Date(`${spiltDate} 23:59:59`.replace(/-/g, '/'))
                    if (eventDateObj < splitDateObj) {
                        flag = 1;
                    }
                    if (startTime === "08:30:00" && endTime === "09:20:00") {
                        hour = 1
                    } else if (startTime === "09:25:00" && endTime === "10:15:00") {
                        hour = 1
                    } else if (startTime === "08:30:00" && endTime === "10:15:00") {
                        hour = 2
                    } else if (startTime === "10:30:00" && endTime === "11:20:00") {
                        hour = 1
                    } else if (startTime === "11:25:00" && endTime === "12:15:00") {
                        hour = 1
                    } else if (startTime === "10:30:00" && endTime === "12:15:00") {
                        hour = 2
                    } else if (startTime === "13:10:00" && endTime === "14:00:00") {
                        hour = 1
                    } else if (startTime === "14:00:00" && endTime === "14:55:00") {
                        hour = 1
                    } else if (startTime === "13:10:00" && endTime === "14:55:00") {
                        hour = 2
                    } else if (startTime === "15:00:00" && endTime === "15:55:00") {
                        hour = 1
                    } else if (startTime === "15:55:00" && endTime === "16:45:00") {
                        hour = 1
                    } else if (startTime === "15:00:00" && endTime === "16:45:00") {
                        hour = 2
                    } else if (startTime === "13:10:00" && endTime === "16:45:00") {
                        hour = 4
                    } else if (startTime === "09:15:00" && endTime === "10:15:00") {
                        hour = 1
                    } else if (startTime === "17:00:00" && endTime === "18:00:00") {
                        hour = 1

                    } else if (startTime === "09:30:00" && endTime === "11:20:00") {
                        hour = 2
                    } else if (startTime === "08:30:00" && endTime === "10:30:00") {
                        hour = 2
                    } else if (startTime === "10:00:00" && endTime === "12:00:00") {
                        hour = 2
                    } else if (startTime === "17:30:00" && endTime === "18:30:00") {
                        hour = 1
                    } else if (startTime === "14:10:00" && endTime === "16:45:00") {
                        hour = 3
                    } else if (startTime === "10:30:00" && endTime === "12:30:00") {
                        hour = 2
                    } else if (startTime === "13:30:00" && endTime === "14:55:00") {
                        hour = 2
                    } else if (startTime === "16:00:00" && endTime === "16:45:00") {
                        hour = 1
                    } else if (startTime === "09:20:00" && endTime === "11:20:00") {
                        hour = 2
                    } else if (startTime === "11:00:00" && endTime === "12:30:00") {
                        hour = 2
                    } else if (startTime === "15:00:00" && endTime === "16:30:00") {
                        hour = 2
                    } else {
                        console.log(startTime, endTime)
                    }
                    pushToDict(totalLectures, subject, hour)
                    if (flag === 0) {
                        pushToDict(remainingLectures, subject, hour)
                    } else {
                        pushToDict(conductedLectures, subject, hour)
                    }

                }
            }
        });
        let values = [];
        for (const subject in absents) {
            values.push({
                'Subject': subject,
                'Total': totalLectures[subject],
                'Conducted': conductedLectures[subject],
                'Remaining': remainingLectures[subject],
                'Attended': conductedLectures[subject] - absents[subject],
                'Absent': absents[subject],
                'Current %': (((conductedLectures[subject] - absents[subject]) / conductedLectures[subject]) * 100).toFixed(2),
                'Final %': (((totalLectures[subject] - absents[subject]) / totalLectures[subject]) * 100).toFixed(2)
            });
        }
        console.table(values);
        // console.log(conductedLectures);
        // console.log(totalLectures);
    });
}