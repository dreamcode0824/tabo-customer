import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  TextInput,
  Alert, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import ApiGraphQl from '../../networking/apiGraphQl';
import API from '../../networking/api';
import Carousel from '../../components/carousel/carousel';
import moment from 'moment';
import Share from 'react-native-share';
import MapView, { Marker } from 'react-native-maps';
import {
  BookCalendar,
  Time,
  ImageZoomModal,
  Reviews,
  DropDownBusiness,
  Menu,
  Rules,
  LikeBusiness,
  TermsConditions,
  PaymentChoose,
  AddCard,
  ContentLoading,
  Map,
  ListTouchable
} from '../../components';
import i18n from "../../constants/i18next";
import wifi from '../../assets/images/wi-fi.png';
import games from '../../assets/images/games.png';
import kids from '../../assets/images/child.png';
import { result } from 'lodash';


const imgHeight = Dimensions.get('window').width;

class BusinessClass extends Component {
  apigraphql = new ApiGraphQl();
  api = new API();

  reservationId = null;
  canLike = true
  tempSeats = [];
  seatsImages = {};
  requestInfo = null;

  paySecretToken = null;
  payPublishToken = null;


  constructor(props) {
    super(props);
    this.state = {
      requestInfoState: {
        is_vip: null,
        zone_id: null,
        additional_umbrella_count: null,
        element_id: null,
      },
      umbrellasCount: null,
      vipSeats: false,
      currency: '',
      business: props.route.params.business,
      businessImages: [],
      like: props.route.params.business.like,
      likeId: props.route.params.business.likeId,
      facilities: [],
      menuCategories: [],
      menuItems: [],
      cards: [],
      terms: `<p></p>`,
      curY: new Animated.Value(0),
      rules: null,
      price: null,
      facilitiesShow: false,
      mapVisible: false,
      cabana: false,
      bed: false,
      baldaquin: false,
      sunbed: false,
      umbrella: false,
      zoomVisible: false,
      bookCalendarVisible: false,
      paymentChooseVisible: false,
      paymentAddVisible: false,
      timeVisible: false,
      reviewsVisible: false,
      menuVisible: false,
      termsConditionsVisible: false,
      rulesVisible: false,
      needUmbrella: false,
      question2: false,
      landscape: false,
      seat: '',
      reviews: [],
      height: new Animated.Value(0),
      opacity: new Animated.Value(0),
      opacityBtn: new Animated.Value(1),
      types: [
        {
          id: 1,
          text: 'Beach & Pool',
          value1: 'beach',
          value2: 'pool',
          select: false,
        },
        {
          id: 2,
          text: 'Restaurant & Terrace',
          value1: 'restaurant',
          value2: 'terrace',
          select: false,
        },
        {
          id: 3,
          text: 'Club',
          value1: 'club',
          value2: '',
          select: false,
        },
      ],
      activeSlide: 0,
      related: [],
      img: [
        require('../../assets/images/slide1.png'),
        require('../../assets/images/slide2.png'),
        require('../../assets/images/slide3.png'),
      ],
      quantity: ['1', '2', '3', '4'],
      quantityItem: '1',
      size: ['1', '2', '3', '4'],
      sizeItem: '1',
      loading: true,
      seats: [],
      products: [],
      activeProductIndex: 0,
      chooseSeats: [],
      elementTypes: [],
      business_id: "",
      currentLang: "",
      businessWork: [],
      businessBeachLong: 0,
      businessBeachLat: 0,
      isCloseDay: false,
      zoneElement: [],
      locationCountry: "",
      locationCity: "",
      elementTypeByZone: [],
      totalElement: [],
      priceValue: [],
      businessData: [],
      beachLocation: { latitude: 0, longitude: 0 },
      temporaryClosed: false,
    };
    this.state.businessImages = this.props.route.params.business.images
  }

