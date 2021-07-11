import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';


export class CalendarModal extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.visible}
        >
          <View style={styles.cont}>
            <Calendar
              style={{ width: 300 }}
              onDayPress={(day) => {
                this.props.action(day.dateString)
              }}
            />
          </View>

        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: 'rgba(236, 236, 236, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },

});

