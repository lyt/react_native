/**
 * **************************************
 * ##
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
  Platform,
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
            </View>
            <View style={styles.mainBottomView}><Text style={styles.mainText}>您已退出小e，我们已关闭您的取送服务并退还保证金到您的银行卡中，若您未收到，可拨打<Text style={{color:"blue"}}>4008187171-6</Text>咨询。若您后悔了，还能重新申请小e哦。</Text></View>
          </View>
        </ScrollView>
        <View style={styles.tixianBtnView}>
          <Button
            containerStyle={styles.tixianBtn}
            style={{fontSize: AppDataConfig.Font_Default_Size+2, color: "white"}}
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
  mainText: {
    fontSize: AppDataConfig.Font_Default_Size + 2,
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
  }
});
