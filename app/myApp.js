import React, {useEffect} from 'react';
import {Platform, StatusBar, KeyboardAvoidingView, Linking} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation';
import MainNavigator from './navigators/mainNavigator';
import {Provider} from 'react-redux';
import store from './store';

const MyApp = () => {
  useEffect(() => {
    Orientation.lockToPortrait();
    console.log('Splash Splash');
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          enabled={Platform.OS === 'ios'}>
          <Provider store={store}>
            {Platform.OS === 'android' ? (
              <StatusBar backgroundColor="#fff" barStyle={'dark-content'} />
            ) : null}
            <MainNavigator />
          </Provider>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default MyApp;
