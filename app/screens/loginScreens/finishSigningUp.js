import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { Country, AnimateLoadingButton } from '../../components';
import ApiGraphQl from '../../networking/apiGraphQl';
import i18n from '../../constants/i18next';

const width = Dimensions.get('window').width - 38;

class FinishSigningUpClass extends Component {
  apigraphql = new ApiGraphQl();

  constructor() {
    super();
    this.state = {
      countryList: [],
      modalCity: false,
      cityId: '',
      secure: true,

      firstName: '',
      lastName: '',
      city: '',
      email: '',
      password: '',

      firstNameError: '',
      lastNameError: '',
      cityError: '',
      emailError: '',
      passwordError: '',
    };
  }

  componentDidMount() {
    Keyboard.dismiss();
  }

  emailValidator() {
    let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(this.state.email);
  }

  passwordValidator() {
    return this.state.password.length > 7;
  }

  isValidAll(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) {
        return false;
      }
    }
    return true;
  }

  submit() {
    Keyboard.dismiss();
    let errors = {
      firstNameError: this.state.firstName ? '' : 'Invalid first name',
      lastNameError: this.state.lastName ? '' : 'Invalid first name',
      cityError: this.state.city ? '' : 'Select city',
      emailError: this.emailValidator() ? '' : 'Email Invalid',
      passwordError: this.passwordValidator()
        ? ''
        : 'Password must be at least 8 characters',
    };
    if (this.isValidAll(errors)) {
      this.createCustomer();
    } else {
      this.setState({
        ...errors,
      });
    }
  }

  async setToken(user) {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('loggedIn', JSON.stringify(true));
    } catch (error) {
      console.log(error);
    }
  }

  changeCity = (city, cityId) => {
    this.setState({
      city: city,
      cityId: cityId,
      cityError: '',
    });
  };

  createCustomer() {
    this.loadingButton.showLoading(true);
    let info = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      city_id: this.state.cityId,
      phone: this.props.route.params.phone,
      password: this.state.password,
      device: { os: 'android' },
    };
    this.apigraphql
      .createCustomer(info)
      .then(async (user) => {
        await this.loadingButton.showLoading(false);
        await this.setToken(user.data.customerCreate);
        await this.props.dispatch({
          type: 'SET_USER',
          value: {
            id: user.data.customerCreate.id,
            token: user.data.customerCreate.token,
            email: this.state.email,
            city_id: this.state.cityId,
            city: this.state.city,
            phone: this.props.route.params.phone,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
          },
        });
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigator' }],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('EnterPassword', {
                ...this.props.route.params,
              });
            }}
            activeOpacity={0.8}
            style={styles.skipButton}>
            <Text style={styles.skipText}>{i18n.t('SKIP_BTN')}</Text>
            <Image
              style={{
                transform: [{ rotateZ: '180deg' }],
                width: 16,
                height: 16,
                resizeMode: 'contain',
              }}
              source={require('../../assets/images/back.png')}
            />
          </TouchableOpacity>
          <Text style={styles.finish_text}>{i18n.t('FINISH_SIGNUP')}</Text>
          <View style={styles.input_view}>
            <TextInput
              placeholder={i18n.t('FIRST_NAME')}
              placeholderTextColor={'#aba9a9'}
              onChangeText={(e) =>
                this.setState({
                  firstName: e,
                  firstNameError: '',
                })
              }
              style={[
                styles.input,
                this.state.firstNameError ? { backgroundColor: '#f8e6ed' } : null,
              ]}
            />
            <TextInput
              placeholder={i18n.t('LAST_NAME')}
              placeholderTextColor={'#aba9a9'}
              onChangeText={(e) =>
                this.setState({
                  lastName: e,
                  lastNameError: '',
                })
              }
              style={[
                styles.input,
                this.state.lastNameError ? { backgroundColor: '#f8e6ed' } : null,
              ]}
            />
            <Text style={styles.id_text}>{i18n.t('MAKE_SURE_IT_ID')}</Text>
            <View
              style={[
                styles.city_view,
                this.state.cityError ? { backgroundColor: '#f8e6ed' } : null,
              ]}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  Keyboard.dismiss();
                  this.setState({ modalCity: true });
                }}>
                {this.state.city ? (
                  <Text style={[styles.city_text, { color: '#2C2929' }]}>
                    {this.state.city}
                  </Text>
                ) : (
                    <Text style={styles.city_text}>{i18n.t('CITY')}</Text>
                  )}
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder={i18n.t('EMAIL')}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCompleteType="email"
              placeholderTextColor={'#aba9a9'}
              onChangeText={(e) =>
                this.setState({
                  email: e,
                  emailError: '',
                })
              }
              style={[
                styles.input,
                this.state.emailError ? { backgroundColor: '#f8e6ed' } : null,
              ]}
            />
            <Text style={styles.id_text}>
              {i18n.t('WELL_EMAIL_CONFIRMATIONS')}
            </Text>
            <View
              style={[
                styles.password_view,
                this.state.passwordError ? { backgroundColor: '#f8e6ed' } : null,
              ]}>
              <TextInput
                secureTextEntry={this.state.secure}
                placeholder={i18n.t('PASSWORD')}
                placeholderTextColor={'#aba9a9'}
                onChangeText={(e) =>
                  this.setState({
                    password: e,
                    passwordError: '',
                  })
                }
                style={styles.input_password}
              />
              <TouchableOpacity
                style={styles.show_btn}
                onPress={() => this.setState({ secure: !this.state.secure })}>
                <Text>{i18n.t('SHOW')}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.tobo_text}>
              {i18n.t('BY_SELECTING_TABO')}
              <Text style={styles.tobo_line_text}>
                {' '}
                {i18n.t('BY_SELECTING_TABO_LINE')}
              </Text>
            </Text>
            <AnimateLoadingButton
              ref={(c) => (this.loadingButton = c)}
              width={width}
              height={50}
              title={i18n.t('AGREE_AND_CONTINUE')}
              titleFontFamily={
                Platform.OS === 'ios'
                  ? 'CircularStd-Medium'
                  : 'Circular-Std-Medium'
              }
              titleFontSize={16}
              titleColor="rgb(255,255,255)"
              backgroundColor="#6744f9"
              borderRadius={12}
              onPress={() => {
                Keyboard.dismiss();
                this.submit();
              }}
            />
          </View>
        </ScrollView>
        <Country
          close={() => {
            this.setState({ modalCity: false });
          }}
          isVisible={this.state.modalCity}
          changeCity={this.changeCity}
        />
      </View>
    );
  }
}

