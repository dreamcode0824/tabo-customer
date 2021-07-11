import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
  Keyboard,
} from 'react-native';

import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import API from '../../networking/api';
import ApiGraphQl from '../../networking/apiGraphQl';
import Modal from 'react-native-modal';
import Back from '../../assets/images/back.png';


class SearchPlaceClass extends Component {

  api = new API();
  apigraphql = new ApiGraphQl();

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      business: [],
      city: [],
      country: [],
      seachRecent: [],
    };
  }

  async getSearch() {
    try {
      let data = await AsyncStorage.getItem('search_recent');
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async setSearch(recent) {
    try {
      await AsyncStorage.setItem('search_recent', JSON.stringify(recent));
    } catch (error) {
      console.log(error);

    }
  }


  handleChange = (e, name) => {
    this.setState({
      [name]: e,
    });
    if (e.length > 2) {
      return this.search(e);
    }
  };

  search(data) {
    this.api.search(data)
      .then(search => {
        console.log(search, "------------->")
        this.setState({
          business: search.data.business,
          city: search.data.city,
          country: search.data.country,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  getBusiness(data) {
    this.apigraphql.getBusinesses(`where : {id: ${data.id} }`)
      .then(business => {
        console.log(business, "------------------------->")
        //   this.apigraphql.getSavedBusinesses(`where: {customer_id: ${this.props.user.id}, business_id: ${data.id}}`)
        //     .then(data => {
        //       business = {
        //         ...business.data.business[0],
        //         like: data.data.customer_liked_business.length ? true : false,
        //         likeId: data.data.customer_liked_business.length ? data.data.customer_liked_business[0].id : false,
        //         images: [business.data.business[0].image],
        //       }
        //       this.props.getIndexBusiness(business)
        //       this.setState({
        //         search: '',
        //         business: [],
        //         city: [],
        //         country: [],
        //       });
        //     })
        //     .catch(err => {

        //     })
        // })
        // .catch(err => {
        //   console.log(err);
      });

  }
  searchCountry(data, type) {
    this.api.getSearchCountry(data, type)
      .then(search => {
        this.props.searchAction(search.data.arr)
        // this.state.business(search.data.arr)
        // console.log(search.data.arr, "------------->")
      })
      .catch(err => {
        console.log(err);
      });
  }
  _renderSearchImage(key) {
    switch (key) {
      case 'restaurant_terrace':
        return require('../../assets/images/Icon-Restaurant.png');
      case 'beach_pool':
        return require('../../assets/images/Icon-Beach.png');
      case 'club':
        return require('../../assets/images/Icon-Bar.png');
      default:
        return require('../../assets/images/locationBlack.png');
    }
  }

  async searchBtn(data, type) {
    let arr = this.state.seachRecent;
    const even = (element) => element.id === data.id;
    if (!arr.some(even)) {
      if (arr.length > 4) {
        arr.splice(0, 1);
        arr.push(data);
        await this.setSearch(arr);
      } else {
        arr.push(data);
        await this.setSearch(arr);
      }
      let seachRecent = await this.getSearch();
      this.setState({
        seachRecent: JSON.parse(seachRecent),
      });
    }
    if (type === 'business') {
      this.getBusiness(data);
    }
    if (type === 'city') {
      this.setState({
        search: '',
        business: [],
        city: [],
        country: [],
      });
      this.props.close(data);

    }
    if (type === 'country') {
      this.setState({
        search: '',
        business: [],
        city: [],
        country: [],
      });
      this.searchCountry(data, type);
      this.props.close(data);
    }
  }


  _renderSearch(item, type) {
    return item.map((data, index) => {
      return (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            this.searchBtn(data, type);
          }}
          key={index}
          style={styles.search_filter_view}>
          <View style={styles.location_item_view}>
            <Image source={this._renderSearchImage(data.type)} style={{ width: 36, height: 36 }} />
          </View>
          {data.state && data.country ?
            <Text
              style={styles.location_item_text}>{data.name},  {data.country.name}</Text>
            :
            <Text style={styles.location_item_text}>{data.name}</Text>
          }
        </TouchableOpacity>
      );
    });
  }

  _renderRecentSearch() {
    return <View>
      <Text style={styles.recent_text}>Recent searches</Text>
      {this.state.seachRecent.map((data, index) => {
        return (
          <TouchableOpacity key={index} style={styles.serch_view} onPress={() => {
            Keyboard.dismiss();
            if (data.type === 'restaurant_terrace') {
              return this.searchBtn(data, 'business');
            }
            if (data.type === 'beach_pool') {
              return this.searchBtn(data, 'business');
            }
            if (data.city && data.country) {
              return this.searchBtn(data, 'city');
            }
            return this.searchBtn(data, 'country');
          }}>
            <Image source={this._renderSearchImage(data.type)} style={{ width: 36, height: 36 }} />
            <View style={styles.info_view}>
              {data.country ?
                <Text
                  style={styles.name_text}>{data.name}, {data.country.name}</Text>
                :
                <Text style={styles.name_text}>{data.name}</Text>
              }
            </View>
          </TouchableOpacity>
        );
      })}</View>;
  }

  render() {
    return (
      <Modal
        onShow={() => {
          setTimeout(() => {
            this.input.focus();
          }, 150);
        }}
        onSwipeComplete={() => {
          this.props.close();
        }}
        swipeDirection="down"
        onBackButtonPress={() => {
          this.props.close();
        }}
        backdropColor={'#6844F9'}
        backdropOpacity={1}
        style={{ margin: 0 }}
        isVisible={this.props.isVisible}>

        <View style={styles.content}>
          <View style={styles.search_view}>
            <TouchableOpacity
              style={styles.backButtonContainer}
              activeOpacity={0.8}
              onPress={() => {
                Keyboard.dismiss()
                this.props.close();
                this.setState({
                  search: '',
                  business: [],
                  city: [],
                  country: [],
                });
              }}>
              <Image
                style={styles.backIcon}
                source={Back} />
            </TouchableOpacity>
            <TextInput
              value={this.state.search}
              ref={ref => this.input = ref}
              placeholder={'Where are you going?'}
              style={styles.input}
              onChangeText={(e) => this.handleChange(e, 'search')}
            />
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='always'
            showsVerticalScrollIndicator={false}>
            <View style={styles.scrollInner}>
              {this._renderSearch(this.state.business, 'business')}
              {this._renderSearch(this.state.city, 'city')}
              {this._renderSearch(this.state.country, 'country')}
              {this.state.seachRecent.length > 0 ?
                this._renderRecentSearch()
                :
                null
              }
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  async componentDidMount() {
    let seachRecent = await this.getSearch();
    if (JSON.parse(seachRecent) !== null) {
      this.setState({
        seachRecent: JSON.parse(seachRecent),
      });
    }
  }
}

export const SearchPlace = connect(({ user }) => ({ user }))(SearchPlaceClass);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 22,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  search_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    width: '100%',
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 26,
    color: '#000000',
  },
  scrollInner: {
    marginBottom: 40,
  },
  location_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  location_item_view: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(181, 179, 189, 0.2)',
    borderRadius: 4,
  },
  location_item_text: {
    marginLeft: 26,
    fontSize: 14,
    color: '#2C2929',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
  },
  recent_text: {
    marginTop: 30,
    marginLeft: 16,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    color: '#2C2929',
    fontWeight: 'bold',
  },
  serch_view: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  img_search: {
    width: 80,
    height: 56,
    borderRadius: 4,
  },
  info_view: {
    marginLeft: 14,
  },
  name_text: {
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    color: '#2C2929',
    fontSize: 14,
    lineHeight: 15,
  },
  date_geust_text: {
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
    color: '#9A98A3',
    fontSize: 11,
    lineHeight: 15,
  },
  search_filter_view: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(181, 179, 189, 0.24)',
    paddingVertical: 20,
    marginHorizontal: 16,
  },
  backButtonContainer: {
    marginLeft: 10,
    height: 28,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    resizeMode: 'contain',
    height: 16,
    width: 16,
  },
});
