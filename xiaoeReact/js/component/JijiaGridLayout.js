/**
 * 自定义Listview实现Gridview的布局效果
 * @flow
 */
'use strict';

import React, {Component, PropTypes} from 'react';
import ReactNative,
{
   Image,
   ListView,
   TouchableOpacity,
   StyleSheet,
   Text,
   View,
   Dimensions,
   Platform,
   Alert,
   TouchableHighlight
} from 'react-native';
import { Actions ,ActionConst } from 'react-native-router-flux';
import AppDataConfig from '../config/AppDataConfig';
import Util from '../utils/Util'

const windowH = Dimensions.get('window').height;
const deviceWidthDp = Dimensions.get('window').width;

export default class ListViewGridLayout extends Component{

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({
           rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            ds: ds,
            tipCount: false,
            tipsinfo: false,
            tipIndex: 0,
            count: 0,
            dataSource: this.props.dataSource
        }
    }

    currentImg(rowID){
      this.props.callback(rowID)
    }

    renderItem(rowData, sectionID, rowID){
      return (
         <TouchableOpacity activeOpacity={1} onPress={()=>{
           this.currentImg(rowID)
         }}>
           <View>
             { rowData.count>0 &&
               <View style={styles.counts}>
                 <Text style={styles.countStyle}>
                   {rowData.count}
                 </Text>
               </View>
             }
             <View style={styles.column}>
               <Image style={styles.thumb} source={{uri:rowData.image_url}} />
               <Text style={styles.text}>
                 {rowData.title}
               </Text>
               <Text style={[styles.text, !Util.isEmptyString(rowData.original_price) && {color: 'red'}]}>
                 {rowData.price+' '}
                 { !Util.isEmptyString(rowData.original_price) &&
                 <Text style={[styles.text,{textDecorationLine: 'line-through'}]}>
                   {rowData.original_price}
                 </Text>
                 }
               </Text>
             </View>
             { !Util.isEmptyObject(rowData.suit) &&
             <TouchableOpacity activeOpacity={0.7} style={{position: 'absolute',right: 5,bottom: 10}}
               onPress={()=>{
                  this.props.suitList(rowData.suit)
               }}
               >
               <Image source={require('../images/ic_xiangqing.png')}/>
             </TouchableOpacity>
             }
             { !Util.isEmptyString(rowData.limited_discount) &&
             <TouchableOpacity activeOpacity={0.7} style={{position: 'absolute',left: 5,top: 5}}
               onPress={()=>{
                  this.props.discountClick(rowData.limited_discount)
               }}
               >
               <Image source={require('../images/icon_xianshi.png')}/>
             </TouchableOpacity>
             }
           </View>
         </TouchableOpacity>
      );
    }

    render(){
        return(
            <ListView
               contentContainerStyle={styles.list}
               dataSource={this.state.ds.cloneWithRows(this.props.dataSource)}
               initialListSize={3}
               pageSize={3}
               enableEmptySections={true}
               renderRow={this.renderItem.bind(this)}
            />
        );
    }
}

const styles = StyleSheet.create({
    list: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    column: {
      justifyContent: 'center',
      width: (deviceWidthDp)/3,
      alignItems: 'center',
      borderRightWidth: 0.5,
      borderBottomWidth: 0.5,
      borderColor: '#ddd',
      flexDirection: 'column',
      paddingBottom: 10,
      paddingTop: 10,
    },
    thumb: {
      height:50,
      width:50
    },
    text: {
      flex: 1,
      color:'#333',
      marginTop: 5,
      fontSize: 12
    },
    counts: {
      borderRadius: 20,
      paddingLeft: 4,
      paddingRight: 4,
      height: 13,
      position: 'absolute',
      right: 4,
      top: 4,
      backgroundColor: '#ec5757'
    },
    countStyle: {
      color: '#fff',
      textAlign: 'center',
      lineHeight: 12,
      backgroundColor: 'transparent',
      fontSize: 10
    }
});
