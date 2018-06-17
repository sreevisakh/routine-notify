import React from 'react';
import { StyleSheet, Text, View, Button, AppState, AsyncStorage, Image, TouchableHighlight } from 'react-native';
import moment from 'moment';
import Immersive from 'react-native-immersive';
import { deserialize } from './utils';

let styles;
export default class Home extends React.Component {
  static toFullDate(time) {
    return `${moment().format('YYYY-MM-DD').valueOf()}T${time}:00`;
  }
  constructor() {
    super();
    this.state = {
      currentSection: {
        remaining: 0,
        name: 'Set the Schedules',
      },
      isImmersive: false,
    };
  }
  componentDidMount() {
    this.sub = this.props.navigation.addListener(
      'didFocus',
      this.loadData.bind(this),
    );
    this.loadData();
    AppState.addEventListener('change', this.onAppStateChange.bind(this));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange.bind(this));
  }

  onAppStateChange(nextAppState) {
    if (nextAppState === 'active' && this.state.isImmersive) {
      this.setImmersiveOn();
    }
  }
  getCurrentSection() {
    setInterval(() => {
      let currentSection;
      if (!this.state.schedules.length) {
        currentSection = { name: 'Set the schedules', remaining: 0, time: moment().format('HH:mm A').valueOf() };
      } else {
        const currentTime = moment();
        [currentSection] = this.state.schedules.filter((section) => {
          const sectionStartTime = moment(section.from);
          const sectionEndTime = moment(section.to);
          if (currentTime.diff(sectionStartTime) >= 0 && currentTime.diff(sectionEndTime) < 0) {
            section.remaining = sectionEndTime.from(currentTime);
            return section;
          }
        });
        if (!currentSection) {
          return { name: 'No Active schedules' };
        }
      }
      this.setState({ currentSection, time: moment().format('HH:mm A').valueOf() });
    }, 2000);
  }

  setImmersiveOn() {
    Immersive.on();
    this.setState({ isImmersive: true });
  }
  setImmersiveOff() {
    Immersive.off();
    this.setState({ isImmersive: false });
  }

  async loadData() {
    const schedules = await AsyncStorage.getItem('schedules');
    this.setState({ schedules: schedules ? deserialize(schedules) : [] });
    this.getCurrentSection();
  }

  showSettings() {
    const { navigate } = this.props.navigation;
    navigate('Settings');
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>{this.state.currentSection.name}</Text>
          {
            this.state.currentSection.remaining !== 0 &&
            <Text style={styles.subText}>ends {this.state.currentSection.remaining}</Text>
          }
          <Text style={styles.subText}>{this.state.time}</Text>
        </View>
        <View style={styles.topBar}>
          <TouchableHighlight onPress={() => { this.showSettings(); }}>
            <Image style={styles.settingsIcon} source={require('./settings.png')} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    flexGrow: 3,
    maxHeight: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 30,
  },
  content: {
    flexGrow: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    borderWidth: 1,
    height: 40,
    width: 40,
  },
  text: {
    fontSize: 26,
    color: '#fff',
  },
  button: {
    marginTop: '20px',
    backgroundColor: 'blue',
    color: '#fff',
  },
  subText: {
    fontSize: 20,
    color: '#eee',
  },
});
