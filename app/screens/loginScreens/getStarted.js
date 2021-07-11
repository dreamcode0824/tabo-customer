import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import DropDown from '../../components/general/dropDown';
import AsyncStorage from '@react-native-community/async-storage'
import i18n from "../../constants/i18next";

class GetStartedClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: [
        {
          title: 'English',
          short: 'en'
        },
        {
          title: 'Romania',
          short: 'ro'
        },
      ],
      languageItem: 'English',
    };

    this.getLanguage()
  }

  getLanguage() {
    for (let i = 0; i < this.state.language.length; i++) {
      if (this.state.language[i].short == this.props.config.language) {
        this.state.languageItem = this.state.language[i].title
      }
    }
  }

  async setLanguage(value) {
    try {
      await AsyncStorage.setItem('language', value)
    }
    catch (error) {
      console.log(error);
    }
  }

  handleChange = (e, name) => {
    this.setState({
      [name]: e.title,
    });
    this.setLanguage(e.short)
    this.props.dispatch({ type: 'SET_LANGUAGE', value: e.short });
    i18n.changeLanguage(e.short)
    this.forceUpdate()
  };
  render() {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View>
            <Image
              style={styles.logo}
              source={require('../../assets/images/logo.png')}
            />
            <Text style={styles.title}>
              {i18n.t('WELCOME_TO_TABO')}
            </Text>
            <View style={styles.drop_down}>
              <DropDown data={this.state.language} handleChange={this.handleChange}
                title={this.state.languageItem} dropdownName='languageItem' />
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.navigation.navigate('LoginNavigator');
            }}
          >
            <View
              style={styles.button}
            >
              <Text style={styles.buttonText}>

                {i18n.t('GET_STARTED')}
              </Text>
              <View style={styles.circle}>
                <Image
                  style={{ height: 10, width: 10 }}
                  source={require('../../assets/images/arrow1.png')}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    );
  }
  componentDidMount() {
    this.props.dispatch({ type: 'SET_COUNTRY', language: this.state.languageItem });
  }
}

export const GetStarted = connect(({ config }) => ({ config }))(GetStartedClass)

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#6844F9',
    justifyContent: 'space-between',
    minHeight: 480,
  },
  logo: {
    width: 69,
    height: 69,
    marginLeft: 10,
    marginTop: 119,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 40,
    marginLeft: 36,
    marginTop: 32,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  drop_down: {
    marginTop: 51,
  },
  button: {
    marginTop: 20,
    height: 50,
    marginLeft: 36,
    marginBottom: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 18,
    lineHeight: 20,
  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginLeft: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
