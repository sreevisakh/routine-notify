import React, { Component } from 'react';
import moment from 'moment';
import t from 'tcomb-form-native';
import uuid from 'uuid/v4';
import { View, Button, AsyncStorage } from 'react-native';

const { Form } = t.form;

const formOptions = {
  fields: {
    id: { hidden: true },
    from: {
      label: 'From',
      mode: 'time',
      config: {
        format: date => moment(date).format('HH:mm').valueOf(),
      },
    },
    to: {
      label: 'To',
      mode: 'time',
      config: {
        format: date => moment(date).format('HH:mm').valueOf(),
      },
    },
  },
};
const ScheduleEntry = t.struct({
  id: t.maybe(t.String),
  from: t.Date,
  to: t.Date,
  name: t.String,
});

export default class AddSchedule extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    if (navigation.getParam('edit')) {
      this.state = {
        editValue: navigation.getParam('data'),
      };
    } else {
      this.state = {
        editValue: new ScheduleEntry({
          id: '', name: '', from: new Date(), to: new Date(),
        }),
      };
    }
  }
  async modify() {
    try {
      const data = this.form.getValue();
      let schedules = await AsyncStorage.getItem('schedules');
      schedules = JSON.parse(schedules) || [];

      if (data.id) {
        const schedule = schedules.find(item => item.id === data.id);
        schedule.from = data.from;
        schedule.to = data.to;
        schedule.name = data.name;
      } else {
        schedules.push({ ...data, id: uuid() });
      }
      AsyncStorage.setItem('schedules', JSON.stringify(schedules));

      this.props.navigation.navigate('Settings');
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    return (
      <View style={{ justifyContent: 'center', marginTop: 20 }}>
        <View style={{ width: '90%', alignSelf: 'center' }}>
          <Form
            ref={(ref) => { this.form = ref; }}
            type={ScheduleEntry}
            value={this.state.editValue}
            options={formOptions}
          />
          <Button title="Update" onPress={() => this.modify()}>Update</Button>
        </View>
      </View>
    );
  }
}

AddSchedule.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('edit') ? 'Edit Schedule' : 'Add Schedule',
});
