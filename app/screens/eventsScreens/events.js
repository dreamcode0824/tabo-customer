import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import {connect} from 'react-redux';
import {
  Like,
  CaruselVideo,
  ContentLoading,
  SearchInput,
  FullSceenVideo,
} from '../../components';
import ApiGraphQl from '../../networking/apiGraphQl';
import i18n from '../../constants/i18next';
import {MaterialIndicator} from 'react-native-indicators';
import Orientation from 'react-native-orientation';

const imgHeight = Dimensions.get('window').width;

class EventsClass extends Component {
  canLike = true;
  itemsOffset = 0;
  canLoadItems = true;

  canAnimate = true;
  offset = 0;
  where = 'where: {}';
  apigraphql = new ApiGraphQl();

  constructor(props) {
    super(props);
    this.state = {
      fullSceenVideoVisible: false,
      urlFullScreen: '',
      loading: true,
      events: [],
      likes: null,
      filter: [
        'Upcoming',
        'Going',
        'Interested',
        'Favorite',
        'Interest',
        'Favorit',
      ],
      filterItem: 'upcoming',
      curY: new Animated.Value(0),
      height: 185,
      elevation: 0,
      autoPlay: {},
      playKey: {},
      location: {},
      searchValue: '',
      loadItems: true,
      eventCardHeight: 0,
      eventNameHeight: 0,
      eventInfoViewHeight: 0,
    };
    this.findCoordinates(this.props.navigation);
  }

  // As EventPage data is hardcoded from route.params.
  // When app is opened using an deeplink it will call the getEvents and
  // navigate in to  specific event.
  componentDidMount() {
    console.log('CDM', this.props.route);
  }

