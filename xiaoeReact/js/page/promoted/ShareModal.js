/**
 * 自定义Modal，展示分享的弹框
 * 分享好友
 * 分享朋友圈
 */
'use strict';

import React, {Component, PropTypes} from 'react';
import ReactNative, {Text,
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
    TouchableNativeFeedback,
    Image,
    Modal,
    PixelRatio,
    Clipboard
} from 'react-native';
import { Actions ,ActionConst} from 'react-native-router-flux';
import Toast from '../.././component/Toast';
import AppMessageConfig from '../.././config/AppMessageConfig';
import ShareUtil from '../.././native_modules/ShareUtil';

const noop = () => {};

export default class ShareModal extends Component{

    static propTypes = {
        /**
         * 分享的规则
         * @type {[type]}
         */
        shareRule: PropTypes.string,
         /**
         * 分享的图片地址
         * @type {[type]}
         */
        shareUri: PropTypes.string,
        /**
         * 是否显示Modal
         * @type {[type]}
         */
        visible:PropTypes.bool,
        /**
         * 点击关闭的回调
         * @type {[type]}
         */
        onClose: PropTypes.func,
    };

    static defaultProps = {
        shareRule:'',
        shareUri:'',
        visible:false,
        onClose: noop,
    };


    render() {
        const {shareRule,shareUri,onClose,visible} = this.props;

        return (
                  <TouchableOpacity>
                      <DefaultShareModal
                          shareRule = {this.props.shareRule}
                          shareUri={this.props.shareUri}
                          visible={this.props.visible}
                          onClose={this.props.onClose}
                      />
                  </TouchableOpacity>
                );
    }
}

/**
 * 默认推广二维码样式
 */
class DefaultShareModal extends React.Component {

  constructor() {
    super();
  }

  _onShareFriendClick(){
    var shareMsg = {
      url : this.props.shareUri,
    };
    ShareUtil.share(shareMsg,0);
  }

   _onShareLifeClick(){
    var shareMsg = {
      url : this.props.shareUri,
    };
    ShareUtil.share(shareMsg,1);
  }

  _onPressCloseBtn(){
    this.props.onClose();
  }

   render() {
     return (
       <View style={styles.contain}>
         <Modal
            animationType='none'
            transparent={true}
            backgroundColor={'rgba(0, 0, 0, 0.8)'}
            visible={this.props.visible}
            onShow={() => {}}
            onRequestClose={() => {}} >
                <View style={styles.modalStyle}>
                    <View style={styles.subView}>
                        <Text style={styles.minText}>分享规则</Text>
                        <Text style={styles.copyText}>{this.props.shareRule}</Text>
                        <View style={styles.functionBtn}>
                            <TouchableOpacity onPress={this._onShareFriendClick.bind(this)} style={styles.shareImg}>
                                  <Image style={{width:50,height:50,resizeMode: Image.resizeMode.contain}} source={require('../.././images/modal/social_share_wechat.png')}/>
                                  <Text style={styles.shareText}>微信好友</Text>
                            </TouchableOpacity>
                             <TouchableOpacity onPress={this._onShareLifeClick.bind(this)} style={styles.shareImg}>
                                  <Image style={{width:50,height:50,resizeMode: Image.resizeMode.contain}} source={require('../.././images/modal/social_share_friends.png')}/>
                                  <Text style={styles.shareText}>朋友圈</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row',alignItems: 'flex-end',width: 100,height: 60, justifyContent: 'center'}} >
                        <TouchableOpacity onPress={this._onPressCloseBtn.bind(this)}>
                            <Image style={styles.modalClosebtn} source={require('../.././images/more/close_btn.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
        </Modal>
      </View>
     );
   }
}


const styles = StyleSheet.create({
    // modal的样式
    modalStyle: {
        backgroundColor: 'rgba( 0, 0, 0, .1)',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingTop: 30,
      },
    // modal上子View的样式
    subView: {
        paddingTop: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#ccc',
      },
    shareImg: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: -8,
        padding: 20,
        alignItems:'center',
      },
    shareText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12,
        textAlign: 'center',
      },
    contain: {
        marginTop: 65,
      },
    minText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16,
        textAlign: 'center',
      },
    copyText: {
        marginBottom: 20,
        textAlign: 'center',
        marginLeft: 25,
        marginRight: 25,
        padding: 5,
        fontSize: 12
      },
     modalClosebtn: {
        width: 40,
        height: 40,
      },
    functionBtn:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
    }

});
