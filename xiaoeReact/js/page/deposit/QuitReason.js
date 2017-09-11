/**
 * **************************************
 * ## 退出原因页面
 * **************************************
 */
'use strict';
import React, {
  Component
} from 'react';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import {
  View,
  Text,
  Image,
  PixelRatio,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import Button from '../.././component/Button';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';

export default class QuitReason extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowFailMsg: this.props.userDepositState.hasOwnProperty('fail_message')
                     && typeof this.props.userDepositState.fail_message !== 'undefined' 
    };
  }

  onBtnClick(){
    Alert.alert(
      '',
      '确定要退出小e吗?退出后,我们将停止为您派单.',
      [
        {text: '取消', onPress: () => {}},
        {text: '确认', onPress: () => {
          Actions.QuitDetailReason({
            type: ActionConst.REPLACE,
          });
        }},
      ],
      { cancelable: false }
    )
  }

  render() {
    const texts = this.props.userDepositState.texts.map((item,index) => {
      return (
        <Text
          key={index}
          style={{marginTop: 5,fontSize: AppDataConfig.Font_Default_Size+2}}>
          {item}
        </Text>
      )
    })
    return (
      <View style={{marginTop:AppDataConfig.HEADER_HEIGHT ,height: AppDataConfig.DEVICE_HEIGHT_Dp-AppDataConfig.HEADER_HEIGHT}}>
        <ScrollView>
          <View style={styles.main}>
            { this.state.isShowFailMsg &&
              <View style={styles.tipView}>
                <Text style={[styles.tipText,{color:'#FF5823',paddingLeft: 10}]}>{this.props.userDepositState.fail_message}</Text>
                <TouchableOpacity   onPress={() => {this.setState({isShowFailMsg: false})}}>
                  <Image
                    source={require('../.././images/more/more_close.png')}
                    style={{height: 25,width: 25,marginRight: 10}}/>
                </TouchableOpacity>
              </View>
            }
            <View style={styles.mainTopView}>
              <Image source={require('../.././images/more/paydeposit_agree_img.png')} style={{borderRadius:80,overflow:'hidden',width: AppDataConfig.DEVICE_WIDTH_Dp/2,height:AppDataConfig.DEVICE_HEIGHT_Dp/4}}/>
              <Text
                style={{fontSize: AppDataConfig.Font_Default_Size+2,color:'#1aa4f2',marginBottom: 15}}>
                我的保证金 {this.props.userDepositState.money} 元
              </Text>
              {texts}
            </View>
          </View>
        </ScrollView>
        <View style={styles.tixianBtnView}>
          <Button
            containerStyle={styles.tixianBtn}
            style={{fontSize: AppDataConfig.Font_Default_Size+2, color: "white"}}
            onPress={this.onBtnClick.bind(this)}>
            申请关闭小e账号及退还保证金
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    paddingTop: (Platform.OS !== 'ios' ? 0 : 15),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTopView: {
    margin: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tixianBtnView: {
    borderTopWidth: 1,
    borderTopColor: '#d2d2d2',
    position: 'absolute',
    height: 65,
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tixianInnerView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 30,
    height: 45,
    borderWidth: 1,
    borderColor: '#00dbf5',
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00dbf5'
  },
  tixianBtn: {
    width: AppDataConfig.DEVICE_WIDTH_Dp - 40,
    margin: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 4,
    backgroundColor: AppColorConfig.commonColor
  },
  tipView: {
    padding: 10,
    backgroundColor: '#FAF9F3',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tipText: {
    color: '#383838',
    fontSize: AppDataConfig.Font_Default_Size + 2,
    textAlign: 'left',
  },
});
