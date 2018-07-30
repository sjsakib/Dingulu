import PushNotification from 'react-native-push-notification';

export default function scheduleNotification(hour, minute) {
    const time = new Date();
    if (time.getHours() > hour) time.setDate(time.getDate() + 1);
    time.setHours(hour);
    time.setMinutes(minute);

    PushNotification.localNotificationSchedule({
        id: '0',
        title: 'How was the day?',
        message: 'Would you like to log your day?',
        actions: '["Remind Later"]',
        date: time,
        repeatType: 'day'
    });
}
