import * as React from 'react';
import { Platform } from 'react-native'
import { Image, Text, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeNavigator from './homeNavigator'
import SavedNavigator from './savedNavigator'
import EventsNavigator from './eventsNavigator'
import ProfileNavigator from './profileNavigator'
import ReservedNavigator from './reservedNavigator'

const Tab = createBottomTabNavigator();

let getTabBarVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  if (routeName === 'EventInfo') {
    return false;
  }

  return true;
}


let getTabBarBusinessVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  if (routeName === 'Business' || routeName === 'SearchResults' || routeName === 'EnterCustomerInfo' || routeName === 'RelatedBusiness' || routeName === 'ReservationDetail') {
    return false;
  }

  return true;
}

let getTabBarProfileVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  if (routeName === 'PersonalInformation' || routeName === 'Languages' || routeName === 'Notifications' || routeName === 'ShowProfile') {
    return false;
  }
  return true;
}

let getTabBarReservedVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  if (routeName === 'ReservedInfo') {
    return false;
  }

  return true;
}

let getTabBarSevedVisibility = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : '';

  if (routeName === 'Business') {
    return false;
  }

  if (routeName === 'EventInfo') {
    return false;
  }

  return true;
}

let getOrientation = () => {
  if (Dimensions.get('window').width < Dimensions.get('window').height) {
    return false
  } else {
    return true
  }
}

export default function TabNavigator() {
  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        unmountOnBlur: true,
        tabBarIcon: ({ focused, color, size }) => {
          let imageSource = null
          if (route.name === 'HomeNavigator') {
            imageSource = require('../assets/images/search.png')
          }

          if (route.name === 'EventsNavigator') {
            imageSource = require('../assets/images/eventsTab.png')
          }

          if (route.name === 'SavedNavigator') {
            imageSource = require('../assets/images/heartTab.png')
          }
          if (route.name === 'ReservedNavigator') {
            imageSource = require('../assets/images/calendar.png')
          }
          if (route.name === 'ProfileNavigator') {
            imageSource = require('../assets/images/userTab.png')
          }
          return <Image
            style={{
              height: 25.2,
              width: 25.2,
              tintColor: color
            }}
            source={imageSource}
          />;
        },
        tabBarLabel: ({ focused, color, size }) => {
          if (getOrientation()) {
            return null
          }
          let label = ''
          if (route.name === 'HomeNavigator') {
            label = 'Explore'
          }
          if (route.name === 'SavedNavigator') {
            label = 'Saved'
          }
          if (route.name === 'ReservedNavigator') {
            label = 'Reserved'
          }
          if (route.name === 'EventsNavigator') {
            label = 'Events'
          }
          if (route.name === 'ProfileNavigator') {
            label = 'Profile'
          }
          return <Text style={{
            color,
            fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
            fontSize: 10,
            lineHeight: 12,
            marginBottom: 2
          }}>
            {label}
          </Text>
        },
      })}
      tabBarOptions={{
        activeTintColor: '#6844F9',
        inactiveTintColor: '#B5B3BD',
        style: {
          position: 'absolute',
          height: 50,
        },
        tabStyle: {
          height: 50,
        }
      }}
    >
      <Tab.Screen

        name="HomeNavigator" component={HomeNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarBusinessVisibility(route)
        })} />
      <Tab.Screen name="ReservedNavigator" component={ReservedNavigator} options={({ route }) => ({
        tabBarVisible: getTabBarReservedVisibility(route)
      })} />
      <Tab.Screen name="SavedNavigator" component={SavedNavigator} options={({ route }) => ({
        tabBarVisible: getTabBarSevedVisibility(route)
      })} />
      <Tab.Screen name="EventsNavigator" component={EventsNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route)
        })}
      />
      <Tab.Screen name="ProfileNavigator" component={ProfileNavigator}
        options={({ route }) => ({
          tabBarVisible: getTabBarProfileVisibility(route)
        })} />
    </Tab.Navigator>
  );
}
