/**
 * **************************************
 * ## 申请小e页面
 * **************************************
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  Actions
} from 'react-native-router-flux';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig';
import Button from '../.././component/Button';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';

export default class Apply extends Component {

  constructor(props) {
    super(props);
    this.state = {
      enable: true,
      message: ''
    };
  }

  // 加载完成
  componentDidMount() {
     this.getApplyResult();
  }

  //获取申请小e结果
  getApplyResult(){
    var me = this;
    HttpUtil.get(NetConstant.Get_Apply_Result,'',function(resultData){
      if(resultData.ret){
        var dataEntry = resultData.data;
        me.setState({
          enable: dataEntry.enable,
          message: dataEntry.message
        });
        if(dataEntry.message.length > 0){
          Alert.alert(
               '',
               dataEntry.message,
               [{
                   text: '确认'
               }]
           );
        }
      }
    },true);
  }

  //点击确定按钮
  onBtnClick(){
    if(this.state.enable){
      Actions.ApplyInfo({
        avatarModel: this.props.avatarModel,
        setAvatar: (avatar)=>{ this.props.setAvatar(avatar) }
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollableTabView
          style={{height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT}}
          initialPage={0}
          renderTabBar={() => <View/>}>
          <View style={styles.item}>
            <Image
              style={{
                backgroundColor:'transparent',
                resizeMode: Image.resizeMode.contain,
                width:AppDataConfig.DEVICE_WIDTH_Dp-30,
                height: AppDataConfig.DEVICE_HEIGHT_Dp /4*3}}
              source={require('../.././images/apply/apply_xiao_e_splash_1.png')} />
          </View>
          <View style={styles.item}>
            <Image
              style={{
                backgroundColor:'transparent',
                resizeMode: Image.resizeMode.contain,
                width:AppDataConfig.DEVICE_WIDTH_Dp-30,
                height: AppDataConfig.DEVICE_HEIGHT_Dp /4*3}}
              source={require('../.././images/apply/apply_xiao_e_splash_2.png')} />
          </View>
          <View style={styles.item}>
            <Image
              style={{
                backgroundColor:'transparent',
                resizeMode: Image.resizeMode.contain,
                width:AppDataConfig.DEVICE_WIDTH_Dp-30,
                height: AppDataConfig.DEVICE_HEIGHT_Dp /4*3}}
              source={require('../.././images/apply/apply_xiao_e_splash_3.png')} />
              <Button
                containerStyle={{
                  width: AppDataConfig.DEVICE_WIDTH_Dp-30,
                  marginTop: 10,
                  paddingTop:5,
                  paddingBottom:5,
                  paddingLeft:35,
                  paddingRight:35,
                  borderRadius:4,
                  backgroundColor: this.state.enable ? AppColorConfig.commonColor:AppColorConfig.commonDisableColor}}
                style={{fontSize: 16, color: "white"}}
                disabled={!this.state.enable}
                onPress={this.onBtnClick.bind(this)}>
                确认申请
              </Button>
          </View>
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: AppDataConfig.HEADER_HEIGHT,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
    backgroundColor: '#fff'
  },
  item:{
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
    width:AppDataConfig.DEVICE_WIDTH_Dp-30,
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT-15,
  }
});
