import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import {
  SearchPlace,
  Like,
  ContentLoading,
  Filter,
  ListTouchable,
} from '../../components';
import ApiGraphQl from '../../networking/apiGraphQl';
import API from '../../networking/api';
import Carousel from '../../components/carousel/carousel';
import i18n from '../../constants/i18next';
import { MaterialIndicator } from 'react-native-indicators';

const imgHeight = Dimensions.get('window').width;

class HomeClass extends Component {
  itemsOffset = 0;
  canLoadItems = true;

  canLike = true;

  canAnimate = true;
  offset = 0;
  apigraphql = new ApiGraphQl();
  api = new API();

  constructor(props) {
    super(props);
    this.state = {
      businesses: [],
      landscape: false,
      filterVisible: false,
      search: false,
      searchData: null,
      searchPlace: false,
      bookCalendarVisible: false,
      commingVisible: false,
      timeVisible: false,
      scrollValue: null,
      activeSlide: 0,
      curY: new Animated.Value(0),
      height: 190,
      elevation: 0,
      loading: true,
      types: [
        {
          text: 'Beach & Pool',
          value: 'beach_pool',
          value1: 'beach',
          value2: 'pool',
          select: false,
        },
        {
          text: 'Restaurant & Terrace',
          value: 'restaurant_terrace',
          value1: 'restaurant',
          value2: 'terrace',
          select: false,
        },
        {
          text: 'Club',
          value: 'club',
          value1: 'club',
          value2: '',
          select: false,
        },
      ],
      likes: null,
      loadItems: true,
      currentDate: ""
    };
    this.searchAction = this.searchAction.bind(this);
  }

