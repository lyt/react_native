/**
 * Copyright (c) 2017-present, edaixi, Inc.
 * All rights reserved.
 *
 * 自定义导航栏，包含右标题
 *
 * @providesModule NavigatorHeader
 */
'use strict';
import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Platform
} from 'react-native';
import AppDataConfig from '../config/AppDataConfig';
import AppColorConfig from '../config/AppColorConfig';
const { array, string, object, bool, func, any } = PropTypes;

export default class NavigatorHeader extends Component {

  static propTypes = {
    title: string,
    rightTitle: string,
    style: View.propTypes.style,
    onLeftPress: func,
    onRightPress: func,
  };

  render() {
    const {
      title,
      rightTitle,
      onLeftPress,
      onRightPress,
      style,
    } = this.props;

    return (
      <View style={styles.headerConcent}>
        <TouchableOpacity style={styles.tabConcent} onPress={onLeftPress}>
          <Image
            source={require('.././images/title_back_image.png')}
            style={{width: 13,height: 21,marginLeft: 8,}}/>
        </TouchableOpacity>
        <Text style={styles.titleText}>{title}</Text>
        <TouchableOpacity
          style={styles.tabConcent}
          onPress={onRightPress}
        >
          <Text style={styles.rightText}>{rightTitle}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerConcent: {
    paddingTop: Platform.OS === 'ios' ? 15 : 0,
    height: AppDataConfig.HEADER_HEIGHT,
    backgroundColor: AppColorConfig.titleBarColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabConcent: {
    height: AppDataConfig.HEADER_HEIGHT,
    width: AppDataConfig.HEADER_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titleText: {
    color: 'white',
    fontSize: 18
  },
  rightText: {
    alignItems: 'center',
    color: '#fff',
    lineHeight: 23,
    textAlign: 'center',
    fontSize: 16,
  },
});
