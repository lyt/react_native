/**
 * **************************************
 * ## 全局图文消息弹框
 *
 * 使用示例:
 *
 * ```
 *  <PicAndTextModal
 *      visible={true}
 *      title={"重要通知"}
 *      imgUrl={""}
 *      textContent={"最新版的小e管家奖励规则已经新鲜出炉啦"}
 *      onBtnClick={this.onBtnClick.bind(this)}
 *      btnText={["去看看"]}/>
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
    Image,
    TouchableOpacity
} from 'react-native';
import AppDataConfig from '.././config/AppDataConfig';

export default class PicAndTextModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
        };
    }

    static propTypes = {
        /**
         * 是否显示弹窗
         * @type {[type]}
         */
        visible: React.PropTypes.bool,
        /**
         * 弹窗的标题文字
         * @type {[type]}
         */
        title: React.PropTypes.string,
        /**
         * 弹窗图片地址
         * @type {[type]}
         */
        imgUrl: React.PropTypes.string,
        /**
         * 弹窗内容的文字描述
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
        title: '重要通知',
        textContent: "加载中...",
        btnText: '去看看',
    };

    closeClick() {
        this.setState({
            visible: false
        });
    }

    render() {
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
                        <View style={styles.topCloseView}>
                            <TouchableOpacity onPress={this.closeClick.bind(this)}>
                            <Image
                                source={require('.././images/tanchuang/btn_close_720.png')}
                                style={styles.closeImg}/>
                             </TouchableOpacity>
                            <View style={styles.borderD}></View>
                        </View>
                        <Image source={require('.././images/tanchuang/img_cute.png')} style={styles.mouseImg}/>
                        <View style={styles.subView}>
                            <Text style={styles.topText}>{this.props.title}</Text>
                            <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                                <Text style={styles.bodyText}>{this.props.textContent}</Text>
                            </View>
                            {this.props.btnText.length > 1 ?
                            <View style={styles.bottomBtn2}>
                                <Text
                                    onPress={this.props.onBtnClick.bind(this,0)}
                                    style={styles.bottomText}>
                                    {this.props.btnText[0]}
                                </Text>
                                <Text
                                    onPress={this.props.onBtnClick.bind(this,1)}
                                    style={styles.bottomText}>
                                    {this.props.btnText[1]}
                                </Text>
                            </View>
                            :
                            <View style={styles.bottomBtn}>
                              <Text
                                  onPress={this.props.onBtnClick.bind(this,0)}
                                  style={styles.bottomText}>
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
      width: AppDataConfig.DEVICE_WIDTH_Dp - 80,
    },
    topText: {
      paddingTop: 15,
      paddingBottom: 15,
      fontSize: AppDataConfig.Font_Default_Size + 1,
      color: '#ff7f17'
    },
    bodyText: {
      paddingLeft: 17,
      paddingRight: 17,
      fontSize: AppDataConfig.Font_Default_Size,
      color: '#3e3e3e'
    },
    textImg: {
      marginBottom: 10,
      height: 60,
      width: AppDataConfig.DEVICE_WIDTH_Dp - 80 - 17 * 2,
    },
    bottomBtn: {
      paddingTop: 13,
      paddingBottom: 13,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomText: {
      fontSize: AppDataConfig.Font_Default_Size,
      color: '#1aa4f2'
    },
    bottomBtn2: {
      paddingTop: 13,
      paddingBottom: 13,
      paddingLeft: 20,
      paddingRight: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    borderD: {
      height: AppDataConfig.DEVICE_HEIGHT_Dp / 7,
      borderWidth: .5,
      borderColor: '#dcdcdc',
    },
    topCloseView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -AppDataConfig.DEVICE_HEIGHT_Dp / 7,
    },
    closeImg: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    mouseImg: {
      zIndex: 1,
      marginBottom: -10,
      marginTop: -15,
    }
});
