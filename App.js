import React from 'react';
import { DeviceEventEmitter, AsyncStorage, Alert, Linking } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import Day from './screens/Day';
import Stat from './screens/Stat';
import EditTag from './screens/EditTag';
import Settings from './screens/Settings';
import { backup, dateString } from './utilities';
import scheduleNotification from './utilities/scheduleNotification';
import PushNotification from 'react-native-push-notification';
import { GoogleSignin } from 'react-native-google-signin';

class Dingulu extends React.Component {
    componentWillMount() {
        this.scheduleNotification();
        this.backup();
        this.promptRating();
    }

    async promptRating() {
        const installed = await AsyncStorage.getItem('installed');

        if (!installed) {
            await AsyncStorage.setItem('installed', dateString(new Date(), 'key'));
            return;
        }
        const rated = await AsyncStorage.getItem('rated');
        const d = new Date(new Date(installed));
        d.setDate(d.getDate() + 5);

        if (!rated && d <= new Date()) {
            Alert.alert(
                'Do you like this app?',
                'If you do, please rate it on Google Play',
                [
                    { text: 'NOT NOW', onPress: () => this.delayRating() },
                    { text: 'OK', onPress: () => this.rate() }
                ],
                { cancelable: false }
            );
        }
    }

    async rate() {
        const opened = await Linking.openURL('http://play.google.com/store/apps/details?id=com.dingulu');
        await AsyncStorage.setItem('rated', 'true');
    }

    async delayRating() {
        await AsyncStorage.setItem('installed', dateString(new Date(), 'key'));
    }

    async scheduleNotification() {
        const notificationTime = await AsyncStorage.getItem('notificationTime');

        let hour = 22, minute = 0;
        if (notificationTime) {
            [hour, minute] = notificationTime.split(':').map(Number)
        }

        scheduleNotification(hour, minute);

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

    async backup() {
        await GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.appdata']
        });
        const user = await GoogleSignin.getCurrentUser();
        if (!user) return;
        const { accessToken } = await GoogleSignin.getTokens();
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
