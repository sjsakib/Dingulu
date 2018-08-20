import React from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TextInput,
    Picker,
    Alert,
    TouchableNativeFeedback,
    TouchableOpacity,
    Modal,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class EditTagInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            name: props.name,
            color: props.color,
            levels: props.levels,
            newName: '',
            editingNew: false
        };
    }

    save() {
        this.props.updateTag(this.state.name, this.props.index, this.props.name, this.state.levels);
        this.setState({ editing: false });
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

    removeLevel(index) {
        const levels = this.state.levels.slice();
        levels.splice(index, 1);
        this.setState({levels});
    }

    addNewLevel() {
        const newName = this.state.newName.trim().toLowerCase();
        const levels = this.state.levels.slice();
        if (levels.includes(newName)) {
            this.setState({ editingNew: false });
            alert('Modifier already exists');
            return;
        }
        levels.push(newName);
        this.setState({
            levels,
            editingNew: false
        });
    }

    updateLevel(index) {
        const newName = this.state.newName.trim().toLowerCase();
        const levels = this.state.levels.slice();
        if (levels.includes(newName)) {
            // alert('Modifier already exists');
            return;
        }
        levels[index] = newName;
        this.setState({
            levels
        });
    }

    render() {
        const footer = (
            <View>
                {this.state.editingNew ? (
                    <TextInput
                        style={styles.levelInput}
                        onChangeText={text => this.setState({ newName: text })}
                        onEndEditing={() => this.addNewLevel()}
                        placeholder="Type new modifier name..."
                        autoFocus
                    />
                ) : (
                    <TouchableNativeFeedback style={styles.addNew} onPress={() => this.setState({ editingNew: true })}>
                        <View style={styles.addNew}>
                            <Icon color="#555" name="add" size={24} />
                            <Text style={{color: '#555'}}> ADD NEW</Text>
                        </View>
                    </TouchableNativeFeedback>
                )}
                <Button title="Save" onPress={() => this.save()} />
            </View>
        );
        return (
            <View style={[styles.tagContainer, { backgroundColor: this.state.color }]}>
                <Text style={styles.tagName}>{this.props.name.toUpperCase()}</Text>
                <View style={styles.right}>
                    <TouchableOpacity style={{ marginRight: 20 }} onPress={() => this.setState({ editing: true })}>
                        <Icon size={22} color="white" name="edit" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.removeAlert()}>
                        <Icon name="delete" color="white" size={22} />
                    </TouchableOpacity>
                </View>
                <Modal
                    transparent
                    visible={this.state.editing}
                    onRequestClose={() => this.save()}>
                    <View style={styles.modal}>
                        <Text style={styles.title}>Editing Label: {this.state.name}</Text>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.levelInput}
                            underlineColorAndroid="grey"
                            style={{width: 100}}
                            defaultValue={this.props.name}
                            onChangeText={text => this.setState({ name: text })}
                        />
                        <Text style={styles.label}>Color</Text>
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
                        <Text style={styles.label}>Modifiers</Text>
                        <FlatList
                            data={this.state.levels}
                            renderItem={({ item, index }) => (
                                <View style={styles.level}>
                                    <Icon size={20} color="#555" name="edit" />
                                    <TextInput
                                        underlineColorAndroid="grey"
                                        placeholder="<No Modifier>"
                                        style={styles.levelInput}
                                        defaultValue={item}
                                        onChangeText={text => this.setState({newName: text})}
                                        onEndEditing={() => this.updateLevel(index)}
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            Alert.alert('Delete this modifier?', '', [
                                                { text: 'OK', onPress: () => this.removeLevel(index) },
                                                { text: 'Cancel' }
                                            ])
                                        }>
                                        <Icon color="#555" size={24} name="delete" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(level, i) => level}
                            ListFooterComponent={footer}
                        />
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 15,
        margin: 3
    },
    tagName: {
        color: 'white',
        marginRight: 5
    },
    right: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    picker: {
        // height: 30,
        width: 200,
        color: '#555'
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
        backgroundColor: 'rgba(255, 255, 255, .95)'
    },
    addNew: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 15,
    },
    level: {
        flex: 1,
        width: 200,
        flexDirection: 'row',
        alignItems: 'center'
    },
    levelInput: {
        flex: 1,
        color: '#555',
    },
    title: {
        fontFamily: 'sans-serif-light',
        fontSize: 24,
        color: '#555',
    },
    label: {
        fontSize: 20,
        fontFamily: 'sans-serif-light',
        color: '#555',
        marginTop: 20,

    }
});

export default EditTagInfo;
