/**
 * **************************************
 * ## 提现成功页面
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
  ListView,
  TouchableOpacity,
  Platform
} from 'react-native';
import Button from '../.././component/Button';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';


export default class ApplySuccessPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  ok() {
    alert('OK...')
  }

  render() {
    return (
      <View style={{marginTop:AppDataConfig.HEADER_HEIGHT ,height: AppDataConfig.DEVICE_HEIGHT_Dp-AppDataConfig.HEADER_HEIGHT}}>
        <ScrollView>
          <View style={styles.main}>
            <View style={styles.mainTopView}>
              <Image source={require('../.././images/tixian/img_succeed.png')} style={{borderRadius:80,overflow:'hidden',width: AppDataConfig.DEVICE_WIDTH_Dp/2,height:AppDataConfig.DEVICE_HEIGHT_Dp/4}}/>
              <Text style={[styles.mainText,{color:'#1aa4f2'}]}>提现申请提交成功！</Text>
            </View>
            <View style={styles.mainBottomView}><Text style={styles.mainText}>{this.props.message}</Text></View>
          </View>
        </ScrollView>
        <View style={styles.tixianBtnView}>
          <Button
            containerStyle={styles.tixianBtn}
            style={{fontSize: 16, color: "white"}}
            onPress={Actions.pop}>
            好的
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
  mainText: {
    fontSize: 16,
    color: 'rgba(62,62,62,.8)',
  },
  mainBottomView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingLeft: 20,
    // paddingRight: 20,
    borderColor: 'blue',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 40,
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
  }
});