  componentDidMount() {
    this.getDate();
    this.getList(this.state.types);
    console.log('++===++');
    this.getOrientation();
    Dimensions.addEventListener('change', this.getOrientation);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.getOrientation);
  }
  getDate() {
    this.api.getCurrentDate()
      .then((res) => {
        if (res) {
          this.setState({ currentDate: res.data })
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  getIndexBusiness = (business) => {
    for (let i = 0; i < this.state.businesses.length; i++) {
      if (this.state.businesses[i].id === business.id) {
        this.props.navigation.navigate('Business', {
          business: business,
          like: () => {
            let arr = this.state.businesses;
            arr[i].like = !arr[i].like;
            this.setState({
              businesses: arr,
            });
          },
          index: i,
          search: true,
        });
        this.setState({
          searchPlace: false,
        });
      }
    }
    this.props.navigation.navigate('Business', {
      business: business,
      search: true,
    });
    this.setState({
      searchPlace: false,
    });
  };

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

  getLikesList(tempBusinesses) {
    let businesses = tempBusinesses;
    this.apigraphql
      .getLikes(this.props.user.id)
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
        this.setState({
          likes,
          businesses,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getList(types, page) {
    if (!this.state.loading && !page) {
      this.itemsOffset = 0;
      this.canLoadItems = true;
      this.setState({
        loading: true,
        loadItems: true,
        businesses: [],
      });
    }

    this.canLoadItems = false;

    let whereArr;
    let where;
    if (this.state.searchData && this.state.search) {
      if (this.state.searchData.country && this.state.searchData.state) {
        let arr = [];
        whereArr = types.filter((item) => item.select).map((item) => {
          arr.push(item.value1);
          arr.push(item.value2);
        });
        where = arr.length
          ? `where: { type: ${JSON.stringify(arr)}, city_id: ${this.state.searchData.id
          }} order: "reverse:avg_rate", limit:5, offset: ${this.itemsOffset}`
          : `where: {city_id: ${this.state.searchData.id}} order: "reverse:avg_rate", limit:5, offset: ${this.itemsOffset}`;
      } else {
        let arr = [];
        whereArr = types.filter((item) => item.select).map((item) => {
          arr.push(item.value1);
          arr.push(item.value2);
        });
        where = arr.length
          ? `where: { type: ${JSON.stringify(arr)}, country_id: ${this.state.searchData.id
          }} order: "reverse:avg_rate", limit:5, offset: ${this.itemsOffset}`
          : `where: {country_id: ${this.state.searchData.id}} order: "reverse:avg_rate", limit:5, offset: ${this.itemsOffset}`;
      }
    } else {
      let arr = [];
      whereArr = types.filter((item) => item.select).map((item) => {
        arr.push(item.value1);
        arr.push(item.value2);
      });
      where = arr.length
        ? `where: { type: ${JSON.stringify(
          arr,
        )}}  order: "reverse:avg_rate", limit:5, offset: ${this.itemsOffset}`
        : `order: "reverse:avg_rate", limit:5, offset: ${this.itemsOffset}`;
    }
    this.itemsOffset = this.itemsOffset + 5;
    this.apigraphql
      .getBusinesses(where)
      .then((businesses) => {
        if (businesses.data.business.length) {
          let tempBusinesses = businesses.data.business.map((item) => ({
            ...item,
            images: [item.image],
          }));
          tempBusinesses = [...this.state.businesses, ...tempBusinesses];
          this.setState(
            {
              businesses: tempBusinesses,
              loading: false,
              loadItems: businesses.data.business.length == 5,
            },
            () => {
              this.canLoadItems = true;
            },
          );

          let idList = businesses.data.business.map((item) => item.id);

          this.apigraphql
            .getGallery(JSON.stringify(idList))
            .then((gallery) => {
              for (let i = 0; i < tempBusinesses.length; i++) {
                if (tempBusinesses[i].images.length <= 1) {
                  const element = tempBusinesses[i];
                  let tempImages = gallery.data.business_gallery
                    .filter((item) => item.business_id == element.id)
                    .map((item) => item.url);
                  tempBusinesses[i].images = [
                    tempBusinesses[i].images[0],
                    ...tempImages,
                  ];
                }
              }
              this.setState({
                businesses: tempBusinesses,
              });
            })
            .catch((error) => {
              console.log(error);
            });
          this.getLikesList(tempBusinesses);
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

  filterSort(types, sort) {
    if (!this.state.loading) {
      this.setState({
        loading: true,
      });
    }
    let where;
    if (this.state.searchData.country && this.state.searchData.state) {
      if (sort === 'normal') {
        where = `where: {  city_id: ${this.state.searchData.id}}`;
      }
      if (sort === 'avg_rate') {
        where = `where: {  city_id: ${this.state.searchData.id}}, order: "reverse:${sort}"`;
      }
      if (sort === 'distance') {
        where = `where: {  city_id: ${this.state.searchData.id}}, order: "reverse:${sort}"`;
      }
    } else {
      if (sort === 'normal') {
        where = `where: { country_id: ${this.state.searchData.id}}`;
      }
      if (sort === 'avg_rate') {
        where = `where: {  country_id: ${this.state.searchData.id}}, order: "reverse:${sort}"`;
      }
      if (sort === 'distance') {
        where = `where: {  country_id: ${this.state.searchData.id}}, order: "reverse:${sort}"`;
      }
    }
    this.apigraphql
      .getBusinesses(where)
      .then((businesses) => {
        let tempBusinesses = businesses.data.business.map((item) => ({
          ...item,
          images: [item.image],
        }));
        this.setState({
          businesses: tempBusinesses,
          loading: false,
        });
        let idList = businesses.data.business.map((item) => item.id);

        this.apigraphql
          .getGallery(JSON.stringify(idList))
          .then((gallery) => {
            for (let i = 0; i < tempBusinesses.length; i++) {
              const element = tempBusinesses[i];
              let tempImages = gallery.data.business_gallery
                .filter((item) => item.business_id == element.id)
                .map((item) => item.url);
              tempBusinesses[i].images = [
                tempBusinesses[i].images[0],
                ...tempImages,
              ];
            }
            this.setState({
              businesses: tempBusinesses,
            });
          })
          .catch((error) => {
            console.log(error);
          });
        this.getLikesList(tempBusinesses);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  filterFacilites(businesses) {
    let tempBusinesses = businesses.map((item) => ({
      ...item,
      images: [item.image],
    }));
    this.setState({
      businesses: tempBusinesses,
      loading: false,
    });
    let idList = businesses.map((item) => item.id);
    this.apigraphql
      .getGallery(JSON.stringify(idList))
      .then((gallery) => {
        for (let i = 0; i < tempBusinesses.length; i++) {
          const element = tempBusinesses[i];
          let tempImages = gallery.data.business_gallery
            .filter((item) => item.business_id == element.id)
            .map((item) => item.url);
          tempBusinesses[i].images = [
            tempBusinesses[i].images[0],
            ...tempImages,
          ];
        }
        this.setState({
          businesses: tempBusinesses,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    this.getLikesList(tempBusinesses);
  }

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({ landscape: false });
    } else {
      this.setState({ landscape: true });
    }
  };

  like = (i) => {
    if (!this.canLike) {
      return;
    }

    this.canLike = false;
    if (!this.state.businesses[i].like && this.state.likes) {
      this.apigraphql
        .setLike({
          customer_id: this.props.user.id,
          business_id: this.state.businesses[i].id,
        })
        .then((res) => {
          let arr = this.state.businesses;
          arr[i].like = true;
          arr[i].likeId = res.data.customer_liked_businessCreate.id;
          this.setState(
            {
              businesses: arr,
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
    } else if (this.state.businesses[i].like && this.state.likes) {
      this.apigraphql
        .deleteLikeSaved(this.state.businesses[i].id)
        .then((res) => {
          let arr = this.state.businesses;
          arr[i].like = false;
          this.setState(
            {
              businesses: arr,
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

  _renderPlaces() {
    let data = [];
    if (this.state.businesses.length > 0) {
      this.state.businesses.map(item => {
        let status = false;
        if (item.settings == null) {
          status = false;
        } else {
          status = true;
        }
        if (item.images.length > 0) {
          item.images.map(list => {
            if (list != null) {
              data.push(list)
            }
          })
        }
      })
    }
    return this.state.loading
      ? null
      : this.state.businesses.map((item, i) => (
        <ListTouchable
          key={i}
          onPress={() => {
            this.props.navigation.navigate('Business', {
              date: this.state.currentDate,
              business: item,
              like: () => {
                let arr = this.state.businesses;
                arr[i].like = !arr[i].like;
                this.setState({
                  businesses: arr,
                });
              },
              index: i,
            });
          }}>
          <View style={{ marginTop: 8 }}>
            <View style={styles.sliderContainer}>
              <View>
                <Carousel
                  data={item.images.length > 0 ? item.images.slice(1) : []}
                  navigation={() => {
                    this.props.navigation.navigate('Business', {
                      date: this.state.currentDate,
                      business: item,
                      like: () => {
                        let arr = this.state.businesses;
                        arr[i].like = !arr[i].like;
                        this.setState({
                          businesses: arr,
                        });
                      },
                      index: i,
                    });
                  }}
                />
              </View>
              {item.settings && (
                <React.Fragment>
                  {item.settings.temporary_closed && (
                    <View style={{ position: 'absolute', bottom: 20, width: '100%', paddingHorizontal: 16 }}>
                      <View style={{ backgroundColor: 'red', paddingVertical: 5, }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Temporary closed</Text>
                      </View>
                    </View>
                  )}
                </React.Fragment>
              )}
              <View style={styles.category}>
                <Text style={styles.categoryText}>
                  {/* {this._renderType(item.type)} */}
                  {item.type}
                </Text>
              </View>
              <Like
                active={this.state.businesses[i].like}
                setActive={() => {
                  this.like(i);
                }}
              />
            </View>
            <View style={{ marginBottom: 10 }}>
              <View style={styles.ratingRow}>
                <Image
                  source={require('../../assets/images/star.png')}
                  style={styles.star}
                />
                <Text style={styles.ratingText}>{item.avg_rate}</Text>
              </View>
              <Text style={styles.itemText}>{item.location_name}</Text>
            </View>
          </View>
        </ListTouchable>
      ));
  }

  _renderHeader() {
    const minScroll = 0;
    const clampedScrollY = this.state.curY.interpolate({
      inputRange: [minScroll, minScroll + 1],
      outputRange: [0, 1],
      extrapolateLeft: 'clamp',
    });
    const minusScrollY = Animated.multiply(clampedScrollY, -1);
    const headerDistance = Animated.diffClamp(minusScrollY, -73, 0).interpolate(
      {
        inputRange: [0, 1],
        outputRange: [0, 1],
      },
    );
    return (
      <Animated.View
        onLayout={({ nativeEvent }) =>
          this.setState({ height: nativeEvent.layout.height })
        }
        style={{
          backgroundColor: '#fff',
          zIndex: 2,
          position: 'absolute',
          top: 0,
          width: '100%',
          transform: [
            {
              translateY: headerDistance,
            },
          ],
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: this.state.elevation,
        }}>
        {this.state.search ? (
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({
                searchPlace: true,
              });
            }}>
            <View style={styles.location_view}>
              <View style={styles.back_view}>
                <TouchableOpacity
                  style={styles.back_btn}
                  onPress={async () => {
                    await this.setState({
                      search: false,
                      searchData: null,
                    });
                    await this.getList(this.state.types);
                  }}>
                  <Image
                    style={styles.back_img}
                    source={require('../../assets/images/back.png')}
                  />
                </TouchableOpacity>
                {this.state.searchData.state &&
                  this.state.searchData.country ? (
                  <Text style={styles.location_text}>
                    {this.state.searchData.name},{' '}
                    {this.state.searchData.state.name},{' '}
                    {this.state.searchData.country.name}
                  </Text>
                ) : (
                  <Text style={styles.location_text}>
                    {this.state.searchData.name}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.filter_btn}
                onPress={() => this.setState({ filterVisible: true })}>
                <Image
                  style={styles.filter_img}
                  source={require('../../assets/images/filter.png')}
                />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({
                searchPlace: true,
              });
            }}>
            <View style={styles.searchButton}>
              <Image
                style={styles.searchIcon}
                source={require('../../assets/images/search.png')}
              />
              <Text style={styles.searchText}>{i18n.t('WHERE_GOING')}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        <View>
          <Animated.ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}>
            <View style={styles.buttonsContainer}>
              {this.state.types.map((item, i) => (
                <TouchableWithoutFeedback
                  key={i}
                  onPress={() => {
                    let arr = this.state.types;
                    arr[i].select = !arr[i].select;
                    this.setState({
                      types: arr,
                    });
                    this.getList(arr);
                  }}>
                  <View
                    style={[
                      styles.button,
                      item.select && { backgroundColor: '#6844F9' },
                    ]}>
                    <Text
                      style={[
                        styles.buttonText,
                        item.select && { color: '#fff' },
                      ]}>
                      {item.text}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
          </Animated.ScrollView>
        </View>
      </Animated.View>
    );
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

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 70;
    //console.log(contentOffset.y);
    ////console.log(contentSize.height - paddingToBottom);
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  }
  searchAction(arr) {
    // this.state.businesses = data;
    this.setState({
      businesses: arr,
    });
    console.log(typeof arr, "--------------------->data")
  }
  render() {
    return (
      <View style={styles.content}>
        {this._renderHeader()}
        <Animated.ScrollView
          onContentSizeChange={() => {
            // this.scroll.scrollTo({x: 0, y: 0, animated: false});
          }}
          ref={(ref) => (this.scroll = ref)}
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, marginTop: this.state.height }}
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
                if (this.isCloseToBottom(event.nativeEvent)) {
                  if (this.canLoadItems) this.getList(this.state.types, true);
                }
              },
            },
          )}>
          <View style={styles.scrollInner}>
            {this._renderPlaces()}
            {!this.state.businesses.length && !this.state.loading ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.no_search}>
                  {i18n.t('NO_SEARCH_RESULTS')}
                </Text>
              </View>
            ) : null}
            <ContentLoading loading={this.state.loading} />
            {this.state.loadItems && !this.state.loading ? (
              <View style={styles.loaderContainer}>
                <MaterialIndicator size={50} color="#6844F9" />
              </View>
            ) : null}
          </View>
        </Animated.ScrollView>
        <SearchPlace
          close={async (data) => {
            if (data) {
              await this.setState({
                search: true,
                searchData: data,
                searchPlace: false,
              });
              await this.getList(this.state.types);
              this.setState({ searchPlace: false });
            } else {
              this.setState({ searchPlace: false });
            }
          }}
          searchAction={this.searchAction}
          getIndexBusiness={this.getIndexBusiness}
          navigation={this.props.navigation}
          isVisible={this.state.searchPlace}
        />
        <Filter
          close={(data) => {
            if (data) {
              this.setState({ filterVisible: false });
              this.filterFacilites(data);
            } else {
              this.setState({ filterVisible: false });
            }
          }}
          filterSort={(sort) => {
            this.filterSort(this.state.types, sort);
            this.setState({ filterVisible: false });
          }}
          go={(data) => {
            this.setState({ filterVisible: false });
            this.getList(this.state.types);
          }}
          data={this.state.searchData}
          isVisible={this.state.filterVisible}
        />
      </View>
    );
  }
}

export const Home = connect(({ user }) => ({ user }))(HomeClass);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },

  location_view: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back_view: {
    flexDirection: 'row',
  },
  back_btn: {
    width: 64,
    height: 36,
    paddingLeft: 16,
  },
  back_img: {
    resizeMode: 'contain',
    marginTop: 4,
    width: 16,
    height: 16,
  },
  filter_btn: {
    width: 64,
    height: 36,
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  filter_img: {
    marginTop: 4,
    height: 18,
    width: 20,
  },

  searchButton: {
    backgroundColor: '#fff',
    height: 50,
    marginHorizontal: 16,
    borderRadius: 25,
    marginTop: 16,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  searchIcon: {
    width: 17,
    height: 17,
    marginLeft: 26,
  },
  searchText: {
    color: 'black',
    fontSize: 16,
    lineHeight: 18,
    marginLeft: 18,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  buttonsContainer: {
    marginTop: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    minWidth: 109,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#6844F9',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#6844F9',
    marginBottom: 2,
  },
  buttonTextSmall: {
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    fontSize: 10,
    lineHeight: 12,
    color: '#fff',
  },
  sliderContainer: {
    height: (imgHeight * 9) / 16,
    borderRadius: 8,
  },
  item: {
    marginLeft: 16,
    height: (imgHeight * 9) / 16,
    borderRadius: 8,
    width: '100%',
  },
  imageContainer: {
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    backgroundColor: 'white',
    borderRadius: 8,
    height: (imgHeight * 9) / 16,
  },
  image: {
    resizeMode: 'cover',
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
    marginTop: 3,
    color: '#060606',
    fontSize: 13,
    lineHeight: 14,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    marginLeft: 5,
  },
  itemText: {
    color: 'black',
    fontSize: 16,
    lineHeight: 18,
    marginLeft: 16,
    marginTop: 2,
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  slideContainer: {
    flex: 1,
    marginHorizontal: 15,
    borderRadius: 8,
  },
  sliderImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  buttonImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  category: {
    position: 'absolute',
    left: 27,
    top: 11,
    backgroundColor: '#fff',
    borderRadius: 2,
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 11,
  },
  categoryText: {
    fontSize: 10,
    lineHeight: 12,
    color: 'black',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  header: {
    zIndex: 2,
    position: 'absolute',
    right: 0,
    left: 0,
    backgroundColor: '#fff',
    height: 250,
  },
  scrollInner: {
    flex: 1,
    marginBottom: 200,
    marginTop: 15,
  },
  loaderContainer: {
    height: 70,
  },
  no_search: {
    color: '#979797',
    fontFamily:
      Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    fontSize: 16,
    lineHeight: 22,
  },
});
