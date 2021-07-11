import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  TextInput
} from 'react-native';
import {
  Like,
  ContentLoading,
  ListTouchable,
  SearchInput,
  CaruselVideo
} from "../../components";
import Carousel from '../../components/carousel/carousel'
import ApiGraphQl from '../../networking/apiGraphQl';
import API from '../../networking/api';
import { connect } from 'react-redux'
import i18n from "../../constants/i18next";
import {
  MaterialIndicator,
} from 'react-native-indicators';
import moment from "moment";

const imgHeight = Dimensions.get('window').width

class SavedClass extends Component {

  itemsOffset = 0
  canLoadItems = true

  canLike = true
  canAnimate = true
  offset = 0
  apigraphql = new ApiGraphQl();
  api = new API()

  constructor(props) {
    super(props);
    this.state = {
      filter: [i18n.t('ALL'), i18n.t('BEACHES'), i18n.t('EVENTS'), i18n.t('RESTAURANT')],
      filterItem: i18n.t('ALL'),
      curY: new Animated.Value(0),
      height: 130,
      elevation: 0,
      searchValue: '',
      businesses: [],
      events: [],
      searchCity: [],
      autoPlay: {},
      playKey: {},
      landscape: false,
      searchPlace: false,
      bookCalendarVisible: false,
      commingVisible: false,
      timeVisible: false,
      scrollValue: null,
      loading: true,
      types: [
        {
          text: i18n.t('EVENTS'),
          value: 'events',
          select: false,
        },
        {
          text: i18n.t('BEACH_POOL'),
          value: 'beach_pool',
          select: false,
        },
        {
          text: i18n.t('RESTAURANT_TERRACE'),
          value: 'restaurant_terrace',
          select: false,
        },
        {
          text: i18n.t('CLUB'),
          value: 'club',
          select: false,
        },
      ],
      likes: null,
      loadItems: true
    };
  }

  componentDidMount() {
    if (this.state.filterItem == 'All') {
      this.getList();
    } else {
      if (this.state.filterItem === 'events') {
        return this.getEvents()
      }
      this.getListWithType(this.state.filterItem);
    }

    this.getOrientation();
    Dimensions.addEventListener(
      'change',
      this.getOrientation
    );
  }

  componentWillUnmount() {
    Dimensions.removeEventListener(
      'change',
      this.getOrientation
    )
  }

