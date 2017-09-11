/**
 * **************************************
 * ## 地图工具类，实现导航功能
 *
 * 使用示例:
 * ```
 *  MapUtil.sendMapIntent('天安门');
 *
 * ```
 * **************************************
 */
'use strict';
import {
	NativeModules
} from 'react-native';

module.exports = NativeModules.MapUtilModule;
