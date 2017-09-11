/**
 * 全局WebView页面，用来打开外链
 * @author wei-spring
 * @Date 2017-03-15
 * @Email:weichsh@edaixi.com
 */
import React, {PropTypes} from 'react';
import{
  Text,
  View,
  StyleSheet,
  WebView,
  BackHandler,
  ActivityIndicator
} from 'react-native';
import AppColorConfig from '../.././config/AppColorConfig';
import { Actions } from 'react-native-router-flux';

export default class WebViewPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            webViewTitle: this.props.webViewTitle,
            isBackButtonEnable: false,
        }
    }

    componentWillMount(){
        Actions.refresh({title: this.state.webViewTitle});
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", ()=> {
            try {
                if (this.state.isBackButtonEnable) {
                    //返回上一个页面
                    this.refs._webView.goBack();
                    //true 系统不再处理 false交给系统处理
                    return true;
                }
            } catch (error) {
                return false;
            }
            return false;
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress");
    }

    render(){
        const webViewUrl = this.props.webViewUrl;
        return(
            <View style={{flex: 1}}>
                <WebView
                  ref="_webView"
                  source={{uri: webViewUrl}}
                  style={styles.webView}
                  renderLoading={this.renderLoading.bind(this)}
                  startInLoadingState={true}
                  domStorageEnabled={true}
                  javaScriptEnabled={true}
                  scalesPageToFit={true}
                  onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                  onLoad={this.showTips.bind(this, 'load')}
                  onError={this.showTips.bind(this, 'error')}
                />
            </View>
        );
    }

    showTips(msg){

    }

    //WebView导航状态改变
    _onNavigationStateChange(navState) {
        this.setState({
            url: navState.url,
            title: navState.title,
            loading: navState.loading,
            isBackButtonEnable: navState.canGoBack,
            isForwardButtonEnable: navState.canGoForward,
        })
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
        backgroundColor: 'white',
        marginTop: 65,
    },
});
