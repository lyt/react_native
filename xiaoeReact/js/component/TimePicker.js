/**
 * 设置服务时间的顶部日期组件
 */
'use strict';
import React, {Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Picker,
  Animated
} from 'react-native';

const windowH = Dimensions.get('window').height;
const windowW = Dimensions.get('window').width;

export default class TimePicker extends Component {


  constructor(props) {
    super(props)
    this.state = {
        selectedDate:this.props.timeConfig.date[0],
        selectedHour:this.props.timeConfig.hour[0],
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        selectedDate:nextProps.timeConfig.date[0],
        selectedHour:nextProps.timeConfig.hour[0],
    })
  }


  cancel() {
    console.log('取消')
    this.props.callback(null)
  }

  submit() {
    console.log('完成')
    this.props.callback(this.state.selectedDate + ' ' + this.state.selectedHour)
  }


  render() {
    const hours = this.props.timeConfig.hour.map((hour,ii)=>{
          return(
            <Picker.Item key={ii} data={hour} label={hour} value={hour}/>
          )
        })

    const dates = this.props.timeConfig.date.map((date,ii)=>{
          return(
            <Picker.Item key={ii} data={date} label={date} value={date}/>
          )
        })

    return (

        <View  style={styles.picker}>
          {!this.props.show?
                <View>
                    <View style={{backgroundColor: '#eee',height: 30,flexDirection:'row',justifyContent: 'space-between',alignItems: 'center'}}>
                      <TouchableOpacity onPress={()=>{ this.cancel() }} activeOpacity={0.7}>
                        <Text style={{marginLeft: 10}}>
                          取消
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>{ this.submit() }} activeOpacity={0.7}>
                        <Text style={{marginRight: 10,color: '#00a4ee'}}>
                          完成
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <Picker
                        style={{width:windowW/2.0}}
                        selectedValue={this.state.selectedDate}
                        // mode = {'dropdown'}
                        onValueChange={(value) => this.setState({selectedDate: value})}>
                        {dates}
                      </Picker>
                      <Picker
                        style={{width:windowW/2.0}}
                        selectedValue={this.state.selectedHour}
                        // mode = {'dropdown'}
                        onValueChange={(value) => this.setState({selectedHour: value})}>
                        {hours}
                      </Picker>
                    </View>
                </View>
                :
                <View/>
              }

        </View>
      );
  }
}

const styles = StyleSheet.create({
    picker: {
      backgroundColor: '#fff',
      position: 'absolute',
      height: 240,
      zIndex: 4,
      bottom:0,
      right: 0,
      borderTopWidth: 1,
      borderTopColor: '#ccc',

    }
});
