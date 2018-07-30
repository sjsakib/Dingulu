import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HeaderIcon = ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon color="black" name="menu" size={24}/>
    </TouchableOpacity>
)

export default HeaderIcon;
