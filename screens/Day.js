import React from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    DatePickerAndroid
} from 'react-native';
import { Tag, Note, LevelOptions, HeaderIcon, Seperator } from '../components';
import { defaultTags, defaultTagColors } from '../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { dateString, headerStyle } from '../utilities';

class Day extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        drawerLabel: 'Day'
    });

    constructor(props) {
        super(props);

        let date = this.props.navigation.getParam('date');
        if (!date) {
            date = new Date();
            if (date.getHours() < 6) date.setDate(date.getDate() - 1);
        }
        this.state = {
            date,
            isReady: false,
            active: null // the current tag selected for level selection
        };
    }

    componentDidMount() {
        this.load();
    }

    // load all the tags and and data of the day from storage
    async load() {
        const tags =
            JSON.parse(await AsyncStorage.getItem('tags')) || defaultTags;
        const tagColors =
            JSON.parse(await AsyncStorage.getItem('tagColors')) ||
            defaultTagColors;

        const dataString = await AsyncStorage.getItem(
            dateString(this.state.date, 'key')
        );
        const { selected, note } = dataString
            ? JSON.parse(dataString)
            : { selected: [], note: '' };

        // have to filter the tags already selected
        const selectedNames = selected.map(t => t.name);

        this.setState({
            tags: tags.filter(t => !selectedNames.includes(t.name)),
            selected,
            note,
            tagColors,
            isReady: true
        });
    }

    async save() {
        const { selected, note, date } = this.state;
        await AsyncStorage.setItem(
            dateString(date, 'key'),
            JSON.stringify({ selected, note })
        );
    }

    activateTag(tag) {
        this.setState({
            active: tag
        });
    }

    addTag(tag) {
        const tags = this.state.tags.slice();
        tags.splice(tags.map(t => t.name).indexOf(tag.name), 1);
        this.setState(
            {
                selected: [...this.state.selected, tag],
                tags,
                active: null
            },
            () => this.save()
        );
    }

    // remove a tag by index from the selected tags and
    // add that tag with level 1 in all tags
    removeTag(i) {
        const selected = this.state.selected.slice();
        const tag = selected[i];
        tag.level = 1;
        selected.splice(i, 1);
        this.setState(
            {
                selected,
                tags: [...this.state.tags, tag]
            },
            () => this.save()
        );
    }

    updateNote(note) {
        this.setState(
            {
                note
            },
            () => this.save()
        );
    }

    async setDate() {
        const { action, year, month, day } = await DatePickerAndroid.open({
            date: this.state.date,
            maxDate: new Date()
        });
        if (action === DatePickerAndroid.dismissedAction) return;
        this.setState({
            date: new Date(year, month, day),
            isReady: false
        });
        this.load();
    }

    render() {
        if (!this.state.isReady) return <ActivityIndicator />;

        const active = this.state.active;
        const tagColors = this.state.tagColors;

        const tags = this.state.tags.map((tag, i) => (
            <Tag
                onPress={() => this.activateTag(tag)}
                key={tag.name}
                tag={tag}
                color={tagColors[tag.name]}
            />
        ));
        let selected = this.state.selected.map((tag, i) => (
            <Tag
                selected
                onPress={() => this.removeTag(i)}
                key={tag.name}
                tag={tag}
                color={tagColors[tag.name]}
            />
        ));
        if (selected.length === 0) {
            selected = <Text>Select one or more tags</Text>;
        }

        const dateStr = dateString(this.state.date, 'long');

        return (
            <View style={styles.container}>
                <View style={headerStyle.header}>
                    <HeaderIcon navigation={this.props.navigation} />
                    <Text style={headerStyle.headerText}>{dateStr}</Text>
                    <TouchableOpacity onPress={() => this.setDate()}>
                        <Icon color="black" name="event" size={26} />
                    </TouchableOpacity>
                </View>
                <Seperator />
                <View style={styles.segment}>
                    <Text style={styles.question}>How was the day?</Text>
                    <View style={styles.tags}>{selected}</View>
                </View>
                <Seperator />
                <View style={[styles.tags, styles.segment]}>{tags}</View>
                <Seperator />
                <Note
                    updateNote={this.updateNote.bind(this)}
                    text={this.state.note}
                />
                {active && (
                    <LevelOptions
                        tag={active}
                        color={tagColors[active.name]}
                        onCancel={() => this.activateTag(null)}
                        addTag={this.addTag.bind(this)}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    segment: {
        backgroundColor: 'white',
        padding: 15,
        display: 'flex'
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 5
    },
    question: {
        fontSize: 24,
        color: 'black',
    }
});

export default Day;
