import React from 'react';
import {
    Text,
    Button,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: props.text,
            editing: false
        };
    }

    handleSave() {
        this.props.updateNote(this.state.text);
        this.setState({ editing: false });
    }

    render() {
        if (this.state.editing) {
            return (
                <View style={styles.notepad}>
                    <TextInput
                        style={styles.input}
                        multiline={true}
                        defaultValue={this.state.text}
                        numberOfLines={10}
                        autoFocus={true}
                        placeholder="Type your note here"
                        onChangeText={text => this.setState({ text })}
                    />
                    <Button title="Save" onPress={() => this.handleSave()} />
                </View>
            );
        }

        const noteText = this.props.text;
        const iconName = noteText ? 'edit' : 'add';
        const text = noteText || <Text>(No note)</Text>;
        return (
            <View style={styles.note}>
                <View style={styles.header}>
                    <Text style={styles.title}>Note</Text>
                    <TouchableOpacity
                        style={styles.editIcon}
                        onPress={() => this.setState({ editing: true })}>
                        <Icon name={iconName} size={30} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.noteText}>
                    <Text>{text}</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    notepad: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'space-around',
        backgroundColor: 'rgba(255, 255, 255, .95)'
    },
    input: {
        flex: 1,
        padding: 15
    },
    title: {
        fontSize: 24
    },
    note: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15,
        paddingBottom: 0
    },
    noteText: {
        marginTop: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default Note;
