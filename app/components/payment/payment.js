import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import Modal from 'react-native-modal'


class PaymentClass extends Component {
  constructor() {
    super();
    this.state = {};
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
        swipeDirection="down"
        backdropColor={'#6844F9'}
        backdropOpacity={1}
        style={{ margin: 0, marginTop: 50, borderTopRadius: 12 }}
        isVisible={this.props.isVisible}>
        <View style={styles.container}>
          <View style={styles.swipeItem} />
          <View style={styles.title_view}>
            <TouchableOpacity onPress={() => this.props.close()}>
              <Image source={require('../../assets/images/close.png')} style={styles.close_btn} />
            </TouchableOpacity>
            <Text style={styles.title_text}>Payment</Text>
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} showsVerticalScrollIndicator={false}>
            <View>
              <Text style={styles.place_text}>Place</Text>
              <View style={styles.business_view}>
                <Image source={require('../../assets/images/business-icon.png')}
                  style={{ width: 30, height: 30, }} />
                <View style={styles.business_info_view}>
                  <Text style={styles.business_name_text}>Vuela Vuela lomas</Text>
                  <Text style={styles.business_city_text}>Miami, Fl</Text>
                </View>
              </View>
              <View style={styles.edit_btn_view}>
                <Text style={styles.edit_text}>Details</Text>
                <TouchableOpacity>
                  <Text style={[styles.edit_text, { color: '#979797' }]}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.details_view}>
                <View style={styles.details_line_view}>
                  <View style={[styles.details_item_view, { width: '60%' }]}>
                    <Image source={require('../../assets/images/calendar-icon.png')}
                      style={{ width: 28, height: 28, }} />
                    <Text style={styles.details_item_text}>30 Sep 2020</Text>
                  </View>
                  <View style={styles.details_item_view}>
                    <Image source={require('../../assets/images/time-icon.png')}
                      style={{ width: 28, height: 28, }} />
                    <Text style={styles.details_item_text}>14:35</Text>
                  </View>
                </View>
                <View style={styles.details_line_view}>
                  <View style={[styles.details_item_view, { width: '60%', marginTop: 20, }]}>
                    <Image source={require('../../assets/images/child-icon.png')}
                      style={{ width: 28, height: 28, }} />
                    <Text style={styles.details_item_text}>2 Adults, 1 Children</Text>
                  </View>
                  <View style={[styles.details_item_view, { marginTop: 20, }]}>
                    <Image source={require('../../assets/images/business-type.png')}
                      style={{ width: 28, height: 28, }} />
                    <Text style={styles.details_item_text}>2 Sumbeds</Text>
                  </View>
                </View>
              </View>
              <View style={styles.edit_btn_view}>
                <Text style={styles.edit_text}>Payment Method</Text>
                <TouchableOpacity>
                  <Text style={[styles.edit_text, { color: '#979797' }]}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.card_view}>
                <Image source={require('../../assets/images/mastercard.png')} style={{ width: 34, height: 34, }} />
                <View style={styles.card_info_view}>
                  <Text style={styles.card_type_text}>Master Card</Text>
                  <Text style={styles.card_number_text}>**** 1514</Text>
                </View>
              </View>
            </View>
            <View style={styles.btn_view} >
              <TouchableOpacity style={styles.btn} disabled={this.state.disabl} onPress={() => this.props.next()}>
                <Text style={styles.btn_text}>Pay now</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

export const Payment = PaymentClass

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  swipeItem: {
    backgroundColor: '#B5B3BD',
    height: 3,
    width: 39,
    borderRadius: 1.5,
    alignSelf: 'center',
    marginTop: 15
  },
  title_view: {
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: 11,
    alignItems: 'center',
    paddingBottom: 10,
  },
  close_btn: {
    width: 32,
    height: 32
  },
  title_text: {
    color: '#000',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 'bold',
    marginLeft: 29,
  },
  place_text: {
    marginTop: 20,
    marginLeft: 16,
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  business_view: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    borderColor: '#F8F8F8',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 13,
    height: 83
  },
  business_info_view: {
    marginLeft: 16
  },
  business_name_text: {
    color: '#000',
    fontSize: 18,
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  business_city_text: {
    color: 'rgba(0, 0, 0, 0.49)',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  edit_btn_view: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16
  },
  edit_text: {
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  details_view: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    borderColor: '#F8F8F8',
    borderWidth: 1,
    paddingLeft: 13,
    height: 103,
    paddingVertical: 16,
  },
  details_line_view: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  details_item_view: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  details_item_text: {
    fontSize: 14,
    color: '#000',
    lineHeight: 23,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    marginLeft: 11
  },
  card_view: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    borderColor: '#F8F8F8',
    borderWidth: 1,
    paddingLeft: 13,
    height: 103,
    paddingVertical: 16,
  },
  card_info_view: {
    alignItems: 'center',
    marginLeft: 19
  },
  card_type_text: {
    color: '#000',
    fontSize: 14,
    lineHeight: 23,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',

  },
  card_number_text: {
    color: 'rgba(0, 0, 0, 0.49)',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',

  },
  btn_view: {
    marginTop: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingBottom: 24
  },
  btn: {
    backgroundColor: '#6844F9',
    borderRadius: 8,
    height: 40,
    width: 87,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn_text: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  }
});