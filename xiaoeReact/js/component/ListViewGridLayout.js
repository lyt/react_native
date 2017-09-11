 /**
  * 自定义FlatList实现Gridview的布局效果
  * @author wei-spring
  * @Date 2017-03-13
  * @Email:weichsh@edaixi.com
  */
'use strict';

import React, {Component, PropTypes} from 'react';
import{
   Image,
   FlatList,
   TouchableHighlight,
   StyleSheet,
   Text,
   View,
   Alert,
} from 'react-native';
import { Actions ,ActionConst } from 'react-native-router-flux';
import AppDataConfig from '.././config/AppDataConfig';

export default class ListViewGridLayout extends Component{

    static propTypes = {
      /**
       * 申请小e点击回调
       * @type {[type]}
       */
      onApplyClick: PropTypes.func,
    };

    itemClickCallback(rowData){
        var name = rowData.name;
        this.props.clearRedPoint(name)
        switch (name)
        {
        case 'qujian':
          //跳转取件页面
          Actions.Take();
          break;
        case 'songjian':
          //跳转送件页面
          Actions.SendOrderPage();
          break;
         case 'zhuanyundan':
          //跳转转运单页面
          Actions.TransferOrderPage({
            title: ['取件已接','送件已接']
          });
          break;
         case 'zhuanyun':
          //跳转转运页面
          Actions.TransferPage();
          break;
         case 'chongzhi':
          //跳转售卡页面
          Actions.Sellcard();
          break;
         case 'tuiguang':
          //跳转推广页面
          Actions.PromotedPage();
          break;
         case 'lanshou':
          //跳转揽收页面
          Actions.LanShouJiJia();
          break;
         case 'xiaoxi':
          //跳转消息页面
          Actions.PromotedPage();
          break;
         case 'xiaoe':
          //跳转小E申请页面
          this.props.onApplyClick();
          break;
         case 'zancun':
          //跳转暂存页面
          Actions.ScannerGetPage({title: '暂存'});
          break;
         case 'zancundan':
          //跳转暂存单页面
          Actions.TransferOrderPage({
            title: ['取件已存','送件已存']
          });
          break;
        default:
          Alert.alert('暂时不能跳转哦，请联系技术.');
          break;
        }
    }

    renderItemComponent = ({item}) => {
      return (
         <TouchableHighlight onPress={this.itemClickCallback.bind(this, item)} underlayColor="transparent">
           <View>
             <View style={styles.column}>
               { item.redPointShow &&
                 <View style={[styles.timeNum]}/>
               }
               <Image style={styles.thumb} source={{uri: item.image_url}} />
               <Text style={styles.text}>
                 {item.title}
               </Text>
             </View>
           </View>
         </TouchableHighlight>
      );
    }

    render(){
        return(
            <FlatList
               contentContainerStyle={styles.list}
               horizontal={false}
               numColumns={2}
               keyExtractor={item => item.id}
               data={this.props.dataSource}
               renderItem={this.renderItemComponent}
               initialListSize={6}
            />
        );
    }
}

const styles = StyleSheet.create({
    list: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      margin: 5,
    },
    column: {
      justifyContent: 'center',
      padding: 10,
      margin: 6,
      width: (AppDataConfig.DEVICE_WIDTH_Dp-34)/2,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      borderRadius: 5,
      borderColor: '#CCC',
      flex: 1,
      flexDirection: 'column',
    },
    thumb: {
      width: 56,
      height: 56,
    },
    text: {
      flex: 1,
      color:'#343941',
      marginTop: 10,
      fontWeight: 'bold'
    },
    timeNum: {
      position: 'absolute',
      top: 5,
      left: AppDataConfig.DEVICE_WIDTH_Dp / 2 - 30,
      width: 10,
      height: 10,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: '#f02e4b'
    },
});
