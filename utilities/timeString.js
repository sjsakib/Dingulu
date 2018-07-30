export default function timeString(hour, minute) {
    let isAm = true;
    if (hour > 12) {
        hour -= 12;
        isAm = false;
    }
    minute = '' + minute;
    if (minute.length === 1) minute = '0' + minute;

    return hour + ':' + minute + ` ${isAm ? 'am' : 'pm'}`;
}
