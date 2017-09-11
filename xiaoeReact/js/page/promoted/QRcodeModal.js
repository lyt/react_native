/**
 * 自定义Modal，展示不同样式的推广二维码
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

const noop = () => {};

export default class QRcodeModal extends Component{

    static propTypes = {
        /**
         * 推广海报id
         * @type {[type]}
         */
        id: PropTypes.number,
        /**
         * 优惠券ID
         * @type {[type]}
         */
        sceneId: PropTypes.string,
        /**
         * [二维码存放地址]
         * @type {[String]}
         */
        QRcodeUrl: PropTypes.string,
        /**
         * [推广活动地址]
         * @type {[String]}
         */
        activeUrl: PropTypes.string,
        /**
         * 是否可以进行分享
         * @type {[type]}
         */
        enableShare: PropTypes.bool,
        /**
         * 是否可以进行下载海报
         * @type {[type]}
         */
        enablePoster: PropTypes.bool,
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
        id: 0,
        sceneId:'',
        QRcodeUrl:'',
        activeUrl:'',
        enableShare:false,
        enablePoster:false,
        visible:false,
        onClose: noop,
    };

 

    render() {
        const {visible,onClose,id,sceneId,QRcodeUrl,activeUrl,enableShare,enablePoster} = this.props;

        return (
                  <TouchableOpacity>
                      <DefaultQRcodeModal 
                          id = {this.props.id}
                          sceneId={this.props.sceneId}
                          QRcodeUrl={this.props.QRcodeUrl}
                          activeUrl={this.props.activeUrl}
                          enableShare={this.props.enableShare}
                          enablePoster={this.props.enablePoster}
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
class DefaultQRcodeModal extends React.Component {

  constructor() {
    super();
  }

  _onCopyBtnClick(activeUrl){
    Clipboard.setString(activeUrl);
    Toast.show(AppMessageConfig.CopySucessTips,{position: Toast.positions.BOTTOM});
  }

  _onShareClick(){
    this._onPressCloseBtn();
    Actions.ShareShowPage({
        id: this.props.id,
    });
  }

   _onPosterClick(){
    this._onPressCloseBtn();
    Actions.PosterShowPage({id:this.props.id});
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
                        <View style={styles.modalIntro}>
                          <Image style={styles.modalImg} source={{uri: this.props.QRcodeUrl}}/>
                        </View>
                        <Text style={styles.minText}>扫描得e袋洗优惠券({this.props.sceneId})</Text>
                        <Text onPress={this._onCopyBtnClick.bind(this,this.props.activeUrl)} style={styles.copyText}>复制推广链接</Text>
                        <View style={styles.functionBtn}>
                            { this.props.enableShare && 
                                <TouchableOpacity onPress={this._onShareClick.bind(this)} style={styles.shareImg}>
                                  <Image style={{width:50,height:50,resizeMode: Image.resizeMode.contain}} source={require('../.././images/modal/ic_share.png')}/>
                                  <Text style={styles.shareText}>分享</Text>  
                                </TouchableOpacity>
                            }
                            { this.props.enablePoster &&
                                <TouchableOpacity onPress={this._onPosterClick.bind(this)} style={styles.shareImg}>
                                  <Image style={{width:50,height:50,resizeMode: Image.resizeMode.contain}} source={require('../.././images/modal/ic_download.png')}/>
                                  <Text style={styles.shareText}>下载</Text>  
                                </TouchableOpacity>
                            }            
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
    modalIntro: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#c4c4c4',
        borderTopColor: '#e4e4e4',
        flexDirection: 'row',
        justifyContent: 'center'
      },
    shareImg: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: -8,
        padding: 10,
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
    modalImg: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.1)',
        width: 180,
        height: 180
      },
    minText: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12,
        textAlign: 'center',
      },
    copyText: {
        marginBottom: 20,
        textAlign: 'center',
        borderWidth: 0.5,
        borderRadius: 4,
        borderColor: '#ddd',
        marginLeft: 85,
        marginRight: 85,
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