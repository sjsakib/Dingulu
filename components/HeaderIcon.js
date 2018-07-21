import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HeaderIcon = ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="menu" size={20}/>
    </TouchableOpacity>
)

export default HeaderIcon;
