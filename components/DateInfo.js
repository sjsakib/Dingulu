import React from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import dateString from '../utilities/dateString';
import Tag from './Tag';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DateInfo = props => {
    const dateStr = dateString(new Date(props.date), 'long');

    const tags = props.selected.map((tag, i) => (
        <Tag key={tag.name} tag={tag} color={props.tagColors[tag.name]} />
    ));

    return (
        <View style={styles.container}>
            <Text style={styles.date}> {dateStr} </Text>
            <View style={styles.tags}>{tags}</View>
            <View style={styles.bottom}>
                <View style={styles.noteContainer}>
                    <ScrollView>
                        <Text style={styles.note}>{props.note}</Text>
                    </ScrollView>
                </View>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={props.close}>
                    <Icon name="close" size={32} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, .95)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20
    },
    date: {
        fontSize: 24,
        fontFamily: 'sans-serif-light',
        color: 'black',
    },
    tags: {
        margin: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    note: {
        textAlign: 'center',
        fontFamily: 'sans-serif-light',
    },
    bottom: {
        flex: 1,
        alignItems: 'center'
    },
    noteContainer: {
        flex: 5
    },
    closeButton: {
        flex: 1
    }
});

export default DateInfo;