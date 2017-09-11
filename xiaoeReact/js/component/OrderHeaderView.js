/**
 * 顶部导航栏，包含左右切换两个Tab按钮.
 * 关于交接单列表顶部导航栏都可以使用.
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

export default class OrderHeaderView extends Component {

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
         * Tab切换回调
         * @type {[type]}
         */
        onTabSwitch: PropTypes.func,
    };

  onSwitchTab(index){
      this.props.onTabSwitch(index)
  }

  render() {
        const {
            tabTextArray,
            onTabSwitch,
        } = this.props;
        const tabs = this.props.tabTextArray.map((tabItem,kk) => {
                return (
                    <View
                      key={kk}
                      style={[styles.tabItem,kk === 0 ? {marginLeft: 0}:{marginLeft: 15}, this.props.selectTab === kk ? {borderBottomWidth: 2,borderBottomColor: '#fff'} : {borderBottomWidth: 2,borderBottomColor: 'transparent'}]}
                      activeOpacity={0.8}>
                       <TouchableOpacity
                         onPress={()=> {this.onSwitchTab(kk)}}>
                         <Text style={{color: '#fff',fontSize: 16}}>
                            {tabItem}
                         </Text>
                       </TouchableOpacity>
                    </View>
                );
            });
        return(
            <View style={styles.navigationBar}>
              <TouchableOpacity
                style={styles.tabConcent}
                onPress={Actions.pop}>
                <Image
                  style={{width: 13,height: 21,marginLeft: 8}}
                  source={require('.././images/title_back_image.png')}
                />
              </TouchableOpacity>
              <View style={styles.tabList}>
                {tabs}
              </View>
              <View style={styles.tabConcent}/>
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
});
