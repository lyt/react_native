/**
 * **************************************
 * ## 配置文件工具类
 *    JS 和 Native 之间进行键值对的传递
 *    包含从JS里面读取原生值和
 *    从原生读取JS里面的值
 *    iOS操作推送
 * **************************************
 */
'use strict';
import {
	NativeModules
} from 'react-native';

module.exports = NativeModules.ConfigModule;
