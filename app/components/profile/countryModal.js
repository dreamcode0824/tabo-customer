import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  ScrollView,
  TextInput
} from 'react-native';
import ApiGraphQl from '../../networking/apiGraphQl'

export class Country extends Component {
  apigraphql = new ApiGraphQl()

  constructor(props) {
    super(props);
    this.state = {
      cityList: [],
      search: ''
    }
  }


  _renderCountryList() {
    return this.state.cityList.map((data, index) => {
      return (
        <TouchableOpacity key={index} style={styles.country_item_btn} onPress={() => {
          this.props.changeCity(data.name, data.id)
          this.props.close()
        }}>
          <Text style={styles.country_item_text}>{data.name}</Text>
        </TouchableOpacity>
      )
    })
  }

  _renderSearch() {
    return (<View style={styles.search_view}>
      <Image
        style={styles.searchIcon}
        source={require('../../assets/images/search.png')}
      />
      <TextInput
        ref={ref => {
          this.input = ref
        }}
        value={this.state.search}
        placeholder={'What is the name of your city?'}
        style={styles.input}
        onChangeText={(text) => {
          this.enterText(text)
        }}
      />
    </View>)
  }

  enterText(text) {
    this.setState({
      search: text
    })
    if (text.length > 2) {
      this.apigraphql.getCityFilter(text)
        .then(citys => {
          this.setState({
            cityList: citys.data.city
          })
        })
        .catch(err => {
          console.log(err);
        })
      this.scroll.scrollTo({ x: 0, y: 0, animated: false })
    } else {
      this.setState({
        cityList: []
      })
    }
  }

  render() {
    return (
      <View>
        <Modal
          onShow={() => {
            this.input.focus()
          }}
          animationType="slide"
          transparent={true}
          visible={this.props.isVisible}
        >
          <View style={styles.container}>
            <View style={styles.title_view}>
              <TouchableOpacity style={styles.back_btn_view} onPress={() => this.props.close()}>
                <Image source={require('../../assets/images/back.png')} style={{ width: 16, height: 16, resizeMode: 'contain', }} />
              </TouchableOpacity>
              <Text style={styles.country_title_text}>City List</Text>
            </View>
            {this._renderSearch()}
            <ScrollView
              keyboardShouldPersistTaps='handled'
              ref={ref => {
                this.scroll = ref
              }}
            >
              <View style={{ marginTop: 15 }}>
                {this._renderCountryList()}
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  title_view: {
    flexDirection: 'row',
    marginTop: 20,
  },
  back_btn_view: {
    paddingTop: 3,
    paddingLeft: 16,
    height: 30,
    width: 70,
  },
  country_title_text: {
    color: '#000',
    fontSize: 17,
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold'
  },
  country_item_btn: {
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(181, 179, 189, 0.46)',
    justifyContent: 'center',
  },
  country_item_text: {
    color: '#000',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book'
  },
  search_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 0.5
  },
  input: {
    height: 52,
    width: '100%',
    fontSize: 16,
    lineHeight: 20,
    padding: 0,
    paddingRight: 32,
    paddingLeft: 50,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book'

  },
  searchIcon: {
    height: 20,
    width: 20,
    position: 'absolute',
    left: 16,
    top: 15
  }
});

