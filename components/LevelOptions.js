import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Tag from './Tag';

// returns three different tags from one tag with different levels
function levelTag(tag, addTag, color, levels) {
    const leveledTags = [];
    levels = levels || ['somehow', '', 'very'];
    for (let i = 0; i < levels.length; i++) {
        const leveledTag = { ...tag, level: levels[i] };
        leveledTags.push(
            <Tag
                onPress={() => addTag(leveledTag)}
                key={i}
                tag={leveledTag}
                color={color}
            />
        );
    }
    return leveledTags;
}

const LevelOptions = props => (
    <View style={styles.overlay}>
        {levelTag(props.tag, props.addTag, props.color)}
        <TouchableOpacity
            onPress={props.onCancel}
            style={{
                backgroundColor: props.color,
                padding: 10,
                borderRadius: 20
            }}>
            <Icon color="white" name="close" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .8)'
    }
});

export default LevelOptions;