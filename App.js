import React from 'react';
import { DeviceEventEmitter, AsyncStorage } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Day from './screens/Day';
import Stat from './screens/Stat';
import EditTag from './screens/EditTag';
import Settings from './screens/Settings';
import PushNotification from 'react-native-push-notification';

class Dingulu extends React.Component {
    async scheduleNotification() {
        const notificationTime = await AsyncStorage.getItem('notificationTime');
        if (notificationTime) return;

        const time = new Date();
        if (time.getHours() > 22) time.setDate(time.getDate() + 1)
        time.setHours(22);
        time.setMinutes(0);

        PushNotification.localNotificationSchedule({
            id: '0',
            title: 'How was the day?',
            message: 'Would you like to log your day?',
            actions: '["Remind Later"]',
            date: time,
            repeatType: 'day',
        });

        PushNotification.registerNotificationActions(['Remind Later']);
        DeviceEventEmitter.addListener('notificationActionReceived', action => {
            const info = JSON.parse(action.dataJSON);
            if (info.action === 'Remind Later') {
                PushNotification.localNotificationSchedule({
                    id: '0',
                    title: 'How was the day?',
                    message: 'Would you like to log your day now?',
                    actions: '["Remind Later"]',
                    date: new Date(Date.now() + 60 * 60 * 1000) // Remind an hour later
                });
            }
        });
    }
    componentWillMount() {
        this.scheduleNotification();
    }
    
    render() {
        return <DinguluNavigator />;
    }
}

const DinguluNavigator = createDrawerNavigator({
    Day: {
        screen: Day
    },
    Stat: {
        screen: Stat
    },
    EditTag: {
        screen: EditTag
    },
    Settings: {
        screen: Settings
    }
});

export default Dingulu;