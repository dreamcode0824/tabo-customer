import { ApolloClient, from, gql, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import AsyncStorage from '@react-native-community/async-storage';
import { Constants } from '../constants';

const link = new HttpLink({
  uri: `${Constants.graphQL}`,
});

const authLink = setContext(async (_, { headers }) => {
  let data = await AsyncStorage.getItem('user');
  let token = JSON.parse(data);
  return {
    headers: {
      ...headers,
      'x-token': token ? `${token.token}` : '',
    },
  };
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
  defaultOptions
});

export default class API {

  async getToken() {
    try {
      let data = await AsyncStorage.getItem('user');
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  getCountry(data) {
    try {
      let counts = client.query({
        query: gql`
                query getCities {
                    city (where:{country_code:"${data}"}) {
                          id
                          name
                    }
                }`,
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          return error;
        });
      return counts;
    } catch (err) {
      return err;
    }
  }

  async resetPassword(data) {
    try {
      let reset = client.mutate({
        mutation: gql`
                mutation password{
                    ResetPassword(input: {
                        password: "${data.password}"
                        number: "${data.number}"
                        code: "${data.code}"
                    })
                }
            `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err.message;
        });
      return reset;
    } catch (err) {
      console.log(err);
    }
  }

  getCountyId(cca2) {
    try {
      let id = client.query({
        query: gql`
                    query getCountry {
                         country (where: {iso2: "${cca2}"}) {
                            id
                         }
                    }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return id;
    } catch (err) {
      console.log(err);
    }
  }

  getCityId(data) {
    try {
      let counts = client.query({
        query: gql`
                        query getCities {
                            city (where:{country_id: ${data}}) {
                                 id
                                 name
                            }
                        }`,
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          return error;
        });
      return counts;
    } catch (err) {
      return err;
    }
  }

  getCityFilter(data) {
    try {
      let cityFilter = client.query({
        query: gql`
                   query getCities {
                        city(where: { name: "${data}" }) {
                            id
                            name
                        }
                    }
                `,
      }).then(data => {
        return data;
      })
        .catch(err => {
          return err;
        });
      return cityFilter;
    } catch (e) {
      console.log(e);
    }
  }

  getFilter() {
    try {
      let getFacilitiesFilter = client.query({
        query: gql`
                   query facilitiesFilter {
                        facilities(where: {}) {
                            id
                            name
                        }
                    }
                `,
      }).then(data => {
        return data;
      })
        .catch(err => {
          return err;
        });
      return getFacilitiesFilter;
    } catch (e) {
      console.log(e);
    }
  }

  async getBusinesses(where) {
    console.log(where, "------------>whereData")
    try {
      let businesses = client.query({
        query: gql`
                    query getBusiness {
                        business(${where} ){
                            id
                            name
                            number
                            image
                            description
                            type
                            offer
                            avg_rate
                            location
                            location_name
                            country{
                                name
                            }
                            settings{
                              currency
                              guaranteed_reservation
                              latitude
                              longitude
                              beach_location_city
                              beach_location_country
                              estimated_time
                              temporary_closed
                            }
                            city{
                                name
                                state{
                                    name
                                }
                            } 
                        }
                    }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return businesses;
    } catch (error) {
      console.log(error);
    }
  }

  async getEvents(where) {
    console.log(where);
    try {
      let events = client.query({
        query: gql`
                    query event {
                        business_event(${where}) {
                            id
                            title
                            description
                            going
                            interested
                            reserved
                            thumbnail
                            main
                            date
                            business_id
                            location_position
                            location_name
                        }
                    }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return events;
    } catch (error) {
      console.log(error);
    }
  }

  async businessEventPrices(id) {
    try {
      let eventsPrice = client.query({
        query: gql`
                    query eventPrice {
                        business_event_prices(where : {business_event_id: ${id}}) {
                            id
                            zone
                            price
                            currency
                        }
                    }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return eventsPrice;
    } catch (error) {
      console.log(error);
    }
  }

  async getLikeEvents() {
    try {
      let eventsLike = client.query({
        query: gql`
                    query eventLike {
                        customer_liked_event(where: {}) {
                           id
                           customer_id
                           event_id
                        }
                    }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return eventsLike;
    } catch (error) {
      console.log(error);
    }
  }

  getCustomerEventStatus() {
    try {
      let eventStatus = client.query({
        query: gql`
                query getCustomerEventStatuses {
                    customer_event_status(where: {}) {
                        id
                        status
                        event_id
                        customer_id
                    }
                }
                `
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err
        })
      return eventStatus
    } catch (err) {
      console.log(err);
    }
  }

  createEventStatus(data) {
    try {
      let eventCreateStatus = client.mutate({
        mutation: gql`
                mutation setGoing {
                    customer_event_statusCreate(customer_event_status: {
                        status: "${data.status}"
                        event_id: ${data.event_id}
                    }){
                        id
                        status
                        event_id
                        customer_id
                        __typename
                    }
                }
                `
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err
        })
      return eventCreateStatus
    } catch (err) {
      console.log(err);
    }
  }

  updateEventStatus(data) {
    try {
      let eventUpdateStatus = client.mutate({
        mutation: gql`
                mutation setUpdateGoing {
                    customer_event_statusUpdate(customer_event_status: {
                        status: "${data.status}"
                        id: ${data.status_id}
                    }){
                        id
                        status
                        event_id
                        customer_id
                        __typename
                    }
                }
                `
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err
        })
      return eventUpdateStatus
    } catch (err) {
      console.log(err);
    }
  }

  deleteEventStatus(data) {
    try {
      let eventDeleteStatus = client.mutate({
        mutation: gql`
                mutation setDeleteGoing {
                    customer_event_statusDelete(id: ${data.status_id})
                }
                `
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err
        })
      return eventDeleteStatus
    } catch (err) {
      console.log(err);
    }
  }

  getSavedBusinesses(where) {
    try {
      let businesses = client.query({
        query: gql`
                query getLikedBusiness {
                    customer_liked_business(${where}){
                        business{
                        id
                        name
                        number
                        image
                        description
                        type
                        avg_rate
                        location
                        country{
                            name
                        }
                        city{
                            name
                            state{
                                name
                            }
                        }
                      }
                     }
                    }
                    `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return businesses;
    } catch (error) {
      console.log(error);
    }

  }

  getSavedEvents(where) {
    try {
      let events = client.query({
        query: gql`
                query getLikedEvents {
                    customer_liked_event(${where} ){
                            business_event{
                                    id
                                    title
                                    description
                                    going
                                    interested
                                    reserved
                                    thumbnail
                                    main
                                    date
                                    business_id
                                    location_position
                                    location_name
                            }
                    }
                }
                    `,
      })
        .then(data => {
          console.log(data);
          return data;
        })
        .catch(err => {
          return err;
        });
      return events;
    } catch (error) {
      console.log(error);
    }

  }

  getSavedBusinessesWithType(type, id, options) {
    try {
      let businesses = client.query({
        query: gql`
                query getLikedBusiness {
                    custom_query(where: {name: "saved_businesses", type: "${type}", customer_id: ${id}}${options}) {
                            id
                            result
                            }
                         }
                    `
      })
        .then(data => {
          return data
        })
        .catch(err => {
          return err
        })
      return businesses
    } catch (error) {
      console.log(error)
    }

  }
  /*
      getEventSavedWithType(id, options) {
          try {
              let businesses = client.query({
                  query: gql`
                  query getLikedBusiness {
                      custom_query(where: {name: "saved_businesses", customer_id: ${id}}${options}) {
                              id
                              result
                              }
                           }
                      `
              })
                  .then(data => {
                      return data
                  })
                  .catch(err => {
                      return err
                  })
              return businesses
          } catch (error) {
              console.log(error)
          }
  
      }*/

  async getPreloadBusinesses() {
    try {
      let businesses = client.query({
        query: gql`
            query getBusiness {
                business(order: "reverse:avg_rate" limit: 3){
                    id
                }
            }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return businesses;
    } catch (error) {
      console.log(error);
    }
  }

  getPreloadGallery(arr) {
    try {
      let businesses = client.query({
        query: gql`
            query getBusinessGallery {
                business_gallery(where:{business_id:${arr}}){
                    business_id
                    url
                    is_main
                }
            }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return businesses;
    } catch (error) {
      console.log(error);
    }
  }

  getEventGallery(id) {
    try {
      let galery = client.query({
        query: gql`
            query getEventGallery {
                business_event_gallery(where:{}){
                    id
                    index
                    type
                    url
                    business_event_id
                    thumbnail
                }
            }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }

  async getBusinessesSettings(id) {
    try {
      let businessesSettings = client.query({
        query: gql`
                    query getBusinessSettings {
                        business_settings(where : {business_id: ${id}}){
                            id
                            currency
                        }
                    }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return businessesSettings;
    } catch (error) {
      console.log(error);
    }
  }

  getRelated(where) {
    try {
      let businesses = client.query({
        query: gql`
                    query getBusiness {
                        business(${where} order: "reverse:avg_rate", limit: 5){
                            id
                        name
                        number
                        image
                        description
                        type
                        avg_rate
                        location
                        country{
                            name
                        }
                        city{
                            name
                            state{
                                name
                            }
                        }
                        }
                    }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          console.log(err);
          return err;
        });
      return businesses;
    } catch (error) {
      console.log(error);
    }
  }

  getReservedActive(options) {
    console.log(options, "------------->option")
    try {
      let reserved = client.query({
        query: gql`
        query reservation_beach {
          reservation_beach(
            where: {reservation_status: ["pending", "paid_online", "occupied"], 
              }${options}
          
          ) {
            id
            element_count
            seat_position
            additional_sunbed
            protocol_status
            phone_number
            name
            comment
            paid_online
            price_values
            coupon_number
            discount_amount
            completed
            released_days
            changed_position
            business_id
            time_zone
            changed_position
            created_at
            updated_at
            accepted_by
            rejected_by
            canceled_by
            rent_umbrella
            selected_days
            reservation_status
            total_price
            customer_request
            extra_sunbed_price
            rent_umbrella_price
            released_days
            business {
              id
              name
              image
              avg_rate
              type
              location
              location_name
              settings{
                beach_location_country
                beach_location_city
              }
              country{
                  name
              }
              city{
                  name
                  state{
                      name
                  }
              }
            gallery{
              id
              url
            }
            }
          }
      }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          console.log(err);
          return err;
        });
      return reserved;
    } catch (error) {
      console.log(error);
    }
  }

  getReservedPaid(options) {
    try {
      let reserved = client.query({
        query: gql`
                query getPastReservations {
                    reservation(where: {status: ["canceled", "expired", "completed"], payment_status: "paid"}${options}) {
                      id
                      status
                      amount
                      type
                      business {
                        id
                        name
                        image
                        avg_rate
                        type
                      }
                    }
                  }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          console.log(err);
          return err;
        });
      return reserved;
    } catch (error) {
      console.log(error);
    }
  }

  getGallery(arr) {
    try {
      let businesses = client.query({
        query: gql`
                query getBusinessGallery {
                    business_gallery(where:{is_main:false, business_id:${arr}}){
                        business_id
                            url
                      is_main
                    }
                }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return businesses;
    } catch (error) {
      console.log(error);
    }
  }

  getReservedInfo(id) {
    try {
      let reservedInfo = client.query({
        query: gql`
                query getReservation {
                    reservation(where: { id: ${id} }) {
                    status
                    old_amount
                    start_date
                    end_date
                    arrival_time
                    element {
                        type
                        structure
                    }
                    element_quantity
                    }
                }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return reservedInfo;
    } catch (error) {
      console.log(error);
    }
  }

  getFacilities(businessId) {
    try {
      let facilitie = client.query({
        query: gql`
                    query business_facilities{
                        business_facilities(where: {business_id: ${businessId}}){
                            facility{
                                name
                            }
                        }
                    }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return facilitie;
    } catch (err) {
      console.log(err);
    }
  }

  filterFacilites(data) {
    try {
      let facilitieFilter = client.query({
        query: gql`
                    query facilityFilter {
                        custom_query(${data}) {
                        id
                        result
                      }
                    }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return facilitieFilter;
    } catch (err) {
      console.log(err);
    }
  }

  getSeat(businessId) {
    try {
      let getSeat = client.query({
        query: gql`
                    query seatBusiness{
                        seat(where: {business_id: ${businessId}}){
                            id
                            index
                            business_element_id
                            business_id
                        }
                    }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return getSeat;
    } catch (err) {
      console.log(err);
    }
  }

  getReview(businessId) {
    try {
      let review = client.query({
        query: gql`
                    query getReviews{
                        review(where: {business_id: "${businessId}"},  limit: 5){
                            id
                            review
                            rate
                            customer {
                                first_name
                                last_name
                                photo
                            }
                            created_at
                        }
                    }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return review;
    } catch (err) {
      console.log(err);
    }
  }

  getMenuCategories(businessId) {
    try {
      let getBeachMenuCategories = client.query({
        query: gql`
                    query getBeachMenuCategories{
                        beach_menu_category(where: {business_id: "${businessId}"}){
                            id
                            title
                        }
                    }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return getBeachMenuCategories;
    } catch (err) {
      console.log(err);
    }
  }

  getMenuItems(businessId) {
    try {
      let getBeachMenuItems = client.query({
        query: gql`
                    query getBeachMenuItems{
                        beach_menu_item(where: {business_id: "${businessId}"}){
                            id
                            price
                            currency
                            title
                            description
                            beach_menu_category_id
                        }
                    }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return getBeachMenuItems;
    } catch (err) {
      console.log(err);
    }
  }

  getRulesTermsBusiness(businessId) {
    try {
      let getRulesTermsBusiness = client.query({
        query: gql`
                    query getRulesTerms {
                        business(where: {id: "${businessId}"}){
                            rules {
                                rules
                            }
                            terms_and_conditions {
                                terms
                            }
                        }
                    }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return getRulesTermsBusiness;
    } catch (err) {
      console.log(err);
    }
  }

  getCustomer(id) {
    try {
      let customer = client.query({
        query: gql`
                    query getCustomer {
                        customer(where: {id: ${id}}){
                            id
                            first_name
                            last_name
                            email
                            phone
                            photo
                            language
                            city{
                                name
                            }
                            city_id
                            country_id
                        }
                    }
                `,
      })
        .then(customer => {
          return customer;
        })
        .catch(err => {
          console.log(err);
          return err;
        });
      return customer;
    } catch (err) {
      console.log(err);
    }
  }
  //
  async updateCustomer(data) {
    console.log(data, 'rewgklrjerfiopjfkol');
    try {
      let update = client.mutate({
        mutation: gql`
                mutation updateCustomer{
                    customerUpdate(customer: ${data}){
                        id
                        token
                        email
                        phone
                        first_name
                        last_name
                        city_id
                        google_user_id
                    }
                }
            `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err.message;
        });
      return update;
    } catch (err) {
      console.log(err);
    }
  }

  createCustomer(data) {
    try {
      let customer = client.mutate({
        mutation: gql`
                        mutation createCustomer {
                            customerCreate(customer: {
                                first_name: "${data.first_name}"
                                last_name: "${data.last_name}"
                                email: "${data.email}"
                                city_id: ${data.city_id}
                                phone: "${data.phone}"
                                password: "${data.password}"
                                device: {os: "android"}
                            }){
                               id
                               token
                           }
                        }`,
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          return error;
        });
      return customer;
    } catch (err) {
      return err;
    }
  }

  createCustomerOnlyPassword(data) {
    try {
      let customer = client.mutate({
        mutation: gql`
                        mutation createCustomer {
                            customerCreate(customer: {
                                phone: "${data.phone}"
                                password: "${data.password}"
                                device: {os: "android"}
                            }){
                               id
                               token
                           }
                        }`,
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          return error;
        });
      return customer;
    } catch (err) {
      return err;
    }
  }


  addReview(review) {
    try {
      let addReview = client.mutate({
        mutation: gql`
                     mutation review{
                        reviewCreate(review:{
                            review: "${review.review}"
                            rate: ${review.rate}
                            business_id: ${review.business_id}
                            customer_id: ${review.customer_id}
                        }){
                            id
                        }
                     }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return addReview;
    } catch (err) {
      console.log(err);
    }
  }

  setLike(data) {
    try {
      let like = client.mutate({
        mutation: gql`
                mutation customerLikeBusiness {
                    customer_liked_businessCreate (customer_liked_business: {
                      customer_id: ${data.customer_id}
                      business_id: ${data.business_id}
                    }) {
                      id
                    }
                  }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return like;
    } catch (err) {
      console.log(err);
    }
  }

  getLikes(id) {
    try {

      let customer = client.query({
        query: gql`
                query getLikedBusinesses {
                    customer_liked_business(where: {customer_id: ${id}}) {
                      business_id
                      id
                    }
                  }
                `,
      })
        .then(customer => {
          return customer;
        })
        .catch(err => {
          return err;
        });
      return customer;
    } catch (err) {
      console.log(err);
    }
  }


  customerLlikedEvent(id) {
    try {
      let customer = client.query({
        query: gql`
                query getLikedBusinesses {
                    customer_liked_business(where: {customer_id: ${id}}) {
                      business_id
                      id
                    }
                  }
                `,
      })
        .then(customer => {
          return customer;
        })
        .catch(err => {
          return err;
        });
      return customer;
    } catch (err) {
      console.log(err);
    }
  }

  eventLikeCreate(data) {
    try {
      let like = client.mutate({
        mutation: gql`
                mutation customerLikeEvent {
                    customer_liked_eventCreate (customer_liked_event: {
                      customer_id: ${data.customer_id}
                      event_id: ${data.event_id}
                    }) {
                      id
                    }
                  }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return like;
    } catch (err) {
      console.log(err);
    }
  }

  deleteEventLike(id) {
    try {
      let deleteLike = client.mutate({
        mutation: gql`
                mutation customerLikeEventDelete {
                    customer_liked_eventDelete (id: ${id})
                   }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return deleteLike;
    } catch (err) {
      console.log(err);
    }
  }

  async createReserveEvent(data) {
    try {
      let createReserveEvent = client.mutate({
        mutation: gql`
                mutation createReserve{
                    business_event_reservationCreate(business_event_reservation: {
                        person_quantity: ${data.person_quantity}
                        business_event_id: ${data.business_event_id}
                        price_id: ${data.price_id}
                    }){
                        id
                        amount
                        currency
                    }
                }
            `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err.message;
        });
      return createReserveEvent;
    } catch (err) {
      console.log(err);
    }
  }

  async updateReserveEvent(data) {
    try {
      let updatyeReserveEvent = client.mutate({
        mutation: gql`
                mutation updateReserve{
                    business_event_reservationUpdate(business_event_reservation: {
                        person_quantity: ${data.person_quantity}
                        id: ${data.id}
                        price_id: ${data.price_id}
                    }){
                        id
                        amount
                        currency
                    }
                }
            `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err.message;
        });
      return updatyeReserveEvent;
    } catch (err) {
      console.log(err);
    }
  }


  deleteLike(id) {
    try {
      let addReview = client.mutate({
        mutation: gql`
                mutation customerLikeEventDelete {
                    customer_liked_eventDelete (id: ${id})
                   }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return addReview;
    } catch (err) {
      console.log(err);
    }
  }

  deleteLikeSaved(id) {
    try {
      let deleteSaved = client.mutate({
        mutation: gql`
                mutation customerLikeEventDelete {
                   DeleteCustomerLikedBusiness(input: {business_id: ${id}}){
                        status
                   }
                   }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return deleteSaved;
    } catch (err) {
      console.log(err);
    }
  }

  deleteLikeSavedEvent(id) {
    try {
      let deleteSavedEvent = client.mutate({
        mutation: gql`
                mutation customerLikeEventDelete {
                   DeleteCustomerLikedEvent(input: {event_id: ${id}}){
                        status
                   }
                }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return deleteSavedEvent;
    } catch (err) {
      console.log(err);
    }
  }

  getProducts(id) {
    try {
      let products = client.query({
        query: gql`
                query getVipProducts {
                    business_vip_product(where: {business_id: ${id}}) {
                      id
                      title
                    }
                  }`,
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          return error;
        });
      return products;
    } catch (err) {
      return err;
    }
  }

  getSeatsImages(id) {
    try {
      let products = client.query({
        query: gql`
                query getBusinessElementGallery {
                    business_element_gallery(where: {business_id: ${id}}) {
                      image
                      element_type
                    }
                  }`,
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          return error;
        });
      return products;
    } catch (err) {
      return err;
    }
  }

  getStripeCard(id) {
    try {
      let cards = client.query({
        query: gql`
                query stripeCard {
                  stripe_card(where: { customer_id: ${id} }) {
                    id
                    last4
                    brand
                    id
                  }
                }`,
      })
        .then(result => {
          return result;
        })
        .catch(error => {
          return error;
        });
      return cards;
    } catch (err) {
      return err;
    }
  }

  setArrivalTime(id, time) {
    try {
      let addReview = client.mutate({
        mutation: gql`
                mutation setArrivalTime {
                    reservationUpdate(reservation: {id: ${id}, arrival_time: "${time}"}) {
                      id
                    }
                  }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return addReview;
    } catch (err) {
      console.log(err);
    }
  }

  getWithFilter(where) {
    console.log(where)
    try {
      let reserved = client.query({
        query: gql`
                query getSearch { custom_query(${where}) {
                    id
                    result
                        }}`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return reserved;
    } catch (error) {
      console.log(error);
    }
  }

  getEventGalleryPreload() {
    try {
      let galery = client.query({
        query: gql`
            query getEventGallery {
                business_event_gallery(where:{}){
                    url
                    thumbnail
                }
            }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }

  checkSocialUser(where) {
    try {
      let galery = client.query({
        query: gql`
                query checkId {
                    customer(${where}){
                      id
                    }
                  }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }

  setSocialUser(data) {
    try {
      let galery = client.query({
        query: gql`
                mutation setSocialUser{
                    customerCreate(customer:${data}){
                      id
                      token
                      first_name
                      last_name
                      photo
                      phone
                      email
                    }
                  }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }

  getSocialUser(data) {
    try {
      let galery = client.query({
        query: gql`
                mutation getSocialUser{
                    CustomerSocialLogin(input:${data}){
                      token
                      id
                      first_name
                      last_name
                      email
                      phone
                      photo
                      language
                      city_id
                      country_id
                    }
                  }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }
  getSeatsGraphQl(data) {
    try {
      let galery = client.query({
        query: gql`
                query zone {
                zone(where: {
                  business_id:${data}
                }) {
                  name
                config
                }
            }`,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }
  getElementTypesGraphQl(data) {
    try {
      let galery = client.query({
        query: gql`
              query business_element {
              business_element(where: {
                business_id:${data}
              }) {
              id
              zone_id
              zone{
                id
                config
              }
              element{
                id
                type
              }
              }
            }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }
  getRule(business_id) {
    console.log(business_id, "----------------->lang")
    try {
      let galery = client.query({
        query: gql`
                query business_rules {
                business_rules(where: {
                  business_id:${business_id}
                }) {
                rules
                }
              }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }
  getLanguages() {
    try {
      let galery = client.query({
        query: gql`
                 query language {
                    language(where: {
                      active:1
                    }) {
                    long_name
                    active
                    id
                    }
                }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }
  getBusinessDataByLocations(id) {
    try {
      let galery = client.query({
        query: gql`
                query business{
                  business(
                    where: {id: ${id}}
                  ){
                    id
                    currency
                    location_name
                    type
                    country_id
                    city_id
                    country{
                      name
                      capital
                    }
                  city{
                      name
                    state_code
                    } 
                    settings{
                      currency
                      guaranteed_reservation
                      latitude
                      longitude
                      beach_location_city
                      beach_location_country
                      estimated_time
                      temporary_closed
                    }
                    facilities{
                      facility_id
                      facility{
                        id
                        name
                      }
                    }
                    elements{
                      id
                      is_vip
                      element{
                        type
                        structure
                      }
                      zone{
                        id
                        name
                        config
                      }
                    }
                    business_week{
                      id
                      mon
                      mon_start
                      mon_end
                      tue
                      tue_start
                      tue_end
                      wed
                      wed_start
                      wed_end
                      thu
                      thu_start
                      thu_end
                      fri
                      fri_start
                      fri_end
                      sat
                      sat_start
                      sat_end
                      sun
                      sun_start
                      sun_end
                    }
                    price{
                      id
                      price
                      type
                      zone_id
                      start_date
                      end_date
                      element{
                        type
                        structure
                      }
                    }
                    zone{
                      id
                      name
                      config
                    }
                  }
                }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }
  getWorkingHour(id) {
    try {
      let galery = client.query({
        query: gql`
                query business {
                  business(where: {
                    id:${id}
                  }) {
                    settings{
                      booking_time_limit
                    }
                  business_week{
                    id
                    mon
                    mon_start
                    mon_end
                    tue
                    tue_start
                    tue_end
                    wed
                    wed_start
                    wed_end
                    thu
                    thu_start
                    thu_end
                    fri
                    fri_start
                    fri_end
                    sat
                    sat_start
                    sat_end
                    sun
                    sun_start
                    sun_end
                    mon_start_break
                    mon_end_break
                    tue_start_break
                    tue_end_break
                    wed_start_break
                    wed_end_break
                    thu_start_break
                    thu_end_break
                    fri_start_break
                    fri_end_break
                    sat_start_break
                    sat_end_break
                    sun_start_break
                    sun_end_break
                  }
                }
              }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }
  getTimeLineApi(id) {
    try {
      let galery = client.query({
        query: gql`
                 query time_line {
                  time_line(where: {
                    business_id:${id}
                  }) {
                  id
                time
                full
                  }
              }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }
  getClosedDaysApi(id) {
    try {
      let galery = client.query({
        query: gql`
                 query business_year {
                  business_year(where: {
                    business_id:${id}
                  }) {
                  id
                closed_days
                  }
              }
                `,
      })
        .then(data => {
          return data;
        })
        .catch(err => {
          return err;
        });
      return galery;
    } catch (error) {
      console.log(error);
    }
  }
}
