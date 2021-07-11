import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Button,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import i18n from "../../constants/i18next";
import {
  DropDownBusiness,
  ListTouchable,
  BookCalendar,
  PaymentChoose,
  AddCard
} from '../../components';
import ApiGraphQl from '../../networking/apiGraphQl';
import API from '../../networking/api';
import moment from 'moment';
import Calendar from '../../assets/images/calendar.png';
import Information from '../../assets/images/information_icon.png';
import { getTimeZone } from 'react-native-localize';
const UselessTextInput = (props) => {
  return (
    <TextInput
      {...props}
      editable
      // placeholderTextColor="#D50000"
      placeholder="Add comment"
    // maxLength={40}
    />
  );
}
const ReservationDetail = (props) => {
  const apigraphql = new ApiGraphQl();
  const api = new API();
  const [vipSeats, setVipSeats] = useState(false)
  const [bookCalendarVisible, setBookCalendarVisible] = useState(false);
  const [business, setBusiness] = useState([]);
  const [isVip, setIsVip] = useState(false)
  const [chooseSeats, setChooseSeats] = useState([])
  const [elementTypeByZone, setElementTypeByZone] = useState([]);
  const [totalElement, setTotalElement] = useState([]);
  const [startDay, setStartDay] = useState("s");
  const [endDay, setEndDay] = useState("s");
  const [daylist, setDayList] = useState(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  const [dayslist, setDaysList] = useState(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
  const [currentDay, setCurrentDay] = useState("");
  const [closedDays, setClosedDays] = useState([]);
  const [currentZoneId, setCurrnetZoneId] = useState("")
  const [bookedStatus, setBookedStatus] = useState(true);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [selectReservationTime, setSelectReservationTime] = useState(false);
  const [selectPersonNumber, setSelectPersonNumber] = useState(false)
  const [selectTypeStatus, setSelectTypeStatus] = useState(false);
  const [selectQuantityStatus, setSelectQuantityStatus] = useState(false);
  const [selectQuantity, setSelectQuantity] = useState([
    {
      id: 1,
      status: false
    },
    {
      id: 2,
      status: false
    },
    {
      id: 3,
      status: false
    },
    {
      id: 4,
      status: false
    },
    {
      id: 5,
      status: false
    },
    {
      id: 6,
      status: false
    },
    {
      id: 7,
      status: false
    },
    {
      id: 8,
      status: false
    },
    {
      id: 9,
      status: false
    },
    {
      id: 10,
      status: false
    },
  ])
  const [number, setNumber] = useState([
    {
      id: 1,
      status: false
    },
    {
      id: 2,
      status: false
    },
    {
      id: 3,
      status: false
    },
    {
      id: 4,
      status: false
    },
    {
      id: 5,
      status: false
    },
    {
      id: 6,
      status: false
    },
    {
      id: 8,
      status: false
    },
    {
      id: 10,
      status: false
    },
    {
      id: 12,
      status: false
    },
    {
      id: 15,
      status: false
    },
    {
      id: 20,
      status: false
    },
  ]);
  const [reservationTime, setReservationTime] = useState([]);
  const [workingHour, setWorkingHour] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, onChangeText] = useState('');
  const [priceValue, setPriceValue] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [priceValueData, setPriceValueData] = useState([]);
  const [dayArrs, setDayArrs] = useState([]);
  const [totalPriceValue, setTotalPriceValue] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [currentType, setCurrentType] = useState("");
  const [errorStatus, setErrorStatus] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [paymentChooseVisible, setPaymentChooseVisible] = useState(false)
  const [paySecretToken, setPaySecretToken] = useState(null);
  const [payPublishToken, setPayPublishToken] = useState(null);
  const [reservationId, setReservationId] = useState(null);
  const [paymentAddVisible, setPaymentAddVisible] = useState(false);
  const [cards, setCards] = useState([]);
  const [lateTimeArr, setLatTimeArr] = useState([
    { id: 0, time: 10, status: true },
    { id: 1, time: 20, status: false },
    { id: 2, time: 30, status: false },
    { id: 3, time: 60, status: false },
  ])
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    setBusiness(props.route.params.business);
    if (props.route.params.business.type == "restaurant" || props.route.params.business.type == "club" || props.route.params.business.type == "terrace") {
      setLoadingStatus(true)
    }
    var today = new Date();
    var date = today.getFullYear() + '-' + `${today.getMonth() + 1 > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`}` + '-' + `${today.getDate() + 1 > 9 ? today.getDate() + 1 : `0${today.getDate()}`}`;
    getTotoalPrice(date, "")
    setBusinessData(props.route.params.businessData)
    if (props.route.params.priceValue.length > 0) {
      setPriceValue(props.route.params.priceValue)
    }
    if (props.route.params.chooseSeats.length > 0) {
      props.route.params.chooseSeats.map((item, index) => {
        if (item.config.slug == "VIP") {
          setIsVip(false)
        } else {
          setIsVip(true)
        }
      })
    }
    setChooseSeats(props.route.params.chooseSeats)
    setElementTypeByZone(props.route.params.elementTypeByZone)
    setTotalElement(props.route.params.totalElement)
    setCurrentDay(daylist[today.getDay()]);
    setDayArrs([daylist[today.getDay()]])
    setStartDay(date)
    if (props.route.params.chooseSeats.length > 0) {
      let currentZoneIds = 0;
      props.route.params.chooseSeats.map((item, index) => {
        if (item.active) {
          currentZoneIds = item.id;
        }
      })
      setCurrnetZoneId(currentZoneIds)
      gettingReservation(date, "", currentZoneIds)
    }
    if (props.route.params.business.id) {
      apigraphql.getWorkingHour(props.route.params.business.id)
        .then((result) => {
          setWorkingHour(result.data.business[0].business_week)
        })
        .catch((error) => {
          console.log(error);
        });
      getclosedDays(props.route.params.business.id);
      getCurrentTime(props.route.params.business.id)
    }
  }, [props]);
  const getCurrentTime = (id) => {
    api.getCurrentTimeApi(id)
      .then((result) => {
        if (result.data) {
          setCurrentTime(result.data.data)
          getTimeLine(props.route.params.business.id, daylist[new Date(`${result.data.data}`).getDay()], true, result.data.data)
          console.log(result.data)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const getTotoalPrice = (start, end) => {
    let arrDays = [];
    var startDay = "";
    var endDay = "";
    if (start) {
      startDay = new Date(`${start}`);
      if (endDay.length > 2) {
      } else {
        arrDays.push(start);
      }
    }
    if (endDay.length > 2) {
      endDay = new Date(`${end}`);
      var newend = endDay.setDate(endDay.getDate() + 1);
      endDay = new Date(newend);
      while (startDay < endDay) {
        arrDays.push(dayslist[new Date(moment(startDay).format("YYYY-MM-DD"))]);
        var newDate = startDay.setDate(startDay.getDate() + 1);
        startDay = new Date(newDate);
      }
    }
    api.getTotalPriceDayApi(arrDays)
      .then((result) => {
        if (result.data) {
          setPriceValueData(result.data.data)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const getTotalPriceValue = (priceValueData, dayArrs, currentZoneId, elementType, quantityCount) => {
    if (quantityCount > 0 && elementType.length > 2) {
      const filterResult = priceValueData.filter(ele => ele.zone_id == currentZoneId && ele.type == elementType);
      if (dayArrs.length > 0) {
        let value = 0;
        dayArrs.map((item, index) => {
          let price = getPriceDay(item, filterResult[0])
          value = value + price;
        })
        setTotalPriceValue(value * quantityCount * dayArrs.length)
      }
      console.log(filterResult, dayArrs, "^^^^^^^^^^^^^^^^^^^^^^")
    }
  }
  const getPriceDay = (day, priceData) => {
    if (day == "Sunday") {
      return priceData.price.sunday
    }
    if (day == "Monday") {
      return priceData.price.monday
    }
    if (day == "Tuesday") {
      return priceData.price.tuesday
    }
    if (day == "Wednesday") {
      return priceData.price.wednesday
    }
    if (day == "Thursday") {
      return priceData.price.thursday
    }
    if (day == "Friday") {
      return priceData.price.friday
    }
    if (day == "Saturday") {
      return priceData.price.saturday
    }
  }
  const getclosedDays = (businessId) => {
    apigraphql.getClosedDaysApi(businessId)
      .then((result) => {
        if (result.data) {
          if (result.data.business_year[0].closed_days.length > 0) {
            setClosedDays(result.data.business_year[0].closed_days)
            // console.log(result.data.business_year[0].closed_days, "))))))))))))))))))")
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const getTimeLine = (businessId, day, todayStatus, currentTime) => {
    apigraphql.getTimeLineApi(businessId)
      .then((result) => {
        if (result.data) {
          if (result.data.time_line[0].time.length > 0) {
            if (todayStatus) {
              let arr = [];
              let time = currentTime.split('T')[1];
              let beginningTime = moment(`${time.split(":")[0]}:${time.split(":")[1]}`, 'HH:mm');
              result.data.time_line[0].time.map((item, index) => {
                if (item.day_name == day) {
                  item.time_line.map((list, i) => {
                    let end_BreakTime = moment(`${list.time}`, 'HH:mm');
                    if (end_BreakTime.isBefore(beginningTime)) {
                    } else {
                      arr.push({
                        id: i,
                        name: list.time,
                        status: false
                      })
                    }
                  })
                }
              })
              setReservationTime(arr)
              setLoadingStatus(false)
              if (arr.length > 0) {
                setErrorStatus(false)
              } else {
                setErrorStatus(true)
              }
            } else {
              let arr = [];
              result.data.time_line[0].time.map((item, index) => {
                if (item.day_name == day) {
                  item.time_line.map((list, i) => {
                    arr.push({
                      id: i,
                      name: list.time,
                      status: false
                    })
                  })
                }
              })
              setReservationTime(arr)
              setLoadingStatus(false)
              if (arr.length > 0) {
                setErrorStatus(false)
              } else {
                setErrorStatus(true)
              }
            }
          } else {
            setLoadingStatus(false)
            setErrorStatus(true)
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const _renderSeatImage = (key) => {
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
  const capitalize = (s) => {
    if (typeof s !== 'string') {
      return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const filterElement = (zoneName) => {
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
    totalElement.sort(compare)
    const result = totalElement.filter(ele => ele.zone.name === zoneName)
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
      setElementTypeByZone(elementsArr)
    } else {
      setElementTypeByZone([])
    }
  }
  const gettingReservation = (startDate, endDate, zoneId) => {
    api.gettingReservationApi(startDate, endDate, zoneId)
      .then((result) => {
        if (result.data) {
          setBookedStatus(result.data.status)
          // console.log(startDate, endDate, "(((((((((((((((((((((((((((")
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(daylist[new Date(moment(currentDate).format('YYYY-MM-DD')).getDay()])
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }
  const getDayArrs = (startDay, endDay) => {
    let dates = getDates(startDay, endDay);
    setDayArrs(dates)
    setTotalPriceValue(0)
    // getTotalPriceValue(priceValueData, dates, currentZoneId, currentType, currentQuantity)
  }
  const getCards = () => {
    apigraphql.getStripeCard(2)
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
  console.log(selectQuantityStatus, selectTypeStatus, "%%%%%%%%%%%%%%%%%%%%")
  return (
    <View
      style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'white' }}
    // style={styles.layout}
    >
      <TouchableOpacity style={styles.back_btn_layout}
        onPress={() => {
          props.navigation.goBack()
        }}
      >
        <Image
          style={styles.backbtn}
          source={require('../../assets/images/back.png')}
        />
      </TouchableOpacity>
      <ScrollView
      // style={styles.container}
      >
        <Text style={[styles.reservation_person, { paddingBottom: 10 }]}>{i18n.t('Calendar')}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', paddingLeft: 25 }}>
          <View>
            <TouchableOpacity style={[styles.reserve_btn, { backgroundColor: 'white', borderWidth: 1, borderColor: '#6844f9', paddingHorizontal: 10 }]}
              onPress={
                () => { setBookCalendarVisible(true) }
              }
            >
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Image source={Calendar} style={styles.calendarStyle} />
                <View>
                  <Text style={[styles.selected_date_text, { color: '#6844f9' }]}>
                    {startDay.split('-')[2]}.{startDay.split('-')[1]}.{startDay.split('-')[0]}
                    {endDay.length > 2 ? " - " : ""}
                    {endDay.length > 2 ? endDay.split('-')[2] : ""}{endDay.length > 2 ? "." : ""}{endDay.length > 2 ? endDay.split('-')[1] : ""}{endDay.length > 2 ? "." : ""}{endDay.length > 2 ? endDay.split('-')[0] : ""}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={[{ backgroundColor: 'white', paddingTop: 2 }]}
              onPress={
                () => { setModalVisible(!modalVisible) }
              }
            >
              <Image source={Information} style={styles.information_icon_style} />
            </TouchableOpacity>
          </View>
        </View>
        <React.Fragment>
          {!currentZoneId && (
            <View>
              <Text style={[styles.reservation_person, { paddingTop: 15 }]}>{i18n.t('Number of persons')}</Text>
              <Animated.ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                  {number.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.person_button, item.status && { backgroundColor: '#6844F9' }]}
                        onPress={() => {
                          setSelectPersonNumber(true)
                          let arr = [...number];
                          arr.map((list, index) => {
                            if (list.id == item.id) {
                              list.status = true;
                            } else {
                              list.status = false;
                            }
                          })
                          setNumber(arr)
                        }}
                      >
                        <View>
                          <Text style={[styles.person_button_text, item.status && { color: 'white' }]}>{item.id}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </Animated.ScrollView>
            </View>
          )}
          <View>
            <React.Fragment>
              {loadingStatus ? (
                <View>
                  <ActivityIndicator size="large" color="#6844f9" />
                </View>
              ) : (
                <React.Fragment>
                  {reservationTime.length > 0 && (
                    <React.Fragment>
                      <Text style={styles.reservation_person}>{i18n.t('Reservation Time')}</Text>
                      <Animated.ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                          {reservationTime.map((item, index) => {
                            return (
                              <TouchableOpacity
                                key={index}
                                style={[styles.reservation_time_button, item.status && { backgroundColor: '#6844F9' }]}
                                onPress={() => {
                                  setSelectReservationTime(true)
                                  let arr = [...reservationTime];
                                  arr.map((list, index) => {
                                    if (list.id == item.id) {
                                      list.status = true;
                                    } else {
                                      list.status = false;
                                    }
                                  })
                                  setReservationTime(arr)
                                }}
                              >
                                <View>
                                  <Text style={[styles.person_button_text, item.status && { color: 'white' }]}>
                                    {reservationTime.length - 1 == index ? `${item.name} - ${businessData.settings.estimated_time}` : item.name}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            )
                          })}
                        </View>
                      </Animated.ScrollView>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          </View>
        </React.Fragment>
        {/* <View>
          <Text style={styles.reservation_person}>Late time</Text>
          <Animated.ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              {lateTimeArr.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.reservation_time_button, item.status && { backgroundColor: '#6844F9' }]}
                    onPress={() => {
                      setSelectReservationTime(true)
                      let arr = [...reservationTime];
                      arr.map((list, index) => {
                        if (list.id == item.id) {
                          list.status = true;
                        } else {
                          list.status = false;
                        }
                      })
                      setReservationTime(arr)
                    }}
                  >
                    <View>
                      <Text style={[styles.person_button_text, item.status && { color: 'white' }]}>
                        {item.time}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </Animated.ScrollView>
        </View> */}
        <React.Fragment>
          {
            chooseSeats.length > 0 && (
              <React.Fragment>
                < View style={styles.seat_view} >
                  <Text style={[styles.reservation_person, { paddingTop: 19, color: 'black' }]}>{i18n.t('Choose a Seat')}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                    {isVip && (
                      <React.Fragment>
                        <TouchableOpacity
                          style={[styles.seat_item_view, { marginLeft: 30 }]}
                          onPress={() => {
                            if (!vipSeats) {
                              setVipSeats(true)
                            }
                          }}
                        >
                          <View style={[
                            styles.seat_item_checkbox,
                            { marginTop: 3, marginRight: 7 },
                            vipSeats && { borderColor: '#6844F9' },
                          ]}>
                            <Text
                              style={[
                                styles.seat_item_checkbox_text,
                                vipSeats && { backgroundColor: '#6844F9' },
                              ]} />
                          </View>
                          <Text style={styles.seat_item_title_text}>
                            VIP
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.seat_item_view}
                          onPress={() => {
                            if (vipSeats) {
                              setVipSeats(false)
                            }
                          }}
                        >
                          <View style={[
                            styles.seat_item_checkbox,
                            { marginTop: 3, marginRight: 7 },
                            !vipSeats && { borderColor: '#6844F9' },
                          ]}>
                            <Text
                              style={[
                                styles.seat_item_checkbox_text,
                                !vipSeats && { backgroundColor: '#6844F9' },
                              ]} />
                          </View>
                          <Text style={styles.seat_item_title_text}>
                            Ordinary
                      </Text>
                        </TouchableOpacity>
                      </React.Fragment>
                    )}
                  </View>
                  {isVip && (
                    <React.Fragment>
                      {!vipSeats && (
                        <View style={[styles.zone_layout, { paddingHorizontal: 18 }]}>
                          <Animated.ScrollView showsHorizontalScrollIndicator={false} horizontal={true} >
                            {chooseSeats.map((item, index) => {
                              return (
                                <React.Fragment key={index}>
                                  {item.name !== "VIP" && (
                                    <View style={{ height: 50 }} >
                                      <TouchableOpacity
                                        style={[styles.zone_btn,
                                        item.active && { backgroundColor: '#6844f9' }]}
                                        onPress={() => {
                                          setSelectTypeStatus(false)
                                          setSelectQuantityStatus(false)
                                          let arr = [...chooseSeats];
                                          arr.map((item, i) => {
                                            if (i === index) {
                                              arr[i]["active"] = true;
                                            } else {
                                              arr[i]["active"] = false;
                                            }
                                          })
                                          let arrs = [...elementTypeByZone];
                                          elementTypeByZone.map((item, index) => {
                                            return (
                                              item.active = false
                                            )
                                          })
                                          let arr1 = [...selectQuantity];
                                          selectQuantity.map((item, index) => {
                                            item.status = false;
                                          })
                                          setSelectQuantity(arr1)
                                          setCurrentQuantity(0)
                                          setElementTypeByZone(arrs)
                                          setCurrentType("")
                                          setTotalPriceValue(0)
                                          getTotalPriceValue(priceValueData, dayArrs, currentZoneId, "", item.id)
                                          setCurrnetZoneId(item.id)
                                          setCurrentType("")
                                          gettingReservation(startDay, endDay, item.id)
                                          setChooseSeats(arr)
                                          filterElement(item.name)
                                        }}
                                      >
                                        <Text style={[styles.zone_btn_text, item.active && { color: 'white' }]}>{item.name}</Text>
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </React.Fragment>
                              )
                            })}
                          </Animated.ScrollView>
                        </View>
                      )}
                    </React.Fragment>
                  )}
                  {(!vipSeats && !bookedStatus) && (
                    <React.Fragment>
                      {elementTypeByZone.map((item, index) => (
                        <View
                          key={index}
                          style={{ paddingHorizontal: 15, paddingTop: 10 }}
                        >
                          <ListTouchable
                            style={styles.seat_item_view}
                            onPress={() => {
                              setSelectTypeStatus(true)
                              let arr = [...elementTypeByZone];
                              arr.map((list) => {
                                if (list.name === item.name) {
                                  if (list.name == "sunbed") {
                                    setCurrentType("sunBed")
                                    setTotalPriceValue(0)
                                    getTotalPriceValue(priceValueData, dayArrs, currentZoneId, "sunBed", currentQuantity)
                                  } else {
                                    setCurrentType("bed")
                                    setTotalPriceValue(0)
                                    getTotalPriceValue(priceValueData, dayArrs, currentZoneId, "bed", currentQuantity)
                                  }
                                  list.active = true;
                                } else {
                                  list.active = false;
                                }
                              })
                              setElementTypeByZone(arr)
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
                                    source={_renderSeatImage(item.name)}
                                    style={styles.seat_caban_img}
                                  />
                                  <Text style={styles.seat_item_title_text}>
                                    {capitalize(item.name)}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </ListTouchable>
                        </View>))}
                    </React.Fragment>
                  )}
                </View >
                {(!vipSeats && !bookedStatus) && (
                  <React.Fragment>
                    <View style={[styles.line_text]} />
                    <Text style={[styles.reservation_person, { paddingTop: 11, paddingBottom: 3, color: 'black' }]}>{i18n.t('SELECT_QUANTITY')}</Text>
                    <View>
                      <Animated.ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 15 }}>
                          {selectQuantity.map((item, index) => {
                            return (
                              <TouchableOpacity
                                key={index}
                                style={[styles.person_button, item.status && { backgroundColor: '#6844F9' }]}
                                onPress={() => {
                                  setSelectQuantityStatus(true)
                                  let arr = [...selectQuantity];
                                  arr.map((list, index) => {
                                    if (list.id == item.id) {
                                      list.status = true;
                                      getTotalPriceValue(priceValueData, dayArrs, currentZoneId, currentType, item.id)
                                      setCurrentQuantity(item.id)
                                    } else {
                                      list.status = false;
                                    }
                                  })
                                  setSelectQuantity(arr)
                                }}
                              >
                                <View>
                                  <Text style={[styles.person_button_text, item.status && { color: 'white' }]}>{item.id}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                          })}
                        </View>
                      </Animated.ScrollView>
                    </View>
                  </React.Fragment>
                )}
              </React.Fragment>
            )
          }
          <View>
            <Text style={[styles.reservation_person, { paddingBottom: 10 }]}>{i18n.t('Comment')}</Text>
          </View>
          <View style={[styles.comment_layout, { paddingHorizontal: 25 }]}>
            <UselessTextInput
              multiline
              numberOfLines={3}
              onChangeText={text => onChangeText(text)}
              value={value}
              style={styles.commnet_style}
            />
          </View>
        </React.Fragment>
      </ScrollView >
      <BookCalendar
        start={{}}
        end={{}}
        close={() => { setBookCalendarVisible(false) }}
        next={async (start, end) => {
          setSelectReservationTime(false)
          let arrs = [...elementTypeByZone];
          elementTypeByZone.map((item, index) => {
            return (
              item.active = false
            )
          })
          let arr1 = [...selectQuantity];
          selectQuantity.map((item, index) => {
            item.status = false;
          })
          setSelectQuantity(arr1)
          setCurrentQuantity(0)
          setElementTypeByZone(arrs)
          setCurrentType("")
          setTotalPriceValue(0)
          var today = new Date(start.dateString);
          gettingReservation(start.dateString, end.dateString ? end.dateString : "", currentZoneId)
          getTotoalPrice(start.dateString, end.dateString ? end.dateString : "")
          if (closedDays.length > 0) {
            let arr2 = [];
            closedDays.map((item, index) => {
              arr2.push(item.closed_day.split('T')[0])
              // arr2.push(item)
            });
            console.log(arr2, start.dateString, "$$$$$$$$$$$$$$$$$$$$")
            const filterResult = arr2.filter(ele => ele == start.dateString)
            if (filterResult.length > 0) {
              setReservationTime([])
              setErrorStatus(true)
            } else {
              setLoadingStatus(true)
              getTimeLine(props.route.params.business.id, daylist[today.getDay()])
            }
          } else {
            getTimeLine(props.route.params.business.id, daylist[today.getDay()])
          }
          setStartDay(start.dateString);
          setEndDay(end.dateString ? end.dateString : "");
          setBookCalendarVisible(false);
          if (start.dateString && end.dateString) {
            getDayArrs(start.dateString, end.dateString)
          }
        }
        }
        businessType={business.type}
        isVisible={bookCalendarVisible}
      />
      <PaymentChoose
        close={() => {
          setPaymentChooseVisible(false)
        }}
        next={() => {
          // this.setState({ paymentAddVisible: true });
          setPaymentAddVisible(true)
        }}
        getCards={() => {
          getCards()
        }}
        paySecretToken={paySecretToken}
        payPublishToken={payPublishToken}
        cards={cards}
        reservationId={reservationId}
        isVisible={paymentChooseVisible}
      />
      <AddCard
        close={() => {
          setPaymentAddVisible(false)
        }}
        next={() => {

        }}
        reservationId={reservationId}
        email={"popic_yahoo@gmail.com"}
        isVisible={paymentAddVisible}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalViewTimeLine}>
            <Text style={styles.modalTitle}>{i18n.t('Time_line')}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.names_day1}>
                <Text style={styles.textBody}>{""}</Text>
              </View>
              <View style={styles.names_day2}><Text style={styles.textBody_left}>{i18n.t('Working hr')}</Text></View>
              <View style={styles.names_day2}><Text style={styles.textBody_left}>{i18n.t('Break Time')}</Text></View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.names_day1}>
                <Text style={styles.textBody}>{i18n.t('Sunday')}</Text>
              </View>
              {workingHour.sun_start ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.sun_start}{' - '}{workingHour.sun_end}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('Close')}</Text></View>
              )}
              {workingHour.sun_start_break ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.sun_start_break}{' - '}{workingHour.sun_end_break}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('N/A')}</Text></View>
              )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.names_day1}><Text style={styles.textBody}>{i18n.t('Monday')}</Text></View>
              {workingHour.mon_start ? (
                <View style={styles.names_day2}><Text style={[styles.textBody_left]}>{workingHour.mon_start}{' - '}{workingHour.mon_end}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('Close')}</Text></View>
              )}
              {workingHour.mon_start_break ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.mon_start_break}{' - '}{workingHour.mon_end_break}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('N/A')}</Text></View>
              )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.names_day1}><Text style={styles.textBody}>{i18n.t('Tuesday')}</Text></View>
              {workingHour.tue_start ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.tue_start}{' - '}{workingHour.tue_end}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('Close')}</Text></View>
              )}
              {workingHour.tue_start_break ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.tue_start_break}{' - '}{workingHour.tue_end_break}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('N/A')}</Text></View>
              )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.names_day1}><Text style={styles.textBody}>{i18n.t('Wednesday')}</Text></View>
              {workingHour.wed_start ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.wed_start}{' - '}{workingHour.wed_end}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('Close')}</Text></View>
              )}
              {workingHour.wed_start_break ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.wed_start_break}{' - '}{workingHour.wed_end_break}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('N/A')}</Text></View>
              )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.names_day1}><Text style={styles.textBody}>{i18n.t('Thursday')}</Text></View>
              {workingHour.thu_start ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.thu_start}{' - '}{workingHour.thu_end}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('Close')}</Text></View>
              )}
              {workingHour.thu_start_break ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.thu_start_break}{' - '}{workingHour.thu_end_break}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('N/A')}</Text></View>
              )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.names_day1}><Text style={styles.textBody}>{i18n.t('Friday')}</Text></View>
              {workingHour.fri_start ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.fri_start}{' - '}{workingHour.fri_end}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('Close')}</Text></View>
              )}
              {workingHour.fri_start_break ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.fri_start_break}{' - '}{workingHour.fri_end_break}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('N/A')}</Text></View>
              )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.names_day1}><Text style={styles.textBody}>{i18n.t('Saturday')}</Text></View>
              {workingHour.sat_start ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.sat_start}{' - '}{workingHour.sat_end}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('Close')}</Text></View>
              )}
              {workingHour.sat_start_break ? (
                <View style={styles.names_day2}><Text style={styles.textBody_left}>{workingHour.sat_start_break}{' - '}{workingHour.sat_end_break}</Text></View>
              ) : (
                <View style={styles.names_day2}><Text style={[styles.textBody_left, { color: 'red' }]}>{i18n.t('N/A')}</Text></View>
              )}
            </View>
            {closedDays.length > 0 && (
              <Text style={styles.modalTitle_closedDay}>{i18n.t('Closed Days')}</Text>
            )}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              {closedDays.length > 0 && closedDays.map((item, index) => {
                return (
                  <View key={index} style={{ paddingTop: 5 }}><Text style={{ fontSize: 14, color: 'red' }}>{item.closed_day.split('T')[0].split('-')[2]}{"-"}{item.closed_day.split('T')[0].split('-')[1]}{", "}</Text></View>
                )
              })}
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', paddingTop: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible)
                }}>
                <View
                  style={{ backgroundColor: '#6844F9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 7 }}
                >
                  <Text style={{ color: 'white' }}>{i18n.t('Close')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={priceModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setPriceModalVisible(!priceModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ paddingBottom: 10 }}>{i18n.t('price_detail')}</Text>
            <Text style={{ fontWeight: 'bold', paddingBottom: 20 }}>{i18n.t('price_note')}</Text>
            <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  setPriceModalVisible(!priceModalVisible)
                }}>
                <View
                  style={{ backgroundColor: '#6844F9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 7 }}
                >
                  <Text style={{ color: 'white' }}>{i18n.t('Close')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {
        business.type == "restaurant" && errorStatus && (
          <View style={{ backgroundColor: 'red' }}>
            <Text style={{ color: 'white', paddingHorizontal: 10 }}>{i18n.t('closeday_error_info')}</Text>
          </View>
        )
      }
      <View style={[styles.reserve_view, { justifyContent: 'space-between' }]}>
        <View style={styles.bottom_layout_info}>
          <View>
            {totalPriceValue > 0 && (
              <Text
                style={{ fontWeight: 'bold', paddingTop: 10 }}
              >
                {totalPriceValue}{businessData.currency}{" / "}{dayArrs.length}{" day"}
              </Text>
            )}
          </View>
          {/* businessData.settings.guaranteed_reservation */}
          {businessData.settings ? (
            <React.Fragment>
              {!errorStatus && businessData.settings.guaranteed_reservation > 0 && (
                <React.Fragment>
                  <View>
                    <Text
                      style={{ fontWeight: 'bold', paddingTop: 10, color: 'black' }}
                    >
                      {businessData.settings.guaranteed_reservation}{' '}{businessData.currency}
                    </Text>
                  </View>
                  {business.type == "restaurant" && (
                    <TouchableOpacity style={[{ backgroundColor: 'white', paddingTop: 2 }]}
                      onPress={
                        () => { setPriceModalVisible(!priceModalVisible) }
                      }
                    >
                      <Image source={Information} style={styles.information_icon_style} />
                    </TouchableOpacity>
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <></>
          )}
        </View>
        <React.Fragment>
          {(business.type == "restaurant" || business.type == "terrace" || business.type == "club") && (
            <React.Fragment>
              {(errorStatus || !(selectReservationTime && selectPersonNumber)) ? (
                <View style={styles.reserve_btn_disable}>
                  <Text style={styles.reserve_btn_text_disable}>{i18n.t('Reserve')}</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.reserve_btn}
                  onPress={() => {
                    setPaymentChooseVisible(true)
                  }}
                >
                  <Text style={styles.reserve_btn_text}>{i18n.t('Reserve')}</Text>
                </TouchableOpacity>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
        <React.Fragment>
          {(business.type == "beach" || business.type == "pool") && (
            <React.Fragment>
              {!(selectQuantityStatus && selectTypeStatus) ? (
                <View style={styles.reserve_btn_disable}>
                  <Text style={styles.reserve_btn_text_disable}>{i18n.t('Reserve')}</Text>
                </View>
              ) : (
                <TouchableOpacity style={styles.reserve_btn}
                  onPress={() => {
                    setPaymentChooseVisible(true)
                  }}
                >
                  <Text style={styles.reserve_btn_text}>{i18n.t('Reserve')}</Text>
                </TouchableOpacity>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      </View>
    </View >
  );
}
export { ReservationDetail };
const styles = StyleSheet.create({
  layout: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    position: 'relative'
  },
  container: {
    position: 'relative'
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
    paddingHorizontal: 10,
    color: '#898989',
    marginTop: 7,
  },
  seat_item_view: {
    paddingLeft: 16,
    flexDirection: 'row',
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
  zone_layout: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    paddingTop: 5
  },
  zone_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    margin: 5,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 8
  },
  zone_btn_text: {
    fontSize: 14,
    color: 'black',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd' : 'Circular-Std',
  },
  seat_text: {
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  backbtn: {
    width: 15,
    height: 15,
  },
  back_btn_layout: {
    paddingHorizontal: 20,
    paddingVertical: 10
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
  reserve_btn: {
    backgroundColor: '#6844F9',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  reserve_btn_text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  reservation_person: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 15,
    paddingTop: 7
  },
  reservation_time_button: {
    width: 75,
    height: 45,
    borderWidth: 1,
    borderColor: 'lightgray',
    margin: 10,
    borderRadius: 8
  },
  person_button: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: 'lightgray',
    margin: 10,
    borderRadius: 8
  },
  person_button_text: {
    paddingTop: 11,
    fontSize: 16,
    color: 'black',
    textAlign: 'center'
  },
  selected_date: {
    backgroundColor: '#6844F9',
    height: 30,
    borderRadius: 6
  },
  selected_date_text: {
    fontWeight: 'bold',
    color: 'white',
    paddingHorizontal: 10
  },
  modalView: {
    width: '100%',
    height: '98%',
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalViewTimeLine: {
    width: '100%',
    height: '98%',
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 15,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textBody: {
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 5
  },
  textBody_left: {
    fontWeight: '500',
    fontSize: 14,
    paddingTop: 8,
    textAlign: 'center'
  },
  reserve_view: {
    flexDirection: 'row',
    width: '100%',
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
  calendarStyle: {
    width: 20,
    height: 20,
    tintColor: '#6844f9'
  },
  commnet_style: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20
  },
  comment_layout: {
    paddingHorizontal: 15
  },
  information_icon_style: {
    width: 40,
    height: 40,
    tintColor: '#6844f9'
  },
  bottom_layout_info: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  names_day1: {
    width: '20%'
  },
  names_day2: {
    width: '40%'
  },
  modalTitle_closedDay: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingTop: 20
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
