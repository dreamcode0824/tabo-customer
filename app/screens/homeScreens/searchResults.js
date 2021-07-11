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
} from 'react-native';
import { connect } from 'react-redux';
import {
  SearchPlace,
  Like,
  Filter, TermsConditions
} from '../../components';


const imgHeight = Dimensions.get('window').width


class SearchResultsClass extends Component {
  canAnimate = true
  offset = 0

  constructor(props) {
    super(props);
    this.state = {
      filterVisible: false,
      places: [
        {
          active: false,
          dummyData: [
            {
              url: require('../../assets/images/slide1.png'),
              id: 1

            },
            {
              url: require('../../assets/images/slide2.png'),
              id: 2
            },
            {
              url: require('../../assets/images/slide3.png'),
              id: 3
            }
          ],
        },
        {
          active: false,
          dummyData: [
            {
              url: require('../../assets/images/slide1.png'),
              id: 1

            },
            {
              url: require('../../assets/images/slide2.png'),
              id: 2
            },
            {
              url: require('../../assets/images/slide3.png'),
              id: 3
            }
          ],
        },
        {
          active: false,
          dummyData: [
            {
              url: require('../../assets/images/slide1.png'),
              id: 1

            },
            {
              url: require('../../assets/images/slide2.png'),
              id: 2
            },
            {
              url: require('../../assets/images/slide3.png'),
              id: 3
            }
          ],
        },
        {
          active: false,
          dummyData: [
            {
              url: require('../../assets/images/slide1.png'),
              id: 1

            },
            {
              url: require('../../assets/images/slide2.png'),
              id: 2
            },
            {
              url: require('../../assets/images/slide3.png'),
              id: 3
            }
          ],
        },
        {
          active: false,
          dummyData: [
            {
              url: require('../../assets/images/slide1.png'),
              id: 1

            },
            {
              url: require('../../assets/images/slide2.png'),
              id: 2
            },
            {
              url: require('../../assets/images/slide3.png'),
              id: 3
            }
          ],
        },
        {
          active: false,
          dummyData: [
            {
              url: require('../../assets/images/slide1.png'),
              id: 1

            },
            {
              url: require('../../assets/images/slide2.png'),
              id: 2
            },
            {
              url: require('../../assets/images/slide3.png'),
              id: 3
            }
          ],
        },
      ],
      landscape: false,
      searchPlace: false,
      bookCalendarVisible: false,
      commingVisible: false,
      timeVisible: false,
      scrollValue: null,
      entries: [
        {
          img: require('../../assets/images/slide1.png'),
        },
        {
          img: require('../../assets/images/slide2.png'),
        },
        {
          img: require('../../assets/images/slide3.png')
        }
      ],
      activeFilter: '',
      activeSlide: 0,
      curY: new Animated.Value(0),
      height: 190,
      elevation: 0
    };
  }

