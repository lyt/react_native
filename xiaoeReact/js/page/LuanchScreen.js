import React, {
  Component
} from 'react';
import {
  Image,
  Animated,
  easeOut,
  Dimensions,
  View,
  Text,
  Platform,
  NetInfo,
} from 'react-native';
import {
  Actions,
  ActionConst
} from "react-native-router-flux";
import EKVData from '.././storage/base/KeyValueData';
import AppDataConfig from '.././config/AppDataConfig';
import {selectLaunchImage} from '../utils/Util'
import DeviceInfoUtil from '.././native_modules/DeviceInfoUtil'
import MapUtil from '.././native_modules/MapUtil';
import ConfigUtil from '.././native_modules/ConfigUtil'
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;

export default class LuanchScreen extends React.Component {

  constructor(props: any) {    
    super(props);    
    this.state = {      
      fadeInOpacity: new Animated.Value(0),
    };  
  }
      
  componentDidMount() {
    Animated.timing(this.state.fadeInOpacity, {
      toValue: 1, // 目标值
      duration: Platform.OS === 'android' ? 2000 : 1, // 动画时间
      easing: easeOut // 缓动函数
    }).start(() => {
      EKVData.getData(AppDataConfig.USER_TOKEN).then((result) => {
        AppDataConfig.GET_USER_TOKEN = result;
      }, (nullList) => {});
      EKVData.getData(AppDataConfig.UID).then((result) => {
        AppDataConfig.GET_USER_ID = result;
      }, (nullList) => {});
      EKVData.getData(AppDataConfig.IS_LOGIN).then((result) => {
        if (result) {
          Actions.Home({
            showContract: true,
            type: ActionConst.RESET
          });
          EKVData.getData(AppDataConfig.UNIQUE_NUMBER).then((result) => {
            ConfigUtil.saveData(AppDataConfig.UNIQUE_NUMBER,result)
          }, (nullList) => {});
        } else {
          Actions.Login({
            type: ActionConst.RESET
          });
        }
      }, (nullList) => {
        Actions.Login({
          type: ActionConst.RESET
        });
      });
  });  // 开始执行动画
  try{
    DeviceInfoUtil.getNetStatus((netStatus) => {
        AppDataConfig.NET_INFO_CONNECTED = netStatus;
    })
    //获取经纬度
    MapUtil.getGeographic((localData) => {
      var loacalObject;
      if (typeof localData === 'string') {
        loacalObject = JSON.parse(localData)
      } else {
        loacalObject = localData
      }
      if(loacalObject.hasOwnProperty('latitude')){
        AppDataConfig.LONGITUDE_DATA = loacalObject.longitude+""
        AppDataConfig.LATITUDE_DATA = loacalObject.latitude+""
        EKVData.setData(AppDataConfig.LONGI_LATITUDE, localData);
      }
    })
  }catch(error){
  }
}

  render() {
    if (Platform.OS == 'android') {
      return (
          <Image
            style={{flex: 1,width:deviceWidthDp, height:deviceHeightDp}}
            source={require('.././images/startup/launcher_bg.png')}
            >
              <Animated.View
                style={{paddingTop: 100, alignItems:'center',opacity: this.state.fadeInOpacity,  width:deviceWidthDp, height:deviceHeightDp }}
              >
                <Image
                  style={{width:80,height:80,resizeMode: Image.resizeMode.cover}}
                  source={require('.././images/startup/launcher_icon.png')}
                />
                <Text
                  style={{color:'#fff',fontSize:16,margin:10,backgroundColor:'transparent'}}>
                  小e助手
                </Text>
                <Image
                  style={{width:130,height:20,resizeMode: Image.resizeMode.cover,marginLeft:10}}
                  source={require('.././images/startup/launcher_slogan.png')}
                />
              </Animated.View>
          </Image>
      );
    } else {
      return (
        <Image
          style={{flex: 1,width:deviceWidthDp, height:deviceHeightDp}}
          source={selectLaunchImage()}
        />
      )
    }
  }
}
