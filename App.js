import React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import Day from './screens/Day';
import Stat from './screens/Stat';
import EditTag from './screens/EditTag';

const Days = createDrawerNavigator({
    Day: {
        screen: Day
    },
    Stat: {
        screen: Stat
    },
    EditTag: {
        screen: EditTag
    }
});

export default Days;
