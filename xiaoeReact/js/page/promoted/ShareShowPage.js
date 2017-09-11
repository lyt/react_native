/**
 * 分享海报预览页面
 * @author wei-spring
 * @Date 2017-03-13
 * @Email:weichsh@edaixi.com
 */
import React, {PropTypes} from 'react';
import ReactNative, {
    Text,
    View,
    Platform,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import ShareUtil from '../.././native_modules/ShareUtil';
import AppDataConfig from '../.././config/AppDataConfig';
import AppColorConfig from '../.././config/AppColorConfig'
import { Actions ,ActionConst} from 'react-native-router-flux';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import ShareModal from './ShareModal';
import NavigatorHeader from '../.././component/NavigatorHeader'

const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height - (Platform.OS !== 'ios' ? 24 : 0);

export default class ShareShowPage extends React.Component{

constructor(props){
    super(props);
    this.state = {
        id: '',
        share_rule: '',
        share_uri: '',
        visible: false,
    };
    this.onClose = this.onClose.bind(this);
  }

componentDidMount() {
   this.getPosterShare();  
}

 //弹框关闭回调
onClose(data) {
   this.setState({
        visible:false,
   });
}

 //弹框关闭回调
onOpenShare() {
   console.log("coemin 点击分享");
   this.setState({
        visible:true,
   });
}

/**
 * @Author      wei-spring
 * @DateTime    2017-03-18
 * @Email       获取海报分享信息，用于分享微信好友和朋友圈
 * @Description
 * @return      {[type]}             [description]
 */
getPosterShare(){
    var thisBak = this;
    let paramData = {
                'id':this.props.id,
                };
    HttpUtil.get(NetConstant.Get_Qrcode_Share,paramData,function(resultData){
        if(resultData.ret){
          var dataEntry = resultData.data;
          try {
             thisBak.setState({
                id: dataEntry.id,
                share_rule:dataEntry.share_rule,
                share_uri: dataEntry.share_uri
             });
            } catch (error) {
              // Error retrieving data
            }
        }
    },true);
}


render(){
    return(
        <View>
          <NavigatorHeader
             title={"分享预览"}
             rightTitle={"分享"}
             onLeftPress={Actions.pop}
             onRightPress={this.onOpenShare.bind(this)}
          />
            { this.state.share_uri.length > 0 &&
            <Image
              source={{uri: this.state.share_uri}}
              style={{
                margin:10,
                width : deviceWidthDp,
                height:deviceHeightDp-AppDataConfig.HEADER_HEIGHT,
                resizeMode: Image.resizeMode.contain
                }}
            />}
            { this.state.visible &&
              <ShareModal
                visible={this.state.visible}
                shareRule = {this.state.share_rule}
                shareUri={this.state.share_uri}
                onClose={this.onClose}
              />
            }
        </View>
        );
    }
}
