import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HeaderIcon = ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon style={{marginLeft: 10}} name="menu" size={20}/>
    </TouchableOpacity>
)

export default HeaderIcon;
