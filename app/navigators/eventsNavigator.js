import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Events,
    EventInfo
} from '../screens'

const Stack = createStackNavigator();

function EventsNavigator() {
    return (
        <Stack.Navigator
            headerMode={'none'}
            //initialRouteName={'Home'}
        >
            <Stack.Screen name="Events" component={Events} />
            <Stack.Screen name="EventInfo" component={EventInfo} />
        </Stack.Navigator>
    );
}

export default EventsNavigator;
