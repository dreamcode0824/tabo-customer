import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage'
import API from '../../networking/api';
import Logo from '../../assets/images/logoStart.png';
import Tabo from '../../assets/images/tabo.png';
import ApiGraphQl from "../../networking/apiGraphQl";
import i18n from "../../constants/i18next";

class SplashClass extends Component {
  api = new API()
  apigraphql = new ApiGraphQl()

  constructor(props) {
    super(props);
  }

  async getToken() {
    try {
      let data = await AsyncStorage.getItem('user')
      let lang = await AsyncStorage.getItem('language')
      return { data, lang }
    } catch (error) {
      console.log(error);
    }
  }

  async getOpened() {
    try {
      let data = await AsyncStorage.getItem('opened')
      return data
    } catch (error) {
      console.log(error);
    }
  }

  getCountry() {
    this.api.gatCountry()
      .then(data => {
        console.log(data);
        this.props.dispatch({ type: 'SET_COUNTRY', value: data.data });
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: 'GetStarted' }],
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

  preload() {
    AsyncStorage.setItem('opened', 'true')
    this.apigraphql.getPreloadBusinesses()
      .then((businesses) => {
        let idList = businesses.data.business.map((item) => (item.id));
        this.apigraphql.getPreloadGallery(JSON.stringify(idList))
          .then((gallery) => {
            let urlOfImages = gallery.data.business_gallery.map((item) => item.url)
            this.preloadImages(urlOfImages)

          })
          .catch((error) => {
            console.log(error);
          })
      })
      .catch((error) => {
        console.log(error);
      })
    this.apigraphql.getEventGalleryPreload()
      .then((res) => {
        let urlOfImages1 = res.data.business_event_gallery.filter((item) => item.url).map((item) => item.url)
        let urlOfImages2 = res.data.business_event_gallery.filter((item) => item.thumbnail).map((item) => item.thumbnail)
        this.preloadImages([...urlOfImages1, ...urlOfImages2])

      })
      .catch((error) => {
        console.log(error);
      })
  }

  preloadImages(urlOfImages) {
    let preFetchTasks = []

    urlOfImages.forEach((p) => {
      preFetchTasks.push(Image.prefetch(p));
    });

    // Promise.all(preFetchTasks).then((results) => {
    //     let downloadedAll = true;
    //     results.forEach((result) => {
    //         if (!result) {
    //             //error occurred downloading a pic
    //             downloadedAll = false;
    //         }
    //     })

    //     if (downloadedAll) {
    //         //finish load images
    //     }
    // })
  }

  componentDidMount() {
    this.getOpened()
      .then((opened) => {
        if (!opened) {
          this.preload()
        }
      })
      .catch((error) => {
        console.log(error);
      })
    this.getToken()
      .then(({ data, lang }) => {
        if (lang) {
          this.props.dispatch({ type: 'SET_LANGUAGE', value: lang });
          i18n.changeLanguage(lang)
        }
        if (data) {
          let user = JSON.parse(data)
          this.apigraphql.getCustomer(user.id)
            .then((user) => {
              this.props.dispatch({ type: 'SET_USER', value: user.data.customer[0] })
              this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'TabNavigator' }],
              });
            })
            .catch((error) => {
              console.log(error);
            })

        } else {
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'GetStarted' }],
          });
          // this.getCountry()
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  componentWillUnmount() {
    clearTimeout(this.time);
  }

  render() {
    return (
      <View style={styles.content}>
        <View style={styles.logo_view}>
          <Image
            //  style={{borderRadius: 20}}
            source={Logo} style={{ width: 80, height: 80 }} />
          <Image source={Tabo} style={styles.tabo_img} />
        </View>
        <Text style={styles.tabo_text}>Take a book</Text>
      </View>
    );
  }
}

export const Splash = connect(({ config }) => ({ config }))(SplashClass);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fafbfd',
    justifyContent: 'space-between',
  },
  logo_view: {
    height: '92%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabo_img: {
    marginTop: 20,
  },
  tabo_text: {
    height: '8%',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Medium' : 'Circular-Std-Medium',
    color: '#6844F9',
  },
});