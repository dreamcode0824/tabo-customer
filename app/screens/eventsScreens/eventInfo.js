import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Share from 'react-native-share';
import MapView, {Marker} from 'react-native-maps';
import ApiGraphQl from '../../networking/apiGraphQl';
import {
  Comming,
  LikeBusiness,
  Map,
  FullSceenVideo,
  CaruselVideo,
  PaymentChoose,
  AddCard,
  ListTouchable,
} from '../../components';
import i18n from '../../constants/i18next';
import Orientation from 'react-native-orientation';

const imgHeight = Dimensions.get('window').width;

class EventInfoClass extends Component {
  apigraphql = new ApiGraphQl();
  canLike = true;

  constructor(props) {
    super(props);
    this.state = {
      playBtn: true,
      fullSceenVideoVisible: false,
      commingVisible: false,
      paymentChooseVisible: false,
      paymentAddVisible: false,
      statusEvent: this.props.route.params.event.status
        ? this.props.route.params.event.status.status
        : '',
      statusId: this.props.route.params.event.status
        ? this.props.route.params.event.status.id
        : null,
      like: props.route.params.event.like,
      likeId: props.route.params.event.likeId,
      galery: [],
      timeVideo: 0,
      urlFullScreen: '',
      amount: '',
      autoPlay: {},
      playKey: {},
      zone: [],
      cards: [],
      zoneIndex: null,
      personeCount: null,
      going: this.props.route.params.event.going
        ? this.props.route.params.event.going
        : 0,
      interested: this.props.route.params.event.interested
        ? this.props.route.params.event.interested
        : 0,
    };
    this.businessEventPrices();
    this.getCards();
  }

  ststusChange() {
    if (this.state.statusEvent) {
      if (this.state.statusEvent === 'intersted') {
        this.setState({
          interested: this.state.interested + 1,
        });
      }
      if (this.state.statusEvent === 'going') {
        this.setState({
          going: this.state.going + 1,
        });
      }
    }
  }

  componentWillUnmount() {
    if (!this.state.like && this.props.route.params.type) {
      this.props.route.params.like();
    }
  }

