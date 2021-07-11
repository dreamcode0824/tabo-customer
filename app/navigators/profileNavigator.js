import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Profile,
    PersonalInformation,
    Languages,
    Notifications,
    ShowProfile
} from '../screens'

const Stack = createStackNavigator();

function ProfileNavigator() {
    return (
        <Stack.Navigator
            headerMode={'none'}
        //initialRouteName={'Home'}
        >
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="PersonalInformation" component={PersonalInformation} />
            <Stack.Screen name="Languages" component={Languages} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="ShowProfile" component={ShowProfile} />
        </Stack.Navigator>
    );
}

export default ProfileNavigator;
