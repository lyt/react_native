/**
 * **************************************
 * ## 包含2个输入框的 Dialog
 *
 * 使用示例:
 *
 * ```
 * <InPutDialog
 *   visible={true}
 *   titleStyle={{color:'red'}}
 *   contentStyle={{color:'red'}}
 *   inputText={['1','2']}
 *   btnStyle={{color:'red'}}
 *   btnText={["确定"]}/>
 *
 * ```
 * **************************************
 */
'use strict';
import React, {
  Component,
  PropTypes
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  Alert,
  Modal,
  TextInput
} from 'react-native';

import AppDataConfig from '.././config/AppDataConfig';
import AppColorConfig from '.././config/AppColorConfig';

export default class InPutDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      name: '',
      tel: ''
    };
  }

  static propTypes = {
    /**
     * 是否显示
     * @type {[type]}
     */
    visible: React.PropTypes.bool,
    /**
     * 输入框的默认显示文字数组
     * @type {[type]}
     */
    inputText: React.PropTypes.array,
    /**
     * 按钮对应文字
     * @type {[type]}
     */
    btnText: React.PropTypes.array,
    /**
     * 按钮点击回调
     * @type {[type]}
     */
    onBtnClick: PropTypes.func,
  };

  static defaultProps = {
    visible: false,
  };

  render() {
    const {
      //标题样式
      titleStyle,
      //内容样式
      contentStyle,
      //按钮样式
      btnStyle
    } = this.props;
    return (
      <View>
          <Modal
            animationType='none'
            transparent={true}
            backgroundColor={'rgba(0, 0, 0, 0.8)'}
            visible={this.state.visible}
            onShow={() => {}}
            onRequestClose={() => {}} >
            <View style={styles.modalStyle}>
              <View style={styles.subView}>
                <View>
                  <TextInput
                    ref={'snInput'}
                    underlineColorAndroid='transparent'
                    placeholder="请输入客户姓名"
                    style={{width:AppDataConfig.DEVICE_WIDTH_Dp-100,height: 40,lineHeight: 40,fontSize: 16,marginTop: 15,}}
                    value = {this.state.orderFenqian}
                    onChangeText={(text) => {
                      this.setState({
                        name: text
                      })
                    }}/>
                </View>
                <View style={{width:AppDataConfig.DEVICE_WIDTH_Dp-100,borderWidth:.5,borderColor:AppColorConfig.borderColor,height:0}}></View>
                <View>
                  <TextInput
                    ref={'snInput'}
                    underlineColorAndroid='transparent'
                    placeholder="请输入客户电话"
                    maxLength={11}
                    style={{height: 40,lineHeight: 40,fontSize: 16,width:AppDataConfig.DEVICE_WIDTH_Dp-100,borderBottomWidth:1,borderBottomColor:AppColorConfig.borderColor,}}
                    keyboardType='numeric'
                    value = {this.state.orderFenqian}
                    onChangeText={(text) => {
                      this.setState({
                        tel: text
                      })
                    }}/>
                </View>
                <View style={{width:AppDataConfig.DEVICE_WIDTH_Dp-100,borderWidth:.5,borderColor:AppColorConfig.borderColor,height:0,marginBottom:15,}}></View>
                <View style={{width:AppDataConfig.DEVICE_WIDTH_Dp-62,borderWidth:.5,borderColor:AppColorConfig.borderColor,height:0}}></View>
                {this.props.btnText.length > 1 ?
                  <View style={styles.bottomBtn2}>
                      <Text
                        onPress={this.props.onBtnClick.bind(this,0,this.state.name,this.state.tel)}
                        style={[styles.btnStyle,btnStyle]}>
                        {this.props.btnText[0]}
                      </Text>
                      <Text
                        onPress={this.props.onBtnClick.bind(this,1,this.state.name,this.state.tel)}
                        style={[styles.btnStyle,btnStyle]}>
                        {this.props.btnText[1]}
                      </Text>
                    <Text style={{position:"absolute",left:(AppDataConfig.DEVICE_WIDTH_Dp-62)/2,height:45,borderWidth:.5,borderColor:AppColorConfig.borderColor,width:0}}></Text>
                  </View>
                  :
                  <View style={styles.bottomBtn}>
                      <Text
                        onPress={this.props.onBtnClick.bind(this,0)}
                        style={[styles.btnStyle,btnStyle]}>
                        {this.props.btnText[0]}
                      </Text>
                  </View>
                }
             </View>
            </View>
          </Modal>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: 'rgba( 0, 0, 0, .7)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  subView: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 60,
    overflow: 'hidden'
  },
  titleStyle: {
    paddingTop: 15,
    paddingBottom: 8,
    fontSize: AppDataConfig.Font_Default_Size + 5,
    color: '#ff0101'
  },
  contentStyle: {
    paddingLeft: 17,
    paddingRight: 17,
    paddingBottom: 17,
    fontSize: AppDataConfig.Font_Default_Size + 4,
    lineHeight: 22,
    color: '#3e3e3e',
  },
  bottomBtn: {
    paddingTop: 13,
    paddingBottom: 13,
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    fontSize: AppDataConfig.Font_Default_Size + 4,
    color: '#1aa4f2',
    textAlign: 'center',
    width: (AppDataConfig.DEVICE_WIDTH_Dp - 62) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 13,
    paddingBottom: 13,
  },
  bottomBtn2: {
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
