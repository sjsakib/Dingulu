import React from 'react';
import { View, Text, StyleSheet, AsyncStorage, TouchableOpacity, TimePickerAndroid } from 'react-native';
import { HeaderIcon } from '../components';
import PushNotification from 'react-native-push-notification';

class Settings extends React.Component {
    static navigationOptions = {
        drawerLabel: 'Settings'
    };

    constructor(props) {
        super(props);

        this.state = {
            notificationTime: '--:--'
        }
        this.load();
    }

    async setTime() {
        const { action, hour, minute } = await TimePickerAndroid.open({
            hour: 22,
            minute: 0,
            is24Hour: false,
        });
        if (action === TimePickerAndroid.dismissedAction) return;

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
            repeatType: 'day',
        });

        await AsyncStorage.setItem('notificationTime', hour + ':' + minute)

        this.setState({notificationTime: this.timeString(hour, minute)});
    }

    timeString(hour, minute) {
        let isAm = true;
        if (hour > 12) {
            hour -= 12;
            isAm = false;
        }
        minute = '' + minute;
        if (minute.length === 1) minute = '0' + minute;

        return hour + ':' + minute + ` ${isAm ? 'am' : 'pm'}`;
    }

    async load() {
        let notificationTime = (await AsyncStorage.getItem('notificationTime')) || '22:00';
        let [hour, minute] = notificationTime.split(':').map(Number);
        this.setState({notificationTime: this.timeString(hour, minute)});
    }

    render() {
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
        justifyContent: 'space-between',
    },
    biggerText: {
        fontSize: 18,
    }
});

export default Settings;