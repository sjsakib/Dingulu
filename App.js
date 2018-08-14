import React from 'react';
import { DeviceEventEmitter, AsyncStorage, NativeModules } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Day from './screens/Day';
import Stat from './screens/Stat';
import EditTag from './screens/EditTag';
import Settings from './screens/Settings';
import backup from './utilities/backup';
import scheduleNotification from './utilities/scheduleNotification';
import PushNotification from 'react-native-push-notification';
import { GoogleSignin } from 'react-native-google-signin';

const { RNGoogleSignin } = NativeModules;

class Dingulu extends React.Component {
    async scheduleNotification() {
        const notificationTime = await AsyncStorage.getItem('notificationTime');
        if (notificationTime) return;

        scheduleNotification(22, 0);

        PushNotification.registerNotificationActions(['Remind Later']);
        DeviceEventEmitter.addListener('notificationActionReceived', action => {
            const info = JSON.parse(action.dataJSON);
            if (info.action === 'Remind Later') {
                PushNotification.localNotificationSchedule({
                    id: '0',
                    title: 'How was the day?',
                    message: 'Would you like to log your day now?',
                    actions: '["Remind Later"]',
                    number: '10',
                    date: new Date(Date.now() + 60 * 60 * 1000) // Remind an hour later
                });
            }
        });
    }
    componentWillMount() {
        this.scheduleNotification();
        this.backup();
    }

    async backup() {
        await GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.appdata']
        });
        const user = await GoogleSignin.currentUserAsync();
        if (!user) return;
        const accessToken = await RNGoogleSignin.getAccessToken(user);
        backup(accessToken);
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
