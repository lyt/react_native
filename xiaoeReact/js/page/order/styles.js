/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 交接单相关（取件，送件，转运，暂存）的样式封装
 *
 * @providesModule styles
 */
'use strict';

var ReactNative = require('react-native');
var {
  StyleSheet,
  Platform
} = ReactNative;
var AppColorConfig = require('../.././config/AppColorConfig');
var AppDataConfig = require('../.././config/AppDataConfig');

const styles = StyleSheet.create({
  rootContain: {
    height: AppDataConfig.DEVICE_HEIGHT_Dp,
  },
  contain: {
    height: AppDataConfig.DEVICE_HEIGHT_Dp - AppDataConfig.HEADER_HEIGHT,
  },
  emptyView:{
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    position:'absolute',
    left:0,
    top: AppDataConfig.DEVICE_HEIGHT_Dp/3,
  },
  //订单列表Item最外层样式
  listStyle: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10
  },
  textTitle: {
    color: '#989ba2',
    fontSize: 14,
    marginRight: 10,
    backgroundColor: 'transparent'
  },
  textCommonContent: {
    color: '#343941',
    fontSize: 14,
    backgroundColor: 'transparent'
  },
  bottomInfo: {
    borderRightWidth: 1,
    borderRightColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  orderTags: {
    padding: 1,
    textAlign: 'center',
    fontSize: 12,
    borderWidth: 0.5,
    borderRadius: 2,
    marginLeft: 5
  },
  textInfo: {
    color: '#666',
    fontSize: 12,
    marginRight: 4,
    backgroundColor: 'transparent'
  },
  textBtn: {
    fontSize: 14,
    color: AppColorConfig.orderBlueColor,
    paddingTop: 12,
    paddingBottom: 12,
    flex: 1,
    textAlign: 'center'
  },
  tags: {
    padding: 1,
    textAlign: 'center',
    fontSize: 12,
    color: AppColorConfig.orderRedColor,
    borderWidth: 1,
    borderColor: AppColorConfig.orderRedColor,
    borderRadius: 2,
    marginLeft: 5
  },
})

export default styles;
