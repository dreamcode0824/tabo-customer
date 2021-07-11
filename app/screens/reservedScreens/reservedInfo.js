import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Animated, Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import Share from 'react-native-share';
import MapView, { Marker } from 'react-native-maps';
import ApiGraphQl from '../../networking/apiGraphQl';
import Api from '../../networking/api';
import Carousel from '../../components/carousel/carousel';
import {
  BookCalendar,
  Comming,
  Time,
  ImageZoomModal,
  Reviews,
  Menu,
  LikeBusiness,
  AddReview,
  Map,
  TermsConditions,
  ListTouchable
} from '../../components';
import moment from 'moment';
import i18n from "../../constants/i18next";
import { result } from 'lodash';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const imgHeight = Dimensions.get('window').width;

class ReservedInfoClass extends Component {

  canLike = true

  apigraphql = new ApiGraphQl();
  api = new Api();
  constructor(props) {
    super(props);
    this.state = {
      business: props.route.params.reservation.business,
      likeId: props.route.params.reservation.business.likeId,
      termsConditionsVisible: false,
      reservationInfo: {},
      facilities: [],
      mapVisible: false,
      addReviewsVisible: false,
      facilitiesShow: false,
      cabana: false,
      bed: false,
      baldaquin: false,
      sunbed: false,
      umbrella: false,
      zoomVisible: false,
      bookCalendarVisible: false,
      commingVisible: false,
      timeVisible: false,
      reviewsVisible: false,
      menuVisible: false,
      rulesVisible: false,
      question1: false,
      question2: false,
      like: false,
      landscape: false,
      seat: '',
      reviews: [],
      height: new Animated.Value(0),
      opacity: new Animated.Value(0),
      opacityBtn: new Animated.Value(1),
      activeSlide: 0,
      img: [],
      quantity: ['1', '2', '3', '4'],
      quantityItem: '1',
      size: ['1', '2', '3', '4'],
      sizeItem: '1',
      menuCategories: [],
      menuItems: [],
      terms: `<p></p>`,
      qrCodeData: ""
    };
    this.state.like = this.props.route.params.reservation.business.like
    this.getReservefInfo();
    this.getFacilities();
    this.getReview();
    this.getMenuCategories();
    this.getMenuItems();
    this.getTerms()
  }

  componentDidMount() {
    if (this.props) {
      this.getQrCode(this.props.route.params.reservation.id)
    }
    this.getOrientation();
    Dimensions.addEventListener(
      'change',
      this.getOrientation,
    );
    let arr = [];
    this.state.img.map(data => {
      arr.push({
        props: {
          source: data,
        },
      });
    });
    this.setState({ zoomImg: arr });
  }