  findCoordinates = (nav) => {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({location: position.coords});
        this.where = `where: {location: {x : ${position.coords.latitude}, y : ${position.coords.longitude}}}`;
        console.log(this.where);
        this.getEvents();
      },
      (error) => {
        this.getEvents();
      },
      {enableHighAccuracy: true},
    );
  };

  getEvents(page) {
    this.searched = false;
    if (!this.state.loading) {
      if (!this.state.loading && !page) {
        this.itemsOffset = 0;
        this.canLoadItems = true;
        this.setState({
          loading: true,
          loadItems: true,
          events: [],
        });
      }
    }

    this.canLoadItems = false;
    let where = `${this.where}, limit:5, offset: ${this.itemsOffset}`;
    this.itemsOffset = this.itemsOffset + 5;
    this.apigraphql
      .getEvents(where)
      .then((data) => {
        if (data.data.business_event.length) {
          let tempEvent = data.data.business_event.map((item, index) => {
            if (item.thumbnail) {
              let obj = this.state.autoPlay;
              obj[index] = true;
              this.setState({
                autoPlay: obj,
              });
              return {
                ...item,
                images: [
                  {
                    type: 'video',
                    thumbnail: item.thumbnail,
                    url: item.main,
                  },
                ],
              };
            } else {
              return {
                ...item,
                images: [
                  {
                    type: 'image',
                    url: item.main,
                  },
                ],
              };
            }
          });
          tempEvent = [...this.state.events, ...tempEvent];
          console.log(this.props.config);

          // If url redirection is true. Navigate to event info page.
          const {urlRedirection, urlRedirectionId} = this.props.config;
          if (urlRedirection) {
            const selectedEvent = tempEvent.find(
              (event) => event.id == urlRedirectionId,
            );

            const selectedIndex = tempEvent.findIndex(
              (event) => event.id == urlRedirectionId,
            );
            console.log('ss', selectedIndex);

            this.props.dispatch({
              type: 'REMOVE_URL_REDIRECTION',
            });

            this.props.navigation.navigate('EventInfo', {
              event: selectedEvent,
              changeStatusEvent: this.changeStatusEvent,
              like: () => {
                let arr = tempEvent;
                arr[selectedIndex].like = !arr[selectedIndex].like;
                this.setState({
                  events: arr,
                });
              },
              index: selectedIndex,
            });
          }

          this.setState(
            {
              loading: false,
              events: tempEvent,
              loadItems: data.data.business_event.length == 5,
            },
            () => {
              this.canLoadItems = data.data.business_event.length == 5;
            },
          );
          this.getCustomerEventStatus(tempEvent);
          this.getGalery(tempEvent);
          this.getLiked(tempEvent);
        } else {
          this.setState({
            loading: false,
            loadItems: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  search(text, page) {
    this.state.searchValue = text;
    this.setState({searchValue: text});
    clearTimeout(this.searchTimeout);

    if (text) {
      if (text.length < 3) {
        return this.setState({
          loading: false,
          loadItems: false,
        });
      }
      this.searched = true;
      if (!this.state.loading) {
        if (!this.state.loading && !page) {
          this.itemsOffset = 0;
          this.canLoadItems = true;
          this.setState({
            loading: true,
            loadItems: true,
            events: [],
          });
        }
      }

      this.searchTimeout = setTimeout(() => {
        this.canLoadItems = false;
        let options = `, limit:5, offset: ${this.itemsOffset}`;
        this.itemsOffset = this.itemsOffset + 5;
        let where = `where: {customer_id: ${this.props.user.id},  name: "event_search", search: "${text}"}${options}`;
        this.apigraphql
          .getWithFilter(where)
          .then((res) => {
            if (res.data.custom_query[0].result.length) {
              let tempEvent = res.data.custom_query[0].result.map((item) => {
                if (item.thumbnail) {
                  return {
                    ...item,
                    images: [
                      {
                        type: 'video',
                        thumbnail: item.thumbnail,
                        url: item.main,
                      },
                    ],
                    location_position: JSON.parse(item.location_position),
                  };
                } else {
                  return {
                    ...item,
                    images: [
                      {
                        type: 'image',
                        url: item.main,
                      },
                    ],
                    location_position: JSON.parse(item.location_position),
                  };
                }
              });
              tempEvent = [...this.state.events, ...tempEvent];
              this.setState(
                {
                  events: tempEvent,
                  loading: false,
                  loadItems: res.data.custom_query[0].result.length == 5,
                },
                () => {
                  this.canLoadItems =
                    res.data.custom_query[0].result.length == 5;
                },
              );
              this.getCustomerEventStatus(tempEvent);
              this.getGalery(tempEvent);
            } else {
              this.setState({
                loading: false,
                loadItems: false,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.setState({
              loading: false,
              events: [],
            });
          });
      }, 500);
    } else {
      this.getEvents();
    }
  }

  getCustomerEventStatus(events) {
    this.apigraphql
      .getCustomerEventStatus()
      .then((ststus) => {
        let arr = events;
        let statusEvent = ststus.data.customer_event_status;
        for (let i = 0; i < statusEvent.length; i++) {
          const event_id = statusEvent[i].event_id;
          for (let j = 0; j < events.length; j++) {
            const id = events[j].id;
            if (event_id === id) {
              arr[j] = {...events[j], status: statusEvent[i]};
            }
          }
        }
        this.setState({
          events: arr,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  capitalize = (s) => {
    if (typeof s !== 'string') {
      return '';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  getGalery(events) {
    this.apigraphql
      .getEventGallery()
      .then((gallery) => {
        let arr = this.state.events;
        for (let i = 0; i < events.length; i++) {
          if (events[i].images.length <= 1) {
            const event = events[i];
            let tempImages = gallery.data.business_event_gallery
              .filter(
                (item) =>
                  item.business_event_id == event.id &&
                  item.url != events[i].images[0].url,
              )
              .map((item) => {
                let obj = this.state.autoPlay;
                if (item.type === 'video') {
                  obj[i] = true;
                  this.setState({
                    autoPlay: obj,
                  });
                }
                return item;
              });
            arr[i].images = [...events[i].images, ...tempImages];
          }
        }
        this.setState({
          loading: false,
          events: arr,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getLiked(tempBusinesses) {
    let events = tempBusinesses;
    this.apigraphql
      .getLikeEvents()
      .then((likes) => {
        for (let i = 0; i < likes.data.customer_liked_event.length; i++) {
          const events_id = likes.data.customer_liked_event[i].event_id;
          for (let j = 0; j < events.length; j++) {
            const id = events[j].id;
            if (events_id == id) {
              events[j].like = true;
              events[j].likeId = likes.data.customer_liked_event[i].id;
              break;
            }
          }
        }
        this.setState({
          likes,
          events,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  like = (i) => {
    if (!this.canLike) {
      return;
    }
    this.canLike = false;
    if (!this.state.events[i].like && this.state.likes) {
      this.apigraphql
        .eventLikeCreate({
          customer_id: this.props.user.id,
          event_id: this.state.events[i].id,
        })
        .then((res) => {
          console.log(res);
          let arr = this.state.events;
          arr[i].like = true;
          arr[i].likeId = res.data.customer_liked_eventCreate.id;
          this.setState(
            {
              events: arr,
            },
            () => {
              this.canLike = true;
            },
          );
        })
        .catch((error) => {
          console.log(error);
          this.canLike = true;
        });
    } else if (this.state.events[i].like && this.state.likes) {
      this.apigraphql
        .deleteLike(this.state.events[i].likeId)
        .then((res) => {
          let arr = this.state.events;
          arr[i].like = false;
          this.setState(
            {
              events: arr,
            },
            () => {
              this.canLike = true;
            },
          );
        })
        .catch((error) => {
          console.log(error);
          this.canLike = true;
        });
    }
  };

  changeStatusEvent = (data, index, status) => {
    let arr = this.state.events;
    if (status === 'update') {
      arr[index].status = data;
    }
    if (status === 'create') {
      arr[index] = {...arr[index], status: data};
    }
    if (status === 'delete') {
      delete arr[index].status;
    }
    this.setState({
      events: arr,
    });
  };

  startPaly = (key, index, status) => {
    let obj = this.state.autoPlay;
    if (status === 'scroll') {
      obj[this.state.playKey.key] = !obj[this.state.playKey.key];
      return this.setState({
        autoPaly: obj,
        playKey: {},
      });
    }
    obj[key] = !obj[key];
    if (status === 'finish') {
      return this.setState({
        autoPaly: obj,
        playKey: {},
      });
    }
    this.setState({
      autoPaly: obj,
      playKey: {[key]: index, key: key},
    });
  };

  headerBorder() {
    if (Object.keys(this.state.playKey).length) {
      this.startPaly(
        this.state.playKey.key,
        this.state.playKey[this.state.playKey.key],
        'finish',
      );
    }
  }

  findDimentions(layout, type) {
    const {width, height} = layout;
    console.log(type);
    console.warn(width);
    console.warn(height);
    // this.setState({[type]: height});
  }

  _renderPlaces() {
    return this.state.events.map((item, i) => {
      return (
        <TouchableOpacity key={i}>
          <View style={{paddingBottom: 20}}>
            <View style={styles.eventContainer}>
              <CaruselVideo
                fullSceen={this.fullSceen}
                data={item.images}
                playObj={{status: this.state.autoPlay[i], key: i}}
                startPaly={this.startPaly}
                playKey={this.state.autoPlay[i] ? {} : this.state.playKey}
                navigation={() => {
                  this.props.navigation.navigate('EventInfo', {
                    event: item,
                    changeStatusEvent: this.changeStatusEvent,
                    like: () => {
                      let arr = this.state.events;
                      arr[i].like = !arr[i].like;
                      this.setState({
                        events: arr,
                      });
                    },
                    index: i,
                  });
                }}
              />
              <View style={styles.category}>
                <Text style={styles.categoryText}>
                  {moment(item.date).format('DD MMM YYYY')}
                </Text>
              </View>

              <Text style={[styles.event_name_text]}>
                {item.title} {this.state.eventCardHeight}
              </Text>
              <View style={styles.event_info_view}>
                <Text style={styles.event_info_text}>
                  {item.location_name} | {moment(item.date).format('hh:mm a')}
                </Text>
              </View>

              <Like
                active={this.state.events[i].like}
                setActive={() => {
                  this.like(i);
                }}
              />
              {item.status ? (
                <View style={styles.ststus_btn}>
                  <Text style={styles.ststus_btn_text}>
                    {this.capitalize(item.status.status)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  }

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    const paddingToBottom = 70;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  }

  _renderEmptyText() {
    let text = '';
    if (
      !this.state.events.length &&
      !this.state.loading &&
      this.state.searchValue
    ) {
      text = i18n.t('NO_SEARCH_RESULT');
    }
    return text ? (
      <View style={styles.no_saved_view}>
        <Text style={styles.no_saved}>{text}</Text>
      </View>
    ) : null;
  }

  fullSceen = (data) => {
    if (Object.keys(this.state.playKey).length) {
      this.startPaly(
        this.state.playKey.key,
        this.state.playKey[this.state.playKey.key],
        'finish',
      );
    }
    this.setState({
      urlFullScreen: data,
      fullSceenVideoVisible: true,
    });
    Orientation.lockToLandscapeRight();
    console.log(data);
    /*this.setState({
            urlFullScreen: data,
            fullSceenVideoVisible: true,
        });*/
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.header_view,
            {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: this.state.elevation,
            },
          ]}>
          <SearchInput
            title={i18n.t('EVENTS')}
            value={this.state.searchValue}
            onChangeText={(text) => {
              this.search(text);
            }}
            onClose={() => {
              //  if (this.state.searchValue.length) {
              this.getEvents();
              //  }
              this.setState({
                searchValue: '',
              });
            }}
          />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          onScroll={(event) => {
            this.headerBorder();
            if (this.isCloseToBottom(event.nativeEvent)) {
              if (this.canLoadItems) {
                if (this.searched) {
                  this.search(this.state.searchValue, true);
                } else {
                  this.getEvents(true);
                }
              }
            }
          }}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}>
          <View style={styles.events_view}>
            {this._renderPlaces()}
            {this._renderEmptyText()}
            <ContentLoading loading={this.state.loading} />
            {this.state.loadItems && !this.state.loading ? (
              <View style={styles.loaderContainer}>
                <MaterialIndicator size={50} color="#6844F9" />
              </View>
            ) : null}
          </View>
        </ScrollView>
        <FullSceenVideo
          close={() => {
            Orientation.lockToPortrait();
            this.setState({fullSceenVideoVisible: false});
          }}
          paused={!this.state.fullSceenVideoVisible}
          url={this.state.urlFullScreen}
          isVisible={this.state.fullSceenVideoVisible}
        />
      </View>
    );
  }
}

export const Events = connect(({user, config}) => ({user, config}))(
  EventsClass,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header_view: {
    paddingBottom: 5,
    backgroundColor: '#fff',
  },
  event_text: {
    color: '#000',
    fontSize: 24,
    lineHeight: 30,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  search_img: {
    width: 18,
    height: 18,
  },
  filter_view: {
    flexDirection: 'row',
    marginTop: 26,
  },
  filter_item_view: {
    height: 30,
    backgroundColor: '#fff',
    borderBottomColor: 'rgba(181, 179, 189, 0.28)',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingBottom: 18,
  },
  filter_item_text: {
    color: '#979797',
    fontSize: 16,
    lineHeight: 20,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  location_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 23,
    marginBottom: 10,
  },
  location_img_view: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(104, 68, 249, 0.11)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  location_text: {
    color: '#2C2929',
    fontSize: 14,
    lineHeight: 18,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    marginLeft: 16,
  },
  events_view: {
    marginTop: 24,
    marginBottom: 50,
  },
  eventContainer: {
    height: (imgHeight * 9) / 16,
  },
  event_img: {
    width: '100%',
    height: (imgHeight * 9) / 16,
    borderRadius: 8,
  },
  category: {
    position: 'absolute',
    left: 27,
    top: 12,
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

  event_name_text: {
    position: 'absolute',
    left: 27,
    top: '75%',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 16,
    lineHeight: 23,
    color: '#fff',
  },
  event_info_view: {
    flexDirection: 'row',
    position: 'absolute',
    left: 27,
    top: '82.5%',
  },
  event_info_text: {
    fontSize: 11,
    lineHeight: 16,
    color: '#fff',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  ststus_btn: {
    position: 'absolute',
    minWidth: 56,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    bottom: 21,
    right: 26,
    paddingHorizontal: 10,
    backgroundColor: '#6844F9',
  },
  ststus_btn_text: {
    color: '#fff',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 12,
    lineHeight: 15,
  },
  no_saved_view: {
    alignItems: 'center',
    marginTop: 20,
  },
  no_saved: {
    color: '#979797',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    fontSize: 16,
    lineHeight: 22,
  },
});
