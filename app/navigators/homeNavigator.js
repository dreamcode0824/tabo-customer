import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Home,
    Business,
    SearchResults,
    EnterCustomerInfo,
    ReservationDetail,
} from '../screens'

const Stack = createStackNavigator();

function HomeNavigator() {
    return (
        <Stack.Navigator
            headerMode={'none'}
            initialRouteName={'test'}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Business" component={Business} />
            <Stack.Screen name="RelatedBusiness" component={Business} />
            <Stack.Screen name="SearchResults" component={SearchResults} />
            <Stack.Screen name="EnterCustomerInfo" component={EnterCustomerInfo} />
            <Stack.Screen name="ReservationDetail" component={ReservationDetail} />
        </Stack.Navigator>
    );
}

export default HomeNavigator;
