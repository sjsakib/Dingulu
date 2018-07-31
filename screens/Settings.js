import React from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    NativeModules,
    AsyncStorage,
    TouchableOpacity,
    TimePickerAndroid,
    ToastAndroid
} from 'react-native';
import { HeaderIcon, Seperator } from '../components';
import { backup, restore, timeString, scheduleNotification, headerStyle } from '../utilities';
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
        let lastBackup = await AsyncStorage.getItem('lastBackup');
        if (!lastBackup) lastBackup = 'Never backed up';
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

        try {
            const user = await GoogleSignin.signIn();
            this.setState({ googleAccount: user.email });
            await AsyncStorage.setItem('googleAccount', user.email);

            const accessToken = await RNGoogleSignin.getAccessToken(user);

            if (!(await restore(accessToken))) {
                await backup(accessToken);
            }
        } catch (e) {
            ToastAndroid.show('Failed. Make sure your internet connection is working', ToastAndroid.LONG);
        }
    }

    render() {
        const googleAccount = this.state.googleAccount;

        return (
            <View style={styles.container}>
                <View style={headerStyle.header}>
                    <View style={headerStyle.headerLeft}>
                        <HeaderIcon navigation={this.props.navigation} />
                    </View>
                    <View style={headerStyle.headerRight}>
                        <Text style={headerStyle.headerText}>Settings</Text>
                    </View>
                </View>
                <Seperator />
                <View style={styles.timeSetting}>
                    <Text style={styles.settingsText}>Notification time</Text>
                    <TouchableOpacity onPress={() => this.setTime()}>
                        <Text style={styles.settingsText}>{this.state.notificationTime}</Text>
                    </TouchableOpacity>
                    <Text style={styles.note}>New day will be considered after 6 am, not 12</Text>
                </View>
                <Seperator />
                <View style={styles.backup}>
                    <Button
                        title={googleAccount ? 'Disconnect ' : 'Connect a Google account'}
                        onPress={() => this.signIn()}
                    />
                    {googleAccount && <Text style={styles.info}>{googleAccount} connected</Text>}
                    <Text style={styles.info}>Last backup: {this.state.lastBackup}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    timeSetting: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    settingsText: {
        color: 'black',
        fontWeight: '500'
    },
    backup: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    info: {
        color: 'black',
        fontWeight: '500',
        marginTop: 20
    },
    note: {
        marginTop: 10,
    }
});

export default Settings;
