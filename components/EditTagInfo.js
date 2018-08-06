import React from 'react';
import { View, Text, StyleSheet, TextInput, Picker, Alert, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class EditTagInfo extends React.Component {
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
        width: 200,
        justifyContent: 'space-between'
    },
    picker: {
        height: 30,
        width: 120,
        color: 'white'
    }
});

export default EditTagInfo;
