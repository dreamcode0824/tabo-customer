import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Keyboard,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {
  Loading,
  ConfirmationCodeInput,
  AnimateLoadingButton
} from '../../components';
import i18n from "../../constants/i18next";
import API from '../../networking/api';

const width = Dimensions.get('window').width - 150;


export class Code extends Component {
  api = new API();

  constructor(props) {
    super(props);
    this.state = {
      pin: '',
      disabledConfirm: true,
      time: 180,
      disabl: true,
    };
  }

  handleChange = (pin) => {
    this.setState({
      pin: pin,
      disabledConfirm: true,
    });
    this.verifyCode(pin);
  };

  verifyCode(pin) {

    if (pin.length < 4) {
      return;
    }
    this.loadingButton.showLoading(true);
    this.setState({ loading: true });
    let info = {
      code: this.props.route.params.code,
      number: this.props.route.params.phone,
      pin: pin,
    };
    this.api.sms(info)
      .then(data => {
        // console.log(data, "----------->data")
        if (data.status === 404) {
          this.loadingButton.showLoading(false);
          this.setState({
            err: true,
            loading: false,
          });
        } else {
          if (this.props.route.params.reset) {
            this.setState({ loading: false });
            this.loadingButton.showLoading(false);
            this.props.navigation.navigate('EnterPassword', {
              phone: this.props.route.params.phone,
              code: this.props.route.params.code,
              reset: true,
            });
          } else {
            this.setState({ loading: false });
            this.loadingButton.showLoading(false);
            this.props.navigation.navigate('FinishSigningUp', {
              phone: `+${this.props.route.params.code}${this.props.route.params.phone}`,
            });
          }
        }
      })
      .catch(err => {
        this.setState({ loading: false });
        this.loadingButton.showLoading(false);
        console.log(err);
      });
  }

  resendTime() {
    this.time = setInterval(() => {
      if (this.state.time === 0) {
        return this.setState({
          disabl: false,
        });
      }
      this.setState({
        time: this.state.time - 1,
      });
    }, 1000);
  }

  resend() {
    this.loadingButton.showLoading(true);
    this.setState({ loading: true });
    let info = {
      code: this.state.this.props.route.params.code,
      number: this.props.route.params.phone,
    };
    this.api.login(info)
      .then(data => {
        this.loadingButton.showLoading(false);
        this.setState({ loading: false });
      })
      .catch(err => {
        this.loadingButton.showLoading(false);
        this.setState({ loading: false });
        console.log(err);
      });
  }

  render() {
    return (
      <View style={styles.content}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', flex: 1 }}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.verific_text}>{i18n.t('ENTER_VERIFICATEION_CODE')}</Text>
          <Text style={styles.code_phone_text}>{i18n.t('PLEASE_ENTER_VERIFICATION_CODE')}</Text>
          <Text
            style={[styles.code_phone_text, { marginTop: 2 }]}>+{this.props.route.params.code}{this.props.route.params.phone}</Text>
          <View style={styles.code_input_view}>
            <ConfirmationCodeInput
              ref="codeInputRef2"
              activeColor='black'
              inactiveColor='rgba(49, 180, 4, 1.3)'
              autoFocus={true}
              size={50}
              codeLength={4}
              onFulfill={(pin) => {
                this.handleChange(pin);
              }}
              codeInputStyle={styles.code_item}
              onCodeChange={(pin) => {
                this.setState({
                  pin: pin,
                  disabledConfirm: true,
                });
              }}
            />
          </View>
          <View style={styles.resend_view}>
            <Text style={styles.resend_text}>Didn’t get the code?</Text>
            <TouchableOpacity style={styles.resend_btn} onPress={() => {
              if (this.state.disabl) {
                Toast.show(`${i18n.t('RESEND_CODE')} ${this.state.time} ${i18n.t('SECONDS')}`);
              } else {

              }
            }}>
              <Text style={styles.resend_btn_text}>Resend</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.err_view}>
            {this.state.err && <Text style={styles.err_text}>{i18n.t('VERIFICATION_CODE_INCORRECT')}</Text>}
          </View>
          <View style={[styles.confirm_btn_view, { opacity: this.state.opacityContinue }]}>
            <AnimateLoadingButton
              ref={c => (this.loadingButton = c)}
              width={width}
              height={50}
              title={i18n.t('CONFITM_CODE_BTN')}
              titleFontFamily={Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium'}
              titleFontSize={16}
              titleColor="rgb(255,255,255)"
              backgroundColor="#6744f9"
              borderRadius={12}
              onPress={() => {
                this.verifyCode(this.state.pin);
              }}
            />
          </View>
        </ScrollView>
        {this.state.loading ? <Loading /> : null}
      </View>
    );
  }

  componentDidMount() {
    this.resendTime();
  }

  componentWillUnmount() {
    clearInterval(this.time);
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fafbfd',
    alignItems: 'center',
  },
  verific_text: {
    marginTop: 60,
    fontSize: 24,
    lineHeight: 30,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  code_phone_text: {
    marginTop: 22,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    color: '#000000',
  },
  code_input_view: {
    height: 100,
  },
  code_item: {
    fontSize: 25,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  resend_view: {
    flexDirection: 'row',
  },
  resend_text: {
    fontSize: 14,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    lineHeight: 17,
  },
  resend_btn: {
    marginLeft: 9,
  },
  resend_btn_text: {
    fontSize: 14,
    color: '#6844F9',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    lineHeight: 17,
  },
  err_view: {
    marginTop: 20,
    height: 10,
    width: '100%',
  },
  err_text: {
    fontSize: 14,
    lineHeight: 14,
    color: '#FF0000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  confirm_btn_view: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 50,
  },
  confirm_btn_text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
