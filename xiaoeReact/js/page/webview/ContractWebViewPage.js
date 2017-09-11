/**
 * 平台协议页面，协议到期用来签署
 * @author wei-spring
 * @Date 2017-04-26
 * @Email:weichsh@edaixi.com
 */
import React, {PropTypes} from 'react';
import ReactNative,{
  Text,
  View,
  StyleSheet,
  WebView,
  ActivityIndicator
} from 'react-native';
import AppColorConfig from '../.././config/AppColorConfig';
import { Actions ,ActionConst} from 'react-native-router-flux';
import Button from '../.././component/Button';
import Toast from '../.././component/Toast';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';

export default class ContractWebViewPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          //from_type 首页，更多 和网页，一共三种情况
          from: this.props.from
        };
    }

    componentWillMount(){
        Actions.refresh({title: '平台协议'});
    }

    //签署平台协议
    signContract(){
      let paramData = {
          contract_id: this.props.contract_id,
      };
      HttpUtil.post(NetConstant.Sign_Contract,paramData,function(resultData){
          if(resultData.ret){
            try {
                Actions.Home({
                  showContract: false,
                  type: ActionConst.RESET
                 });
              } catch (error) {}
          }else{
            Toast.show(resultData.error);
          }
      },true);
    }

    //点击按钮事件
    onBtnClick(){
      if(this.state.from === 'more'){
        Actions.ApplyDeposit({
           from: 'web',
           userDepositState: this.props.userDepositState,
           type: ActionConst.REPLACE
         });
      }else{
        this.signContract();
      }
    }

    render(){
        const webViewUrl = this.props.contractUrl;
        return(
            <View style={{flex: 1}}>
                <WebView
                    source={{uri: webViewUrl}}
                    style={styles.webView}
                    renderLoading={this.renderLoading.bind(this)}
                    startInLoadingState={true}
                    onLoad={this.showTips.bind(this, 'load')}
                    onError={this.showTips.bind(this, 'error')}/>
                <View style={styles.download}>
                  <Button
                    containerStyle={{
                      paddingTop:10,
                      paddingBottom:10,
                      paddingLeft:15,
                      paddingRight:15,
                      borderRadius:4,
                      backgroundColor: AppColorConfig.commonColor}}
                    style={{fontSize: 16, color: "white"}}
                    onPress={this.onBtnClick.bind(this)}>
                  已阅读并同意签署此协议
                  </Button>
                </View>
            </View>
        );
    }

    showTips(msg){
    }

    renderLoading(){
      return(
          <View style={{justifyContent: 'center', paddingTop: 10}}>
              <ActivityIndicator color= 'gray' size="large"/>
          </View>
      );
    }
}

const styles = StyleSheet.create({
    webView: {
        flex: 1,
    },
    download:{
      margin:15,
    }
});