  componentDidMount() {
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

  getOrientation = () => {
    if (Dimensions.get('window').width < Dimensions.get('window').height) {
      this.setState({ landscape: false });
    } else {
      this.setState({ landscape: true });
    }
  }

  _renderPlaces() {
    return this.state.places.map((item, i) => (
      <View
        key={i}
      >
        <View style={styles.sliderContainer}>
          <View>
            <Carousel data={item.dummyData} navigation={() => this.props.navigation.navigate('Business')} />
          </View>
          <View style={styles.category}>
            <Text style={styles.categoryText}>
              Beach & Pool
            </Text>
          </View>
          <Like
            active={item.active}
            setActive={() => {
              let arr = this.state.places
              arr[i].active = !arr[i].active
              this.setState({
                places: arr
              })
            }}
          />
        </View>
        <TouchableOpacity onPress={() => {
          this.props.navigation.navigate('Business')
        }} style={{ marginBottom: 18 }}>
          <View style={styles.ratingRow}>
            <Image
              source={require('../../assets/images/star.png')}
              style={styles.star} />
            <Text style={styles.ratingText}>
              5.0
                        </Text>
          </View>
          <Text style={styles.itemText}>
            Vuela Vuela lomas | Mexico
                    </Text>
          <Text style={styles.priceText}>
            $50 / <Text style={styles.priceSmallText}>1 ticket</Text>
          </Text>
        </TouchableOpacity>
      </View>
    ));
  }


  _renderHeader() {
    const headerDistance = Animated.diffClamp(this.state.curY, 0, 50).interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1]
    });
    return (
      <Animated.View
        onLayout={({ nativeEvent }) => this.setState({ height: nativeEvent.layout.height })}
        style={{
          backgroundColor: '#fff',
          zIndex: 2,
          position: 'absolute',
          top: 0,
          width: '100%',
          transform: [{
            translateY: headerDistance
          }],
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: this.state.elevation,
        }}>


        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({
              searchPlace: true,
            });
          }}
        >
          <View style={styles.location_view}>
            <View style={styles.back_view}>
              <TouchableOpacity style={styles.back_btn} onPress={() => this.props.navigation.goBack()}>
                <Image
                  style={styles.back_img}
                  source={require('../../assets/images/back.png')}
                />
              </TouchableOpacity>
              <Text style={styles.location_text}>
                Maiami, FI
                            </Text>
            </View>
            <TouchableOpacity style={styles.filter_btn} onPress={() => this.setState({ filterVisible: true })}>
              <Image
                style={styles.filter_img}
                source={require('../../assets/images/filter.png')}
              />
            </TouchableOpacity>

          </View>
        </TouchableWithoutFeedback>



        <View>
          <Animated.ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal={true}
          >
            <View style={styles.buttonsContainer}>
              <TouchableWithoutFeedback onPress={() => {
                if (this.state.activeFilter === 'beach') {
                  return this.setState({
                    activeFilter: ''
                  })
                }
                this.setState({
                  activeFilter: 'beach'
                })
              }}>
                <View
                  style={[styles.button, this.state.activeFilter === 'beach' && { backgroundColor: '#6844F9' }]}>
                  <Text
                    style={[styles.buttonText, this.state.activeFilter === 'beach' && { color: '#fff' }]}>
                    Beach & Pool
                                    </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {
                if (this.state.activeFilter === 'club') {
                  return this.setState({
                    activeFilter: ''
                  })
                }
                this.setState({
                  activeFilter: 'club'
                })
              }}>
                <View
                  style={[styles.button, this.state.activeFilter === 'club' && { backgroundColor: '#6844F9' }]}>
                  <Text
                    style={[styles.buttonText, this.state.activeFilter === 'club' && { color: '#fff' }]}>
                    Club
                                    </Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => {
                if (this.state.activeFilter === 'terraces') {
                  return this.setState({
                    activeFilter: ''
                  })
                }
                this.setState({
                  activeFilter: 'terraces'
                })
              }}>
                <View
                  style={[styles.button, this.state.activeFilter === 'terraces' && { backgroundColor: '#6844F9' }]}>
                  <Text
                    style={[styles.buttonText, this.state.activeFilter === 'terraces' && { color: '#fff' }]}>
                    Terraces & Restaurants
                                    </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Animated.ScrollView>
        </View>
      </Animated.View>
    )
  }

  headerBorder(offsetY) {
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

  render() {
    return (
      <View style={styles.content}>
        {this._renderHeader()}
        <Animated.ScrollView
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: this.state.height }}
          onScroll={Animated.event(
            [{
              nativeEvent: { contentOffset: { y: this.state.curY } }
            }],
            {
              useNativeDriver: false,
              listener: event => {
                const offsetY = event.nativeEvent.contentOffset.y
                this.headerBorder(offsetY)
              },
            },
          )}
        >
          <View style={styles.scrollInner}>
            {this._renderPlaces()}

          </View>
        </Animated.ScrollView>
        <Filter
          close={() => {
            this.setState({ filterVisible: false });
          }}
          isVisible={this.state.filterVisible}
        />
      </View>
    );
  }
}

export const SearchResults = connect()(SearchResultsClass);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  location_view: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  back_view: {
    flexDirection: 'row',
  },
  back_btn: {
    width: 64,
    height: 36,
    paddingLeft: 16
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
    paddingRight: 16
  },
  filter_img: {
    marginTop: 4,
    height: 18,
    width: 20,
  },
  location_text: {
    color: 'black',
    fontSize: 17,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  buttonsContainer: {
    marginTop: 5,
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
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: '#6844F9',
    marginBottom: 2
  },
  buttonTextSmall: {
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    fontSize: 10,
    lineHeight: 12,
    color: '#fff',
  },
  sliderContainer: {
    height: imgHeight * 9 / 16,
  },
  item: {
    marginLeft: 16,
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
  priceSmallText: {
    fontSize: 10,
    color: '#9A98A3',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
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
    justifyContent: "center",
    paddingHorizontal: 11
  },
  categoryText: {
    fontSize: 10,
    lineHeight: 12,
    color: 'black',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
  },
  header: {
    zIndex: 2,
    position: "absolute",
    right: 0,
    left: 0,
    backgroundColor: '#fff',
    height: 250
  },
  scrollInner: {
    flex: 1,
    marginBottom: 180,
    marginTop: 15
  }
});

