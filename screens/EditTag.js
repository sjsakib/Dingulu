import React from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    AsyncStorage,
    ActivityIndicator,
    TouchableNativeFeedback,
    FlatList,
    TextInput,
    Picker,
    Alert
} from 'react-native';
import { HeaderIcon, Seperator } from '../components';
import { defaultTags, defaultTagColors } from '../constants';
import { headerStyle } from '../utilities';
import Icon from 'react-native-vector-icons/MaterialIcons';

class TagInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            name: props.name,
            color: props.color
        };
    }

    updateName() {
        this.setState({
            editing: false
        });
        this.props.updateName(this.state.name, this.props.index, this.props.name);
    }

    updateColor(color) {
        this.setState({ color });
        this.props.updateColor(this.state.name, color);
    }

    remove() {
        this.props.remove(this.props.index);
    }

    removeAlert() {
        Alert.alert('Delete this tag?', '', [{ text: 'OK', onPress: () => this.remove() }, { text: 'Cancel' }]);
    }

    render() {
        return (
            <View style={[styles.tagContainer, { backgroundColor: this.state.color }]}>
                {this.state.editing ? (
                    <TextInput
                        autoFocus
                        defaultValue={this.props.name}
                        onChangeText={text => this.setState({ name: text })}
                        onEndEditing={() => this.updateName()}
                    />
                ) : (
                    <TouchableNativeFeedback onPress={() => this.setState({ editing: true })}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.tagName}>{this.props.name.toUpperCase()}</Text>
                            <Icon size={16} color="white" name="edit" />
                        </View>
                    </TouchableNativeFeedback>
                )}
                <View style={styles.right}>
                    <Picker
                        selectedValue={this.state.color}
                        mode="dropdown"
                        style={styles.picker}
                        onValueChange={color => this.updateColor(color)}>
                        <Picker.Item label="Red" value="#f44336" />
                        <Picker.Item label="Pink" value="#E91E63" />
                        <Picker.Item label="Purple" value="#9C27B0" />
                        <Picker.Item label="Indigo" value="#673AB7" />
                        <Picker.Item label="Blue" value="#2196F3" />
                        <Picker.Item label="Light Blue" value="#03A9F4" />
                        <Picker.Item label="Cyan" value="#00BCD4" />
                        <Picker.Item label="Teal" value="#009688" />
                        <Picker.Item label="Green" value="#4CAF50" />
                        <Picker.Item label="Light Green" value="#8BC34A" />
                        <Picker.Item label="Lime" value="#CDDC39" />
                        <Picker.Item label="Yellow" value="#FFEB3B" />
                        <Picker.Item label="Amber" value="#FFC107" />
                        <Picker.Item label="Orange" value="#FF9800" />
                        <Picker.Item label="Deep Orange" value="#FF5722" />
                        <Picker.Item label="Brown" value="#795548" />
                        <Picker.Item label="Grey" value="#9E9E9E" />
                        <Picker.Item label="Blue Grey" value="#607D8B" />
                        <Picker.Item label="Black" value="#212121" />
                    </Picker>
                    <Icon onPress={() => this.removeAlert()} name="delete" color="white" size={26} />
                </View>
            </View>
        );
    }
}

class EditTag extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        drawerLabel: 'Edit Tags'
    });

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            editingNew: false,
            newName: ''
        };
        this.load();
    }

    async load() {
        const tags = JSON.parse(await AsyncStorage.getItem('tags')) || defaultTags;
        const tagColors = JSON.parse(await AsyncStorage.getItem('tagColors')) || defaultTagColors;
        this.setState({
            tags,
            tagColors,
            isReady: true
        });
    }

    async updateName(name, index, oldName) {
        const tags = this.state.tags.slice();
        const tagColors = { ...this.state.tagColors };

        name = name.toLowerCase();

        if (name === oldName || !name) return;

        if (tags.map(t => t.name).includes(name)) {
            alert('Tag already exists');
            return;
        }

        tagColors[name] = tagColors[oldName];
        tags[index].name = name;

        await AsyncStorage.setItem('tags', JSON.stringify(tags));
        await AsyncStorage.setItem('tagColors', JSON.stringify(tagColors));
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
        tags.push({ name: newName, level: 1 });
        tagColors[newName] = '#212121';

        await AsyncStorage.setItem('tags', JSON.stringify(tags));
        await AsyncStorage.setItem('tagColors', JSON.stringify(tagColors));

        this.setState({
            tags,
            tagColors,
            editingNew: false
        });
    }

    render() {
        if (!this.state.isReady) return <ActivityIndicator />;
        const tagColors = this.state.tagColors;

        const footer = (
            <View style={[styles.tagContainer, styles.listFooter]}>
                {this.state.editingNew ? (
                    <TextInput
                        style={{ flex: 1 }}
                        onChangeText={text => this.setState({ newName: text })}
                        onEndEditing={() => this.addNewTag()}
                        placeholder="new tag"
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
                        <Text style={headerStyle.headerText}>Edit Tags</Text>
                    </View>
                </View>
                <Seperator />
                <FlatList
                    data={this.state.tags}
                    renderItem={({ item, index }) => (
                        <TagInfo
                            {...item}
                            color={tagColors[item.name]}
                            index={index}
                            updateName={this.updateName.bind(this)}
                            updateColor={this.updateColor.bind(this)}
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
        borderRadius: 10,
        margin: 3
    },
    tagName: {
        color: 'white',
        marginRight: 5
    },
    right: {
        flexDirection: 'row',
        width: 200,
        justifyContent: 'space-between'
    },
    picker: {
        height: 30,
        width: 120,
        color: 'white'
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