export const FinishSigningUp = connect(({ user }) => ({ user }))(
  FinishSigningUpClass,
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fafbfd',
  },
  finish_text: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 'bold',
    marginTop: 60,
  },
  input_view: {
    marginTop: 36,
    marginHorizontal: 24,
  },
  input: {
    marginTop: 16,
    lineHeight: 20,
    fontSize: 16,
    paddingLeft: 27,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  id_text: {
    fontSize: 11,
    marginTop: 10,
    color: '#010101',
  },
  city_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 27,
    paddingRight: 18,
    marginTop: 10,
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  city_text: {
    //fontFamily: 'Circular-Std',
    fontSize: 16,
    lineHeight: 20,
    color: '#aba9a9',
  },
  password_view: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: 20,
    fontSize: 16,
    paddingLeft: 27,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  input_password: {
    width: '85%',
  },
  show_btn: {
    width: '15%',
  },
  tobo_text: {
    marginBottom: 16,
    marginTop: 24,
    fontSize: 11,
    lineHeight: 17,
    color: '#010101',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  tobo_line_text: {
    fontSize: 11,
    lineHeight: 17,
    color: '#010101',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    textDecorationLine: 'underline',
  },
  continue_btn: {
    width: '100%',
    backgroundColor: '#6844F9',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  continue_text: {
    color: '#fff',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.5,
    height: 30,
    position: 'absolute',
    right: 16,
    top: 20,
  },
  skipText: {
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 20,
    lineHeight: 22,
    marginRight: 5,
  },
});