  getTerms() {
    this.apigraphql.getRulesTermsBusiness(this.props.route.params.reservation.business.id)
      .then(rulesTerms => {
        this.setState({
          terms: rulesTerms.data.business[0].terms_and_conditions ? rulesTerms.data.business[0].terms_and_conditions.terms : `<p></p>`,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  getQrCode(id) {
    this.api.getQrCodeApi(id)
      .then(result => {
        if (result.data.data.length > 0) {
          this.setState({ qrCodeData: result.data.data })
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  likeChange() {
    if (!this.canLike) {
      return
    }

    this.canLike = false

    if (!this.state.like) {
      this.apigraphql.setLike({
        customer_id: this.props.user.id,
        business_id: this.state.business.id,
      })
        .then(like => {
          this.props.route.params.like(this.props.route.params.index);
          this.setState({
            like: true,
            likeId: like.data.customer_liked_businessCreate.id,
          }, () => {
            this.canLike = true
          }
          );
        })
        .catch(err => {
          console.log(err);
          this.canLike = true
        });
    }
    if (this.state.like) {
      this.apigraphql.deleteLikeSaved(this.state.business.id)
        .then(data => {
          this.props.route.params.like(this.props.route.params.index);
          this.setState({
            like: false,
          }, () => {
            this.canLike = true
          });
        })
        .catch(err => {
          console.log(err);
          this.canLike = true
        });
    }
  }

  zoom = () => {
    let arr = [];
    this.props.route.params.reservation.images.map(data => {
      arr.push({
        url: data,
      });
    });
    this.setState({
      zoomVisible: true,
      zoomImg: arr,
    });
  };

  getMenuItems() {
    this.apigraphql.getMenuItems(this.props.route.params.reservation.business.id)
      .then(menuItems => {
        this.setState({
          menuItems: menuItems.data.beach_menu_item,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getMenuCategories() {
    this.apigraphql.getMenuCategories(this.props.route.params.reservation.business.id)
      .then(menuCategories => {
        this.setState({
          menuCategories: menuCategories.data.beach_menu_category,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getFacilities() {
    this.apigraphql.getFacilities(this.props.route.params.reservation.business.id)
      .then(data => {
        this.setState({
          facilities: data.data.business_facilities,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getReservefInfo() {
    this.apigraphql.getReservedInfo(this.props.route.params.reservation.id)
      .then(data => {
        this.setState({
          reservationInfo: data.data.reservation[0],
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getReview() {
    this.apigraphql.getReview(this.props.route.params.reservation.business.id)
      .then(review => {
        this.setState({
          reviews: review.data.review,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener(
      'change',
      this.getOrientation,
    );
    clearTimeout(this.time);
  }

  handleChange = (e, name) => {
    this.setState({
      [name]: e,
    });
  };

  changeSeat(name, seatChoose) {
    this.setState({
      [name]: true,
      [seatChoose]: false,
      seat: name,
    });
  }

  capitalize = (s) => {
    if (typeof s !== 'string') {
      return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  _renderBookingInformation() {
    return this.state.reservationInfo.start_date ? (<View>
      <Text style={styles.location_text}>{i18n.t('BOOKING_INFOTMATION')}</Text>
      <View style={[styles.facilities_view, { marginRight: 0 }]}>

        <View style={styles.facilities_item_view}>
          <View style={styles.bookIconContainer}>
            <Image
              source={require('../../assets/images/calendar2.png')}
              style={styles.bookIcon} />
          </View>
          <Text
            style={styles.facilities_item_text}>
            {/* {moment(this.state.reservationInfo.start_date).format('DD.MM.YY')}{'\n'}
                        {moment(this.state.reservationInfo.start_date).format('DD.MM.YY')} */}
          </Text>
        </View>
        <View style={styles.facilities_item_view}>
          <View style={styles.bookIconContainer}>
            <Image
              source={require('../../assets/images/clock.png')}
              style={styles.bookIcon} />
          </View>
          {/* <Text style={styles.facilities_item_text}>{moment(this.state.reservationInfo.start_date).format('hh:mm')}</Text> */}
        </View>
      </View>
      <View style={[styles.facilities_view, { marginRight: 0 }]}>
        <View style={styles.facilities_item_view}>
          <View style={styles.bookIconContainer}>
            <Image
              source={require('../../assets/images/sunbed2.png')}
              style={styles.bookIcon} />
          </View>
          <Text style={styles.facilities_item_text}>
            {this.capitalize(this.state.reservationInfo.element.type)} (size {this.state.reservationInfo.element.structure.size}) x{this.state.reservationInfo.element_quantity}
          </Text>
        </View>
      </View>
    </View>) : null
  }

  _renderfacilities() {
    return this.state.facilities.map((data, index) => {
      if (data.facility.name === 'blue_flag') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/wave.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('BLUE_FLAG')}</Text>
          </View>
        );
      }
      if (data.facility.name === 'restoran') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/restoran.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('RESTAURANT')}</Text>
          </View>
        );
      }
      if (data.facility.name === 'ski_jet') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/motor.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('SKI_JET')}</Text>
          </View>
        );
      }
      if (data.facility.name === 'bar') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/coffee-cup.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('BAR')}</Text>
          </View>
        );
      }
      if (data.facility.name === 'kids') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/child.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('KIDS')}</Text>
          </View>
        );
      }
      if (data.facility.name === 'shower') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/shower.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('SHOWER')}</Text>
          </View>
        );
      }
      if (data.facility.name === 'massage') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/massage.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('MASSAGE')}</Text>
          </View>
        );
      }

      if (data.facility.name === 'games') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/games.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('GAMES')}</Text>
          </View>
        );
      }
      if (data.facility.name === 'card') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/credit-card.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('CREDIT_CARD')}</Text>
          </View>
        );
      }
      if (data.facility.name === 'wifi') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/wi-fi.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('WIFI')}</Text>
          </View>
        );
      }

    });
  }

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({ landscape: false });
    } else {
      this.setState({ landscape: true });
    }
  };

  get pagination() {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          position: 'absolute',
          width: '100%',
          top: 170,
          backgroundColor: 'rgba(0, 0, 0, 0)',
        }}
        dotStyle={{
          width: 10,
          height: 10,
          marginLeft: -18,
          borderRadius: 50,
          backgroundColor: '#fff',
        }}
        inactiveDotStyle={{
          width: 15,
          height: 15,
          borderRadius: 50,
          marginLeft: -18,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  time(date) {
    let now = new Date();
    let then = date;
    let min = moment(now, 'YYYY-MM-DD HH:mm:ss').diff(moment(then, 'YYYY-MM-DD HH:mm:ss'), 'minutes');
    if (min <= 60) {
      return <Text>{min} min</Text>;
    } else {
      let hours = moment(now, 'YYYY-MM-DD HH:mm:ss').diff(moment(then, 'YYYY-MM-DD HH:mm:ss'), 'hours');
      if (hours <= 24) {
        return <Text>{hours} hours</Text>;
      } else {
        let day = moment(now, 'YYYY-MM-DD HH:mm:ss').diff(moment(then, 'YYYY-MM-DD HH:mm:ss'), 'day');
        if (day <= 30) {
          return <Text>{day} days</Text>;
        } else {
          let month = moment(now, 'YYYY-MM-DD HH:mm:ss').diff(moment(then, 'YYYY-MM-DD HH:mm:ss'), 'month');
          if (month <= 12) {
            return <Text>{month} months</Text>;
          } else {
            let year = moment(now, 'YYYY-MM-DD HH:mm:ss').diff(moment(then, 'YYYY-MM-DD HH:mm:ss'), 'year');
            return <Text>{year} years</Text>;
          }
        }
      }
    }
  }

  _renderReviews() {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      >
        <View style={styles.reviews_view}>
          {this.state.reviews.map((data, index) => {
            return (
              <View key={index} style={styles.review_item_view}>
                <View style={styles.reviews_info}>
                  <View style={styles.reviews_info_view}>
                    {data.customer.photo ?
                      <Image
                        source={{ uri: data.customer.photo }}
                        style={{
                          width: 26,
                          height: 26,
                          overlayColor: 'white',
                          borderRadius: 13
                        }}
                      />
                      :
                      <View style={styles.avatar_view}>
                        <Text style={styles.avatar_text}>{data.customer.last_name[0]}</Text>
                      </View>
                    }
                    <View>
                      <Text style={styles.reviews_info_name_text}
                        numberOfLines={1}>{data.customer.first_name}</Text>
                      <Text
                        style={styles.reviews_info_time_text}>{this.time(data.created_at)}</Text>
                    </View>
                  </View>
                  <View style={[styles.ratingRow, { marginLeft: 25 }]}>
                    <Image
                      source={require('../../assets/images/star.png')}
                      style={styles.star} />
                    <Text style={styles.ratingText}>{data.rate}</Text>
                  </View>
                </View>
                <Text style={styles.reviews_info_text}>{data.review}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  share() {
    const shareOptions = {
      title: 'text',
      //url: pdfBase64,
    };

    Share.open(shareOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  render() {
    console.log(this.props.route.params.reservation.business.settings, "******************")
    return (
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.sliderContainer}>
            <View>
              <Carousel
                data={this.props.route.params.reservation.images}
                style={'full'}
                zoom={this.zoom} />
            </View>
            <TouchableOpacity style={styles.icon_btn} onPress={() => {
              this.share()
            }}>
              <Image source={require('../../assets/images/icon.png')} style={{ width: 17.1, height: 17 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.close_btn} onPress={() => this.props.navigation.goBack()}>
              <Image source={require('../../assets/images/close_icon.png')}
                style={{ width: 15, height: 15 }} />
            </TouchableOpacity>
            <LikeBusiness
              business={true}
              active={this.state.like}
              setActive={() => {
                this.likeChange();
              }}
            />
          </View>
          <View style={[styles.ratingRow, { marginTop: 10 }]}>
            <Image
              source={require('../../assets/images/star.png')}
              style={styles.star} />
            <Text style={styles.ratingText}>{this.props.route.params.reservation.business.avg_rate}</Text>
          </View>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.itemText}>
                {this.props.route.params.reservation.business.location_name}
              </Text>
              <Text style={styles.priceText}>
                {this.props.route.params.reservation.old_amount} {this.props.route.params.reservation.currency}
              </Text>
            </View>
            <View style={styles.bookContainer}>
              <Text style={styles.bookText}>
                {this.props.route.params.reservation.reservation_status == "paid_online" ? `${i18n.t('PAID')}`.toUpperCase() : this.props.route.params.reservation.reservation_status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.line_text} />
          {/* {this._renderBookingInformation()} */}
          <Text style={styles.line_text} />
          <Text style={styles.location_text}>{i18n.t('LOCATION')}</Text>
          <Text
            style={styles.nearby_text}>{this.props.route.params.reservation.business.settings.beach_location_country}, {this.props.route.params.reservation.business.settings.beach_location_city}</Text>
          <ListTouchable style={{ height: 180, paddingHorizontal: 16, paddingVertical: 16, marginTop: 4 }}
            onPress={() => this.setState({ mapVisible: true })}>
            <MapView
              style={{ width: '100%', height: '100%' }}
              mapType={'terrain'}
              region={{
                // latitude: Number(this.props.route.params.reservation.business.location.latitude),
                // longitude: Number(this.props.route.params.reservation.business.location.longitude),
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  // latitude: Number(this.props.route.params.reservation.business.location.latitude),
                  // longitude: Number(this.props.route.params.reservation.business.location.longitude),
                  latitude: 0,
                  longitude: 0
                }}

              />
            </MapView>
          </ListTouchable>
          <View style={[styles.line_text, { marginTop: 0 }]} />
          <ListTouchable style={styles.rules_view} onPress={() => this.setState({ menuVisible: true })}>
            <View>
              <Text style={styles.rules_text}>{i18n.t('BEACH_MENU')}</Text>
              <Text style={styles.rules_info_text}>{i18n.t('BEACH_MENU_DESCRIPTION')}</Text>
            </View>
            <View>
              <Image source={require('../../assets/images/next.png')} style={styles.next_img} />
            </View>
          </ListTouchable>
          {(this.state.qrCodeData.length > 0 && this.props.route.params.reservation.reservation_status == "occupied") && (
            <Text style={{ paddingLeft: 20, fontWeight: 'bold' }}>{i18n.t('Qr_code_validated')}</Text>
          )}
          {(this.state.qrCodeData.length > 0 && this.props.route.params.reservation.reservation_status == "paid_online") && (
            <Text style={{ paddingLeft: 20, fontWeight: 'bold' }}>{i18n.t('Qr_code_not_validated')}</Text>
          )}
          {this.state.qrCodeData.length > 0 && (
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <Image
                style={{ width: 200, height: 200 }}
                source={{
                  uri:
                    `${this.state.qrCodeData}`
                }}
              />
            </View>
          )}
          <Text style={[styles.line_text, { marginTop: 0 }]} />
          <View style={styles.facilities}>
            {this._renderfacilities()}
          </View>
          <View style={[styles.line_text, { marginTop: 0 }]} />
          <ListTouchable style={styles.terms_view}
            onPress={() => this.setState({ termsConditionsVisible: true })}>
            <View>
              <Text style={styles.terms_text}>{i18n.t('TERMS_CONDITIONS')}</Text>
              <Text style={styles.terms_info_text}>{i18n.t('TERMS_CONDITIONS_DESCRIPTION1')} <Text
                style={[styles.terms_info_text, {
                  fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
                  color: '#000',
                }]}>{i18n.t('TERMS_CONDITIONS_DESCRIPTION2')}</Text> {i18n.t('AND')}{'\n'}<Text
                  style={[styles.terms_info_text, {
                    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
                    color: '#000',
                  }]}>{i18n.t('TERMS_CONDITIONS_DESCRIPTION3')}</Text>
              </Text>
            </View>
            <Image source={require('../../assets/images/next.png')} style={styles.next_img} />
          </ListTouchable>
          <Text style={[styles.line_text, { marginTop: 0 }]} />
          {this.state.reviews.length ?
            <View>
              <Text style={styles.reviews_text}>{i18n.t('REVIEWS')}</Text>
              {this._renderReviews()}
              {this.state.reviews.length >= 5 ? <ListTouchable style={styles.more_btn} onPress={() => this.setState({ reviewsVisible: true })}>
                <Text style={styles.more_btn_text}>{i18n.t('SHOW_ALL_REVIEWS_BTN')}</Text>
              </ListTouchable> : null}
            </View>
            : null}

          <ListTouchable style={styles.more_btn} onPress={() => this.setState({ addReviewsVisible: true })}>
            <Text style={styles.more_btn_text}>{i18n.t('ADD_REVIEWS_BTN')}</Text>
          </ListTouchable>
        </ScrollView>
        <View style={styles.reserve_view}>
          <Text style={styles.price_text}><Text style={[styles.price_text, {
            color: '#000',
            fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
            fontSize: 16,
          }]}>{this.props.route.params.reservation.old_amount} {this.props.route.params.reservation.currency} </Text></Text>
          <TouchableOpacity style={styles.reserve_btn}>
            <Text style={styles.reserve_btn_text}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <BookCalendar
          close={() => {
            this.setState({ bookCalendarVisible: false });
          }}
          next={() => {
            this.setState({ bookCalendarVisible: false, commingVisible: true });
          }}
          skip={() => {
            this.setState({ bookCalendarVisible: false, commingVisible: true });
          }}
          isVisible={this.state.bookCalendarVisible}
        />
        <Comming
          close={() => {
            this.setState({ commingVisible: false });
          }}
          next={() => {
            this.setState({ commingVisible: false, timeVisible: true });
          }}
          skip={() => {
            this.setState({ commingVisible: false, timeVisible: true });
          }}
          navigation={this.props.navigation}
          isVisible={this.state.commingVisible}
        />
        <Time
          close={() => {
            this.setState({ timeVisible: false });
          }}
          next={() => {
            this.setState({ timeVisible: false });
          }}
          skip={() => {
            this.setState({ timeVisible: false });
          }}
          isVisible={this.state.timeVisible}
        />
        <ImageZoomModal
          close={() => {
            this.setState({ zoomVisible: false });
          }}
          zoomImg={this.state.zoomImg}
          isVisible={this.state.zoomVisible}
        />
        <Reviews
          close={() => {
            this.setState({ reviewsVisible: false });
          }}
          reviews={this.state.reviews}
          rate={this.state.business.avg_rate}
          isVisible={this.state.reviewsVisible}
        />
        <AddReview
          close={() => {
            this.setState({ addReviewsVisible: false });
          }}
          business_id={this.props.route.params.reservation.business.id}
          customer_id={this.props.user.id}
          isVisible={this.state.addReviewsVisible}
        />
        <Menu
          close={() => {
            this.setState({ menuVisible: false });
          }}
          isVisible={this.state.menuVisible}
          menuItems={this.state.menuItems}
          menuCategories={this.state.menuCategories}
        />
        <Map
          close={() => {
            this.setState({ mapVisible: false });
          }}
          location={this.props.route.params.reservation.business.location}
          isVisible={this.state.mapVisible}
        />
        <TermsConditions
          close={() => {
            this.setState({ termsConditionsVisible: false });
          }}
          terms={this.state.terms}
          isVisible={this.state.termsConditionsVisible}
        />
      </View>
    );
  }
}

export const ReservedInfo = connect(({ user, config }) => ({ user, config }))(ReservedInfoClass);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  sliderContainer: {
    height: imgHeight * 9 / 16,
  },
  item: {
    height: imgHeight * 9 / 16,
  },
  imageContainer: {
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    backgroundColor: 'white',
    borderRadius: 8,
    height: imgHeight * 9 / 16,
  },
  image: {
    resizeMode: 'cover',
  },
  icon_btn: {
    height: 35,
    width: 35,
    backgroundColor: '#fff',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 61,
    top: 19,
  },
  heart_icon_btn: {
    position: 'absolute',
    right: 16,
    top: 19,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 50,
  },
  close_btn: {
    position: 'absolute',
    left: 10,
    top: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
    width: 35,
    height: 35,
  },
  categoryText: {
    fontSize: 10,
    lineHeight: 12,
    color: 'black',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  img: {
    width: '100%',
    height: 238,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 7,
  },
  star: {
    height: 12,
    width: 12,
  },
  ratingText: {
    color: '#060606',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    marginLeft: 5,
  },
  itemText: {
    color: 'black',
    fontSize: 16,
    lineHeight: 18,
    marginLeft: 16,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  priceText: {
    color: 'black',
    fontSize: 14,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginLeft: 16,
    marginTop: 4,
  },
  line_text: {
    marginHorizontal: 16,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(151, 151, 151, 0.13)',
  },
  facilities: {
    marginBottom: 20,
    marginLeft: 16,
    marginRight: 70,
    marginTop: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facilities_title_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  facilities_text: {
    marginLeft: 16,
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  text1: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 7,
    fontSize: 10,
    lineHeight: 14,
    color: '#898989',
  },
  down_img_view: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  down_img: {
    width: 14,
    height: 7.54,
  },
  facilities_view: {
    marginLeft: 16,
    marginRight: '10%',
    marginTop: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facilities_img: {
    width: 14,
    height: 14,
  },
  facilities_item_view: {
    marginTop: 15,
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilities_item_text: {
    marginLeft: 16,
    fontSize: 12,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  location_text: {
    marginLeft: 16,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    color: '#000',
  },
  reserve_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 90,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  price_text: {
    color: '#898989',
    fontSize: 12,
  },
  reserve_btn: {
    width: 108,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 8,
  },
  reserve_btn_text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  map_img: {
    marginTop: 20,
    width: '100%',
    marginHorizontal: 16,
  },
  nearby_text: {
    marginLeft: 16,
    marginTop: 15,
    fontSize: 12,
    lineHeight: 19,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  more_btn: {
    height: 44,
    marginHorizontal: 16,
    borderRadius: 5,
    borderColor: 'rgba(104, 68, 249, 0.03)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  more_btn_text: {
    color: '#2C2929',
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  rules_view: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rules_text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  rules_info_text: {
    marginTop: 7,
    fontSize: 10,
    lineHeight: 14,
    color: '#898989',
  },
  next_img: {
    height: 14,
    width: 7.54,
  },
  ofer_img_view: {
    alignItems: 'center',
  },
  seat_view: {
    marginLeft: 16,
  },
  seat_text: {
    fontSize: 12,
    lineHeight: 19,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  seat_item_view: {
    flexDirection: 'row',
    marginTop: 20,
  },
  seat_item_checkbox: {
    marginTop: 5,
    width: 15,
    height: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#979797',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seat_item_checkbox_text: {
    width: 7.5,
    height: 7.5,
    borderRadius: 50,
  },
  seat_item_info_view: {
    marginLeft: 10,
  },
  seat_title_item_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seat_img: {
    width: 15,
    height: 15,
  },
  seat_caban_img: {
    width: 19,
    height: 14,
  },
  seat_item_title_text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginLeft: 4,
  },
  seat_item_info_text: {
    fontSize: 10,
    lineHeight: 14,
    color: '#898989',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    marginTop: 6,
  },
  select_title: {
    marginLeft: 26,
    marginTop: 12,
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 12,
    lineHeight: 17,
  },
  select_text: {
    color: '#2C2929',
    fontSize: 12,
    lineHeight: 15,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  select_quantity_text: {
    marginLeft: 16,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 14,
    lineHeight: 20,
  },
  select_quantity_info: {
    marginLeft: 16,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    fontSize: 10,
    lineHeight: 14,
    color: '#898989',
    marginTop: 7,
  },
  questions_view: {
    marginLeft: 25,
    marginTop: 20,
  },
  questions_text: {
    color: '#000',
    fontSize: 12,
    lineHeight: 17,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  questions_btn_view: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',

  },
  like_row_no_yes_btn: {
    marginRight: 12,
    width: 53,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(181, 179, 189, 0.25)',
  },
  like_row_no_yes_text: {
    color: 'rgba(44, 41, 41, 0.37)',
    lineHeight: 15,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  terms_view: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  terms_text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  terms_info_text: {
    marginTop: 7,
    fontSize: 10,
    lineHeight: 14,
    color: '#898989',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  reviews_text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginLeft: 16,
  },
  reviews_view: {
    flexDirection: 'row',
    marginTop: 20,
    paddingBottom: 20,
  },
  review_item_view: {
    marginLeft: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
  reviews_info: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  reviews_info_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviews_item_avatar_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 17,
  },
  avatar_view: {
    backgroundColor: '#6844F9',
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  reviews_info_name_text: {
    fontSize: 10,
    lineHeight: 14,
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginLeft: 8,
  },
  avatar_text: {
    color: '#fff',
  },
  reviews_info_time_text: {
    fontSize: 8,
    lineHeight: 10,
    color: '#B5B3BD',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginLeft: 8,
  },
  reviews_info_text: {
    marginBottom: 29,
    marginLeft: 8,
    marginTop: 10,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  related_text: {
    marginLeft: 16,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 14,
    lineHeight: 20,
  },
  related_view: {
    paddingLeft: 6,
  },
  related_item_view: {
    marginLeft: 10,
  },
  related_img: {
    width: 137,
    height: 91,
    borderRadius: 8,
  },
  related_type_view: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  related_type_text: {
    fontSize: 8,
    lineHeight: 10,
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  related_info_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  related_name_text: {
    color: '#000',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  related_rating_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img_star: {
    width: 9.7,
    height: 9.7,
  },
  related_rating_text: {
    marginLeft: 5,
    color: '#060606',
    fontSize: 8,
    lineHeight: 10,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  related_price_text: {
    marginLeft: 5,
    color: '#060606',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  related_ticket_text: {
    color: '#898989',
    fontSize: 8,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookContainer: {
    marginRight: 18,
    height: 20,
    paddingHorizontal: 7,
    backgroundColor: '#6844F9',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookText: {
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 10,
    lineHeight: 12,
  },
  bookIconContainer: {
    height: 26,
    width: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(181, 179, 189, 0.2)',
    borderRadius: 4,
  },
  bookIcon: {
    height: 16,
    width: 16,
  },
});
