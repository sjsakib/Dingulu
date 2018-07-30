import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    NativeModules,
    AsyncStorage,
    TouchableOpacity,
    TimePickerAndroid,
    ToastAndroid
} from 'react-native';
import { HeaderIcon } from '../components';
import backup from '../utilities/backup';
import restore from '../utilities/restore';
import timeString from '../utilities/timeString';
import scheduleNotification from '../utilities/scheduleNotification';
import { GoogleSignin } from 'react-native-google-signin';

const { RNGoogleSignin } = NativeModules;

class Settings extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Settings'
    };

    constructor(props) {
        super(props);

        this.state = {
            notificationTime: '--:--',
            lastBackup: 'loading...',
            googleAccount: null
        };
        this.load();
    }

    async load() {
        let notificationTime = (await AsyncStorage.getItem('notificationTime')) || '22:00';
        let [hour, minute] = notificationTime.split(':').map(Number);

        const googleAccount = await AsyncStorage.getItem('googleAccount');
        const lastBackup = await AsyncStorage.getItem('lastBackup');
        this.setState({
            notificationTime: timeString(hour, minute),
            googleAccount,
            lastBackup
        });
    }

    async setTime() {
        const { action, hour, minute } = await TimePickerAndroid.open({
            hour: 22,
            minute: 0,
            is24Hour: false
        });
        if (action === TimePickerAndroid.dismissedAction) return;

        scheduleNotification(hour, minute);

        await AsyncStorage.setItem('notificationTime', hour + ':' + minute);

        this.setState({ notificationTime: timeString(hour, minute) });
    }

    async signIn() {
        await GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.appdata']
        });
        if (this.state.googleAccount) {
            await GoogleSignin.signOut();
            this.setState({ googleAccount: null });
            await AsyncStorage.removeItem('googleAccount');
            return;
        }
        const user = await GoogleSignin.signIn();

        this.setState({ googleAccount: user.email });
        await AsyncStorage.setItem('googleAccount', user.email);

        const accessToken = await RNGoogleSignin.getAccessToken(user);

        if (!(await restore(accessToken))) {
            await backup(accessToken);
        }
    }

    render() {
        const googleAccount = this.state.googleAccount;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <HeaderIcon navigation={this.props.navigation} />
                    <Text style={styles.headerText}>Settings</Text>
                </View>
                <View style={styles.timeSetting}>
                    <Text style={styles.biggerText}>Notification time</Text>
                    <TouchableOpacity onPress={() => this.setTime()}>
                        <Text style={styles.biggerText}>{this.state.notificationTime}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.linkGoogle}>
                    {googleAccount && <Text>{googleAccount} connected</Text>}
                    <TouchableOpacity onPress={() => this.signIn()}>
                        <Text>{googleAccount ? 'Signout' : 'Connect a Google account'}</Text>
                    </TouchableOpacity>
                    <Text>Last backup: {this.state.lastBackup}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        fontSize: 30,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30
    },
    headerText: {
        fontSize: 20,
        marginLeft: 40,
        fontWeight: '400'
    },
    timeSetting: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    biggerText: {
        fontSize: 18
    }
});

export default Settings;
