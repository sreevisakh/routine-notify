import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';


import Home from './components/Home';
import Settings from './components/Settings';
import AddSchedule from './components/AddSchedule';

console.disableYellowBox = true;

const App = StackNavigator({
  Home: {
    screen: Home,
  },
  Settings: {
    screen: Settings,
  },
  AddSchedule: {
    screen: AddSchedule,
  },
}, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#000',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

AppRegistry.registerComponent('Routine', () => App);
