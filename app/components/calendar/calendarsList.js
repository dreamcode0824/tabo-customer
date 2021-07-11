import React from 'react';
import { CalendarList } from 'react-native-calendars';
import {
  Text,
  View,
  Platform
} from 'react-native';
import { LocaleConfig } from 'react-native-calendars';
import moment from 'moment'

LocaleConfig.locales['en'] = {
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  monthNamesShort: ['', '', '', '', '', '', '', '', '', '', '', ''],
  dayNames: ['', '', '', '', '', '', ''],
  dayNamesShort: ['SU ', 'M ', 'TU ', 'W ', 'TH ', 'F ', 'SA '],
  today: ''
};
LocaleConfig.defaultLocale = 'en';

export class CalendarsList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      start: {},
      end: {},
      period: {},
    }

  }

  componentDidMount() {

    if (this.props.start && this.props.end) {
      this.state.start = this.props.start
      this.state.end = this.props.end
      this.setDay(this.props.start, true)
    }
  }

  isEmpty(obj, type) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    if (type == "restaurant" || type == "club" || type == "terrace") {
      return false;
    } else {
      return true;
    }
  }

  getDateString(timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    let dateString = `${year}-`
    if (month < 10) {
      dateString += `0${month}-`
    } else {
      dateString += `${month}-`
    }
    if (day < 10) {
      dateString += `0${day}`
    } else {
      dateString += day
    }

    return dateString
  }

  getPeriod(startTimestamp, endTimestamp) {
    const period = {}
    let currentTimestamp = startTimestamp
    while (currentTimestamp < endTimestamp) {
      const dateString = this.getDateString(currentTimestamp)
      period[dateString] = {
        color: currentTimestamp === startTimestamp ? '#6844F9' : '#f0ebfe',
        startingDay: currentTimestamp === startTimestamp,
        textColor: currentTimestamp === startTimestamp ? '#fff' : '#2C3135'
      }
      currentTimestamp += 24 * 60 * 60 * 1000
    }
    const dateString = this.getDateString(endTimestamp)
    period[dateString] = {
      color: '#6844F9',
      endingDay: true,
      textColor: '#fff'
    }
    return period
  }

  setDay(dayObj, validDate) {
    if (Object.keys(this.state.period).length == 1 && Object.keys(this.state.period)[0] == dayObj.dateString) {
      return
    }
    const { start, end } = this.state
    const {
      dateString, day, month, year,
    } = dayObj

    // timestamp returned by dayObj is in 12:00AM UTC 0, want local 12:00AM
    const timestamp = new Date(year, month - 1, day).getTime()
    const newDayObj = { ...dayObj, timestamp }
    // if there is no start day, add start. or if there is already a end and start date, restart
    const startIsEmpty = this.isEmpty(start, this.props.businessType)
    if (startIsEmpty || !startIsEmpty && !this.isEmpty(end, this.props.businessType)) {
      const period = {
        [dateString]: {
          color: '#6844F9',
          endingDay: true,
          startingDay: true,
          textColor: '#fff',
        },
      }
      this.setState({ start: newDayObj, period, end: {} },
        () => {
          if (validDate) {
            this.setDay(this.props.end)
          }
        })
      this.props.handleChange(newDayObj, {}, period)
    } else {
      // if end date is older than start date switch
      const { timestamp: savedTimestamp } = start
      if (savedTimestamp > timestamp) {
        const period = this.getPeriod(timestamp, savedTimestamp)
        this.setState({ start: newDayObj, end: start, period },
          () => {
            if (validDate) {
              this.setDay(this.props.end)
            }
          })
        this.props.handleChange(newDayObj, start, period)
      } else {
        const period = this.getPeriod(savedTimestamp, timestamp)
        this.setState({ end: newDayObj, start, period },
          () => {
            if (validDate) {
              this.setDay(this.props.end)
            }
          })
        this.props.handleChange(start, newDayObj, period)
      }
    }
  }


  render() {
    const { period } = this.state
    return (
      <CalendarList
        // testID={testIDs.calendarList.CONTAINER}
        onDayPress={this.setDay.bind(this)}
        markingType='period'
        markedDates={period}
        current={this.props.start ? this.props.start.dateString : moment(new Date()).format('YYYY-MM-DD')}
        minDate={moment(new Date()).format('YYYY-MM-DD')}
        pastScrollRange={0}
        futureScrollRange={6}
        renderHeader={(date) => {
          const header = date.toString('MMMM yyyy');
          const [month, year] = header.split(' ');
          const textStyle = {
            fontSize: 16,
            lineHeight: 18,
            paddingTop: 10,
            color: '#2C3135',
            fontFamily: Platform.OS === 'ios' ? 'CircularStd-Bold' : 'Circular-Std-Bold',
          };

          return (
            <View style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginBottom: 20
            }}>
              <Text style={{ marginLeft: 5, ...textStyle }}>{`${month} ${year}`}</Text>
            </View>
          );
        }}
        theme={{
          'stylesheet.calendar.header': {
            dayHeader: {
              fontFamily: Platform.OS === 'ios' ? 'CircularStd-Light' : 'Circular-Std-Light',
              fontSize: 12,
              lineHeight: 14,
              color: '#7F8FA4'
            }
          },
          // 'stylesheet.day.basic': {
          //     today: {
          //         borderColor: '#6844F9',
          //         borderWidth: 2,
          //         borderRadius: 16,
          //         justifyContent: "center"
          //     },
          //     todayText: {
          //         color: '#6844F9',
          //     },
          // },
          'stylesheet.day.period': {
            base: {
              overflow: 'hidden',
              height: 34,
              alignItems: 'center',
              width: 34,
            },
            today: {
              borderColor: '#6844F9',
              borderWidth: 1,
              borderRadius: 16,
              justifyContent: "center"
            },
            todayText: {
              color: '#6844F9',
            },
            text: {
              //marginTop: Platform.OS === 'android' ? 4 : 6,
              paddingTop: 8,
              fontSize: 16,
              lineHeight: 18,
              fontFamily: Platform.OS === 'ios' ? 'CircularStd-Book' : 'Circular-Std-Book',
              color: 'black',
            },
          }
        }}
      />);
  }

};
