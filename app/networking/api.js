import { Constants } from '../constants'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'


export default class API {

  async getToken() {
    try {
      let data = await AsyncStorage.getItem('user')
      return data
    } catch (error) {
      console.log(error);
    }
  }

  async gatCountry() {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let country = axios.get(`${Constants.baseUrl}/determineCountry`,)
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return country
    } catch (err) {
      console.log(err);
    }
  }

  async login(info) {
    try {
      console.log(info, "------->")
      let responce = axios.post(`${Constants.baseUrl}/verifyPhoneNumber`, info)
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return responce
    } catch (error) {
      console.log(error);
    }
  }

  async sms(info) {
    try {
      let responce = axios.post(`${Constants.baseUrl}/verifySmsPin`, info)
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return responce
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(info) {
    try {
      let responce = axios.post(`${Constants.baseUrl}/login`, info)
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return responce
    } catch (error) {
      console.log(error);
    }
  }


  async search(item) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let reserve = axios.get(`${Constants.baseUrl}/search/general?query=${item}`, {
        headers: {
          'x-token': token.token
        }
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return reserve
    } catch (err) {
      console.log(err);
    }
  }
  async getSearchCountry(item, type) {
    console.log(item.country.name, type, "--------------->get")
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let reserve = axios.get(`${Constants.baseUrl}/search/location?query=${item.country.name}&type=${type}`, {
        headers: {
          'x-token': token.token
        }
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return reserve
    } catch (err) {
      console.log(err);
    }
  }

  async getSeats(id) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let reserve = axios.get(`${Constants.baseUrl}/getBusinessSeats?id=${id}`, {
        headers: {
          'x-token': token.token
        }
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return reserve
    } catch (err) {
      console.log(err);
    }
  }

  async reservePriveGet(info) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let reservePrive = axios.get(`${Constants.baseUrl}/calculatePrice`, {
        headers: {
          'x-token': token.token
        },
        params: info
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return reservePrive
    } catch (err) {
      console.log(err);
    }
  }


  async createCard(info) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let responce = axios.post(`${Constants.baseUrl}/createPaymentMethod`, info, {
        headers: {
          'x-token': token.token
        },
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return responce
    } catch (error) {
      console.log(error);
    }
  }


  async deleteCard(info) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let responce = axios.post(`${Constants.baseUrl}/deleteCard`, info, {
        headers: {
          'x-token': token.token
        },
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return responce
    } catch (error) {
      console.log(error);
    }
  }

  async uploadPhoto(uri) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let formData = new FormData()
      formData.append("photo", {
        uri: uri,
        type: "image/jpg",
        name: `avatar.jpg`,
      });
      let responce = axios.post(`${Constants.baseUrl}/upload/customer-photo`, formData, {
        headers: {
          'x-token': token.token
        },
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err
        })
      return responce
    } catch (error) {
      console.log(error);
    }
  }
  async getCurrentDate() {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let currentDate = axios.get(`${Constants.baseUrl}/search/getDate`, {
        headers: {
          'x-token': token.token
        },
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return currentDate
    } catch (err) {
      console.log(err);
    }
  }
  async getQrCodeApi(id) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let currentDate = axios.get(`${Constants.baseUrl}/customer/getQrcode?id=${id}`, {
        headers: {
          'x-token': token.token
        },
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return currentDate
    } catch (err) {
      console.log(err);
    }
  }
  async gettingReservationApi(start, end, zoneId) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let currentDate = axios.get(`${Constants.baseUrl}/customer/fullReservation?start=${start}&end=${end}&zoneId=${zoneId}`, {
        headers: {
          'x-token': token.token
        },
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return currentDate
    } catch (err) {
      console.log(err);
    }
  }
  async getTotalPriceDayApi(start) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let currentDate = axios.get(`${Constants.baseUrl}/multiDayPrice?id=7&days=${start}`, {
        headers: {
          'x-token': token.token
        },
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return currentDate
    } catch (err) {
      console.log(err);
    }
  }
  async getCurrentTimeApi(id) {
    try {
      let data = await this.getToken()
      let token = JSON.parse(data)
      let currentDate = axios.get(`${Constants.baseUrl}/getTimeZone?id=${id}`, {
        headers: {
          'x-token': token.token
        },
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err.response
        })
      return currentDate
    } catch (err) {
      console.log(err);
    }
  }
}
