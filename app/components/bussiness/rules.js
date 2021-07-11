import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  Platform, Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Back from '../../assets/images/back.png';
import { WebView } from 'react-native-webview';
import i18n from "../../constants/i18next";
import { DropDownBusiness } from "../../components"
import ApiGraphQl from '../../networking/apiGraphQl';
import API from '../../networking/api';
import AsyncStorage from '@react-native-community/async-storage'
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


class RulesClass extends Component {
  apigraphql = new ApiGraphQl();
  api = new API();
  canAnimate = true;
  offset = 0;

  constructor(props) {
    super(props);
    this.state = {
      curY: new Animated.Value(0),
      elevation: 0,
      ruleData: [],
      langItem: "romanian",
      langFlag: [],
    };
  }
  componentDidMount() {
    this.getLang();
  }
  getLang() {
    this.apigraphql.getRule(JSON.stringify([this.props.business_id]))
      .then((lang) => {
        if (lang) {
          this.setState({ ruleData: lang.data.business_rules })
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.apigraphql.getLanguages()
      .then((lang) => {
        if (lang) {
          if (lang.data.language.length > 0) {
            let arr = [];
            lang.data.language.map((item, index) => {
              if (index == 0) {
                this.setState({ langItem: item.long_name })
              }
              arr.push(item.long_name)
            })
            this.setState({ langFlag: arr })
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  headerBorder(offsetY) {
    if (offsetY > 0 && this.canAnimate) {
      this.canAnimate = false;
      this.setState({
        elevation: 5,
      });
    } else if (offsetY <= 0 && !this.canAnimate) {
      this.canAnimate = true;
      this.setState({
        elevation: 0,
      });
    }
  }

  render() {
    return (
      <Modal
        onSwipeComplete={() => {
          this.props.close();
        }}
        onBackButtonPress={() => {
          this.props.close();
        }}
        testID={'modal'}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        animationInTiming={500}
        backdropColor={'rgb(255,255,255,0)'}
        backdropOpacity={1}
        style={{ margin: 0, marginTop: 0 }}
        isVisible={this.props.isVisible}>
        <View style={styles.content}>
          <Animated.View style={[styles.headerRow, {
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: this.state.elevation,
          }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.back_btn}
              onPress={() => this.props.close()}>
              <Image
                style={styles.backIcon}
                source={Back} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {i18n.t('RULES')}
            </Text>
          </Animated.View>
          {/* <View style={[{ marginLeft: 16, marginTop: 20 }]}>
            <DropDownBusiness
              data={this.state.langFlag}
              handleChange={(index) => {
                this.setState({
                  langItem: this.state.langFlag[index],
                });
              }}
              title={this.state.langItem}
            />
          </View> */}
          {this.state.ruleData.length > 0 && (
            <View style={styles.ruleLayout}>
              {this.props.currentLanguage === "ro" && (
                <Text>
                  {this.state.ruleData[0].rules.ro}
                </Text>
              )}
              {this.props.currentLanguage === "en" && (
                <Text>
                  {this.state.ruleData[0].rules.en}
                </Text>
              )}
              {this.props.currentLanguage === "it" && (
                <Text>
                  {this.state.ruleData[0].rules.it}
                </Text>
              )}
              {this.props.currentLanguage === "es" && (
                <Text>
                  {this.state.ruleData[0].rules.es}
                </Text>
              )}
              {this.props.currentLanguage === "fr" && (
                <Text>
                  {this.state.ruleData[0].rules.fr}
                </Text>
              )}
              {this.props.currentLanguage === "el" && (
                <Text>
                  {this.state.ruleData[0].rules.el}
                </Text>
              )}
            </View>
          )}
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            contentContainerStyle={{ marginTop: this.state.height }}
            onScroll={Animated.event(
              [{
                nativeEvent: { contentOffset: { y: this.state.curY } },
              }],
              {
                useNativeDriver: false,
                listener: event => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  this.headerBorder(offsetY);
                },
              },
            )}
          >
          </Animated.ScrollView>
        </View>
      </Modal>
    );
  }
}

export const Rules = connect()(RulesClass);
// export const Languages = connect(({ config }) => ({ config }))(RulesClass)

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  backButtonContainer: {
    height: 28,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  back_btn: {
    width: 53,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backIcon: {
    resizeMode: 'contain',
    height: 16,
    width: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  headerTitle: {
    color: 'black',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 18,
    lineHeight: 22,
  },
  rules_view: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  rules_text: {
    width: width,
    height: height,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    fontSize: 12,
    lineHeight: 16,
    color: '#898989',
  },
  ruleLayout: {
    padding: 20,
  }
});
