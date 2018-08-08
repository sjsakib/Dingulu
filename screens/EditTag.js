import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
    TouchableNativeFeedback,
    FlatList,
    TextInput,
    Picker,
    Alert
} from 'react-native';
import { HeaderIcon, Seperator, EditTagInfo } from '../components';
import { defaultTags, defaultTagColors, defaultTagLevels } from '../constants';
import { headerStyle } from '../utilities';
import Icon from 'react-native-vector-icons/MaterialIcons';

class EditTag extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        drawerLabel: 'Edit Labels',
        drawerIcon: ({ tintColor }) => <Icon color={tintColor} size={24} name="edit" />
    });

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            editingNew: false,
            newName: ''
        };
    }

    componentDidMount() {
        this.load();
    }

    async load() {
        const tags = JSON.parse(await AsyncStorage.getItem('tags')) || defaultTags;
        const tagColors = JSON.parse(await AsyncStorage.getItem('tagColors')) || defaultTagColors;
        const tagLevels = JSON.parse(await AsyncStorage.getItem('tagLevels')) || defaultTagLevels;
        this.setState({
            tags,
            tagColors,
            tagLevels,
            isReady: true
        });
    }

    async updateName(name, index, oldName) {
        const tags = this.state.tags.slice();
        const tagColors = { ...this.state.tagColors };
        const tagLevels = {...this.state.tagLevels };

        name = name.toLowerCase();

        if (name === oldName || !name) return;

        if (tags.map(t => t.name).includes(name)) {
            alert('Tag already exists');
            return;
        }

        tagColors[name] = tagColors[oldName];
        tagLevels[name] = tagLevels[oldName];
        tags[index].name = name;

        await AsyncStorage.setItem('tags', JSON.stringify(tags));
        await AsyncStorage.setItem('tagColors', JSON.stringify(tagColors));
        await AsyncStorage.setItem('tagLevels', JSON.stringify(tagLevels));
        this.setState({
            tags,
            tagColors
        });
    }

    async updateColor(name, color) {
        const tagColors = { ...this.state.tagColors };
        tagColors[name] = color;
        await AsyncStorage.setItem('tagColors', JSON.stringify(tagColors));
    }

    async remove(index) {
        const tags = this.state.tags.slice();
        tags.splice(index, 1);
        await AsyncStorage.setItem('tags', JSON.stringify(tags));
        this.setState({ tags });
    }

    async addNewTag() {
        const newName = this.state.newName.toLowerCase();

        if (!newName) {
            this.setState({ editingNew: false });
            return;
        }

        const tags = this.state.tags.slice();

        if (tags.map(t => t.name).includes(newName)) {
            alert('Tag already exists');
            return;
        }

        const tagColors = { ...this.state.tagColors };
        const tagLevels = { ...this.state.tagLevels };
        tags.push({ name: newName, level: '' });
        tagColors[newName] = '#607D8B';
        tagLevels[newName] = ['somehow', '', 'very'];

        await AsyncStorage.setItem('tags', JSON.stringify(tags));
        await AsyncStorage.setItem('tagColors', JSON.stringify(tagColors));
        await AsyncStorage.setItem('tagLevels', JSON.stringify(tagLevels));

        this.setState({
            tags,
            tagColors,
            tagLevels,
            editingNew: false
        });
    }

    async updateLevels(name, levels) {
        const tagLevels = {...this.state.tagLevels};
        tagLevels[name] = levels;
        await AsyncStorage.setItem('tagLevels', JSON.stringify(tagLevels));

    }

    render() {
        if (!this.state.isReady) return <ActivityIndicator />;
        const { tagColors, tagLevels } = this.state;

        const footer = (
            <View style={[styles.tagContainer, styles.listFooter]}>
                {this.state.editingNew ? (
                    <TextInput
                        style={{ flex: 1 }}
                        onChangeText={text => this.setState({ newName: text })}
                        onEndEditing={() => this.addNewTag()}
                        placeholder="Type new tag name..."
                        autoFocus
                    />
                ) : (
                    <TouchableNativeFeedback style={styles.addNew} onPress={() => this.setState({ editingNew: true })}>
                        <View style={styles.addNew}>
                            <Icon name="add" size={26} />
                            <Text> ADD NEW</Text>
                        </View>
                    </TouchableNativeFeedback>
                )}
            </View>
        );
        return (
            <View style={styles.container}>
                <View style={headerStyle.header}>
                    <View style={headerStyle.headerLeft}>
                        <HeaderIcon navigation={this.props.navigation} />
                    </View>
                    <View style={headerStyle.headerRight}>
                        <Text style={headerStyle.headerText}>Edit Labels</Text>
                    </View>
                </View>
                <Seperator />
                <FlatList
                    data={this.state.tags}
                    renderItem={({ item, index }) => (
                        <EditTagInfo
                            {...item}
                            color={tagColors[item.name]}
                            index={index}
                            levels={tagLevels[item.name]}
                            updateName={this.updateName.bind(this)}
                            updateColor={this.updateColor.bind(this)}
                            updateLevels={this.updateLevels.bind(this)}
                            remove={this.remove.bind(this)}
                        />
                    )}
                    keyExtractor={(tag, i) => tag.name}
                    ListFooterComponent={footer}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 15,
        margin: 3
    },
    listFooter: {
        justifyContent: 'center'
    },
    addNew: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    }
});

export default EditTag;
