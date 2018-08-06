import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import dateString from '../utilities/dateString';
import Tag from './Tag';
import Icon from 'react-native-vector-icons/MaterialIcons';

class DateInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(props.date),
            ready: false,
            message: 'Loading...'
        };
        this.load();
    }
    async load() {
        const data = JSON.parse(await AsyncStorage.getItem(dateString(this.state.date, 'key')));
        if (!data) {
            this.setState({
                message: 'No record!'
            });
            return;
        }
        this.setState({
            selected: data.selected,
            note: data.note,
            ready: true
        });
    }
    next(backward) {
        const date = new Date(this.state.date);
        date.setDate(date.getDate() + (backward ? -1 : 1));
        this.setState({ date, ready: false }, () => this.load());
    }

    render() {
        const dateStr = dateString(this.state.date, 'long');

        return (
            <View style={styles.container}>
                <Text style={styles.date}>{dateStr}</Text>
                {this.state.ready ? (
                    <View>
                        <View style={styles.tags}>
                            {this.state.selected.map((tag, i) => (
                                <Tag key={tag.name} tag={tag} color={this.props.tagColors[tag.name]} />
                            ))}
                        </View>
                        <ScrollView>
                            <Text style={styles.note}>{this.state.note}</Text>
                        </ScrollView>
                    </View>
                ) : (
                    <Text style={styles.message}>{this.state.message}</Text>
                )}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.icon} onPress={() => this.next(true)}>
                        <Icon name="arrow-back" size={32} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon} onPress={this.props.close}>
                        <Icon name="close" size={32} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon} onPress={() => this.next()}>
                        <Icon name="arrow-forward" size={32} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, .95)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingLeft: 20,
        paddingRight: 20
    },
    date: {
        fontSize: 24,
        fontFamily: 'sans-serif-light',
        color: 'black'
    },
    tags: {
        margin: 15,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    note: {
        textAlign: 'center',
        fontFamily: 'sans-serif-light'
    },
    footer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0
    },
    icon: {
        margin: 15
    },
    message: {
        margin: 15,
    }
});

export default DateInfo;
