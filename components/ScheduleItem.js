import React from 'react';
import { StyleSheet, Text, View, Button, TouchableHighlight, Image } from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
  listItem: {
    display: 'flex',
    minHeight: 30,
    flexDirection: 'row',
    borderColor: '#eee',
    borderWidth: 1,
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  scheduleName: {
    display: 'flex',
    flex: 9,
    fontSize: 20,
  },
  scheduleUpdate: {
    display: 'flex',
    flex: 2,
    padding: 10,
  },
  modal: {
    display: 'flex',
    width: '90%',
    marginTop: 50,
  },
  listItemText: {
    flex: 8,
    padding: 5,
  },
  listItemActions: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  textInputs: { height: 40, borderColor: 'gray', borderWidth: 1 },

});

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }
  close() {
    this.props.update(this.state.data);
  }
  render() {
    return (
      <View style={styles.listItem}>
        <View style={styles.listItemText}>
          <Text style={styles.scheduleName}>{moment(this.props.data.from).format('HH:mm').valueOf()} - {moment(this.props.data.to).format('HH:mm').valueOf()} {this.props.data.name}</Text>
        </View>
        <View style={styles.listItemActions}>
          <TouchableHighlight onPress={() => this.props.edit(this.props.data)}>
            <Image style={styles.scheduleUpdate} source={require('./pencil.png')} />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.remove(this.props.data)}>
            <Image style={styles.scheduleUpdate} source={require('./trash.png')} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
