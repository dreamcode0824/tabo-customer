import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Back from '../../assets/images/back.png';
import { CalendarsList } from './calendarsList'

class BookCalendarClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disabledNext: true,
      start: {},
      end: {},
      period: {},
      showCalendar: false
    };
  }

  handleChange = (start, end, period) => {
    this.setState({
      start: start,
      end: end,
      period: period,
      disabledNext: false
    });
  };

  render() {
    return (
      <Modal
        onShow={() => {
          setTimeout(() => {
            this.setState({
              showCalendar: true
            })
          }, 300);
        }}
        onModalHide={() => {
          this.setState({
            showCalendar: false
          })

        }}
        style={{ margin: 0 }}
        isVisible={this.props.isVisible}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButtonContainer}
              activeOpacity={0.8}
              onPress={() => this.props.close(this.state.start, this.state.end)}>
              <Image
                style={styles.backIcon}
                source={Back} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Pick a day or a range
            </Text>
            <View style={{ width: 38 }} />
          </View>
          <View style={styles.caledarContainer}>
            {this.state.showCalendar ?
              (<CalendarsList
                start={this.props.start}
                end={this.props.end}
                businessType={this.props.businessType}
                handleChange={this.handleChange} />)
              : null}
          </View>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={this.state.disabledNext ? [styles.nextButton, { opacity: 0.3 }] : styles.nextButton}
              disabled={this.state.disabledNext}
              activeOpacity={0.8}
              onPress={() => {
                this.props.next(this.state.start, this.state.end)
              }}
            >
              <Text style={styles.nextButtonText}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export const BookCalendar = connect()(BookCalendarClass);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    marginLeft: 10,
    height: 28,
    width: 28,
    justifyContent: "center",
    alignItems: "center"
  },
  backIcon: {
    resizeMode: 'contain',
    height: 16,
    width: 16
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  headerTitle: {
    color: 'black',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 20,
    lineHeight: 22
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 16,
    height: 90
  },
  skipText: {
    color: 'black',
    fontSize: 16,
    lineHeight: 26,
    paddingHorizontal: 10,
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
  },
  nextButton: {
    backgroundColor: '#6844F9',
    height: 40,
    width: 96,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  nextButtonText: {
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
    fontSize: 16,
    lineHeight: 18
  },
  caledarContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  }
});







// import React, {Component} from 'react';
// import {
//     StyleSheet,
//     View,
//     Image,
//     TouchableOpacity,
//     Text,
//     Platform
// } from 'react-native';
// import {connect} from 'react-redux';
// import Modal from 'react-native-modal';
// import Back from '../../assets/images/back.png';
// import { Calendar } from 'react-native-calendario';
// import moment from 'moment';
// import { ContentLoading } from '../loading/loading'

// class BookCalendarClass extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             disabledNext: true,
//             start: {},
//             end: {},
//             showCalendar: false
//         };
//         this.state.start = this.props.start
//         this.state.end = this.props.end
//     }

//     render() {

//         let date = new Date()
//         let maxDate = new Date(date.setMonth(date.getMonth()+6))

//         return (
//             <Modal
//             onShow={()=>{
//                setTimeout(() => {
//                 this.setState({
//                     showCalendar: true
//                 })
//                }, 300);
//             }}
//             onModalHide={()=>{
//                 this.setState({
//                     start: this.props.start,
//                     end: this.props.end,
//                     showCalendar: false
//                 })
//             }}
//                 style={{margin: 0}}
//                 isVisible={this.props.isVisible}>
//                 <View style={styles.content}>
//                     <View style={styles.headerRow}>
//                         <TouchableOpacity
//                             style={styles.backButtonContainer}
//                             activeOpacity={0.8}
//                             onPress={() => this.props.close(this.state.start, this.state.end)}>
//                             <Image
//                                 style={styles.backIcon}
//                                 source={Back}/>
//                         </TouchableOpacity>
//                         <Text style={styles.headerTitle}>
//                             When will you be there?
//                         </Text>
//                         <View style={{width: 38}}/>
//                     </View>
//                     <View style={styles.caledarContainer}>
//                     <ContentLoading
//                     style={{height: 50, top: 200}}
//                     loading={!this.state.showCalendar}/>
//                     {this.state.showCalendar ? <Calendar
//                     disableOffsetDays

