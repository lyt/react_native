/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 拨打电话工具类
 * 主要用于交接单各种电话的拨打
 *
 * @providesModule phone
 */
'use strict';

import {
  Linking,
  Platform,
  Clipboard,
  Alert
} from 'react-native';
import Util from '../../utils/Util';
import Toast from '../.././component/Toast';

export default function call(tel) {
    if (Util.checkPhone(tel)) {
      if(Platform.OS === 'ios'){
        Linking.canOpenURL('tel:' + tel).then(supported => {
          if (supported) {
            Linking.openURL('tel:' + tel);
          } else {
            Clipboard.setString(tel);
            Toast.show('拨打失败,号码已经复制到粘贴板', {
              position: Toast.positions.BOTTOM,
            });
          }
        });
      }else{
        Alert.alert(
          '',
          '是否确认拨打电话' + tel + '?', [{
            text: '取消',
            onPress: () => console.log('取消 Pressed!')
          }, {
            text: '确认',
            onPress: () => {
              Linking.canOpenURL('tel:' + tel).then(supported => {
                if (supported) {
                  Linking.openURL('tel:' + tel);
                } else {
                  Clipboard.setString(tel);
                  Toast.show('拨打失败,号码已经复制到粘贴板', {
                    position: Toast.positions.BOTTOM,
                  });
                }
              });
            }
          }],
          { cancelable: false }
        )
      }
    } else {
      Toast.show('请核对电话是否正确')
    }
}
