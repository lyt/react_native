/**
 * **************************************
 * ## 原生扫描模块,只适用于Android
 *
 * 使用示例:
 * ```
 * var params = {
 *    	autoInput:'',
 *    	continueScan:''
 *    	...
 *  }
 *  ScannerUtil.scanner(params,() => {});
 * ```
 * **************************************
 */
'use strict';
import {
	NativeModules
} from 'react-native';

module.exports = NativeModules.ScannerModule;
