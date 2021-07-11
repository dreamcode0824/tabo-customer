import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import ApiGraphQl from '../../networking/apiGraphQl';
import i18n from '../../constants/i18next';

class ProfileClass extends Component {
  canAnimate = true;
  offset = 0;
  apigraphql = new ApiGraphQl();
  constructor(props) {
    super(props);
    this.state = {
      curY: new Animated.Value(0),
      border: 0,
      avatarSource:
        'https://www.pinclipart.com/picdir/middle/157-1578186_user-profile-default-image-png-clipart.png',
    };
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

  removeValue = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (e) {
      // remove error
    }
  };

  render() {
    return (
      <View style={styles.content}>
        <View
          style={{
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: this.state.elevation,
          }}>
          <Text style={styles.headerText}>{i18n.t('PROFILE')}</Text>
        </View>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          contentContainerStyle={{ marginHorizontal: 16 }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: this.state.curY } },
              },
            ],
            {
              useNativeDriver: false,
              listener: (event) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                this.headerBorder(offsetY);
              },
            },
          )}>
          <View style={styles.photoRow}>
            <View style={styles.photoContainer}>
              <Image
                style={styles.photo}
                source={
                  this.props.user.photo
                    ? { uri: this.props.user.photo }
                    : require('../../assets/images/avatar.png')
                }
              />
            </View>
            <View>
              <Text style={styles.nameText}>
                {this.props.user.first_name} {this.props.user.last_name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ShowProfile');
                }}
                activeOpacity={0.8}>
                <Text style={styles.showText}>
                  {i18n.t('SHOW_PROFILE_BTN')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.categoryText}>{i18n.t('ACCOUNT_SETTINGS')}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.routeItem}
            onPress={() =>
              this.props.navigation.navigate('PersonalInformation')
            }>
            <View style={styles.itemRow}>
              <Image
                source={require('../../assets/images/profileIcon1.png')}
                style={{ height: 26, width: 26 }}
              />
              <Text style={styles.itemText}>
                {i18n.t('PERSONAL_INFORMATION')}
              </Text>
            </View>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            activeOpacity={0.8}
            style={styles.routeItem}>
            <View style={styles.itemRow}>
              <Image
                source={require('../../assets/images/profileIcon2.png')}
                style={{ height: 26, width: 26 }}
              />
              <Text style={styles.itemText}>{i18n.t('PAYMENTS_PAYOUTS')}</Text>
            </View>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Notifications');
            }}
            activeOpacity={0.8}
            style={styles.routeItem}>
            <View style={styles.itemRow}>
              <Image
                source={require('../../assets/images/profileIcon3.png')}
                style={{ height: 26, width: 26 }}
              />
              <Text style={styles.itemText}>{i18n.t('NOTIFICATIONS')}</Text>
            </View>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Languages');
            }}
            activeOpacity={0.8}
            style={styles.routeItem}>
            <View style={styles.itemRow}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/images/plane.png')}
                  style={{ height: 15.31, width: 15.31 }}
                />
              </View>
              <Text style={styles.itemText}>{i18n.t('LANGUAGE')}</Text>
            </View>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <Text style={styles.categoryText}>{i18n.t('SUPPORT')}</Text>
          <TouchableOpacity
            onPress={() => { }}
            activeOpacity={0.8}
            style={styles.routeItem}>
            <View style={styles.itemRow}>
              <Image
                source={require('../../assets/images/profileIcon4.png')}
                style={{ height: 26, width: 26 }}
              />
              <Text style={styles.itemText}>{i18n.t('ABOUT_US')}</Text>
            </View>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            activeOpacity={0.8}
            style={styles.routeItem}>
            <View style={styles.itemRow}>
              <Image
                source={require('../../assets/images/profileIcon5.png')}
                style={{ height: 26, width: 26 }}
              />
              <Text style={styles.itemText}>{i18n.t('HOW_TABO_WORKS')}</Text>
            </View>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            activeOpacity={0.8}
            style={styles.routeItem}>
            <View style={styles.itemRow}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/images/profileIcon6.png')}
                  style={{ height: 15, width: 15 }}
                />
              </View>
              <Text style={styles.itemText}>{i18n.t('SUPPORT')}</Text>
            </View>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            activeOpacity={0.8}
            style={styles.routeItem}>
            <View style={styles.itemRow}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/images/profileIcon7.png')}
                  style={{ height: 15, width: 15 }}
                />
              </View>
              <Text style={styles.itemText}>{i18n.t('GIVE_FEEDBACK')}</Text>
            </View>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <Text style={styles.categoryText}>{i18n.t('LEGAL')}</Text>
          <TouchableOpacity
            onPress={() => { }}
            activeOpacity={0.8}
            style={styles.routeItem}>
            <Text style={[styles.itemText, { marginLeft: 0 }]}>
              {i18n.t('TERMS_SERVICE')}
            </Text>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { }}
            activeOpacity={0.8}
            style={styles.routeItem}>
            <Text style={[styles.itemText, { marginLeft: 0 }]}>
              {i18n.t('COMPANY_POLICY')}
            </Text>
            <Image
              source={require('../../assets/images/itemArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              this.removeValue();
              this.props.dispatch({
                type: 'SET_USER',
                value: {},
              });
              this.props.dispatch({
                type: 'SET_USER_LOGGED_OUT',
              });
              AsyncStorage.setItem('loggedIn', JSON.stringify(false));

              this.props.navigation.replace('Splash');
            }}>
            <Text style={[styles.showText, { marginTop: 24 }]}>
              {i18n.t('LOG_OUT')}
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.categoryText,
              {
                marginTop: 30,
                marginBottom: 50,
              },
            ]}>
            VERSION 20.12
          </Text>
        </Animated.ScrollView>
      </View>
    );
  }
}

export const Profile = connect(({ user, config }) => ({ user, config }))(
  ProfileClass,
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    marginLeft: 16,
    fontSize: 24,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    lineHeight: 30,
    color: '#000',
    marginTop: 20,
    marginBottom: 16,
  },
  photoRow: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderBottomColor: 'rgba(151, 151, 151, 0.13)',
    borderBottomWidth: 1,
    paddingBottom: 20,
    borderRadius: 44.5,
  },
  photoContainer: {
    backgroundColor: '#fff',
    height: 89,
    width: 89,
    marginRight: 23,
    borderRadius: 44.5,
  },
  photo: {
    overlayColor: 'white',
    backgroundColor: '#fff',
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    borderRadius: 44.5,
  },
  nameText: {
    color: '#000',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 17,
    lineHeight: 18,
  },
  showText: {
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    color: '#6844F9',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  categoryText: {
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    color: '#B5B3BD',
    fontSize: 11,
    lineHeight: 12,
    marginTop: 20,
    paddingBottom: 20,
  },
  routeItem: {
    height: 53,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(151, 151, 151, 0.13)',
    borderBottomWidth: 1,
    paddingTop: 11,
    paddingBottom: 16,
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    color: '#000',
    fontSize: 15,
    lineHeight: 16,
    marginLeft: 15,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  arrowIcon: {
    width: 8,
    height: 14,
  },
  iconContainer: {
    height: 26,
    width: 26,
    backgroundColor: 'rgba(181, 179, 189, 0.2)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
