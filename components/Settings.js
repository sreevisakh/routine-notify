import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Modal, AsyncStorage } from 'react-native';
import Immersive from 'react-native-immersive';
import ScheduleItem from './ScheduleItem';
import { deserialize} from './utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topBar: {
    flexDirection: 'row',
    backgroundColor: '#37474F',
    flexGrow: 2,
    maxHeight: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  heading: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 25,
  },
  addButton: {
    flex: 1,
    alignSelf: 'center',
    height: '30',
  },
  list: {
    flexGrow: 8,
  },
});

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedules: [],

    };
  }
  componentDidMount() {
    Immersive.on();
    this.sub = this.props.navigation.addListener(
      'didFocus',
      this.loadData.bind(this),
    );
    this.loadData()
  }
  componentWillUnmount() {
    this.sub.remove();
  }
  async loadData() {
    let schedules = await AsyncStorage.getItem('schedules')
    this.setState({ schedules: schedules ? deserialize(schedules) : [] });
  }
  edit(data) {
    this.props.navigation.navigate('AddSchedule', { edit: true, data });
  }
  remove(data) {
    let updatedSchedules = this.state.schedules.filter(item => item.id !== data.id);
    AsyncStorage.setItem('schedules', JSON.stringify(updatedSchedules));
    this.setState({
      schedules: updatedSchedules
    });
    
  }
  render() {
    return (
      <View style={styles.container} >
        <ScrollView style={styles.list}>
          {
            this.state.schedules.map(schedule =>
              (<ScheduleItem
                key={schedule.id}
                data={schedule}
                edit={data => this.edit(data)}
                remove={data => this.remove(data)}
              />))
          }
        </ScrollView>
      </View >
    );
  }
}
Settings.navigationOptions = ({ navigation }) => ({
  title: 'Schedules',
  headerRight: (
    <Button
      onPress={() => navigation.navigate('AddSchedule')}
      title="Add Schedule"
      color="#000"
    />
  ),
});