  componentDidMount() {
    this.getBusinessDataByLocation();
    // this.getFacilities();
    // this.getBusinessesSettings();
    // this.getSeatsImages();
    // this.getReview();
    // this.getMenuCategories();
    // this.getMenuItems();
    // this.getTerms();
    // this.getOrientation();
    // this.getVipProducts();
    // this.getRelated();
    // this.getCards();
    this.getSeats();
    this.setState({ currentLang: this.props.config.language })
    if (this.props.route.params.business.id) {
      this.setState({ business_id: JSON.stringify([this.props.route.params.business.id]) })
    }
    // if (this.props.route.params.business.type == 'beach_pool') {
    // }
    Dimensions.addEventListener(
      'change',
      this.getOrientation,
    );
    let arr = [];
    this.state.business.images.map(data => {
      arr.push({
        url: data,
      });
    });
    this.setState({ zoomImg: arr });
    if (this.props.route.params.search) {
      this.apigraphql.getGallery(JSON.stringify([this.props.route.params.business.id]))
        .then((gallery) => {
          let arr = gallery.data.business_gallery.map(data => {
            return data.url
          })
          this.setState({
            businessImages: [...this.state.businessImages, ...arr],
          })
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  getBusinessDataByLocation() {
    this.apigraphql.getBusinessDataByLocations(JSON.stringify([this.props.route.params.business.id]))
      .then((res) => {
        if (res) {
          let resultCloseDay = false;
          let arr = [];
          let chooseSeatArr = [];
          let zoneElementType = [];
          if (res.data.business[0].business_week) {
            resultCloseDay = this.allowCloseDay(this.props.route.params.date.week, res.data.business[0].business_week)
          }
          if (res.data.business[0].facilities.length > 0) {
            res.data.business[0].facilities.map(item => {
              arr.push(item.facility)
            })
          } else {
            arr = [];
          }
          if (res.data.business[0].zone.length > 0) {
            function compare(a, b) {
              if (a.config.slug < b.config.slug) {
                return -1;
              }
              if (a.config.slug > b.config.slug) {
                return 1;
              }
              return 0;
            }
            res.data.business[0].zone.sort(compare)
            chooseSeatArr = res.data.business[0].zone
            chooseSeatArr.map((item, index) => {
              if (item.name === "Near sea") {
                chooseSeatArr[index]["active"] = true;
                if (res.data.business[0].elements.length > 0) {
                  console.log(res.data.business[0].elements[0], "&&&&&&&&&&&&&&&&&&&*****************")
                  this.setState({ totalElement: res.data.business[0].elements })
                  let elementsArr = [];
                  let elementType = null;
                  function compare(a, b) {
                    if (a.element.type < b.element.type) {
                      return -1;
                    }
                    if (a.element.type > b.element.type) {
                      return 1;
                    }
                    return 0;
                  }
                  res.data.business[0].elements.sort(compare)
                  const result = res.data.business[0].elements.filter(ele => ele.zone.name === "Near sea")
                  if (result.length > 0) {
                    result.map((item, i) => {
                      console.log(item.zone, "---------->")
                      let elementName = "";
                      if (item.element.type == "umbrella") {
                        elementName = "sunbed"
                      }
                      else {
                        elementName = "bed"
                      }
                      if (elementType != elementName) {
                        elementType = elementName;
                        elementsArr.push({ name: elementName, active: false, zoneName: item.zone.name, id: item.zone.id })
                      }
                    })
                    this.setState({ elementTypeByZone: elementsArr })
                  } else {
                    this.setState({ elementTypeByZone: [] })
                  }
                }
              }
              else {
                chooseSeatArr[index]["active"] = false;
              }
            })
          } else {
            chooseSeatArr = [];
          }
          if (res.data.business[0].elements.length > 0) {
            zoneElementType = res.data.business[0].elements;
          } else {
            zoneElementType = [];
          }
          this.setState({
            loading: false,
            isCloseDay: !resultCloseDay,
            facilities: arr,
            chooseSeats: chooseSeatArr,
            zoneElement: zoneElementType,
            locationCity: res.data.business[0].settings.beach_location_city ? res.data.business[0].settings.beach_location_city : "",
            locationCountry: res.data.business[0].settings.beach_location_country ? res.data.business[0].settings.beach_location_country : "",
            priceValue: res.data.business[0].price ? res.data.business[0].price : "",
            businessData: res.data.business[0]
          })
          if (res.data.business[0].settings) {
            this.setState({ beachLocation: { latitude: res.data.business[0].settings.latitude, longitude: res.data.business[0].settings.longitude } })
            this.setState({ businessBeachLat: res.data.business[0].settings.latitude })
            this.setState({ businessBeachLong: res.data.business[0].settings.longitude })
            this.setState({ temporaryClosed: res.data.business[0].settings.temporary_closed })
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log("----------------------->updatewillMount")
    this.formatSeats(nextState);
    this.reservePrice({}, {}, nextState);
    return true;
  }
  allowCloseDay(currentWeek, dates) {
    if (currentWeek === "sunday") {
      if (dates.sun === "Open") {
        return true;
      } else {
        return false;
      }
    }
    if (currentWeek === "monday") {
      if (dates.mon === "Open") {
        return true;
      } else {
        return false;
      }
    }
    if (currentWeek === "tuesday") {
      if (dates.tue === "Open") {
        return true;
      } else {
        return false;
      }
    }
    if (currentWeek === "wednesday") {
      if (dates.wed === "Open") {
        return true;
      } else {
        return false;
      }
    }
    if (currentWeek === "thursday") {
      if (dates.thu === "Open") {
        return true;
      } else {
        return false;
      }
    }
    if (currentWeek === "friday") {
      if (dates.fri === "Open") {
        return true;
      } else {
        return false;
      }
    }
    if (currentWeek === "saturday") {
      if (dates.sat === "Open") {
        return true;
      } else {
        return false;
      }
    }
    if (currentWeek === "sunday") {
      if (dates.sun === "Open") {
        return true;
      } else {
        return false;
      }
    }
  }
  formatSeats(nextState) {
    let tempKey = '';
    let seat = {};
    let infoForRequest = {};
    for (const key in nextState.seats) {
      if (nextState.seats.hasOwnProperty(key)) {
        const element = nextState.seats[key];
        if (element.active) {
          seat = element;
          tempKey = key;
        }
      }
    }
    if (this.isEmpty(seat)) {
      this.requestInfo = null;
      return;
    }

    infoForRequest.element_id = seat.structure[seat.structureIndex].element_id;
    infoForRequest.is_vip = seat.structure[seat.structureIndex].isVip;
    if (tempKey == 'sunbed' && nextState.needUmbrella) {
      infoForRequest.additional_umbrella_count = nextState.umbrellasCount;
    }
    if (seat.structure.length > 0 && !this.state.vipSeats) {
      infoForRequest.zone_id = seat.structure[seat.structureIndex].__zones[seat.zoneIndex].id;
    }
    this.requestInfo = { ...infoForRequest };
  }

  isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  getVipProducts() {
    this.apigraphql.getProducts(this.props.route.params.business.id)
      .then((products) => {
        if (products.data && products.data.business_vip_product) {
          this.setState({
            products: products.data.business_vip_product,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getBusinessesSettings() {
    this.apigraphql.getBusinessesSettings(this.props.route.params.business.id)
      .then((settings) => {
        this.setState({
          currency: settings.data.business_settings[0].currency,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getSeatsImages() {
    this.apigraphql.getSeatsImages(this.props.route.params.business.id)
      .then((res) => {
        if (res && res.data && res.data.business_element_gallery) {
          for (let i = 0; i < res.data.business_element_gallery.length; i++) {
            const element = res.data.business_element_gallery[i];
            if (this.seatsImages[element.element_type]) {
              this.seatsImages[element.element_type].push({ url: element.image });
            } else {
              this.seatsImages[element.element_type] = [];
              this.seatsImages[element.element_type].push({ url: element.image });
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  capitalize = (s) => {
    if (typeof s !== 'string') {
      return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  getSeats() {
    this.api.getSeats(this.props.route.params.business.id)
      .then((res) => {
        if (res.data) {
          let object = res.data;
          for (const key in object) {
            if (object.hasOwnProperty(key)) {
              const element = object[key];
              if (element.structure && element.structure.length > 0) {
                element.structureIndex = 0;
                element.zoneIndex = 0;
              }
              element.active = false;
            }
          }
          this.tempSeats = object;
          this.setState({
            seats: this.filterSeats(object, false),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  filterSeats(mainSeats, vip) {
    let seats = JSON.parse(JSON.stringify(mainSeats));
    let filteredSeats = {};
    for (const key in seats) {
      if (seats.hasOwnProperty(key)) {
        const object = seats[key];
        object.structure = object.structure.filter((item) => item.isVip == vip);
      }
    }

    for (const key in seats) {
      if (seats.hasOwnProperty(key)) {
        const object = seats[key];
        if (object.structure.length) {
          filteredSeats[key] = object;
        }
      }
    }
    return filteredSeats;
  }

  getFacilities() {
    this.apigraphql.getFacilities(this.props.route.params.business.id)
      .then(data => {
        this.setState({
          facilities: data.data.business_facilities,
          loading: false,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getTerms() {
    this.apigraphql.getRulesTermsBusiness(this.props.route.params.business.id)
      .then(rulesTerms => {
        this.setState({
          terms: rulesTerms.data.business[0].terms_and_conditions ? rulesTerms.data.business[0].terms_and_conditions.terms : `<p></p>`,
          rules: rulesTerms.data.business[0].rules ? rulesTerms.data.business[0].rules.rules : `<p></p>`,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getReview() {
    this.apigraphql.getReview(this.props.route.params.business.id)
      .then(review => {
        this.setState({
          reviews: review.data.review,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getMenuCategories() {
    this.apigraphql.getMenuCategories(this.props.route.params.business.id)
      .then(menuCategories => {
        this.setState({
          menuCategories: menuCategories.data.beach_menu_category,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getMenuItems() {
    this.apigraphql.getMenuItems(this.props.route.params.business.id)
      .then(menuItems => {
        this.setState({
          menuItems: menuItems.data.beach_menu_item,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  getRelated() {
    let where = `where: { type: ${JSON.stringify(this.state.business.type)}}`;
    this.apigraphql.getRelated(where)
      .then(data => {
        this.setState({
          related: data.data.business,
        });
      })
      .catch(err => {
        console.log(err);
      });

  }

  getCards() {
    this.apigraphql.getStripeCard(this.props.user.id)
      .then(data => {
        let arr = data.data.stripe_card.map((data, index) => {
          if (index === 0) {
            return { ...data, active: true };
          }
          return { ...data, active: false };
        });
        this.setState({
          cards: arr,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    if (!this.state.like && this.props.route.params.type) {
      this.props.route.params.like()
    }
    Dimensions.removeEventListener(
      'change',
      this.getOrientation,
    );
    clearTimeout(this.time);
  }

  reservePrice(start, end, nextState) {

    if ((this.props.config[this.props.route.params.business.type] &&
      this.props.config[this.props.route.params.business.type].dateReserve)
      && this.requestInfo) {
      let info = {
        quantity: nextState.quantityItem,
        is_vip: this.requestInfo.is_vip,
        element_id: this.requestInfo.element_id,
        reservation_id: this.reservationId ? this.reservationId : null,
        business_id: nextState.business.id,
        start_date: Object.keys(start).length ? start.dateString : this.props.config[this.props.route.params.business.type].dateReserve.dateString,
        end_date: Object.keys(end).length ? end.dateString : this.props.config[this.props.route.params.business.type].dateEndReserve.dateString,
      };
      if (this.requestInfo.zone_id) {
        info.zone_id = this.requestInfo.zone_id;
      }
      if (this.requestInfo.additional_umbrella_count) {
        info.additional_umbrella_count = this.requestInfo.additional_umbrella_count;
      }
      this.api.reservePriveGet(info)
        .then(price => {

          this.state.price = price.data.price;

          this.reservationId = price.data.reservation_id;
          if (
            this.reservationId &&
            this.props.config[this.props.route.params.business.type] &&
            this.props.config[this.props.route.params.business.type].timeReserve) {
            let time = this.props.config[this.props.route.params.business.type].timeReserve.activeHourIndex + ':' + this.props.config[this.props.route.params.business.type].timeReserve.activeMinuteIndex;
            this.apigraphql.setArrivalTime(this.reservationId, time)
              .then((res) => {
              })
              .catch((error) => {
                console.log(error);
              });
          }
          this.forceUpdate();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  handleChange = (e, name) => {
    this.setState({
      [name]: e,
    });
  };

  changeSeat(name, seatChoose) {
    if (this.state.seat === name) {
      return this.setState({
        [name]: !this.state.seat,
        [seatChoose]: !this.state.seat,
        seat: '',
      });
    }
    this.setState({
      [name]: true,
      [seatChoose]: false,
      seat: name,
    });
  }
  filterElement(zoneName) {
    let elementsArr = [];
    let elementType = null;
    function compare(a, b) {
      if (a.element.type < b.element.type) {
        return -1;
      }
      if (a.element.type > b.element.type) {
        return 1;
      }
      return 0;
    }
    this.state.totalElement.sort(compare)
    const result = this.state.totalElement.filter(ele => ele.zone.name === zoneName)
    if (result.length > 0) {
      result.map((item, i) => {
        let elementName = "";
        if (item.element.type == "umbrella") {
          elementName = "sunbed"
        }
        else {
          elementName = "bed"
        }
        if (elementType != elementName) {
          elementType = elementName;
          elementsArr.push({ name: elementName, active: false, zoneName: item.zone.name })
        }
      })
      this.setState({ elementTypeByZone: elementsArr })
    } else {
      this.setState({ elementTypeByZone: [] })
    }
  }
  _renderfacilities() {
    return this.state.facilities.map((data, index) => {
      if (data.name === 'blue_flag') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/wave.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('BLUE_FLAG')}</Text>
          </View>
        );
      }
      if (data.name === 'restaurant') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/restoran.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('RESTAURANT')}</Text>
          </View>
        );
      }
      if (data.name === 'ski_jet') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/motor.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('SKI_JET')}</Text>
          </View>
        );
      }
      if (data.name === 'bar') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/coffee-cup.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('BAR')}</Text>
          </View>
        );
      }
      if (data.name === 'kids') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/child.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('KIDS')}</Text>
          </View>
        );
      }
      if (data.name === 'shower') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/shower.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('SHOWER')}</Text>
          </View>
        );
      }
      if (data.name === 'massage') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/massage.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('MASSAGE')}</Text>
          </View>
        );
      }
      if (data.name === 'games') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/games.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('GAMES')}</Text>
          </View>
        );
      }
      if (data.name === 'credit_card') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/credit-card.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('CREDIT_CARD')}</Text>
          </View>
        );
      }
      if (data.name === 'wifi') {
        return (
          <View style={[styles.facilities_item_view, index % 2 === 1 && { paddingLeft: 50 }]} key={index}>
            <Image source={require('../../assets/images/wi-fi.png')} style={styles.facilities_img} />
            <Text style={styles.facilities_item_text}>{i18n.t('WIFI')}</Text>
          </View>
        );
      }

    });
  }

  _renderSeatImage(key) {
    switch (key) {
      case 'cabana':
        return require('../../assets/images/cabana.png');
      case 'bed':
        return require('../../assets/images/bed.png');
      case 'sunbed':
        return require('../../assets/images/sunbed.png');
      case 'umbrella':
        return require('../../assets/images/sunbed2.png');
      default:
        return null;
    }
  }

  _renderSizeSelect(key) {
    if (
      this.state.seats[key].structure &&
      this.state.seats[key].structure.length > 1 &&
      this.state.seats[key].active
    ) {
      return (<View>
        <Text style={styles.select_title}>Select size</Text>
        <View style={[{ marginLeft: 25, marginTop: 7 }]}>
          <DropDownBusiness
            data={this.state.seats[key].structure.map((item) => (item.size))}
            handleChange={(i) => {
              let arr = this.state.seats;
              if (arr[key].structureIndex != i) {
                arr[key].zoneIndex = 0;
              }
              arr[key].structureIndex = i;

              this.setState({ seats: arr });
            }}
            title={this.state.seats[key].structure[this.state.seats[key].structureIndex].size}
            dropdownName='quantityItem' />
        </View>
      </View>);
    }

    return null;
  }

  _renderZoneSelect(key) {
    if (
      !this.state.vipSeats &&
      this.state.seats[key].active &&
      this.state.seats[key].structure &&
      this.state.seats[key].structure[this.state.seats[key].structureIndex].__zones &&
      this.state.seats[key].structure[this.state.seats[key].structureIndex].__zones.length > 1
    ) {
      return (<View>
        <Text style={styles.select_title}>Select zone</Text>
        <View style={[{ marginLeft: 25, marginTop: 7 }]}>
          <DropDownBusiness
            data={this.state.seats[key].structure[this.state.seats[key].structureIndex].__zones.map((item) => (item.name))}
            handleChange={(i) => {
              let arr = this.state.seats;
              arr[key].zoneIndex = i;
              this.setState({ seats: arr });
            }}
            title={this.state.seats[key].structure[this.state.seats[key].structureIndex].__zones[this.state.seats[key].zoneIndex].name}
            dropdownName='quantityItem' />
        </View>
      </View>);
    }

    return null;
  }

  _renderProductsSelect(key) {
    if (
      this.state.vipSeats &&
      this.state.products &&
      this.state.products.length > 1 &&
      this.state.seats[key].active &&
      this.state.seats[key].structure &&
      this.state.seats[key].structure.length > 1
    ) {
      return (<View>
        <Text style={styles.select_title}>Select product</Text>
        <View style={[{ marginLeft: 25, marginTop: 7 }]}>
          <DropDownBusiness
            data={this.state.products.map((item) => (item.title))}
            handleChange={(i) => {
              this.setState({ activeProductIndex: i });
            }}
            title={this.state.products[this.state.activeProductIndex].title}
            dropdownName='quantityItem' />
        </View>
      </View>);
    }

    return null;
  }

  _renderSingleSize(key) {
    if (
      this.state.seats[key].structure &&
      this.state.seats[key].structure.length == 1 &&
      this.state.seats[key].active
    ) {
      return (<Text
        style={[styles.seat_item_info_text, { marginLeft: 25 }]}>
        For {this.state.seats[key].structure[0].size} {this.state.seats[key].structure[0].size > 1 ? 'persons' : 'person'}
      </Text>);
    }
    return null;
  }

  _renderSingleProduct(key) {
    if (
      this.state.vipSeats &&
      this.state.products &&
      this.state.products.length == 1 &&
      this.state.seats[key].active
    ) {
      return (<Text
        style={[styles.seat_item_info_text, { marginLeft: 25 }]}>
        Your product is {this.state.products[0].title}
      </Text>);
    }
    return null;
  }

  _renderSunbedSelect(key) {
    if (key == 'sunbed' &&
      this.state.seats[key].active &&
      Object.keys(this.state.seats).length == 1) {
      return (<View style={styles.questions_view}>
        <Text style={styles.questions_text}>Do you like to have an umbrella ?</Text>
        <View style={styles.questions_btn_view}>
          <TouchableOpacity
            style={[styles.like_row_no_yes_btn, !this.state.needUmbrella && { backgroundColor: '#6844F9' }]}
            onPress={() => {
              this.setState({ needUmbrella: false });
            }}>
            <Text
              style={[styles.like_row_no_yes_text, !this.state.needUmbrella && { color: '#fff' }]}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.like_row_no_yes_btn, this.state.needUmbrella && { backgroundColor: '#6844F9' }]}
            onPress={() => {
              this.setState({ needUmbrella: true });
            }}>
            <Text
              style={[styles.like_row_no_yes_text, this.state.needUmbrella && { color: '#fff' }]}>Yes</Text>
          </TouchableOpacity>
        </View>
        {this.state.needUmbrella ? <>
          <Text style={[styles.questions_text, { marginTop: 15 }]}>
            Number of umbrellas
          </Text>
          <TextInput
            autoFocus
            keyboardType='number-pad'
            ref={ref => this.umbrellaInput = ref}
            style={styles.typeInput}
            placeholder={'Type here...'}
            onChangeText={(text) => {
              this.setState({
                umbrellasCount: text,
              });
            }}
          />
        </> : null}
      </View>);
    }
  }

  _renderChooseSeat() {
    let isVip = false;
    let isOrdinary = false;
    if (this.state.chooseSeats.length > 0) {
      isVip = false;
      isOrdinary = false;
      for (let i = 0; i < this.state.chooseSeats.length; i++) {
        if (this.state.chooseSeats[i].config.slug == "VIP") {
          isVip = true;
        } else {
          isOrdinary = true;
        }
      }
    }
    else {
      isVip = false;
      isOrdinary = false;
    }
    let seatsKeys = Object.keys(this.state.seats);
    let elementTypeArr = [];
    if (this.state.zoneElement.length > 0) {
      let elements = null;
      this.state.zoneElement.map((item) => {
        if (elements != item.element.type) {
          elements = item.element.type;
          elementTypeArr.push(item.element.type)
        }
      })
    }
    return (
      <React.Fragment>
        {
          this.state.chooseSeats.length > 0 && (
            <React.Fragment>
              < View style={styles.seat_view} >
                <Text style={[styles.seat_text, { marginLeft: 16 }]}>Choose a seat</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {isVip && (
                    <React.Fragment>
                      <TouchableOpacity
                        style={[styles.seat_item_view, { marginLeft: 30 }]}
                        onPress={() => {
                          if (!this.state.vipSeats) {
                            this.requestInfo = null;
                            this.setState({
                              vipSeats: true,
                            });
                          }
                        }}
                      >
                        <View style={[
                          styles.seat_item_checkbox,
                          { marginTop: 3, marginRight: 7 },
                          this.state.vipSeats && { borderColor: '#6844F9' },
                        ]}>
                          <Text
                            style={[
                              styles.seat_item_checkbox_text,
                              this.state.vipSeats && { backgroundColor: '#6844F9' },
                            ]} />
                        </View>
                        <Text style={styles.seat_item_title_text}>
                          VIP
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.seat_item_view}
                        onPress={() => {
                          if (this.state.vipSeats) {
                            this.setState({
                              vipSeats: false,
                            });
                          }
                        }}
                      >
                        <View style={[
                          styles.seat_item_checkbox,
                          { marginTop: 3, marginRight: 7 },
                          !this.state.vipSeats && { borderColor: '#6844F9' },
                        ]}>
                          <Text
                            style={[
                              styles.seat_item_checkbox_text,
                              !this.state.vipSeats && { backgroundColor: '#6844F9' },
                            ]} />
                        </View>
                        <Text style={styles.seat_item_title_text}>
                          Ordinary
                      </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  )}
                </View>
                {!this.state.isVip && (
                  <React.Fragment>
                    {!this.state.vipSeats && (
                      <View style={styles.zone_layout}>
                        {this.state.chooseSeats.map((item, index) => {
                          return (
                            <React.Fragment>
                              {item.name !== "VIP" && (
                                <View style={{ height: 50 }} key={index}>
                                  <TouchableOpacity
                                    style={[styles.zone_btn,
                                    item.active && { backgroundColor: '#888' }]}
                                    onPress={() => {
                                      let arr = [...this.state.chooseSeats];
                                      arr.map((item, i) => {
                                        if (i === index) {
                                          arr[i]["active"] = true;
                                        } else {
                                          arr[i]["active"] = false;
                                        }
                                      })
                                      this.setState({ chooseSeats: arr })
                                      this.filterElement(item.name)
                                    }}
                                  >
                                    <Text style={styles.zone_btn_text}>{item.name}</Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </View>
                    )}
                  </React.Fragment>
                )}
                {!this.state.vipSeats && (
                  <React.Fragment>
                    {this.state.elementTypeByZone.map((item, index) => (
                      <View
                        key={index}
                      >
                        <ListTouchable
                          style={styles.seat_item_view}
                          onPress={() => {
                            let arr = [...this.state.elementTypeByZone];
                            arr.map((list) => {
                              if (list.name === item.name) {
                                list.active = true;
                              } else {
                                list.active = false;
                              }
                            })
                            this.setState({ elementTypeByZone: arr })
                          }}
                        >
                          <View style={[
                            styles.seat_item_checkbox,
                            item.active && { borderColor: '#6844F9' },
                          ]}>
                            <Text
                              style={[
                                styles.seat_item_checkbox_text,
                                item.active && { backgroundColor: '#6844F9' },
                              ]} />
                          </View>
                          <View style={styles.seat_item_info_view}>
                            <View style={styles.row}>
                              <View style={styles.seat_title_item_view}>
                                <Image
                                  source={this._renderSeatImage(item.name)}
                                  style={styles.seat_caban_img}
                                />
                                <Text style={styles.seat_item_title_text}>
                                  {this.capitalize(item.name)}
                                </Text>
                              </View>
                              {/* {this.seatsImages[key] ? <TouchableOpacity
                            onPress={() => {
                              let arr = [...this.seatsImages[key]];
                              this.setState({
                                zoomVisible: true,
                                zoomImg: arr,
                              });
                            }}
                          >
                            <Image
                              style={styles.viewIcon}
                              source={require('../../assets/images/view.png')}
                            />
                          </TouchableOpacity> : null} */}
                            </View>
                          </View>
                        </ListTouchable>
                        {/* {this._renderSizeSelect(key)} */}
                        {/* {this._renderSingleSize(key)}
                    {this._renderZoneSelect(key)}
                    {this._renderProductsSelect(key)}
                    {this._renderSingleProduct(key)}
                    {this._renderSunbedSelect(key)} */}
                      </View>))}
                  </React.Fragment>
                )}
              </View >
            </React.Fragment>
          )
        }
      </React.Fragment>
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
                      <Image source={{ uri: data.customer.photo }} style={{
                        width: 26,
                        height: 26,
                        overlayColor: 'white',
                        borderRadius: 13
                      }} />
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

  _renderType(t) {
    let typeName = '';
    for (let i = 0; i < this.state.types.length; i++) {
      const type = this.state.types[i].value;
      if (t === type) {
        typeName = this.state.types[i].text;
        break;
      }
    }
    return typeName;
  }

  _renderRelated() {
    return (
      <View style={styles.related_view}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        >
          {this.state.related.map((data, index) => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  this.props.navigation.navigate('RelatedBusiness', {
                    business: {
                      ...data,
                      images: [data.image],
                    },
                    search: true,
                  }
                  )
                }}
                key={index}
                style={styles.related_item_view}>
                <Image source={{ uri: data.image }} style={styles.related_img} />
                <View style={styles.related_type_view}>
                  <Text style={styles.related_type_text}>
                    {this._renderType(data.type)}
                  </Text>
                </View>
                <View style={styles.related_info_view}>
                  <Text style={styles.related_name_text}>{data.name}</Text>
                  <View style={styles.related_rating_view}>
                    <Image source={require('../../assets/images/star.png')}
                      style={styles.img_star} />
                    <Text style={styles.related_rating_text}>{data.avg_rate}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  setAnimation(disable) {
    Animated.timing(this.state.height, {
      duration: 300,
      toValue: disable ? 0 : 35,
      useNativeDriver: false,
    }).start(() => {
    });

    Animated.timing(this.state.opacity, {
      duration: 10,
      toValue: disable ? 0 : 1,
      useNativeDriver: false,
    }).start(() => {
    });
    Animated.timing(this.state.opacityBtn, {
      duration: 10,
      toValue: disable ? 1 : 0,
      useNativeDriver: false,
    }).start(() => {
    });
  };

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({ landscape: false });
    } else {
      this.setState({ landscape: true });
    }
  };

  zoom = () => {
    let arr = [];
    this.state.businessImages.map(data => {
      arr.push({
        url: data,
      });
    });
    this.setState({
      zoomVisible: true,
      zoomImg: arr,
    });
  };

  _renderContent() {
    return this.state.loading ? null :
      (<View>
        <ListTouchable
          style={{ paddingVertical: 10 }}
          disabled={this.state.facilities.length <= 4}
          onPress={() => {
            this.setState({ facilitiesShow: !this.state.facilitiesShow });
            this.setAnimation(this.state.facilitiesShow);
          }}>
          <Text style={styles.facilities_text}>{i18n.t('FACILITIES')}</Text>
          <Text style={styles.text1}>
            {i18n.t('FACILITIES_DESCRIPTION')}
          </Text>
          <View style={styles.facilities_view}>
            {this._renderfacilities()}
          </View>
        </ListTouchable>
        <Text style={styles.line_text} />
        <Text style={styles.location_text}>{i18n.t('LOCATION')}</Text>
        <Text style={styles.nearby_text}>{this.state.locationCity}, {this.state.locationCountry}</Text>
        <TouchableOpacity style={{ height: 180, paddingHorizontal: 16, paddingVertical: 16, marginTop: 4 }}
          onPress={() => this.setState({ mapVisible: true })}>
          <MapView
            style={{ width: '100%', height: '100%' }}
            mapType={'terrain'}
            region={{
              latitude: this.state.businessBeachLat == 0 ? 0 : this.state.businessBeachLat,
              longitude: this.state.businessBeachLong == 0 ? 0 : this.state.businessBeachLong,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            {/* <Marker
              coordinate={{
                latitude: this.state.businessBeachLat == 0 ? 0 : this.state.businessBeachLat,
                longitude: this.state.businessBeachLong == 0 ? 0 : this.state.businessBeachLong,
              }}

            /> */}
          </MapView>
        </TouchableOpacity>
        <View style={styles.line_text} />
        <ListTouchable style={styles.rules_view} onPress={() => this.setState({ rulesVisible: true })}>
          <View style={{ width: '90%' }}>
            <Text style={styles.rules_text}>{i18n.t('RULES')}</Text>
            <Text style={styles.rules_info_text}>{i18n.t('RULES_DESCRIPTION')}</Text>
          </View>
          <Image source={require('../../assets/images/next.png')} style={styles.next_img} />
        </ListTouchable>

        {this.state.business.offer ?
          <>
            <Text style={[styles.line_text, { marginTop: 0 }]} />
            <View style={styles.ofer_img_view}>
              <Image source={{ uri: this.state.business.offer }}
                style={{
                  height: 130,
                  borderRadius: 8,
                  width: '100%',
                  overlayColor: '#fff',
                }} />
            </View>

          </>

          : null
        }
        <View style={styles.line_text} />
        <ListTouchable style={styles.rules_view} onPress={() => this.setState({ menuVisible: true })}>
          <View style={{ width: '90%' }}>
            <Text style={styles.rules_text}>{i18n.t('BEACH_MENU')}</Text>
            <Text style={styles.rules_info_text}>{i18n.t('BEACH_MENU_DESCRIPTION')}</Text>
          </View>
          <View>
            <Image source={require('../../assets/images/next.png')} style={styles.next_img} />
          </View>
        </ListTouchable>
        <Text style={[styles.line_text, { marginTop: 0 }]} />
        {/* {this._renderChooseSeat()} */}
        {/* <ListTouchable style={styles.terms_view}
          onPress={() => this.setState({ termsConditionsVisible: true })}>
          <View style={{ width: '90%' }}>
            <Text style={styles.terms_text}>{i18n.t('TERMS_CONDITIONS')}</Text>
            <Text style={styles.terms_info_text}>{i18n.t('TERMS_CONDITIONS_DESCRIPTION1')} <Text
              style={[styles.terms_info_text, {
                fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
                color: '#000',
              }]}>{i18n.t('TERMS_CONDITIONS_DESCRIPTION2')} </Text> {i18n.t('AND')} <Text
                style={[styles.terms_info_text, {
                  fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
                  color: '#000',
                }]}>{i18n.t('TERMS_CONDITIONS_DESCRIPTION3')}</Text>
            </Text>
          </View>
          <Image source={require('../../assets/images/next.png')} style={styles.next_img} />
        </ListTouchable> */}
        {/* <Text style={[styles.line_text, { marginTop: 0 }]} /> */}
        {this.state.reviews.length ?
          <View>
            <Text style={styles.reviews_text}>{i18n.t('REVIEWS')}</Text>
            {this._renderReviews()}
            {this.state.reviews.length >= 5 ? <ListTouchable style={styles.more_btn}
              onPress={() => this.setState({ reviewsVisible: true })}>
              <Text style={styles.more_btn_text}>{i18n.t('SHOW_ALL_REVIEWS')}</Text>
            </ListTouchable> : null}
            <Text style={styles.line_text} />
          </View>
          : null}
        <Text style={styles.related_text}>{i18n.t('RELATED_PLACES')}</Text>
        {this._renderRelated()}
      </View>);
  }

  likeChange() {
    if (this.props.route.params.type) {
      return this.setState({
        like: !this.state.like
      })
    }
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
          let saveData = {
            like: true,
            likeId: like.data.customer_liked_businessCreate.id,
          }
          this.setState(
            saveData,
            () => {
              this.canLike = true
            }
          );
          if (this.props.route.params.like) {
            this.props.route.params.like();
          }

        })
        .catch(err => {
          console.log(err);
          this.canLike = true
        });
    }
    if (this.state.like) {
      this.apigraphql.deleteLikeSaved(this.state.business.id)
        .then(data => {
          if (this.props.route.params.like) {
            this.props.route.params.like();
          }
          this.setState({
            like: false,
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
  }

  _renderBookingInformation() {
    if ((this.props.config[this.props.route.params.business.type] &&
      this.props.config[this.props.route.params.business.type].timeReserve) ||
      (this.props.config[this.props.route.params.business.type] &&
        this.props.config[this.props.route.params.business.type].dateReserve)) {
      return (
        <View style={{ paddingHorizontal: 16, marginBottom: 15 }}>
          <Text style={styles.booking_info_text}>Booking Information</Text>
          {(this.props.config[this.props.route.params.business.type] &&
            this.props.config[this.props.route.params.business.type].dateReserve) &&
            <View style={styles.booking_info_view}>
              <View style={styles.booking_info_item_view}>
                <Image source={require('../../assets/images/calendar-icon.png')}
                  style={{ width: 26, height: 26 }} />
                <Text
                  style={styles.booking_info_item_text}>{moment(this.props.config[this.props.route.params.business.type].dateReserve.dateString).format('DD-MM-YYYY')} - {moment(this.props.config[this.props.route.params.business.type].dateEndReserve.dateString).format('DD-MM-YYYY')}</Text>
              </View>
              <TouchableOpacity onPress={() => this.setState({ bookCalendarVisible: true })}>
                <Text>{i18n.t("EDIT")}</Text>
              </TouchableOpacity>
            </View>}
          {(this.props.config[this.props.route.params.business.type] &&
            this.props.config[this.props.route.params.business.type].timeReserve) &&
            <View style={styles.booking_info_view}>
              <View style={styles.booking_info_item_view}>
                <Image source={require('../../assets/images/time-icon.png')}
                  style={{ width: 26, height: 26 }} />
                <Text
                  style={styles.booking_info_item_text}>{this.props.config[this.props.route.params.business.type].timeReserve.activeHourIndex} : {this.props.config[this.props.route.params.business.type].timeReserve.activeMinuteIndex}</Text>
              </View>
              <TouchableOpacity onPress={() => this.setState({ timeVisible: true })}>
                <Text>{i18n.t("EDIT")}</Text>
              </TouchableOpacity>
            </View>}
        </View>
      );
    }
  }

  reserverBtn() {
    // return this.setState({ bookCalendarVisible: true });
    this.props.navigation.navigate('ReservationDetail', { chooseSeats: this.state.chooseSeats, elementTypeByZone: this.state.elementTypeByZone, totalElement: this.state.totalElement, business: this.state.business, priceValue: this.state.priceValue, businessData: this.state.businessData });
    if (this.props.user.email && this.props.user.phone && this.props.user.last_name && this.props.user.first_name && this.props.user.city_id) {
      if (this.requestInfo && this.requestInfo.element_id) {
        if (this.requestInfo.is_vip || this.requestInfo.zone_id) {
          if ((this.props.config[this.props.route.params.business.type] &&
            this.props.config[this.props.route.params.business.type].dateReserve) ||
            (this.props.config[this.props.route.params.business.type] &&
              this.props.config[this.props.route.params.business.type].dateEndReserve)) {
            return this.reservePrice({}, {}, this.state);
          }
          return this.setState({ bookCalendarVisible: true });
        } else {
          // return Alert.alert(
          //   '',
          //   'Please select a seat',
          //   [
          //     {
          //       text: 'Close',
          //       onPress: () => {
          //       },
          //       style: 'cancel',
          //     },
          //   ],
          //   { cancelable: true },
          // );
        }
      } else {
        // return Alert.alert(
        //   '',
        //   'Please select a seat',
        //   [
        //     {
        //       text: 'Close',
        //       onPress: () => {
        //       },
        //       style: 'cancel',
        //     },
        //   ],
        //   { cancelable: true },
        // );
      }

    } else {
      this.props.navigation.navigate('EnterCustomerInfo', { user: this.props.user });
    }
  }

  payBtn() {
    if (this.reservationId) {

      if (this.state.cards.length) {
        return this.setState({
          paymentChooseVisible: true,
        });
      }
      this.setState({
        paymentAddVisible: true,
      });
    }
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
    const minScroll = 0;
    const clampedScrollY = this.state.curY.interpolate({
      inputRange: [minScroll, 80],
      outputRange: [0, 1],
      extrapolateLeft: 'clamp',
    });
    console.log(this.state.temporaryClosed, "---------------->temporary")
    return (
      <View style={styles.content}>
        <Animated.View style={[styles.header_view, {
          opacity: clampedScrollY,
          zIndex: clampedScrollY,
        }]}>
          <TouchableOpacity style={styles.header_back_view} onPress={() => this.props.navigation.goBack()}>
            <Image source={require('../../assets/images/back.png')} style={{
              resizeMode: 'contain',
              height: 16,
              width: 16,
            }} />
            <Text style={styles.back_text}>Back</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.ScrollView
          onContentSizeChange={() => {
            // this.scroll.scrollTo({ x: 0, y: 0, animated: false })
          }}
          ref={ref => this.scroll = ref}
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onScroll={Animated.event(
            [{
              nativeEvent: { contentOffset: { y: this.state.curY } },
            }],
            {
              useNativeDriver: false,
            },
          )}>
          <View style={styles.sliderContainer}>
            <View>
              <Carousel
                data={this.state.businessImages.slice(1)}
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
                console.log('mta');
                this.likeChange();
              }}
            />
          </View>
          <View style={[styles.ratingRow, { marginTop: 10 }]}>
            <Image
              source={require('../../assets/images/star.png')}
              style={styles.star} />
            <Text style={styles.ratingText}>{this.state.business.avg_rate}</Text>
          </View>
          <Text style={styles.itemText}>
            {this.state.business.location_name}
          </Text>
          <Text style={styles.line_text} />
          {this._renderBookingInformation()}
          {this._renderContent()}
        </Animated.ScrollView>
        <ContentLoading
          style={{ height: 50, top: 350 }}
          loading={this.state.loading} />
        {this.state.temporaryClosed && (
          <View style={styles.alert_message}>
            <Text style={styles.alert_text}>Temporary closed</Text>
          </View>
        )}
        {this.state.isCloseDay && (
          <View style={styles.alert_message}>
            <Text style={styles.alert_text}>This location is close today.</Text>
          </View>
        )}
        <View style={[styles.reserve_view, this.state.price === null ? { justifyContent: 'center' } : null]}>
          {this.state.price === null ? null :
            <Text style={styles.price_text}><Text style={[styles.price_text, {
              color: '#000',
              fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
              fontSize: 16,
            }]}>{this.state.price} {this.state.currency}</Text></Text>}
          {this.state.isCloseDay ? (
            <View style={styles.reserve_btn_disable}>
              <Text style={styles.reserve_btn_text_disable}>{i18n.t('NEXT')}</Text>
            </View>
          ) : (
            <React.Fragment>
              {(this.props.config[this.props.route.params.business.type] &&
                this.props.config[this.props.route.params.business.type].dateReserve) && this.state.price !== null ?
                <TouchableOpacity style={[styles.reserve_btn, { backgroundColor: '#f95644' }]}
                  onPress={async () => {
                    if (this.props.config[this.props.route.params.business.type] &&
                      !this.props.config[this.props.route.params.business.type].timeReserve) {
                      return this.setState({
                        payFlag: true,
                        timeVisible: true,
                      });
                    }
                    this.payBtn();
                  }}>
                  <Text style={[styles.reserve_btn_text, { color: '#fff' }]}>{i18n.t('PAY')}</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.reserve_btn}
                  onPress={async () => this.reserverBtn()}>
                  <Text style={styles.reserve_btn_text}>{i18n.t('NEXT')}</Text>
                </TouchableOpacity>
              }
            </React.Fragment>
          )}

        </View>
        <BookCalendar
          start={this.props.config[this.props.route.params.business.type] ?
            this.props.config[this.props.route.params.business.type].dateReserve :
            {}}
          end={this.props.config[this.props.route.params.business.type] ?
            this.props.config[this.props.route.params.business.type].dateEndReserve :
            {}}
          close={() => {
            this.setState({
              bookCalendarVisible: false,
            });
          }}
          next={async (start, end) => {
            await this.setState({
              timeVisible: true,
              bookCalendarVisible: false,
              payFlag: false,
            });
            this.props.dispatch({
              type: 'SET_DATES',
              value: {
                type: this.props.route.params.business.type,
                data: {
                  dateReserve: start,
                  dateEndReserve: Object.keys(end).length ? end : start,
                },
              },
            });
            await this.reservePrice(start, end, this.state);
          }}
          isVisible={this.state.bookCalendarVisible}
        />
        <Time
          city={this.state.business.city.name}
          country={this.state.business.country.name}
          back={(time) => {
            this.setState({
              bookCalendarVisible: false,
              timeVisible: false,
            });
          }}
          close={() => {
            this.setState({
              bookCalendarVisible: false,
              timeVisible: false,
              //  payFlag: this.state.price ? true : false
            });
          }}
          next={(time) => {
            this.props.dispatch({
              type: 'SET_DATES',
              value: {
                type: this.props.route.params.business.type,
                data: {
                  timeReserve: time,
                },
              },
            });
            if (this.state.price && this.props.config[this.props.route.params.business.type] && this.state.payFlag) {
              if (this.state.cards.length) {
                return this.setState({
                  paymentChooseVisible: true,
                  timeVisible: false,
                });
              }
              return this.setState({
                paymentAddVisible: true,
                timeVisible: false,
              });
            }
            this.setState({
              timeVisible: false,
            });
          }}
          payFlag={this.state.price && this.props.config[this.props.route.params.business.type] && this.state.payFlag ? true : false}
          isVisible={this.state.timeVisible}
        />
        <PaymentChoose
          close={() => {
            this.setState({ paymentChooseVisible: false });
          }}
          next={() => {
            this.setState({ paymentAddVisible: true });
          }}
          getCards={() => {
            this.getCards()
          }}
          paySecretToken={this.paySecretToken}
          payPublishToken={this.payPublishToken}
          cards={this.state.cards}
          reservationId={this.reservationId}
          isVisible={this.state.paymentChooseVisible}
        />
        <AddCard
          close={() => {
            this.setState({ paymentAddVisible: false });
          }}
          next={() => {

          }}
          reservationId={this.reservationId}
          email={this.props.user.email}
          isVisible={this.state.paymentAddVisible}
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
        <Menu
          close={() => {
            this.setState({ menuVisible: false });
          }}
          isVisible={this.state.menuVisible}
          menuItems={this.state.menuItems}
          menuCategories={this.state.menuCategories}
        />
        <Rules
          close={() => {
            this.setState({ rulesVisible: false });
          }}
          rules={this.state.rules}
          isVisible={this.state.rulesVisible}
          business_id={this.props.route.params.business.id}
          currentLanguage={this.state.currentLang}
        />
        <TermsConditions
          close={() => {
            this.setState({ termsConditionsVisible: false });
          }}
          terms={this.state.terms}
          isVisible={this.state.termsConditionsVisible}
        />
        <Map
          close={() => {
            this.setState({ mapVisible: false });
          }}
          location={this.state.beachLocation}
          isVisible={this.state.mapVisible}
        />
      </View>
    );
  }
}

export const Business = connect(({ user, config }) => ({ user, config }))(BusinessClass);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  header_view: {
    height: 50,
    backgroundColor: '#fff',
    width: '100%',
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  header_back_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back_text: {
    marginLeft: 20,
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  sliderContainer: {
    height: imgHeight * 9 / 16,
    borderRadius: 8,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    fontSize: 12,
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
    marginBottom: 8,
  },
  star: {
    height: 12,
    width: 12,
  },
  ratingText: {
    marginTop: 3,
    color: '#060606',
    fontSize: 13,
    lineHeight: 14,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    marginLeft: 5,
  },
  itemText: {
    color: 'black',
    fontSize: 18,
    lineHeight: 18,
    marginLeft: 16,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  line_text: {
    marginHorizontal: 16,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(151, 151, 151, 0.13)',
  },
  facilities_title_view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  facilities_text: {
    marginLeft: 16,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    color: '#000',
  },
  text1: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 7,
    fontSize: 12,
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
    marginRight: 70,
    marginTop: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facilities_img: {
    width: 14,
    height: 14,
  },
  facilities_item_view: {
    width: '50%',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilities_item_text: {
    marginLeft: 16,
    fontSize: 14,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  location_text: {
    marginLeft: 16,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    color: '#000',
  },
  nearby_text: {
    marginLeft: 16,
    marginTop: 15,
    fontSize: 14,
    lineHeight: 19,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  reserve_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 65,
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
    fontSize: 14,
  },
  reserve_btn: {
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#6844F9',
    borderRadius: 8,
  },
  reserve_btn_text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
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
  },
  more_btn_text: {
    color: '#2C2929',
    fontSize: 16,
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
    lineHeight: 19,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  rules_info_text: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 14,
    color: '#898989',
  },
  next_img: {
    height: 14,
    width: 14,
    borderWidth: 1,
  },
  ofer_img_view: {
    borderRadius: 8,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  seat_view: {
    // paddingLeft: 16,
  },
  seat_text: {
    fontSize: 14,
    lineHeight: 19,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  seat_item_view: {
    paddingLeft: 16,
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
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
    marginHorizontal: 10,
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
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  seat_item_title_text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginLeft: 4,
  },
  seat_item_info_text: {
    fontSize: 12,
    lineHeight: 14,
    color: '#898989',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    //   marginTop: 6,
  },
  select_title: {
    marginLeft: 26,
    marginTop: 12,
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 14,
    lineHeight: 17,
  },
  select_text: {
    color: '#2C2929',
    fontSize: 14,
    lineHeight: 15,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  select_quantity_text: {
    marginLeft: 16,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 16,
    lineHeight: 20,
  },
  select_quantity_info: {
    marginLeft: 16,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    fontSize: 12,
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
    fontSize: 14,
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
    paddingHorizontal: 14,
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
    fontSize: 14,
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
    lineHeight: 19,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  terms_info_text: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 14,
    color: '#898989',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  reviews_text: {
    fontSize: 16,
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
    width: 166,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#ECECEE',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  reviews_info: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  reviews_info_view: {
    flex: 1,
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
  avatar_text: {
    color: '#fff',
  },
  reviews_info_name_text: {
    fontSize: 12,
    lineHeight: 14,
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginLeft: 8,
  },
  reviews_info_time_text: {
    fontSize: 10,
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
    fontSize: 16,
    lineHeight: 20,
  },
  related_view: {
    paddingLeft: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  related_item_view: {
    marginRight: 10,
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
    fontSize: 10,
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
    fontSize: 13,
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
    marginTop: 2,
    marginLeft: 5,
    color: '#060606',
    fontSize: 10,
    lineHeight: 10,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  row: {
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewIcon: {
    marginRight: 20,
    tintColor: 'rgba(0,0,0,0.6)',
    height: 21,
    width: 21,
  },
  typeInput: {
    marginTop: 10,
    width: 100,
    paddingHorizontal: 14,
    height: 35,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(181, 179, 189, 0.25)',
    color: 'black',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  booking_info_view: {
    marginTop: 23,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  booking_info_item_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  booking_info_item_text: {
    color: '#000',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    lineHeight: 19,
    marginLeft: 12,
  },
  booking_info_text: {
    color: '#000',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  zone_layout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 13
  },
  zone_btn: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: '#6844F9',
    padding: 15,
    margin: 5,
  },
  zone_btn_text: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  alert_message: {
    backgroundColor: 'red',
    width: '100%'
  },
  alert_text: {
    color: '#fff',
    padding: 10,
    textAlign: 'center'
  },
  reserve_btn_disable: {
    width: 108,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C2C2C2',
    borderRadius: 8,
  },
  reserve_btn_text_disable: {
    fontSize: 16,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
});