  getList(page) {
    this.searched = false
    if (!this.state.loading) {
      if (!this.state.loading && !page) {
        this.itemsOffset = 0
        this.canLoadItems = true
        this.setState({
          loading: true,
          loadItems: true,
          businesses: [],
          events: [],
        });
      }
    }
    this.canLoadItems = false
    let where = `where: { customer_id: ${this.props.user.id}}, limit:5, offset: ${this.itemsOffset}`
    this.itemsOffset = this.itemsOffset + 5

    this.apigraphql.getSavedBusinesses(where)
      .then(businesses => {
        if (businesses.data.customer_liked_business.length) {
          let tempBusinesses = businesses.data.customer_liked_business.map((item) => ({
            ...item.business,
            like: true,
            images: [item.business.image],

          }));
          tempBusinesses = [...this.state.businesses, ...tempBusinesses]
          this.setState({
            businesses: tempBusinesses,
            loading: false,
          }, () => {
            this.canLoadItems = businesses.data.customer_liked_business.length == 5
          });
          let idList = businesses.data.customer_liked_business.map((item) => (item.business.id));

          this.apigraphql.getGallery(JSON.stringify(idList))
            .then((gallery) => {
              for (let i = 0; i < tempBusinesses.length; i++) {
                if (tempBusinesses[i].images.length <= 1) {
                  const element = tempBusinesses[i];
                  let tempImages = gallery.data.business_gallery
                    .filter((item) => item.business_id == element.id)
                    .map((item) => item.url);
                  tempBusinesses[i].images = [tempBusinesses[i].images[0], ...tempImages];
                }
              }
              this.setState({
                businesses: tempBusinesses,
              });
            })
            .catch((error) => {
              console.log(error);
            });
          if (
            businesses.data.customer_liked_business.length !== 5 &&
            (this.state.filterItem == 'All' || this.state.filterItem == 'Events')
          ) {
            this.getEvents()
          }
        } else {
          this.setState({
            loadItems: false
          });
          if (this.state.filterItem == 'All' || this.state.filterItem == 'Events') {
            this.getEvents()
          }

        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  search(text, page) {
    this.state.searchValue = text
    this.setState({ searchValue: text })
    clearTimeout(this.searchTimeout)
    if (text) {
      if (text.length < 3) {
        return this.setState({
          loading: false,
          loadItems: false,
        });
      }
      this.searched = true
      if (!this.state.loading) {
        if (!this.state.loading && !page) {
          this.itemsOffset = 0
          this.canLoadItems = true
          this.setState({
            loading: true,
            loadItems: true,
            businesses: [],
            events: [],
          });
        }

      }
      this.searchTimeout = setTimeout(() => {
        this.canLoadItems = false
        let options = `, limit:5, offset: ${this.itemsOffset}`
        this.itemsOffset = this.itemsOffset + 5
        let typeStr = this.state.filterItem == 'All' ? '' : `type: "${this.state.filterItem}", `
        let where = `where: {customer_id: ${this.props.user.id},  name: "saved_businesses", ${typeStr}search: "${text}"}${options}`

        this.apigraphql.getWithFilter(where)
          .then((res) => {
            let tempBusinesses = res.data.custom_query[0].result.map((item) => ({
              ...item.business,
              like: true,
              images: [item.business.image],
            }));
            tempBusinesses = [...this.state.businesses, ...tempBusinesses]
            if (this.state.searchValue == text)
              this.setState({
                businesses: tempBusinesses,
                loading: false,
                loadItems: res.data.custom_query[0].result.length == 5
              }, () => {
                this.canLoadItems = res.data.custom_query[0].result.length == 5
              });
            let idList = res.data.custom_query[0].result.map((item) => (item.business.id));

            this.apigraphql.getGallery(JSON.stringify(idList))
              .then((gallery) => {
                for (let i = 0; i < tempBusinesses.length; i++) {
                  if (tempBusinesses[i].images.length <= 1) {
                    const element = tempBusinesses[i];
                    let tempImages = gallery.data.business_gallery
                      .filter((item) => item.business_id == element.id)
                      .map((item) => item.url);
                    tempBusinesses[i].images = [tempBusinesses[i].images[0], ...tempImages];
                  }
                }
                if (this.state.searchValue == text)
                  this.setState({
                    businesses: tempBusinesses,
                  });
              })
              .catch((error) => {
                console.log(error);
              });
            //   this.getLikesList(tempBusinesses, text);
          })
          .catch((error) => {
            this.setState({
              loading: false,
              businesses: [],
              events: [],
            });
          })
      }, 500);
    } else {
      if (this.state.filterItem == 'All') {
        this.getList('All');
      } else {
        if (this.state.filterItem === 'events') {
          return this.getEvents()
        }
        this.getListWithType(this.state.filterItem);
      }
    }

  }

  getEvents(page) {
    this.searched = false
    this.itemsOffset = 0
    if (!this.state.loading) {
      if (this.state.filterItem === 'events' || page === 'events') {
        this.itemsOffset = 0
        this.canLoadItems = true
        this.setState({
          loading: true,
          loadItems: true,
          businesses: [],
          events: []
        });
      }
    }
    this.canLoadItems = false
    let where = `where: {}, limit:5, offset: ${this.itemsOffset}`
    this.itemsOffset = this.itemsOffset + 5
    this.apigraphql.getSavedEvents(where)
      .then(data => {
        if (data.data.customer_liked_event.length) {
          let tempEvent = data.data.customer_liked_event.map((item, index) => {
            if (item.business_event.thumbnail) {
              let obj = this.state.autoPlay
              obj[index] = true
              this.setState({
                autoPlay: obj
              })
              return (
                {
                  ...item.business_event,
                  type: 'events',
                  like: true,
                  images: [{
                    type: 'video',
                    thumbnail: item.business_event.thumbnail,
                    url: item.business_event.main
                  }]
                }
              )
            } else {
              return (
                {
                  ...item.business_event,
                  type: 'events',
                  like: true,
                  images: [{
                    type: 'image',
                    url: item.business_event.main
                  }]
                }
              )
            }
          });
          tempEvent = [...this.state.events, ...tempEvent]
          this.setState({
            events: tempEvent,
            loadItems: data.data.customer_liked_event.length == 5,
            loading: false,
          }, () => {
            this.canLoadItems = data.data.customer_liked_event.length == 5
          });
          this.getGalery(tempEvent)
        } else {
          this.setState({
            loading: false,
            loadItems: false
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
  };

  getGalery(events) {
    this.apigraphql.getEventGallery()
      .then(gallery => {
        let arr = this.state.events
        for (let i = 0; i < events.length; i++) {
          if (events[i].images.length <= 1) {
            const event = events[i];
            let tempImages = gallery.data.business_event_gallery
              .filter((item) => item.business_event_id == event.id && item.url != events[i].images[0].url)
              .map((item) => {
                let obj = this.state.autoPlay
                if (item.type === 'video') {
                  obj[i] = true
                  this.setState({
                    autoPlay: obj
                  })
                }
                return item
              });
            arr[i].images = [...events[i].images, ...tempImages]
          }
        }
        this.setState({
          loading: false,
          events: arr
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  getListWithType(type, page) {
    if (!this.state.loading) {
      if (!this.state.loading && !page) {
        this.itemsOffset = 0
        this.canLoadItems = true
        this.setState({
          loading: true,
          loadItems: true,
          businesses: [],
          events: [],
        });
      }
    }

    this.canLoadItems = false
    let options = `, limit:5, offset: ${this.itemsOffset}`
    this.itemsOffset = this.itemsOffset + 5
    this.apigraphql.getSavedBusinessesWithType(type, this.props.user.id, options)
      .then(businesses => {
        if (businesses.data.custom_query[0].result.length) {
          let tempBusinesses = businesses.data.custom_query[0].result.map((item) => ({
            ...item.business,
            like: true,
            location: JSON.parse(item.business.location),
            images: [item.business.image],
          }));
          tempBusinesses = [...this.state.businesses, ...tempBusinesses]
          this.setState({
            businesses: tempBusinesses,
            loading: false,
            loadItems: businesses.data.custom_query[0].result.length == 5
          }, () => {
            this.canLoadItems = businesses.data.custom_query[0].result.length == 5
          });
          let idList = businesses.data.custom_query[0].result.map((item) => (item.business.id));

          this.apigraphql.getGallery(JSON.stringify(idList))
            .then((gallery) => {
              for (let i = 0; i < tempBusinesses.length; i++) {
                if (tempBusinesses[i].images.length <= 1) {
                  const element = tempBusinesses[i];
                  let tempImages = gallery.data.business_gallery
                    .filter((item) => item.business_id == element.id)
                    .map((item) => item.url);
                  tempBusinesses[i].images = [tempBusinesses[i].images[0], ...tempImages];
                }
              }
              this.setState({
                businesses: tempBusinesses,
              });
            })
            .catch((error) => {
              console.log(error);
            });
          // this.getLikesList(tempBusinesses, text);
        } else {
          this.setState({
            loading: false,
            loadItems: false
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getLikesList(tempBusinesses, text) {
    let businesses = tempBusinesses;
    this.apigraphql.getLikes(this.props.user.id)
      .then((likes) => {
        for (let i = 0; i < likes.data.customer_liked_business.length; i++) {
          const business_id = likes.data.customer_liked_business[i].business_id;
          for (let j = 0; j < businesses.length; j++) {
            const id = businesses[j].id;
            if (business_id == id) {
              businesses[j].like = true;
              businesses[j].likeId = likes.data.customer_liked_business[i].id;
              break;
            }
          }

        }
        if (this.state.searchValue == text)
          this.setState({
            likes,
            businesses,
          });

      })
      .catch((error) => {
        console.log(error);
      });
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

  like = (i, type) => {
    if (!this.canLike) {
      return
    }
    this.canLike = false

    if (this.state.businesses.length && this.state.businesses[i].like) {
      this.apigraphql.deleteLikeSaved(this.state.businesses[i].id)
        .then((res) => {
          let arr = this.state.businesses;
          arr.splice(i, 1)
          this.setState({
            businesses: arr,
          }, () => {
            this.canLike = true
          });
        })
        .catch((error) => {
          console.log(error);
          this.canLike = true
        });
    }
    if (this.state.events.length && this.state.events[i].like && type === 'event') {
      this.apigraphql.deleteLikeSavedEvent(this.state.events[i].id)
        .then((res) => {
          let arr = this.state.events;
          arr.splice(i, 1)
          this.setState({
            events: arr,
          }, () => {
            this.canLike = true
          });
        })
        .catch((error) => {
          console.log(error);
          this.canLike = true
        });
    }
  }

  _renderFilter() {
    return this.state.types.map((data, index) => {
      return (
        <TouchableOpacity
          style={[styles.filter_item_view, this.state.filterItem === data.value ? {
            borderBottomColor: '#000',
            borderBottomWidth: 2
          } : null]}
          key={index}
          onPress={() => {
            this.setState({ filterItem: data.value })
            if (data.value === 'events') {
              return this.getEvents(data.value)
            }
            this.getListWithType(data.value)
          }}>
          <Text
            style={[styles.filter_item_text, this.state.filterItem === data.value ? {
              color: '#000',
              fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
            } : null]}>{data.text}</Text>
        </TouchableOpacity>
      )
    })
  }

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({ landscape: false });
    } else {
      this.setState({ landscape: true });
    }
  }

  _renderPlaces() {
    return this.state.loading ? null :
      this.state.businesses.map((item, i) => {
        return (
          <ListTouchable
            onPress={() => {
              this.props.navigation.navigate('Business', {
                business: item,
                index: i,
                type: 'saved',
                like: () => {
                  this.like(i)
                },
              });
            }}
            key={i}>
            <View style={{ marginTop: 8 }}>
              <View style={styles.sliderContainer}>
                <View>
                  <Carousel
                    data={item.images}
                    navigation={() => {
                      this.props.navigation.navigate('Business', {
                        business: item,
                        index: i,
                        type: 'saved',
                        like: () => {
                          this.like(i)
                        },
                      })
                    }} />
                </View>
                <View style={styles.category}>
                  <Text style={styles.categoryText}>
                    {this._renderType(item.type)}
                  </Text>
                </View>
                <Like
                  active={this.state.businesses[i].like}
                  setActive={() => {
                    this.like(i);
                  }}
                />
              </View>
              <View style={{ marginBottom: 10, marginLeft: 16 }}>
                <View style={styles.ratingRow}>
                  <Image
                    source={require('../../assets/images/star.png')}
                    style={styles.star} />
                  <Text style={styles.ratingText}>
                    {item.avg_rate}
                  </Text>
                </View>
                <Text style={styles.itemText}>
                  {item.name}
                </Text>
              </View>
            </View>
          </ListTouchable>
        )

      });
  }

  changeStatusEvent = (data, index, status) => {
    let arr = this.state.events
    if (status === 'update') {
      arr[index].status = data
    }
    if (status === 'create') {
      arr[index] = { ...arr[index], status: data }
    }
    if (status === 'delete') {
      delete arr[index].status
    }
    this.setState({
      events: arr
    })
  }

  startPaly = (key, index, status) => {
    let obj = this.state.autoPlay
    if (status === 'scroll') {
      obj[this.state.playKey.key] = !obj[this.state.playKey.key]
      return this.setState({
        autoPaly: obj,
        playKey: {}
      })
    }
    obj[key] = !obj[key]
    if (status === 'finish') {
      return this.setState({
        autoPaly: obj,
        playKey: {}
      })
    }
    this.setState({
      autoPaly: obj,
      playKey: { [key]: index, key: key }
    })

  }

  _renderEvents() {
    return this.state.loading ? null :
      this.state.events.map((item, i) => {
        return (
          <TouchableOpacity key={i}>
            <View style={{ paddingBottom: 20, }}>
              <View style={styles.eventContainer}>
                <CaruselVideo
                  data={item.images}
                  playObj={{ status: this.state.autoPlay[i], key: i }}
                  startPaly={this.startPaly}
                  playKey={this.state.autoPlay[i] ? {} : this.state.playKey}
                  navigation={() => {
                    this.props.navigation.navigate('EventInfo', {
                      event: item,
                      type: 'saved',
                      changeStatusEvent: this.changeStatusEvent,
                      like: () => {
                        this.like(i, 'event')
                      },
                      index: i
                    })
                  }}
                />
                <View style={styles.category1}>
                  <Text style={styles.categoryText1}>
                    {moment(item.date).format("DD MMMM YYYY")}
                  </Text>
                </View>
                <Text style={styles.event_name_text}>
                  {item.title}
                </Text>
                <View style={styles.event_info_view}>
                  <Text
                    style={styles.event_info_text}>{item.location_name} | {moment(item.date).format("hh:mm a")}</Text>
                </View>
                <Like
                  active={item.like}
                  setActive={() => {
                    this.like(i, 'event');
                  }}
                />
                {item.status ?
                  <View style={styles.ststus_btn}>
                    <Text
                      style={styles.ststus_btn_text}>{this.capitalize(item.status.status)}</Text>
                  </View>
                  :
                  null
                }
              </View>
            </View>
          </TouchableOpacity>
        )
      });
  }

  headerBorder(offsetY) {
    if (Object.keys(this.state.playKey).length) {
      this.startPaly(this.state.playKey.key, this.state.playKey[this.state.playKey.key], 'finish')
    }
    if (offsetY > 0 && this.canAnimate) {
      this.canAnimate = false;
      this.setState({
        elevation: 5
      })
    } else if (offsetY <= 0 && !this.canAnimate) {
      this.canAnimate = true
      this.setState({
        elevation: 0
      })
    }
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 70;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  _renderEmptyText() {
    let text = ''
    if (!this.state.events.length && !this.state.loading && !this.state.businesses.length && this.state.searchValue) {
      text = i18n.t('NO_SEARCH_RESULT')
    }
    else if (this.state.filterItem === i18n.t('ALL') && !this.state.events.length && !this.state.loading && !this.state.businesses.length) {
      text = i18n.t('NO_SAVED_ITEMS')
    }
    else if (!this.state.events.length && !this.state.loading && !this.state.businesses.length) {
      text = i18n.t('NO_SAVED') + this._renderType(this.state.filterItem)
    }
    return text ? (<View style={styles.no_saved_view}>
      <Text style={styles.no_saved}>{text}</Text>
    </View>) : null
  }

  render() {
    const minScroll = 0;
    const clampedScrollY = this.state.curY.interpolate({
      inputRange: [minScroll, minScroll + 1],
      outputRange: [0, 1],
      extrapolateLeft: 'clamp',
    });
    const minusScrollY = Animated.multiply(clampedScrollY, -1);
    const headerDistance = Animated.diffClamp(minusScrollY, -60, 0).interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
    return (
      <View style={styles.container}>
        <Animated.View
          onLayout={({ nativeEvent }) => this.setState({ height: nativeEvent.layout.height })}
          style={{
            transform: [{
              translateY: headerDistance
            }],
            position: 'absolute',
            top: 0,
            zIndex: 1,
            width: '100%',
            backgroundColor: '#fff',
          }}
        >
          <SearchInput
            title={i18n.t('SAVED')}
            value={this.state.searchValue}
            onChangeText={(text) => {
              this.search(text)
            }}
            onClose={() => {
              this.state.searchValue = ''
              this.setState({
                searchValue: ''
              })
              // if (this.state.searchValue.length) {
              if (this.state.filterItem == 'All') {
                this.getList();
              } else {
                if (this.state.filterItem === 'events') {
                  return this.getEvents()
                }
                this.getListWithType(this.state.filterItem);
              }
              //  }

            }}
          />
          <View>
            <ScrollView style={{ marginLeft: 16 }} showsHorizontalScrollIndicator={false} horizontal={true}>
              <View style={styles.filter_view}>
                <TouchableOpacity
                  style={[styles.filter_item_view, this.state.filterItem === 'All' ? {
                    borderBottomColor: '#000',
                    borderBottomWidth: 2
                  } : null]}
                  onPress={() => {
                    this.setState({ filterItem: 'All' })
                    this.getList();
                  }}>
                  <Text
                    style={[styles.filter_item_text, this.state.filterItem === 'All' ? {
                      color: '#000',
                      fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
                    } : null]}>{'All'}</Text>
                </TouchableOpacity>
                {this._renderFilter()}
              </View>
            </ScrollView>
          </View>
        </Animated.View>
        <View>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            contentContainerStyle={{ marginTop: this.state.height, }}
            onScroll={Animated.event(
              [{
                nativeEvent: { contentOffset: { y: this.state.curY } }
              }],
              {
                useNativeDriver: false,
                listener: event => {
                  const offsetY = event.nativeEvent.contentOffset.y
                  this.headerBorder(offsetY)
                  if (this.isCloseToBottom(event.nativeEvent)) {
                    if (this.canLoadItems) {
                      if (this.searched) {
                        this.search(this.state.searchValue, true)
                      } else {
                        if (this.state.filterItem == 'All') {
                          this.getList(true);
                        } else {
                          if (this.state.filterItem === 'events') {
                            return this.getEvents()
                          }
                          this.getListWithType(this.state.filterItem, true);
                        }
                      }

                    }

                  }
                },
              },
            )}>
            <View style={{ marginBottom: 160, marginTop: 15, }}>
              {this._renderPlaces()}
              {this._renderEvents()}
              {this._renderEmptyText()}
              <ContentLoading
                loading={this.state.loading} />
              {this.state.loadItems && !this.state.loading ?
                <View style={styles.loaderContainer}>
                  <MaterialIndicator
                    size={50}
                    color='#6844F9' />
                </View>
                : null}
            </View>
          </Animated.ScrollView>
        </View>
      </View>
    );
  }
}

export const Saved = connect(({ user }) => ({ user }))(SavedClass)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  title_text: {
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 24,
    lineHeight: 30,
    color: '#000',
    marginTop: 25,
    marginLeft: 16,
  },
  filter_view: {
    flexDirection: 'row',
    marginTop: 20,
    // marginBottom: 16
  },
  filter_item_view: {
    height: 33,
    backgroundColor: '#fff',
    borderBottomColor: 'rgba(181, 179, 189, 0.28)',
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  filter_item_text: {
    color: '#979797',
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  cont_view: {
    marginHorizontal: 16,
  },
  no_saved_view: {
    alignItems: 'center',
    marginTop: 20,
  },
  no_saved: {
    color: '#979797',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    fontSize: 16,
    lineHeight: 22
  },
  eventContainer: {
    height: imgHeight * 9 / 16,
  },
  event_img: {
    width: '100%',
    height: imgHeight * 9 / 16,
    borderRadius: 8
  },
  category1: {
    position: 'absolute',
    left: 27,
    top: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
    height: 26,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  categoryText1: {
    fontSize: 12,
    lineHeight: 15,
    color: 'black',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },

  event_name_text: {
    position: 'absolute',
    left: 20,
    top: 160,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 16,
    lineHeight: 23,
    color: '#fff'
  },
  event_info_view: {
    flexDirection: 'row',
    position: 'absolute',
    left: 13,
    top: 195,
  },
  event_info_text: {
    fontSize: 11,
    lineHeight: 16,
    color: '#fff',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',

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
    backgroundColor: '#6844F9'
  },
  ststus_btn_text: {
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 12,
    lineHeight: 15
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

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 7,
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
    fontSize: 16,
    lineHeight: 18,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  priceText: {
    color: 'black',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginTop: 4,
  },
  priceSmallText: {
    fontSize: 10,
    color: '#9A98A3',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  category: {
    position: 'absolute',
    left: 27,
    top: 11,
    backgroundColor: '#fff',
    borderRadius: 2,
    height: 22,
    justifyContent: "center",
    paddingHorizontal: 11
  },
  categoryText: {
    fontSize: 10,
    lineHeight: 12,
    color: 'black',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 10,
    height: 18,
    width: 18
  },
  searchInputContainer: {
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#6844F9',
    marginHorizontal: 16,
    marginTop: 14
  },
  searchInput: {
    padding: 0,
    flex: 1,
    paddingHorizontal: 48,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  clearInput: {
    position: "absolute",
    top: 7,
    right: 12,
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loaderContainer: {
    height: 70,
  }
});
