import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import CountryPicker from 'react-native-country-picker-modal';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import i18n from '../../constants/i18next';
import { Loading, AnimateLoadingButton } from '../../components';
import API from '../../networking/api';
import ApiGraphQl from '../../networking/apiGraphQl';
import Down from '../../assets/images/down.png';
import Face from '../../assets/images/face.png';
import Google from '../../assets/images/google.png';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width - 38;

class LoginClass extends Component {
  api = new API();
  apigraphql = new ApiGraphQl();
  responseDone = false;
  responseTime = false;

  constructor(props) {
    super(props);
    this.state = {
      invalidPhone: false,
      loading: false,
      buttonDisabled: true,
      country: '',
      phone: '',
      code: '',
      cca2: props.config.country.country_code,
    };
    GoogleSignin.configure({
      scopes: ['profile', 'email', 'openid'],
      offlineAccess: false,
      forceCodeForRefreshToken: true,
      webClientId:
        '1003662112590-60rqakfp7lp562q8u8ppjlu1ac0ld704.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    });
  }

  async setToken(user) {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('loggedIn', JSON.stringify(true));
    } catch (error) {
      console.log(error);
    }
  }

  checkSocialUserId(whereId, whereEmail, userData, loginData) {
    this.setState({ loading: true });
    this.loadingButton.showLoading(true);
    this.apigraphql
      .checkSocialUser(whereId)
      .then((res) => {
        if (res.data.customer.length) {
          this.apigraphql
            .getSocialUser(loginData)
            .then((res) => {
              this.props.dispatch({
                type: 'SET_USER',
                value: res.data.CustomerSocialLogin,
              });
              this.setToken({
                token: res.data.CustomerSocialLogin.token,
                id: res.data.CustomerSocialLogin.id,
              });
              this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'TabNavigator' }],
              });
            })
            .catch((error) => {
              console.log(error);
              this.loadingButton.showLoading(false);
            });
        } else {
          if (whereEmail) {
            this.apigraphql.checkSocialUser(whereEmail).then((res) => {
              if (res.data.customer.length) {
                let customer = `{
                                  id: ${res.data.customer[0].id},
                                  google_auth_data: ${userData}
                              }`;
                this.apigraphql
                  .updateCustomer(customer)
                  .then((data) => {
                    this.props.dispatch({
                      type: 'SET_USER',
                      value: res.data.customerUpdate,
                    });
                    this.setToken({
                      token: res.data.customerUpdate.token,
                      id: res.data.customerUpdate.id,
                    });
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'TabNavigator' }],
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    this.loadingButton.showLoading(false);
                  });
              } else {
                let data = `{
                              google_auth_data: ${userData}
                          }`;
                this.apigraphql
                  .setSocialUser(data)
                  .then((res) => {
                    this.props.dispatch({
                      type: 'SET_USER',
                      value: res.data.customerCreate,
                    });
                    this.setToken({
                      token: res.data.customerCreate.token,
                      id: res.data.customerCreate.id,
                    });
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'TabNavigator' }],
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                    this.setState({ loading: false });
                    this.loadingButton.showLoading(false);
                  });
              }
            });
          } else {
            let data = `{
                                          facebook_auth_data: ${userData}
                                      }`;
            this.apigraphql
              .setSocialUser(data)
              .then((res) => {
                console.log(res, 'rgrg');
                this.props.dispatch({
                  type: 'SET_USER',
                  value: res.data.customerCreate,
                });
                this.setToken({
                  token: res.data.customerCreate.token,
                  id: res.data.customerCreate.id,
                });
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'TabNavigator' }],
                });
              })
              .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
                this.loadingButton.showLoading(false);
              });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loading: false });
        this.loadingButton.showLoading(false);
      });
  }

  handel = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
      let whereId = `where: {google_user_id: "${userInfo.user.id}"}`;
      let whereEmail = `where: {email: "${userInfo.user.email}"}`;
      let userData = `{
                id: "${userInfo.user.id}",
                email: "${userInfo.user.email}",
                givenName: "${userInfo.user.givenName}",
                familyName: "${userInfo.user.familyName}",
                photo: "${userInfo.user.photo}",
            }`;
      let loginData = `{
                type:"google",
                id:"${userInfo.user.id}"
              }`;
      this.checkSocialUserId(whereId, whereEmail, userData, loginData);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  async signInWithFacebook() {
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }

    await LoginManager.logInWithPermissions(['public_profile'])
      .then(
        (result) => {
          if (result.isCancelled) {
            console.log('Login cancelled');
          } else {
            console.log(
              'Login success with permissions: ' +
              result.grantedPermissions.toString(),
            );
            return AccessToken.getCurrentAccessToken()
              .then(({ accessToken }) => {
                return fetch(
                  `https://graph.facebook.com/me?fields=email,name,birthday,picture.width(100).height(100)&access_token=${accessToken}`,
                )
                  .then((response) => response.json())
                  .then((res) => {
                    let whereId = `where: {facebook_user_id: "${res.id}"}`;
                    let whereEmail = '';
                    let userData = `{
                                    id: "${res.id}",
                                    name: "${res.name}",
                                    picture: "${res.picture.data.url}",
                                     country_id: ${this.props.config.country_id},
                                }`;
                    let loginData = `{
                                    type:"facebook",
                                    id:"${res.id}"
                                  }`;
                    this.checkSocialUserId(
                      whereId,
                      whereEmail,
                      userData,
                      loginData,
                    );
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          }
        },
        function (error) {
          console.log('Login fail with error: ' + error);
        },
      )
      .catch((error) => {
        console.log(error);
      });
  }

  phoneValidator() {
    let pattern = /^[0-9]{8,15}$/;
    return pattern.test(this.state.phone);
  }

  handleChange = (e, name) => {
    this.setState({
      [name]: e,
    });
  };

  _rendercountry() {
    if (this.state.modallCountry) {
      return (
        <CountryPicker
          countryCode={'AM'}
          onSelect={(value) => {
            this.props.dispatch({
              type: 'SET_COUNTRY',
              value: { country_code: value.cca2 },
            });
            this.setState({
              country: `${value.name}(+${value.callingCode[0]})`,
              code: value.callingCode[0],
              cca2: value.cca2,
            });
          }}
          translation="eng"
          visible={true}
          withCallingCode={true}
          withFilter={true}
          withFlag={true}
          onClose={() => {
            this.setState({ modallCountry: false });
          }}
        />
      );
    }
  }

  login() {
    console.log("OOOOOOOOOOOOOOOOOOO")
    if (!this.phoneValidator()) {
      this.setState({
        invalidPhone: true,
      });
      return;
    }
    this.loadingButton.showLoading(true);
    this.setState({ loading: true });
    if (!this.state.code && !this.state.phone) {
      return;
    }
    let info = {
      code: this.state.code,
      number: this.state.phone,
    };
    this.time = setTimeout(() => {
      if (this.responseDone) {
        this.responseDone = false;
        if (this.data.data.already_registered) {
          this.loadingButton.showLoading(false);
          this.setState({ loading: false });
          this.props.navigation.navigate('EnterPassword', {
            phone: this.state.phone,
            code: this.state.code,
            login: true,
            cca2: this.state.cca2,
          });
        } else {
          this.loadingButton.showLoading(false);
          this.setState({ loading: false });
          this.props.navigation.navigate('Code', {
            phone: this.state.phone,
            code: this.state.code,
            cca2: this.state.cca2,
          });
        }
      } else {
        this.responseTime = true;
      }
    }, 1000);
    this.api
      .login(info)
      .then((data) => {
        console.log(data.data, "$$$$$$$$$$$$$$$$$$$$$$$$$")
        if (data.status === 404) {
          this.loadingButton.showLoading(false);
          this.setState({
            loading: false,
          });
        } else {
          if (this.state.responseTime) {
            this.responseTime = false;
            console.log(data.data.already_registered, "------------>registered")
            if (data.data.already_registered === true) {
              this.loadingButton.showLoading(false);
              this.setState({ loading: false });
              this.props.navigation.navigate('EnterPassword', {
                phone: this.state.phone,
                code: this.state.code,
                login: true,
                cca2: this.state.cca2,
              });
            } else {
              this.loadingButton.showLoading(false);
              this.setState({ loading: false });
              this.props.navigation.navigate('Code', {
                phone: this.state.phone,
                code: this.state.code,
                cca2: this.state.cca2,
              });
            }
          } else {
            this.data = data;
            this.responseDone = true;
          }
        }
      })
      .catch((err) => {
        this.loadingButton.showLoading(false);
        this.setState({ loading: false });
      });
  }

  render() {
    return (
      <View style={styles.content}>
        <ScrollView
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
          <Text
            style={{
              margin: 20,
              fontSize: 30,
            }}></Text>
          <View style={styles.cont}>
            <Text style={styles.login_signup_text}>
              {i18n.t('LOGIN_OR_SIGNUP')}
            </Text>
            <Text style={styles.login_account_text}>
              {i18n.t('LOGIN_YOUR_ACCOUNT')}
            </Text>
            <View style={styles.count_view}>
              <TouchableOpacity
                style={styles.country_btn}
                onPress={() => this.setState({ modallCountry: true })}>
                {this.state.country ? (
                  <Text style={[styles.country_text, { color: '#2C2929' }]}>
                    {this.state.country}
                  </Text>
                ) : this.props.config.phone_code &&
                  this.props.config.country ? (
                  <Text style={[styles.country_text, { color: '#2C2929' }]}>
                    {this.props.config.country} (+{this.props.config.phone_code}
                    )
                  </Text>
                ) : (
                  <Text style={styles.country_text}> Country/Region</Text>
                )}
                <Image source={Down} />
              </TouchableOpacity>
            </View>
            <View style={styles.input_view}>
              <TextInput
                placeholder={'Phone number'}
                placeholderTextColor={'#aba9a9'}
                style={
                  this.state.invalidPhone
                    ? [styles.input, { backgroundColor: '#f8e6ed' }]
                    : styles.input
                }
                keyboardType={'numeric'}
                onChangeText={(e) =>
                  this.setState({
                    invalidPhone: false,
                    phone: e,
                  })
                }
              />
            </View>
            <View style={styles.err_view}>
              {this.state.invalidPhone && (
                <Text style={styles.invalid_phone}>
                  {i18n.t('PHONE_VALIDATION')}
                </Text>
              )}
            </View>
            <Text style={styles.login_text}>
              {i18n.t(
                'SMART_BEACH_WILL_SEND_YOU_AN_SMS_MESSAGE_TO_VERIFY_YOUR_PHONE_NUMBER',
              )}
            </Text>
            <TouchableOpacity style={styles.continue_view}>
              <AnimateLoadingButton
                ref={(c) => (this.loadingButton = c)}
                width={width}
                height={50}
                title={i18n.t('CONTINUE_BTN')}
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
                  this.login();
                }}
              />
            </TouchableOpacity>
            <View style={styles.or_view}>
              <Text style={styles.line} />
              <Text style={styles.or_text}>or</Text>
              <Text style={styles.line} />
            </View>
            <TouchableOpacity
              style={styles.face_google_btn}
              onPress={() => {
                this.signInWithFacebook();
              }}>
              <Image source={Face} />
              <Text style={styles.face_google_text}>
                {i18n.t('CONTINUE_WITH')} Facebook
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.face_google_btn, { marginTop: 16 }]}
              onPress={() => this.handel()}>
              <Image source={Google} />
              <Text style={styles.face_google_text}>
                {i18n.t('CONTINUE_WITH')} Google
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {this._rendercountry()}
        {this.state.loading ? <Loading /> : null}
      </View>
    );
  }

  componentDidMount() {
    if (this.props.config.phone_code) {
      this.setState({
        code: this.props.config.phone_code,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.time);
  }
}

export const Login = connect(({ config, user }) => ({ config, user }))(LoginClass);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#FAFBFD',
  },
  back_btn: {
    width: 70,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 19,
  },
  cont: {
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  login_signup_text: {
    fontSize: 24,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    color: '#000000',
    lineHeight: 30,
  },
  login_account_text: {
    marginTop: 13,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#040404',
  },
  count_view: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 27,
    paddingRight: 18,
    marginTop: 40,
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
  country_btn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  country_text: {
    fontSize: 16,
    lineHeight: 20,
    color: '#aba9a9',
  },
  input_view: {
    marginTop: 16,
    width: '100%',
    height: 50,
    borderRadius: 12,
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
  input: {
    flex: 1,
    paddingLeft: 27,
    color: '#2C2929',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  err_view: {
    marginTop: 10,
    height: 10,
    width: '100%',
  },
  invalid_phone: {
    fontSize: 14,
    lineHeight: 14,
    color: '#FF0000',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  login_text: {
    marginTop: 10,
    lineHeight: 14,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 11,
    color: '#040404',
  },
  continue_view: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 10,
  },
  or_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  or_text: {
    marginHorizontal: 11,
    fontSize: 15,
    color: '#969798',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    lineHeight: 19,
  },
  line: {
    width: 45,
    height: 0,
    borderWidth: 0.5,
    borderColor: '#949597',
  },
  face_google_btn: {
    paddingLeft: 26,
    marginTop: 39,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 12,
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
  face_google_text: {
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    marginLeft: 30,
    fontSize: 16,
    lineHeight: 20,
  },
});
