/**
 * **************************************
 * ## 首页签署协议弹框
 *
 * 使用示例:
 *
 * ```
 * <TextModal
 *   visible={true}
 *   titleStyle={{color:'red'}}
 *   title={"重要提示"}
 *   contentStyle={{color:'red'}}
 *   textContent={"您的合作协议将在10月31日到期，请阅读并同意新的协议！续签后方可正常使用该系统！"}
 *   btnStyle={{color:'red'}}
 *   btnText={["立即续签协议"]}/>
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
  Modal
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import AppDataConfig from '.././config/AppDataConfig';
const statueBarHeightDp = (Platform.OS === 'ios' ? 20 : 25)
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;

export default class TextModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
  }

  static propTypes = {
    /**
     * 是否显示
     * @type {[type]}
     */
    visible: React.PropTypes.bool,
    /**
     * 弹窗的标题
     * @type {[type]}
     */
    title: React.PropTypes.string,
    /**
     * 弹窗的内容
     * @type {[type]}
     */
    textContent: React.PropTypes.string,
    /**
     * 弹窗按钮的文字描述
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
    title: '重要提示',
    textContent: "加载中...",
    btnText: ['确定'],
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
                    <View style={styles.topView}><Text style={[styles.titleStyle,titleStyle]}>{this.props.title}</Text></View>
                    <View style={styles.bodyView}><Text style={[styles.contentStyle,contentStyle]}>{this.props.textContent}</Text></View>
                    {this.props.btnText.length > 1 ?
                      <View style={styles.bottomBtn2}>
                          <Text
                            onPress={this.props.onBtnClick.bind(this,0)}
                            style={[styles.btnStyle,btnStyle]}>
                            {this.props.btnText[0]}
                          </Text>
                          <Text
                            onPress={this.props.onBtnClick.bind(this,1)}
                            style={[styles.btnStyle,btnStyle]}>
                            {this.props.btnText[1]}
                          </Text>
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
    width: deviceWidthDp - 60,
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
    width: deviceWidthDp - 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    fontSize: AppDataConfig.Font_Default_Size + 4,
    color: '#1aa4f2'
  },
  bottomBtn2: {
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 30,
    paddingRight: 30,
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    width: deviceWidthDp - 62,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});