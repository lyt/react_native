import React, {Component} from 'react';
import { Actions,ActionConst } from 'react-native-router-flux';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView
}from 'react-native'
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import Toast from '../.././component/Toast';
import Util from '../.././utils/Util';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

export default class Mark extends Component {

  constructor(props){
    super(props);
    this.state = {
      mark: '',
      canSubmit: false
    }
  }

  checkSubmitStatus(){
    if (this.state.mark !== '') {
      this.setState({
        canSubmit: true
      })
    }else {
      this.setState({
        canSubmit: false
      })
    }
  }

  submitText(){
    // var originRemark = this.props.transtask.order_info.remark?this.props.transtask.order_info.remark:''
    // this.props.callback(originRemark + this.state.mark)
    // Actions.pop();
    this.requestAddRemark()
  }

  requestAddRemark() {

    var mark = Util.filteremoji(this.state.mark)
    var params = {remark:mark, order_id:this.props.transtask.order_id, trans_task_id:this.props.transtask.id};
    HttpUtil.post(NetConstant.Add_Order_Remark,params, (result)=>{
        if (result.ret) {
            Toast.show('添加备注成功')
            // this.props.callback()
            RCTDeviceEventEmitter.emit('ORDER_REFRESH', 0)
            Actions.pop();
        } else {
            Toast.show(result.error)
        }
    }, true)
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView >
          <View style={{backgroundColor: '#fff',height: 100,margin: 8,borderWidth: 1,borderColor: '#ddd',padding: 6}}>
            <TextInput
              underlineColorAndroid='transparent'
              style={styles.textStyle}
              multiline={true}
              value={this.state.mark}
              onChangeText={(mark)=>{
                var that = this
                this.setState({mark},()=>{
                  that.checkSubmitStatus()
                })
              }}
            />
          </View>
        </ScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={[styles.button, this.state.canSubmit? {}:{backgroundColor: AppColorConfig.commonDisableColor}]} activeOpacity={0.7} disabled={this.state.canSubmit? false : true}
            onPress={this.submitText.bind(this)}>
            <Text style={{color: '#fff'}}>
              确定
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
  },
  textStyle: {
    flex: 1
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColorConfig.orderBlueColor,
    margin: 10,
    height: 40,
    borderRadius: 4,
  },
  buttonView: {
    // height: 40,
    position: 'absolute',
    bottom: 0,
    left:0,
    right:0,
    backgroundColor: '#fff'
  }
})
