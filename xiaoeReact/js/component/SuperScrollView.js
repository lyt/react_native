/**
 * 全局上拉刷新，下拉加载更多列表组件
 * 没有数据时候，需要展示的空View提示文案.
 * 基于ScrollView
 *
 * @author wei-spring
 * @Date 2017-05-06
 * @Email:weichsh@edaixi.com
 */
import React, {Component, PropTypes} from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    RefreshControl
} from "react-native";
import AppDataConfig from '../config/AppDataConfig';
import ListViewEmptyView from './ListViewEmptyView';

export default class SuperScrollView extends Component {

     constructor(props){
        super(props);
        this.state = {
        }
    }

    static propTypes = {
        /**
         * 是否正在刷新中
         * @type {[type]}
         */
        isRefreshing : PropTypes.bool,
        /**
         * 是否可以加载更多
         * @type {[type]}
         */
        isShowEmptyView : PropTypes.bool,
        /**
         * 渲染列表条目
         * @type {[type]}
         */
        renderRow : PropTypes.func,
        /**
         * 列表刷新回调
         * @type {[type]}
         */
        onRefresh: PropTypes.func,
        /**
         * 列表加载更多回调
         * @type {[type]}
         */
        onLoadMore: PropTypes.func,
    };

    static defaultProps = {
       isShowEmptyView: true,
       isRefreshing: false,
    };

    render() {
        const {
            onRefresh,
            renderRow,
            onLoadMore,
            isShowEmptyView,
            isRefreshing
        } = this.props;
        var currentOffset = 0;

        return(
          <ScrollView
             style={styles.scrollview}
             onScroll={(e)=>{
                var windowHeight = Dimensions.get('window').height,
                    height = e.nativeEvent.contentSize.height,
                    offset = e.nativeEvent.contentOffset.y;
                    if((offset >= currentOffset)
                      && (!this.props.isRefreshing)
                      && (windowHeight + offset >= height)){
                      this.props.onLoadMore();
                    }
                    currentOffset = offset;
             }}
             refreshControl={
               <RefreshControl
                 refreshing={this.props.isRefreshing}
                 onRefresh={this.props.onRefresh}
                 tintColor="#999"
                 title="加载中..."
                 titleColor="#666"
                 colors={['#518DFF', '#999', '#518DFF']}
                 progressBackgroundColor="#666"
               />
             }>
             {this.props.isShowEmptyView ?
                <View style={styles.empty}>
                    <ListViewEmptyView/>
                </View>
                :
                this.props.renderRow()}
           </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
   scrollview: {
     height: AppDataConfig.deviceHeightDp - AppDataConfig.HEADER_HEIGHT,
     width: AppDataConfig.DEVICE_WIDTH_Dp,
     paddingTop: 5
   },
   empty:{
     marginTop: 150
   }
});
