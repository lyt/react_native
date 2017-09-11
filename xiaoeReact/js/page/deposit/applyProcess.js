/**
 * **************************************
 * ## 申请审核中页面
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
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Clipboard,
} from 'react-native';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import HttpUtil from '../.././net/HttpUtil';


export default class ApplySuccessPage extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{marginTop:AppDataConfig.HEADER_HEIGHT ,height: AppDataConfig.DEVICE_HEIGHT_Dp-AppDataConfig.HEADER_HEIGHT}}>
        <ScrollView>
          <View style={styles.main}>
            <View style={styles.mainTopView}>
              <Image source={require('../.././images/more/more_wait.png')} style={{borderRadius:80,overflow:'hidden',width: AppDataConfig.DEVICE_WIDTH_Dp/2,height:AppDataConfig.DEVICE_HEIGHT_Dp/4}}/>
              <Text style={{fontSize: AppDataConfig.Font_Default_Size+2,color:'#1aa4f2'}}>申请提交审核成功</Text>
            </View>
            <View style={styles.mainBottomView}>
              <Text style={styles.mainText}>您的申请已经提交审核，请等待工作人员联系，若有疑问，可拨打
                <Text
                  onPress={() => {
                  Linking.canOpenURL('tel:4008187171-6').then(supported => {
                      if (supported) {
                        Linking.openURL('tel:4008187171-6');
                      } else {
                      Clipboard.setString('4008187171-6');
                      Toast.show('号码已经复制', {
                          position: Toast.positions.BOTTOM,
                        });
                     }
                    });
                  }}
                  style={{color:"blue"}}>4008187171-6</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
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
    fontSize: AppDataConfig.Font_Default_Size + 2,
    color: 'rgba(62,62,62,.8)',
  },
  mainBottomView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'blue',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 40,
  }
});
