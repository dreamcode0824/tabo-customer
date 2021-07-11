import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import ApiGraphQl from '../../networking/apiGraphQl';
import API from '../../networking/api';
import {AnimateLoadingButton} from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import i18n from '../../constants/i18next';

const width = Dimensions.get('window').width - 38;

class EnterPasswordClass extends Component {
  api = new API();

  apigraphql = new ApiGraphQl();

  constructor(props) {
    super(props);
    this.state = {
      err_wrong: false,
      secure: true,
      password: '',
      passwordError: '',
    };

    this.fromLogin = this.props.route.params.login;
  }

  passwordValidator() {
    return this.state.password.length > 7;
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      setTimeout(() => {
        this.input.focus();
      }, 150);
    });

    this.apigraphql
      .getCountyId(this.props.config.country_code)
      .then((data) => {
        this.setState({
          country_id: data.data.country[0].id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async setToken(user) {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('loggedIn', JSON.stringify(true));
    } catch (error) {
      console.log(error);
    }
  }

  createCustomer() {
    if (!this.passwordValidator()) {
      this.setState({
        passwordError: 'Password must be at least 8 characters',
      });
      return;
    }
    this.loadingButton.showLoading(true);
    let info = {
      phone: this.props.route.params.phone,
      password: this.state.password,
      device: {os: 'android'},
    };
    console.log(info);
    this.apigraphql
      .createCustomerOnlyPassword(info)
      .then(async (user) => {
        console.log(user);
        this.loadingButton.showLoading(false);
        await this.setToken({
          id: user.data.customerCreate.id,
          token: user.data.customerCreate.token,
        });
        this.props.dispatch({
          type: 'SET_USER',
          value: {
            id: user.data.customerCreate.id,
            token: user.data.customerCreate.token,
            country_id: this.state.country_id,
          },
        });
        this.props.navigation.reset({
          index: 0,
          routes: [{name: 'TabNavigator'}],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  login() {
    if (!this.passwordValidator()) {
      this.setState({
        passwordError: 'Password must be at least 8 characters',
      });
      return;
    }
    this.loadingButton.showLoading(true);
    let info = {
      number: this.props.route.params.phone,
      password: this.state.password,
      code: this.props.route.params.code,
    };
    this.api
      .signIn(info)
      .then((res) => {
        this.loadingButton.showLoading(false);
        if (res.data && res.data.token) {
          this.props.dispatch({
            type: 'SET_USER',
            value: res.data.customer,
          });

          this.setToken({
            token: res.data.token,
            id: res.data.customer.id,
          });
          console.log('SIGN');
          this.props.navigation.reset({
            index: 0,
            routes: [{name: 'TabNavigator'}],
          });
        } else if (res.data && res.data.message == 'WRONG_PASSWORD') {
          this.setState({
            err_wrong: true,
          });
        } else {
          Alert.alert(
            '',
            'Unknown error',
            [
              {
                text: 'Close',
                onPress: () => {},
                style: 'cancel',
              },
            ],
            {cancelable: true},
          );
        }
      })
      .catch((error) => {
        console.log(error);
        this.loadingButton.showLoading(false);
      });
  }

  submit() {
    if (this.fromLogin) {
      this.login();
    } else {
      this.createCustomer();
    }
  }

  sendCode() {
    this.loadingButton.showLoading(true);
    let info = {
      code: this.props.route.params.code,
      number: this.props.route.params.phone,
    };
    this.api
      .login(info)
      .then((data) => {
        this.loadingButton.showLoading(false);
        if (data.status === 404) {
          this.loadingButton.showLoading(false);
          this.setState({
            loading: false,
          });
        } else {
          this.loadingButton.showLoading(false);
          this.props.navigation.navigate('Code', {
            phone: this.props.route.params.phone,
            code: this.props.route.params.code,
            reset: true,
          });
        }
      })
      .catch((err) => {
        this.loadingButton.showLoading(false);
      });
  }

  newPassword() {
    if (!this.passwordValidator()) {
      this.setState({
        passwordError: 'Password must be at least 8 characters',
      });
      return;
    }
    this.loadingButton.showLoading(true);
    let info = {
      number: this.props.route.params.phone,
      code: this.props.route.params.code,
      password: this.state.password,
    };
    this.apigraphql
      .resetPassword(info)
      .then((data) => {
        this.login();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.back_btn}
            onPress={() => this.props.navigation.goBack()}>
            <Image
              source={require('../../assets/images/back.png')}
              style={{
                resizeMode: 'contain',
                height: 16,
                width: 16,
              }}
            />
          </TouchableOpacity>
          <Text style={styles.finish_text}>
            {this.fromLogin
              ? this.props.route.params.reset
                ? i18n.t('ENTER_YOUR_NEW_PASSWORD')
                : i18n.t('ENTER_YOUR_PASSWORD')
              : i18n.t('FINISH_SIGNUP')}
          </Text>
          <View style={styles.input_view}>
            <View
              style={[
                styles.password_view,
                this.state.passwordError ? {backgroundColor: '#f8e6ed'} : null,
              ]}>
              <TextInput
                ref={(ref) => (this.input = ref)}
                secureTextEntry={this.state.secure}
                placeholder={
                  this.props.route.params.reset
                    ? i18n.t('ENTER_YOUR_NEW_PASSWORD')
                    : i18n.t('PASSWORD')
                }
                placeholderTextColor={'#aba9a9'}
                onChangeText={(e) =>
                  this.setState({
                    password: e,
                    passwordError: '',
                    err_wrong: false,
                  })
                }
                style={styles.input_password}
              />
              <TouchableOpacity
                style={styles.show_btn}
                onPress={() => this.setState({secure: !this.state.secure})}>
                <Text>{i18n.t('SHOW')}</Text>
              </TouchableOpacity>
            </View>
            {!this.props.route.params.reset ? (
              <View style={styles.reset_view}>
                <TouchableOpacity
                  style={styles.reset_buton}
                  onPress={() => this.sendCode()}>
                  <Text style={styles.reset_text}>
                    {i18n.t('RESET_PASSWORD')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.err_view}>
              {this.state.passwordError ? (
                <Text style={styles.err_text}>{i18n.t('PASSWORD_LENGTH')}</Text>
              ) : null}
              {this.state.err_wrong && (
                <Text style={styles.err_text}>{i18n.t('PASSWORD_WRONG')}</Text>
              )}
            </View>
            {this.fromLogin ? null : (
              <Text style={styles.tobo_text}>
                {i18n.t('BY_SELECTING_TABO')}
                <Text style={styles.tobo_line_text}>
                  {i18n.t('BY_SELECTING_TABO_LINE')}
                </Text>
              </Text>
            )}
            <AnimateLoadingButton
              ref={(c) => (this.loadingButton = c)}
              width={width}
              height={50}
              title={
                this.fromLogin
                  ? this.props.route.params.reset
                    ? i18n.t('RESET')
                    : i18n.t('LOGIN')
                  : i18n.t('AGREE_AND_CONTINUE')
              }
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
                if (this.props.route.params.reset) {
                  this.newPassword();
                } else {
                  this.submit();
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export const EnterPassword = connect(({user, config}) => ({user, config}))(
  EnterPasswordClass,
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fafbfd',
  },
  back_btn: {
    marginTop: 16,
    marginLeft: 16,
    width: 50,
    height: 50,
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
    fontSize: 16,
    lineHeight: 20,
    color: '#aba9a9',
  },
  password_view: {
    marginBottom: 10,
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
  reset_view: {
    alignItems: 'center',
  },
  reset_text: {
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 14,
    color: '#000',
  },
  err_view: {
    height: 20,
    marginBottom: 10,
  },
  err_text: {
    color: 'red',
    fontSize: 14,
    marginBottom: 20,
  },
  show_btn: {
    width: '15%',
  },
  tobo_text: {
    marginBottom: 20,
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
});
