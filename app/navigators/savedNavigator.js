import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Saved,
    BusinessTest,
    Business,
    EnterCustomerInfo,
    EventInfo,
} from '../screens'

const Stack = createStackNavigator();

function SavedNavigator() {
    return (
        <Stack.Navigator
            headerMode={'none'}
            //initialRouteName={'Home'}
        >
            <Stack.Screen name="Saved" component={Saved} />
            <Stack.Screen name="BusinessTest" component={BusinessTest} />
            <Stack.Screen name="Business" component={Business}/>
            <Stack.Screen name="EnterCustomerInfo" component={EnterCustomerInfo}/>
            <Stack.Screen name="EventInfo" component={EventInfo} />
        </Stack.Navigator>
    );
}

export default SavedNavigator;