  businessEventPrices() {
    if (
      this.props.route.params.event.status &&
      this.props.route.params.event.status.status === 'reserved'
    ) {
      return;
    }
    this.apigraphql
      .businessEventPrices(this.props.route.params.event.id)
      .then((data) => {
        let zone = data.data.business_event_prices;
        let length = zone.length;
        for (let i = 0; i < zone.length; i++) {
          zone[i] = {...zone[i], status: length === 1 ? true : false};
        }
        this.setState({
          zone: zone,
          zoneIndex: length ? null : 0,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCards() {
    this.apigraphql
      .getStripeCard(this.props.user.id)
      .then((data) => {
        let arr = data.data.stripe_card.map((data, index) => {
          if (index === 0) {
            return {...data, active: true};
          }
          return {...data, active: false};
        });
        this.setState({
          cards: arr,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.amount) {
      if (
        prevState.zoneIndex !== this.state.zoneIndex ||
        prevState.personeCount !== this.state.personeCount
      ) {
        this.reserveUpdate();
      }
    }
  }

  autoPlay() {
    let obj = {};
    this.props.route.params.event.images.map((data, index) => {
      if (data.type === 'video') {
        obj[index] = true;
      }
    });
    this.setState({
      autoPlay: obj,
    });
  }

  componentDidMount() {
    this.ststusChange();
    this.autoPlay();
  }

  changeStatus(status) {
    if (!this.state.statusEvent) {
      return this.createStatus(status);
    }
    if (this.state.statusEvent === status) {
      return this.deleteStatus(status);
    }
    return this.updateStatus(status);
  }

  updateStatus(status) {
    let info = {
      status: status,
      status_id: this.state.statusId,
    };
    this.apigraphql.updateEventStatus(info).then((data) => {
      if (status === 'going') {
        this.setState({
          statusEvent: 'going',
          going: this.state.going + 1,
          interested: this.state.interested - 1,
        });
      } else {
        this.setState({
          statusEvent: 'intersted',
          going: this.state.going - 1,
          interested: this.state.interested + 1,
        });
      }
      this.props.route.params.changeStatusEvent(
        data.data.customer_event_statusUpdate,
        this.props.route.params.index,
        'update',
      );
    });
  }

  deleteStatus(status) {
    let info = {
      status_id: this.state.statusId,
    };
    this.apigraphql.deleteEventStatus(info).then((data) => {
      if (status === 'going') {
        this.setState({
          statusEvent: '',
          going: this.state.going - 1,
          statusId: null,
        });
      } else {
        this.setState({
          statusEvent: '',
          interested: this.state.interested - 1,
          statusId: null,
        });
      }
      this.props.route.params.changeStatusEvent(
        {},
        this.props.route.params.index,
        'delete',
      );
    });
  }

  likeChange() {
    if (this.props.route.params.type) {
      return this.setState({
        like: !this.state.like,
      });
    }
    if (!this.canLike) {
      return;
    }
    this.canLike = false;
    if (!this.state.like) {
      this.apigraphql
        .eventLikeCreate({
          customer_id: this.props.user.id,
          event_id: this.props.route.params.event.id,
        })
        .then((like) => {
          let saveData = {
            like: true,
            likeId: like.data.customer_liked_eventCreate.id,
          };
          this.props.route.params.like();
          this.setState(saveData, () => {
            this.canLike = true;
          });
        })
        .catch((err) => {
          console.log(err);
          this.canLike = true;
        });
    }
    if (this.state.like) {
      this.apigraphql
        .deleteLike(this.state.likeId)
        .then((data) => {
          this.props.route.params.like();
          this.setState(
            {
              like: false,
            },
            () => {
              this.canLike = true;
            },
          );
        })
        .catch((err) => {
          console.log(err);
          this.canLike = true;
        });
    }
  }

  createStatus(status) {
    let info = {
      status: status,
      event_id: this.props.route.params.event.id,
    };
    this.apigraphql
      .createEventStatus(info)
      .then((data) => {
        if (status === 'going') {
          this.setState({
            statusEvent: 'going',
            going: this.state.going + 1,
            statusId: data.data.customer_event_statusCreate.id,
          });
        } else {
          this.setState({
            statusEvent: 'intersted',
            interested: this.state.interested + 1,
            statusId: data.data.customer_event_statusCreate.id,
          });
        }
        this.props.route.params.changeStatusEvent(
          data.data.customer_event_statusCreate,
          this.props.route.params.index,
          'create',
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fullSceen = (data) => {
    Orientation.lockToLandscapeRight();
    this.setState({
      urlFullScreen: data,
      fullSceenVideoVisible: true,
    });
  };

  startPaly = (index, status) => {
    let obj = this.state.autoPlay;
    let playKey = {};
    if (status === 'scroll') {
      obj[this.state.playKey.key] = !obj[this.state.playKey.key];
      return this.setState({
        autoPaly: obj,
        playBtn: true,
        playKey: {},
      });
    }
    if (status === 'finish') {
      obj[index] = true;
      return this.setState({
        autoPaly: obj,
      });
    }
    obj[index] = !obj[index];
    if (!obj[index]) {
      playKey = {
        key: index,
      };
    }
    this.setState({
      autoPaly: obj,
      playBtn: !this.state.playBtn,
      playKey: playKey,
    });
  };

  headerBorder() {
    if (Object.keys(this.state.playKey).length) {
      this.startPaly(this.state.playKey.key);
    }
  }

  changeZone(i) {
    let zone = this.state.zone;
    if (this.state.zoneIndex === i) {
      zone[i] = {...zone[i], status: !this.state.zone[i].status};
      return this.setState({
        zoneIndex: null,
        zone: zone,
      });
    }
    if (this.state.zoneIndex !== null) {
      zone[this.state.zoneIndex] = {
        ...zone[this.state.zoneIndex],
        status: false,
      };
    }
    zone[i] = {...zone[i], status: !this.state.zone[i].status};
    this.setState({
      zoneIndex: i,
      zone: zone,
    });
  }

  _renderZone() {
    return this.state.zone.map((data, index) => {
      return (
        <ListTouchable
          key={index}
          style={{paddingHorizontal: 16, paddingVertical: 10}}
          onPress={() => this.changeZone(index)}>
          <View>
            <View style={styles.zone_btn}>
              <View
                style={[
                  styles.zone_item_checkbox,
                  {marginTop: 3, marginRight: 7},
                  data.status && {borderColor: '#6844F9'},
                ]}>
                <Text
                  style={[
                    styles.zone_item_checkbox_text,
                    data.status && {backgroundColor: '#6844F9'},
                  ]}
                />
              </View>
              <Text style={styles.zone_name_text}>{data.zone}</Text>
            </View>
            <Text style={styles.xone_price_zone}>
              {data.price} {data.currency}
            </Text>
          </View>
        </ListTouchable>
      );
    });
  }

  reserveBtn() {
    let cards = this.state.cards;
    if (this.state.statusEvent === 'reserved') {
      return;
    }
    if (this.state.amount && cards) {
      return this.setState({
        paymentChooseVisible: true,
      });
    }
    if (this.state.amount && !cards) {
      return this.setState({
        paymentAddVisible: true,
      });
    }
    if (this.state.zoneIndex !== null) {
      return this.setState({
        commingVisible: true,
      });
    }
    if (this.state.zoneIndex === null) {
      return Alert.alert(
        '',
        'Please choose zone ',
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
  }

  reserve(count) {
    let info = {
      person_quantity: count,
      business_event_id: this.props.route.params.event.id,
      price_id: this.state.zone[this.state.zoneIndex].id,
    };
    this.apigraphql
      .createReserveEvent(info)
      .then((data) => {
        this.setState({
          reserveCreateId: data.data.business_event_reservationCreate.id,
          amount: `${data.data.business_event_reservationCreate.amount} ${data.data.business_event_reservationCreate.currency}`,
          commingVisible: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  reserveUpdate = () => {
    let info = {
      id: this.state.reserveCreateId,
      person_quantity: this.state.personeCount,
      price_id: this.state.zone[this.state.zoneIndex].id,
    };
    this.apigraphql
      .updateReserveEvent(info)
      .then((data) => {
        this.setState({
          reserveCreateId: data.data.business_event_reservationUpdate.id,
          amount: `${data.data.business_event_reservationUpdate.amount} ${data.data.business_event_reservationUpdate.currency}`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  share() {
    const {id} = this.props.route.params.event;
    const shareOptions = {
      title: 'text',
      url: `http://www.tabo.io/event/${id}`,
    };

    Share.open(shareOptions)
      .then((res) => {
        //  console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  render() {
    return (
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          onScroll={() => {
            this.headerBorder();
          }}>
          <View style={styles.photoContainer}>
            <View>
              <CaruselVideo
                data={this.props.route.params.event.images}
                style={'full'}
                fullSceen={this.fullSceen}
                autoPlay={this.state.autoPlay}
                startPaly={this.startPaly}
                playBtn={this.state.playBtn}
                playKey={this.state.playKey}
              />
            </View>
            <TouchableOpacity
              style={styles.icon_btn}
              onPress={() => {
                this.share();
              }}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={{width: 17.1, height: 17}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.close_btn}
              onPress={() => this.props.navigation.goBack()}>
              <Image
                source={require('../../assets/images/close.png')}
                style={{width: 35, height: 35}}
              />
            </TouchableOpacity>
            <LikeBusiness
              active={this.state.like}
              setActive={() => {
                this.likeChange();
              }}
            />
            <View style={styles.category}>
              <Text style={styles.categoryText}>
                {moment(this.props.route.params.event.date).format(
                  'DD MMM YYYY',
                )}
              </Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.event_info}>
              <View>
                <Text style={styles.title}>
                  {this.props.route.params.event.title}
                </Text>
                <View style={styles.row}>
                  <Image
                    style={styles.markerIcon}
                    source={require('../../assets/images/marker.png')}
                  />
                  <Text style={styles.locationText}>
                    {this.props.route.params.event.location_name} |{' '}
                    {moment(this.props.route.params.event.date).format(
                      'hh:mm A',
                    )}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.count}>
              {this.state.going > 0 ? (
                <Text style={styles.count_text}>
                  {this.state.going} {i18n.t('GOING')}
                  {this.state.interested > 0 ||
                  this.props.route.params.event.reserved > 0 ? (
                    <Text> |</Text>
                  ) : null}
                </Text>
              ) : null}
              {this.state.interested > 0 ? (
                <Text style={styles.count_text}>
                  {this.state.interested} {i18n.t('INTERSTED')}
                  {this.props.route.params.event.reserved > 0 ? (
                    <Text> |</Text>
                  ) : null}
                </Text>
              ) : null}
              {this.props.route.params.event.reserved > 0 ? (
                <Text style={styles.count_text}>
                  {this.props.route.params.event.reserved} {i18n.t('RESERVED')}{' '}
                </Text>
              ) : null}
            </View>
            <View style={[styles.btn_view, {marginTop: 20}]}>
              {this.state.statusEvent === 'reserved' ? (
                <View
                  style={[styles.intersted_btn, {backgroundColor: '#6844F9'}]}>
                  <Text style={[styles.going_btn_text, {color: '#fff'}]}>
                    {i18n.t('RESERVED')}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 16,
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.intersted_btn,
                      this.state.statusEvent === 'going'
                        ? {backgroundColor: '#6844F9'}
                        : {backgroundColor: '#fff'},
                    ]}
                    onPress={() => this.changeStatus('going')}>
                    <Text
                      style={[
                        styles.going_btn_text,
                        this.state.statusEvent === 'going'
                          ? {color: '#fff'}
                          : {color: '#6844F9'},
                      ]}>
                      {i18n.t('GOING')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.intersted_btn,
                      this.state.statusEvent === 'intersted'
                        ? {backgroundColor: '#6844F9'}
                        : {backgroundColor: '#fff'},
                    ]}
                    onPress={() => this.changeStatus('intersted')}>
                    <Text
                      style={[
                        styles.going_btn_text,
                        this.state.statusEvent === 'intersted'
                          ? {color: '#fff'}
                          : {color: '#6844F9'},
                      ]}>
                      {i18n.t('INTERSTED')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {this.state.personeCount ? (
              <View style={{marginTop: 20}}>
                <Text style={styles.reserve_info_titel}>
                  {i18n.t('BOOKING_INFOTMATION')}
                </Text>
                <TouchableOpacity
                  style={styles.count_edit}
                  onPress={() => this.setState({commingVisible: true})}>
                  <View style={styles.count_view}>
                    <Image
                      source={require('../../assets/images/child.png')}
                      style={{width: 15, resizeMode: 'contain', height: 15}}
                    />
                    <Text style={styles.count_persone_text}>
                      {this.state.personeCount}
                    </Text>
                  </View>
                  <Text style={{marginRight: 16}}>{i18n.t('EDIT')}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View style={styles.smallTitleContainer}>
              <Text style={styles.smallTitle}>{i18n.t('DESCRIPION')}</Text>
            </View>
            <Text style={styles.desc}>
              {this.props.route.params.event.description}
            </Text>

            <View style={styles.smallTitleContainer}>
              <Text style={styles.smallTitle}>{i18n.t('LOCATION')}</Text>
            </View>
            <TouchableOpacity
              style={{height: 180, marginTop: 20, marginHorizontal: 16}}
              onPress={() => this.setState({mapVisible: true})}>
              <MapView
                style={{width: '100%', height: '100%'}}
                mapType={'terrain'}
                region={{
                  latitude: Number(
                    this.props.route.params.event.location_position.latitude,
                  ),
                  longitude: Number(
                    this.props.route.params.event.location_position.longitude,
                  ),
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                scrollEnabled={false}
                zoomEnabled={false}>
                <Marker
                  coordinate={{
                    latitude: Number(
                      this.props.route.params.event.location_position.latitude,
                    ),
                    longitude: Number(
                      this.props.route.params.event.location_position.longitude,
                    ),
                  }}
                />
              </MapView>
            </TouchableOpacity>
            {this.state.zone.length ? (
              <View style={styles.zone_view}>
                <Text
                  style={[
                    styles.smallTitle,
                    {
                      marginTop: 20,
                      borderTopColor: 'rgba(151, 151, 151, 0.13)',
                      borderTopWidth: 1,
                      marginHorizontal: 16,
                      marginBottom: 10,
                      paddingTop: 20,
                    },
                  ]}>
                  {i18n.t('CHOOSE_ZONE')}
                </Text>
                {this._renderZone()}
              </View>
            ) : null}
          </View>
        </ScrollView>
        <View style={styles.reserve_view}>
          <Text style={styles.price_text}>
            <Text
              style={[
                styles.price_text,
                {
                  color: '#000',
                  fontFamily:
                    Platform.OS === 'ios'
                      ? 'CircularStd-Bold'
                      : 'Circular-Std-Bold',
                  fontSize: 16,
                },
              ]}>
              {this.state.amount}
            </Text>
          </Text>
          <View style={styles.btn_view}>
            <TouchableOpacity
              style={[
                styles.reserve_btn,
                this.state.statusEvent === 'reserved'
                  ? {backgroundColor: 'black'}
                  : null,
              ]}
              onPress={() => {
                this.reserveBtn();
              }}>
              {this.state.statusEvent === 'reserved' ? (
                <Text style={styles.reserve_btn_text}>{i18n.t('CANCEL')}</Text>
              ) : this.state.personeCount ? (
                <Text style={styles.reserve_btn_text}>{i18n.t('PAY')}</Text>
              ) : (
                <Text style={styles.reserve_btn_text}>{i18n.t('RESERVE')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Comming
          close={() => {
            this.setState({commingVisible: false});
          }}
          date={this.props.route.params.event.date}
          reserve={(count) => {
            this.setState({
              commingVisible: false,
              personeCount: count,
            });
            if (!this.state.amount) {
              this.reserve(count);
            }
          }}
          skip={() => {
            this.setState({commingVisible: false});
          }}
          name={this.props.route.params.event.title}
          navigation={this.props.navigation}
          isVisible={this.state.commingVisible}
        />
        <Map
          close={() => {
            this.setState({mapVisible: false});
          }}
          location={this.props.route.params.event.location_position}
          isVisible={this.state.mapVisible}
        />
        <FullSceenVideo
          close={() => {
            Orientation.lockToPortrait();
            this.setState({fullSceenVideoVisible: false});
          }}
          paused={!this.state.fullSceenVideoVisible}
          url={this.state.urlFullScreen}
          isVisible={this.state.fullSceenVideoVisible}
        />
        <PaymentChoose
          close={() => {
            this.setState({paymentChooseVisible: false});
          }}
          next={() => {
            this.setState({paymentAddVisible: true});
          }}
          pay={() => {
            this.setState({paymentAddVisible: true});
          }}
          getCards={() => {
            this.getCards();
          }}
          cards={this.state.cards}
          reservationId={this.reservationId}
          isVisible={this.state.paymentChooseVisible}
        />
        <AddCard
          close={() => {
            this.setState({paymentAddVisible: false});
          }}
          next={() => {}}
          reservationId={this.reservationId}
          email={this.props.user.email}
          isVisible={this.state.paymentAddVisible}
        />
      </View>
    );
  }
}

export const EventInfo = connect(({user}) => ({user}))(EventInfoClass);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  photoContainer: {
    height: (imgHeight * 9) / 16,
  },
  photo: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  icon_btn: {
    height: 38,
    width: 38,
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
  },
  close_btn: {
    position: 'absolute',
    left: 16,
    top: 19,
  },
  category: {
    position: 'absolute',
    left: 16,
    bottom: 24,
    backgroundColor: '#fff',
    borderRadius: 2,
    height: 26,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  categoryText: {
    fontSize: 12,
    lineHeight: 15,
    color: 'black',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  event_info: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  btn_view: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price_text: {
    color: '#898989',
    fontSize: 12,
  },
  going_btn: {
    minWidth: 75,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6844F9',
    borderRadius: 8,
    marginRight: 12,
  },
  intersted_btn: {
    paddingHorizontal: 6,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6844F9',
    borderRadius: 8,
    marginRight: 16,
  },
  going_btn_text: {
    fontSize: 12,
    color: '#6844F9',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginHorizontal: 4,
  },
  reserve_btn: {
    width: 108,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6844F9',
    borderRadius: 8,
  },
  reserve_btn_text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  title: {
    color: 'black',
    fontSize: 18,
    lineHeight: 20,
    marginTop: 14,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
  },
  markerIcon: {
    height: 12.8,
    width: 10,
  },
  locationText: {
    marginLeft: 6,
    color: '#828282',
    fontSize: 14,
    lineHeight: 16,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Book',
  },
  count: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  count_text: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 16,
    marginRight: 4,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Book',
    color: '#898989',
  },
  smallTitleContainer: {
    marginHorizontal: 16,
    borderTopColor: 'rgba(151, 151, 151, 0.13)',
    borderTopWidth: 1,
    paddingTop: 20,
    paddingBottom: 13,
    marginTop: 20,
  },
  smallTitle: {
    color: 'black',
    fontSize: 16,
    lineHeight: 18,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  reserve_info_titel: {
    marginHorizontal: 16,
    paddingTop: 20,
    borderTopColor: 'rgba(151, 151, 151, 0.13)',
    borderTopWidth: 1,
    color: 'black',
    fontSize: 16,
    lineHeight: 18,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  count_edit: {
    paddingTop: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  count_view: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  count_persone_text: {
    color: '#000',
    fontSize: 14,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    lineHeight: 19,
    marginLeft: 12,
  },
  desc: {
    paddingHorizontal: 16,
    color: '#979797',
    fontSize: 12,
    lineHeight: 15,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  map: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  zone_view: {
    marginTop: 20,
  },
  zone_btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zone_item_checkbox: {
    marginTop: 5,
    width: 15,
    height: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#979797',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zone_item_checkbox_text: {
    width: 7.5,
    height: 7.5,
    borderRadius: 50,
  },
  zone_name_text: {
    color: '#000',
    fontSize: 16,
    lineHeight: 20,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  xone_price_zone: {
    marginTop: 5,
    marginLeft: 20,
    color: '#898989',
    fontSize: 14,
    lineHeight: 20,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
});
