/**
 * **************************************
 * ## APP更新工具类
 *    此工具类适用于Android
 *    iOS走Safari更新，不走此更新逻辑
 *
 * 使用示例:
 * ```
 *  UpdateUtil.update(url);
 *
 * ```
 * **************************************
 */
'use strict';
import {
	NativeModules
} from 'react-native';

module.exports = NativeModules.UpdateUtilModule;
