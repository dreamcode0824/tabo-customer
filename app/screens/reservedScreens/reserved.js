import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import ApiGraphQl from '../../networking/apiGraphQl';
import {
  Like,
  ContentLoading,
  ListTouchable,
  SearchInput
} from "../../components";
import i18n from "../../constants/i18next";
import Carousel from '../../components/carousel/carousel'
import {
  MaterialIndicator,
} from 'react-native-indicators';

const imgHeight = Dimensions.get('window').width

class ReservedClass extends Component {

  itemsOffset = 0
  canLoadItems = true

  canLike = true
  apigraphql = new ApiGraphQl()

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      likes: null,
      reservation: [],
      activeSlide: 0,
      filter: [i18n.t('ACTIVE'), i18n.t('PAST')],
      filterItem: 'active',
      curY: new Animated.Value(0),
      height: 185,
      loading: true,
      types: [
        {
          text: 'Beach & Pool',
          value: 'beach_pool',
          select: false,
        },
        {
          text: 'Restaurant & Terrace',
          value: 'restaurant_terrace',
          select: false,
        },
        {
          text: 'Club',
          value: 'club',
          select: false,
        },
      ],
      loadItems: true
    };
    this.getList(this.state.filterItem)
    this.getOrientation();
  }

  componentDidMount() {
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

  getList(filterItem, page) {
    this.searched = false
    if (!this.state.loading) {
      if (!this.state.loading && !page) {
        this.itemsOffset = 0
        this.canLoadItems = true
        this.setState({
          loading: true,
          loadItems: true,
          reservation: []
        });
      }
    }
    this.canLoadItems = false
    let options = `, limit:5, offset: ${this.itemsOffset}`
    this.itemsOffset = this.itemsOffset + 5
    if (filterItem == 'active') {
      this.apigraphql.getReservedActive(options)
        .then(reserved => {
          if (reserved.data.reservation_beach.length) {
            let tempReserved = reserved.data.reservation_beach.map((item) => ({
              ...item,
              images: [item.business.gallery[0].url],
            }));
            tempReserved = [...this.state.reservation, ...tempReserved]
            this.setState({
              reservation: tempReserved,
              loading: false,
              loadItems: reserved.data.reservation_beach.length == 5
            }, () => {
              this.canLoadItems = true
            });

            this.getLikesList(tempReserved)
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
    } else {
      this.apigraphql.getReservedPaid(options)
        .then(reserved => {
          if (reserved.data.reservation.length) {
            let tempReserved = reserved.data.reservation.map((item) => ({
              ...item,
              images: [item.business.image],
            }));
            this.setState({
              reservation: tempReserved,
              loading: false,
              loadItems: reserved.data.reservation.length == 5
            }, () => {
              this.canLoadItems = reserved.data.reservation.length == 5
            });
            this.getLikesList(tempReserved)
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
    }

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
            reservation: []
          });
        }
      }
      this.searchTimeout = setTimeout(() => {
        this.canLoadItems = false
        let options = `, limit:5, offset: ${this.itemsOffset}`
        this.itemsOffset = this.itemsOffset + 5
        let where = ''
        if (this.state.filterItem == 'active') {
          where = `where: {customer_id: ${this.props.user.id}, status: ["pending", "paid_online", "occupied"],  name: "reserved_search",  search: "${text}"}${options}`
        } else {
          where = `where: {customer_id: ${this.props.user.id}, status:  ["canceled", "expired", "completed"],  name: "reserved_search",  search: "${text}"}${options}`
        }
        this.apigraphql.getWithFilter(where)
          .then((res) => {
            if (res.data.custom_query[0].result.length) {
              let tempReserved = res.data.custom_query[0].result.map((item) => ({
                ...item,
                business: {
                  ...item.business,
                  location: JSON.parse(item.business.location),
                },
                images: [item.business.image],
              }));
              tempReserved = [...this.state.reservation, ...tempReserved]
              if (this.state.searchValue == text)
                this.setState({
                  reservation: tempReserved,
                  loading: false,
                  loadItems: res.data.custom_query[0].result.length == 5
                }, () => {
                  this.canLoadItems = res.data.custom_query[0].result.length == 5
                });

              this.getLikesList(tempReserved)
            } else {
              this.setState({
                loading: false,
                loadItems: false
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.setState({
              loading: false,
              reservation: []
            });
          })
      }, 500)
    } else {
      this.getList(this.state.filterItem)
    }
  }

  getLikesList(tempReserved) {
    let reserved = JSON.parse(JSON.stringify(tempReserved))
    this.apigraphql.getLikes(this.props.user.id)
      .then((likes) => {
        for (let i = 0; i < likes.data.customer_liked_business.length; i++) {
          const business_id = likes.data.customer_liked_business[i].business_id;
          for (let j = 0; j < reserved.length; j++) {
            const id = reserved[j].business.id;
            if (business_id == id) {
              reserved[j].business.like = true;
              reserved[j].business.likeId = likes.data.customer_liked_business[i].id;
              break;
            }
          }

        }

        let idList = reserved.map((item) => (item.business.id));

        this.apigraphql.getGallery(JSON.stringify(idList))
          .then((gallery) => {
            for (let i = 0; i < reserved.length; i++) {
              if (reserved[i].images.length <= 1) {
                const element = reserved[i];
                let tempImages = gallery.data.business_gallery
                  .filter((item) => item.business_id == element.business.id)
                  .map((item) => item.url);
                reserved[i].images = [reserved[i].images[0], ...tempImages];
              }
            }

            this.setState({
              likes,
              reservation: reserved,
            });
          })
          .catch((error) => {
            console.log(error);
          });


      })
      .catch((error) => {
        console.log(error);
      });
  }

  like = (i) => {
    if (!this.canLike) {
      return
    }

    this.canLike = false

    if (!this.state.reservation[i].business.like && this.state.likes) {
      this.apigraphql.setLike({
        customer_id: this.props.user.id,
        business_id: this.state.reservation[i].business.id,
      })
        .then((res) => {
          let arr = this.state.reservation;
          arr[i].business.like = !arr[i].business.like;
          arr[i].business.likeId = res.data.customer_liked_businessCreate.id
          this.setState({
            reservation: arr,
          }, () => {
            this.canLike = true
          });
        })
        .catch((error) => {
          console.log(error);
          this.canLike = true
        });
    } else if (this.state.reservation[i].business.like && this.state.likes) {
      this.apigraphql.deleteLikeSaved(this.state.reservation[i].business.id)
        .then((res) => {
          let arr = this.state.reservation;
          arr[i].business.like = !arr[i].business.like;
          this.setState({
            reservation: arr,
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

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({ landscape: false });
    } else {
      this.setState({ landscape: true });
    }
  }

  _renderFilter() {
    return this.state.filter.map((data, index) => {
      return (
        <TouchableOpacity
          style={[styles.filter_item_view, this.state.filterItem === data.toLowerCase() ? {
            borderBottomColor: '#000',
            borderBottomWidth: 2
          } : null]}
          key={index} onPress={() => {
            if (this.state.filterItem != data.toLowerCase()) {
              this.setState({
                filterItem: data.toLowerCase(),
                searchValue: ''
              })
              this.getList(data.toLowerCase())
            }
          }}>
          <Text
            style={[styles.filter_item_text, this.state.filterItem === data.toLowerCase() ? {
              color: '#000',
              fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
            } : null]}>{data}</Text>
        </TouchableOpacity>
      )
    })
  }

  _renderType(t) {
    console.log(this.state.types)
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

  _renderReservation() {
    return this.state.loading ? null :
      this.state.reservation.map((item, i) => (
        <ListTouchable
          key={i}
          onPress={() => {
            this.props.navigation.navigate('ReservedInfo', {
              reservation: item,
              like: () => {
                let arr = this.state.reservation;
                arr[i].business.like = !arr[i].business.like;
                this.setState({
                  reservation: arr,
                });
              },
              index: i,
            })
          }}
        >
          <View style={{ marginTop: 8 }}>
            <View style={styles.sliderContainer}>
              <View>
                <Carousel
                  data={item.images}
                  navigation={() => this.props.navigation.navigate('ReservedInfo', {
                    reservation: item,
                    like: () => {
                      let arr = this.state.reservation;
                      arr[i].business.like = !arr[i].business.like;
                      this.setState({
                        reservation: arr,
                      });
                    },
                    index: i,
                  })} />
              </View>

              <View style={styles.category}>
                <Text style={styles.categoryText}>
                  {item.business.type}
                </Text>
              </View>
              <Like
                active={this.state.reservation[i].business.like}
                setActive={() => {
                  this.like(i);
                }}
              />
            </View>
            <View style={{ marginBottom: 10, marginHorizontal: 16 }}>
              <View style={styles.ratingRow}>
                <Image
                  source={require('../../assets/images/star.png')}
                  style={styles.star} />
                <Text style={styles.ratingText}>
                  {item.business.avg_rate}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <View>
                  <Text style={styles.itemText}>
                    {item.business.location_name}
                  </Text>
                  <Text style={styles.priceText}>
                    {item.old_amount} {item.currency}
                  </Text>
                </View>
                <View style={styles.bookContainer}>
                  <Text style={styles.bookText}>
                    {item.reservation_status == "paid_online" ? `${i18n.t('PAID')}`.toUpperCase() : item.reservation_status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ListTouchable>
      ));
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 70;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  _renderEmptyText() {
    let text = ''
    if (!this.state.reservation.length && !this.state.loading && this.state.searchValue) {
      text = i18n.t('NO_SEARCH_RESULT')
    }
    else if (!this.state.reservation.length && !this.state.loading && this.state.filterItem === 'past') {
      text = i18n.t('NO_ACTIVE_PAST_RESERV')
    }
    else if (!this.state.reservation.length && !this.state.loading && this.state.filterItem === 'active') {
      text = i18n.t('NO_ACTIVE_RESERV')
    }
    return text ? (<View style={{ alignItems: 'center' }}>
      <Text style={styles.no_reserved}>{text}</Text>
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
          onLayout={({ nativeEvent }) => this.setState({ height: nativeEvent.layout.height })}

        >
          <SearchInput
            title={i18n.t('RESERVED')}
            value={this.state.searchValue}
            onChangeText={(text) => {
              this.search(text)
            }}
            onClose={() => {
              // if (this.state.searchValue.length) {
              this.getList(this.state.filterItem)
              //    }
              this.setState({
                searchValue: ''
              })

            }}
          />
          <View>
            {/* <ScrollView style={{marginLeft: 16, backgroundColor: 'red'}} showsHorizontalScrollIndicator={false} horizontal={true}> */}
            <View style={styles.filter_view}>
              {this._renderFilter()}
              <View style={styles.emptyView}>

              </View>
            </View>
            {/* </ScrollView> */}
          </View>
        </Animated.View>
        <View>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            contentContainerStyle={{ marginTop: 130 }}
            onScroll={Animated.event(
              [{
                nativeEvent: { contentOffset: { y: this.state.curY } }
              }],
              {
                useNativeDriver: false,
                listener: event => {
                  if (this.isCloseToBottom(event.nativeEvent)) {
                    if (this.canLoadItems) {
                      if (this.searched) {
                        this.search(this.state.searchValue, true)
                      } else {
                        this.getList(this.state.filterItem, true);
                      }
                    }

                  }

                },
              },
            )}>
            <View style={{ marginBottom: 200 }}>
              {this._renderReservation()}
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

export const Reserved = connect(({ user }) => ({ user }))(ReservedClass);

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
    marginLeft: 16
  },
  filter_view: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 16
  },
  filter_item_view: {
    height: 46,
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
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  emptyView: {
    flex: 1,
    borderBottomColor: 'rgba(181, 179, 189, 0.28)',
    borderBottomWidth: 2,
  },
  beache_text: {
    color: '#000',
    lineHeight: 20,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    marginTop: 34,
    marginLeft: 16,
    marginBottom: 15,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bookContainer: {
    height: 20,
    paddingHorizontal: 7,
    backgroundColor: '#6844F9',
    borderRadius: 4,
    justifyContent: "center",
    alignItems: 'center'
  },
  bookText: {
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 10,
    lineHeight: 12
  },
  loaderContainer: {
    height: 70,
  },
  no_reserved: {
    color: '#979797',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    fontSize: 16,
    lineHeight: 22
  }
});
