/**
 * 顶部导航栏，包含切换Tab.以及右边的按钮
 * @author wei-spring
 * @Date 2017-04-11
 * @Email:weichsh@edaixi.com
 */
import React, {Component, PropTypes} from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Platform
} from "react-native";
import { Actions,ActionConst } from 'react-native-router-flux';
import AppDataConfig from '.././config/AppDataConfig'
import AppColorConfig from '.././config/AppColorConfig'

export default class RightHeaderView extends Component {

    constructor(props) {
      super(props);
    }

    static propTypes = {
        /**
         * 选中Tab
         * @type {[type]}
         */
        selectTab: PropTypes.number,
        /**
         * Tab之间间距
         * @type {[type]}
         */
        tabMargin: PropTypes.number,
        /**
         * Tab按钮文字数组，可以传入多个Tab按钮.
         * @type {[type]}
         */
        tabTextArray: PropTypes.array.isRequired,
        /**
         * 右边Tab按钮文字
         * @type {[type]}
         */
        rightText: PropTypes.string,
        /**
         * Tab切换回调
         * @type {[type]}
         */
        onTabSwitch: PropTypes.func,
        /**
         * 右边按钮点击回调
         * @type {[type]}
         */
        onRightTabSwitch: PropTypes.func,
    };

    onSwitchTab(index){
        this.props.onTabSwitch(index)
    }

    onRightTabSwitch(){
      this.props.onRightTabSwitch()
    }

    render() {
        const {
            tabTextArray,
            onTabSwitch,
        } = this.props;
        const tabs = this.props.tabTextArray.map((tabItem,kk) => {
                return (
                    <TouchableOpacity
                      key={kk}
                      style={[styles.tabItem,kk === 0 ? {marginLeft: 0}:{marginLeft: 15},this.props.selectTab === kk ? {borderBottomWidth: 2,borderBottomColor: '#fff'} : {borderBottomWidth: 2,borderBottomColor: 'transparent'}]}
                      onPress={()=> {this.onSwitchTab(kk)}}
                      activeOpacity={0.8}>
                        <View/>
                        <Text style={{color: '#fff',fontSize: 16}} >
                            {tabItem}
                        </Text>
                        <View/>
                    </TouchableOpacity>
                );
            });
        return(
            <View style={styles.navigationBar}>
                <TouchableOpacity
                  style={styles.tabConcent}
                  onPress={Actions.pop}>
                    <Image
                      style={{width: 13,height: 21,marginLeft: 10,marginTop: 7}}
                      source={require('.././images/title_back_image.png')}
                    />
                </TouchableOpacity>
                <View style={styles.tabList}>
                  {tabs}
                </View>
                <TouchableOpacity
                    style={styles.tabRightConcent}
                    onPress={()=> {this.onRightTabSwitch()}}
                    activeOpacity={0.8}>
                    <Image
                      style={{width: 25,height: 15}}
                      source={require('../images/order_receive_img.png')}/>
                  <Text style={{color: '#fff',fontSize: 12}}>
                      {this.props.rightText}
                  </Text>
                </TouchableOpacity>
            </View>
          );
    }
}

const styles = StyleSheet.create({
  navigationBar: {
    backgroundColor: AppColorConfig.titleBarColor,
    height: AppDataConfig.HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: (Platform.OS !== 'ios' ? 0 : 15)
  },
  tabConcent: {
    height: AppDataConfig.HEADER_HEIGHT,
    width: AppDataConfig.HEADER_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabItem:{
    height: AppDataConfig.HEADER_HEIGHT - (Platform.OS !== 'ios' ? 5 : 15),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: (Platform.OS !== 'ios' ? 5 : 15)
  },
  tabList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabRightConcent: {
    height: AppDataConfig.HEADER_HEIGHT,
    width: AppDataConfig.HEADER_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
