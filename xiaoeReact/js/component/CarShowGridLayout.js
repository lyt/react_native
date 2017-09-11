/**
 * 计价页面，购物车组件
 *
 * @providesComponent CarShowGridLayout
 * @flow
 */
'use strict';
import React, {Component, PropTypes} from 'react';
import {toDecimal2} from '../utils/Util';
import Toast from '.././component/Toast';
import ReactNative,
{  Image,
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
import AppDataConfig from '.././config/AppDataConfig'

export default class CarShowGridLayout extends Component{

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({
           rowHasChanged: (r1, r2) => r1 !== r2
        });
        var cardListData=[];
        var data = this.props.dataSource;
        for (var i = 0; i < data.length; i++) {
          if (data[i].count > 0) {
            cardListData.push(data[i])
          }
        }
        this.state = {
            ds: ds,
            dataSource: cardListData
        }
    }

    updateDataBlob(rowID,type){
      var data = this.state.dataSource;
      var cloth = data[rowID];
      if (type === 'delete') {
        cloth.count--
        if(cloth.count == 0) {
            this.state.dataSource.splice(rowID,1)
        }
      }else {
        cloth.count++
      }

      for (var i in this.props.dataSource) {
        var originCloth = this.props.dataSource[i]
        if (originCloth.id == cloth.id) {
          originCloth.count = cloth.count
        }
      }
      this.props.callback(this.props.dataSource)
      this.setState({
          dataSource: this.state.dataSource
      })
    }

    renderItem(rowData, sectionID, rowID){
      return (
          <View style={{justifyContent: 'space-between',flexDirection: 'row',marginBottom: 18}}>
            <Text style={{backgroundColor: 'transparent', fontSize: 12,flex: 1,marginTop: 5}}>
              {rowData.title}
            </Text>
            <Text style={{backgroundColor: 'transparent', fontSize: 12,flex: 1,marginTop: 5}}>
              {toDecimal2(rowData.price)}元
            </Text>
            <View style={{justifyContent: 'space-between',flexDirection: 'row'}}>
              { !this.props.zengbao &&
              <TouchableOpacity  activeOpacity={0.7} onPress={()=>{
                this.updateDataBlob(rowID,'delete');
              }}>
                <Image source={require('../images/icon_minus.png')}/>
              </TouchableOpacity>}
              <Text style={{paddingLeft: 10,paddingRight: 10,width: 60,textAlign: 'center',marginTop: 4}}>
                {rowData.count}
              </Text>
              { !this.props.zengbao &&
              <TouchableOpacity  activeOpacity={0.7} onPress={()=>{
                this.updateDataBlob(rowID);
              }}>
                <Image source={require('../images/icon_add01.png')}/>
              </TouchableOpacity>}
            </View>
          </View>
      )
    }

    render(){
        return(
          <View style={styles.shoppingCar}>
            <View style={{flexDirection: 'row',justifyContent: 'space-between',marginBottom: 20}}>
              <Text style={{fontSize: 12,backgroundColor: 'transparent',color: '#666'}}>
                已选衣物清单
              </Text>
              <Text
                style={{fontSize: 12,color: '#00b7f9',backgroundColor: 'transparent',width: 100,textAlign: 'right'}}
                onPress={ ()=>{
                  for (var i in this.props.dataSource) {
                    var originCloth = this.props.dataSource[i]
                    originCloth.count = 0
                  }
                  this.props.callback(this.props.dataSource)
                }}
              >
                清空
              </Text>
            </View>
            <ListView
               enableEmptySections={true}
               dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
               renderRow={this.renderItem.bind(this)}
               showsVerticalScrollIndicator={false}/>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    countStyle: {
      color: '#fff',
      textAlign: 'center',
      lineHeight: 12,
      backgroundColor: 'transparent',
      fontSize: 10
    },
    shoppingCar: {
      backgroundColor: '#fff',
      position: 'absolute',
      bottom: 50,
      paddingTop: 20,
      paddingLeft: 10,
      paddingRight: 10,
      left: 0,
      right: 0,
      zIndex: 2,
      maxHeight: 300
    }
});
