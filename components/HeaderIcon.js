import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const HeaderIcon = ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Text>=</Text>
    </TouchableOpacity>
)

export default HeaderIcon;
