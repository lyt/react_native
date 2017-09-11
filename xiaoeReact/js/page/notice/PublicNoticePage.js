/**
 * 公告板页面
 * @author wei-spring
 * @Date 2017-03-13
 * @Email:weichsh@edaixi.com
 */
'use strict';

import React, {
  Component
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import HttpUtil from '../.././net/HttpUtil';
import NetConstant from '../.././net/NetConstant';
import Toast from '../.././component/Toast';
import AppDataConfig from '../.././config/AppDataConfig';
import ListViewEmptyView from '../.././component/ListViewEmptyView';
import { Actions } from 'react-native-router-flux';

/**
 * 默认公告展示样式，只有文字
 */
class DefaultRowItem extends Component {

   render() {
     return (
         <View>
           <View style={{flexDirection: 'row',justifyContent:'space-between'}}>
              <Text style={{fontSize:13,fontWeight: 'bold',marginBottom: 8}}>
                {this.props.data.title}
              </Text>
              { this.props.data.is_top &&
                <Text style={{backgroundColor: '#1AA4F2',color: 'white',fontSize:10,padding:3,borderRadius:3,marginBottom: 8}}>
                  置顶
                </Text>
              }
           </View>
           <Text style={{fontSize: 11,color: '#999',marginBottom: 8}}>
             {this.props.data.created_at}     {this.props.data.from_user}
           </Text>
           {/*判断是否展示图片*/}
           { this.props.data.image_url !== null && this.props.data.image_url !== undefined  && this.props.data.image_url.length > 1 &&
             <Image
                 style={{width: AppDataConfig.DEVICE_WIDTH_Dp-40,height: 150,resizeMode: Image.resizeMode.contain}}
                 source={{uri: this.props.data.image_url}}
             />
           }
           <View>
             <Text style={{lineHeight: 18,color: '#444'}}>
                 {this.props.data.message}
             </Text>
           </View>
         </View>
     );
   }
 }

/**
 * 图文混排公告展示样式
 * 图片可以动态配置对应点击打开url
 */
class PhotoRowItem extends Component {

    render() {
      return (
          <View style={styles.defaultList}>
            <DefaultRowItem
                data={this.props.data}
            />
            {/*根据跳转URL判断是否展示查看详情*/}
            { this.props.data.url !== null && this.props.data.url !== undefined && this.props.data.url.length > 1 &&
            <TouchableOpacity
                  onPress={() => {
                      Actions.WebViewPage({webViewTitle: this.props.data.title,webViewUrl: this.props.data.url});
                  }}>
              <View>
                <View style={styles.borderD}/>
                <View style={{flexDirection: 'row',justifyContent:'space-between'}}>
                   <Text style={{fontSize:13,fontWeight: 'bold',marginBottom: 8}}>
                     查看详情
                   </Text>
                 {/*<Icon name="ios-arrow-forward" color="#ccc" size={10}/>*/}
                </View>
              </View>
            </TouchableOpacity>
            }
          </View>
      );
    }
}

export default class PublicNoticePage extends Component {

   constructor(props){
       super(props);
       this.state = {
         isRefreshing: false,
         currentPage: 1,
         totalPage: 1,
         rowDataBlob:[],
       };
   }

   componentDidMount() {
     this.getPublicNotices(this.state.currentPage);
   }

   //获取公告板信息，分页第一页
   getPublicNotices(pageIndex){
     //这里有个惊天大bug,pageIndex可能为 NaN ，一定要做处理判断一下
     if(Number.isNaN(pageIndex)){
       return;
     }
     //如果当前页面索引大于总的页数，直接return.
     if(this.state.currentPage > this.state.totalPage){
       let toast = Toast.show('没有更多了', {
           duration: Toast.durations.SHORT,
           position: Toast.positions.BOTTOM
       });
       return;
     }
     this.setState({isRefreshing: true})
     var thisBak = this;
     let noticeParams = {
       'per_page': '10',
       'page': pageIndex,
     };
     HttpUtil.get(NetConstant.Get_Notices,noticeParams,function(resultData){
       if(resultData.ret){
         var dataEntry = resultData.data;
         var rowData = [];
         for (var i = 0; i < dataEntry.length; i++) {
            let itemInfo = {
                id: dataEntry[i].id,
                title: dataEntry[i].title,
                message: dataEntry[i].message,
                created_at: dataEntry[i].created_at,
                url: dataEntry[i].url,
                image_url: dataEntry[i].image_url,
                from_user: dataEntry[i].from_user,
                is_top: dataEntry[i].is_top
            }
            rowData.push(itemInfo);
          }
          const rowDataResult = resultData.current_page === 1 ?
                                rowData :
                                thisBak.state.rowDataBlob.concat(rowData);
          thisBak.setState({
            currentPage: resultData.current_page+1,
            totalPage: resultData.total_pages,
            rowDataBlob: rowDataResult,
            isRefreshing: false,
          });
       }
     },true);
   }

   handleRefresh(){
     if(!this.state.isRefreshing){
       this.getPublicNotices(1);
     }
   }

   handleLoadMore(){
     if(!this.state.isRefreshing && this.state.currentPage > 1){
       this.getPublicNotices(this.state.currentPage);
     }
   }

   render() {
     return (
       <View style={styles.rootView}>
         { this.state.rowDataBlob.length === 0 &&
           <View style={styles.emptyView}>
              <ListViewEmptyView/>
           </View>
         }
         <FlatList
           style={styles.listView}
           data={this.state.rowDataBlob}
           initialNumToRender={4}
           renderItem={({item}) => <PhotoRowItem  data={item}/>}
           keyExtractor={item => item.id}
           onRefresh={this.handleRefresh.bind(this)}
           refreshing={this.state.isRefreshing}
           onEndReached={({ distanceFromEnd }) => {
                     this.handleLoadMore();
                  }}
           onEndReachedThreshold={0.7}
         />
       </View>
     );
  }

 }

const styles = StyleSheet.create({
   rootView:{
     marginTop: AppDataConfig.HEADER_HEIGHT,
     flex: 1,
   },
   listView: {
     margin: 10,
     flex: 1,
   },
   defaultList: {
     backgroundColor: '#fff',
     padding: 8,
     marginBottom: 10,
     borderRadius: 4,
     borderWidth: 0.5,
     borderColor: '#ddd'
   },
   borderD: {
     borderRightColor: '#ddd',
     borderRightWidth: AppDataConfig.DEVICE_WIDTH_Dp,
     height: 0.5,
     alignItems: 'center',
     marginBottom: 10,
     marginTop: 10,
   },
   emptyView:{
     alignItems: 'center',
     justifyContent: 'center',
     flexDirection: 'row',
     width: AppDataConfig.DEVICE_WIDTH_Dp,
     height: AppDataConfig.DEVICE_HEIGHT_Dp
   }
});
