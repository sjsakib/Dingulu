import React from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { Tag, Note, LevelOptions, HeaderIcon } from '../components';
import { defaultTags } from '../constants';

class Day extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        drawerLabel: 'Today',
        headerTitle: new Date().toDateString(),
        headerLeft: <HeaderIcon navigation={navigation} />
    });

    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            isReady: false,
            active: null // the current tag selected for level selection
        };
    }

    componentDidMount() {
        this.load();
    }

    // load all the tags and and data of the day from storage
    async load() {
        const tagsString = await AsyncStorage.getItem('tags');
        const tags = tagsString ? JSON.parse(tagsString) : defaultTags;

        const dataStrig = await AsyncStorage.getItem(
            this.state.date.toLocaleDateString()
        );
        const { selected, note } = dataStrig
            ? JSON.parse(dataStrig)
            : { selected: [], note: '' };

        // have to filter the tags already selected
        const selectedNames = selected.map(t => t.name);

        this.setState({
            tags: tags.filter(t => !selectedNames.includes(t.name)),
            selected: selected,
            note: note,
            isReady: true
        });
    }

    async save() {
        const { selected, note, date } = this.state;
        await AsyncStorage.setItem(
            date.toLocaleDateString(),
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
        this.setState({
            selected: [...this.state.selected, tag],
            tags,
            active: null
        }, () => this.save());
    }

    // remove a tag by index from the selected tags and
    // add that tag with level 1 in all tags
    removeTag(i) {
        const selected = this.state.selected.slice();
        const tag = selected[i];
        tag.level = 1;
        selected.splice(i, 1);
        this.setState({
            selected,
            tags: [...this.state.tags, tag]
        }, () => this.save());
    }

    updateNote(note) {
        this.setState({
            note
        }, () => this.save());
    }

    render() {
        if (!this.state.isReady) return <ActivityIndicator />;

        const active = this.state.active;

        const tags = this.state.tags.map((tag, i) => (
            <Tag onPress={() => this.activateTag(tag)} key={i} tag={tag} />
        ));
        let selected = this.state.selected.map((tag, i) => (
            <Tag selected onPress={() => this.removeTag(i)} key={i} tag={tag} />
        ));
        if (selected.length === 0) {
            selected = <Text>Select one or more tag</Text>;
        }

        return (
            <View style={styles.container}>
                <View style={styles.segment}>
                    <Text style={styles.question}>How was the day?</Text>
                    <View style={styles.tags}>{selected}</View>
                </View>
                <View style={[styles.tags, styles.segment]}>{tags}</View>
                <Note
                    updateNote={this.updateNote.bind(this)}
                    text={this.state.note}
                />
                {active && (
                    <LevelOptions
                        tag={active}
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
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        display: 'flex'
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    question: {
        fontSize: 24
    }
});

export default Day;