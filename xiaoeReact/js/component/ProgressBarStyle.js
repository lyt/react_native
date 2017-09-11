'use strict';

var React = require('react-native');
var {
  StyleSheet,
} = React;

var Style = StyleSheet.create({
  flexBox: {
    flex: 1,
    flexDirection: 'row',
  },
  progressBar: {
    overflow: 'hidden',
    height: 18,
    borderWidth: 2,
    borderColor: '#f4f8ff', //进度条默认颜色
    borderRadius: 20,
    marginBottom: 5,
    backgroundColor: '#f4f8ff'
  },
  progressBar_left: {
    backgroundColor: '#62aeff',
  },
  progressBar_right: {
    backgroundColor: '#f4f8ff',
  },
  progressBar_mes: {
    position: 'absolute',
    right: 0,
    paddingRight: 5,
    // lineHeight: 30,
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
  },
  progressBar__balloon: {
    position: 'absolute',
    padding: 3,
    right: -15,
    backgroundColor: '#62aeff', //进度数字背景色
    borderRadius: 5,
    //paddingRight: 5,
    flexDirection: 'column',
    width: 35,
    height: 22,
  },
  progressBar__balloonArrow: {
    position: 'absolute',
    //bottom: -6,
    right: -8,
    top: 18,
    width: 0,
    height: 0,
    borderWidth: 10,
    borderTopColor: '#62aeff',
    borderBottomColor: 'rgba(0,0,0,0)',
    borderLeftColor: 'rgba(0,0,0,0)',
    borderRightColor: 'rgba(0,0,0,0)',
  },
  progressBar__balloonVal: {
    textAlign: 'center',
    color: '#fff',
    alignItems: 'center',
    width: 29,
    lineHeight: 15,
  },
  labelWrap: {
    position: 'absolute',
    top: 0,
    left: .2,
  }
});
module.exports = Style