//                             onChange={(range) => {
//                                 console.log(range)
//                                 let data = {
//                                     disabledNext: false,
//                                     start:{
//                                         date: range.startDate,
//                                         dateString: moment(range.startDate).format('YYYY-MM-DD')
//                                     }
//                                 }
//                                 if(range.endDate){
//                                     data.end = {
//                                         date: range.endDate,
//                                         dateString: moment(range.endDate).format('YYYY-MM-DD')
//                                     }
//                                 }
//                                 else{
//                                     data.end ={}
//                                 }
//                                 this.setState(data)
//                             }}
//                             minDate={new Date()}
//                             maxDate={maxDate}
//                             startDate={this.state.start.date}
//                             endDate={this.state.end.date}
//                             // startingMonth={
//                             //     this.state.start.date ?
//                             //      moment(this.state.start.date).format('YYYY-MM-DD') :
//                             //      moment(new Date()).format('YYYY-MM-DD')
//                             //     }
//                             theme={{
//                                 activeDayColor: {},
//                                 monthTitleTextStyle: {
//                                     color: '#6d95da',
//                                     fontWeight: '300',
//                                     fontSize: 16,
//                                 },
//                                 emptyMonthContainerStyle: {},
//                                 emptyMonthTextStyle: {
//                                     fontWeight: '200',
//                                 },
//                                 weekColumnsContainerStyle: {},
//                                 weekColumnStyle: {
//                                     paddingVertical: 10,
//                                 },
//                                 weekColumnTextStyle: {
//                                     color: '#b6c1cd',
//                                     fontSize: 13,
//                                 },
//                                 nonTouchableDayContainerStyle: {},
//                                 nonTouchableDayTextStyle: {},
//                                 startDateContainerStyle: {},
//                                 endDateContainerStyle: {},
//                                 dayContainerStyle: {},
//                                 dayTextStyle: {
//                                     color: '#2d4150',
//                                     fontWeight: '200',
//                                     fontSize: 15,
//                                 },
//                                 dayOutOfRangeContainerStyle: {},
//                                 dayOutOfRangeTextStyle: {},
//                                 todayContainerStyle: {},
//                                 todayTextStyle: {
//                                     color: '#6d95da',
//                                 },
//                                 activeDayContainerStyle: {
//                                     backgroundColor: '#6d95da',
//                                 },
//                                 activeDayTextStyle: {
//                                     color: 'white',
//                                 },
//                                 nonTouchableLastMonthDayTextStyle: {},
//                             }}
//                         /> : null}
//                     </View>
//                     <View style={styles.buttonsRow}>
//                         <TouchableOpacity
//                             style={this.state.disabledNext ? [styles.nextButton, {opacity: 0.3}] : styles.nextButton}
//                             disabled={this.state.disabledNext}
//                             activeOpacity={0.8}
//                             onPress={() => {
//                                 this.props.next(this.state.start, this.state.end)
//                             }}
//                         >
//                             <Text style={styles.nextButtonText}>
//                                 Next
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         );
//     }
// }

// export const BookCalendar = connect()(BookCalendarClass);

// const styles = StyleSheet.create({
//     content: {
//         flex: 1,
//         backgroundColor: '#fff',

//     },
//     backButtonContainer: {
//         marginLeft: 10,
//         height: 28,
//         width: 28,
//         justifyContent: "center",
//         alignItems: "center"
//     },
//     backIcon: {
//         height: 16,
//         width: 16
//     },
//     headerRow: {
//         flexDirection: "row",
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginTop: 20
//     },
//     headerTitle: {
//         color: 'black',
//         fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
//         fontSize: 20,
//         lineHeight: 22
//     },
//     buttonsRow: {
//         flexDirection: 'row',
//         alignItems: "center",
//         justifyContent: "flex-end",
//         marginHorizontal: 16,
//         height: 90
//     },
//     skipText: {
//         color: 'black',
//         fontSize: 16,
//         lineHeight: 26,
//         paddingHorizontal: 10,
//         fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
//     },
//     nextButton: {
//         backgroundColor: '#6844F9',
//         height: 40,
//         width: 96,
//         borderRadius: 8,
//         justifyContent: "center",
//         alignItems: "center"
//     },
//     nextButtonText: {
//         color: '#fff',
//         fontFamily: Platform.OS==='ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
//         fontSize: 16,
//         lineHeight: 18
//     },
//     caledarContainer: {
//         flex: 1,
//         marginTop: 20,
//         marginHorizontal: 16
//     }
// });
