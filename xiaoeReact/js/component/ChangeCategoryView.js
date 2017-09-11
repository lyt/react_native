/**
 * 计价页面，修改品类组件
 *
 * @providesComponent ChangeCategoryView
 * @flow
 */
'use strict';
import React, {
  Component,
  PropTypes
} from 'react';
import ReactNative, {
  Image,
  ListView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {
  Actions,
  ActionConst
} from 'react-native-router-flux';
import AppDataConfig from '.././config/AppDataConfig'

export default class ChangeCategoryView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      ds: ds,
      currentIndex: 0,
      dataSource: this.props.dataSource
    }
  }

  componentWillMount() {
    if (this.props.currentCateName != undefined && this.props.currentCateName != null && this.props.currentCateName.length != 0) {
      var index = this.props.dataSource.indexOf(this.props.currentCateName)
      this.setState({
        currentIndex: index
      })
    }
  }

  chooseCategory(rowID) {
    this.setState({
      currentIndex: rowID
    })
  }

  renderItem(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity
        onPress={()=>{this.chooseCategory(rowID)}}
        activeOpacity={1}>

        <View style={[styles.changeCategoryList, rowID == this.state.dataSource.length-1 ? {marginBottom:30}: {}]}>
          <Text style={{backgroundColor: 'transparent', fontSize: 18}}>
            {rowData}
          </Text>
          {this.state.currentIndex != rowID?
            <Image source={require('../images/send/icon_choose_disabled.png')}/>
            :
            <Image source={require('../images/send/icon_choose_enabled.png')}/>
          }
        </View>
      </TouchableOpacity>
    )
  }


  render() {
    return (
      <View style={styles.modalView}>
          <View style={styles.modalStyle}>
            <ListView
              style={styles.listViewCategory}
              showsVerticalScrollIndicator={false}
              dataSource={ this.state.ds.cloneWithRows(this.state.dataSource) }
              renderRow={this.renderItem.bind(this)}/>

            <View style={{backgroundColor: '#4783ff',borderBottomLeftRadius:5,borderBottomRightRadius:5,}}>
              <Text style={{paddingTop: 18,textAlign: 'center',backgroundColor: 'transparent',color: '#fff',fontSize: 12}}>
                请选择服务品类
              </Text>
              <View style={styles.modalBottom}>
                <TouchableOpacity style={[styles.text,{marginRight: 10}]} activeOpacity={0.7} onPress={()=>{
                  this.props.categorySubmitId(-1)
                }}>
                  <Text style={{color: '#fff',fontSize: 12}}>
                    取消
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.text,{backgroundColor: '#fff'}]} activeOpacity={0.7} onPress={()=>{
                  this.props.categorySubmitId(this.state.currentIndex)
                }}>
                  <Text style={{color: '#00b7f9',fontSize: 12}}>
                    确定
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{width:AppDataConfig.DEVICE_WIDTH_Dp,height: AppDataConfig.DEVICE_HEIGHT_Dp,backgroundColor:'rgba(0, 0, 0, 0.6)',position: 'absolute',top: 0,zIndex: 1, left: 0, right: 0}}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    position: 'absolute',
    top: 0,
    zIndex: 4,
    paddingTop: 0,
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    height: AppDataConfig.DEVICE_HEIGHT_Dp,
    left: 0,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalStyle: {
    backgroundColor: '#fff',
    zIndex: 6,
    height: AppDataConfig.DEVICE_HEIGHT_Dp / 2,
    borderRadius: 5,
    width: AppDataConfig.DEVICE_WIDTH_Dp - 80,
    marginTop: 60,
    overflow: 'hidden',
  },
  text: {
    padding: 8,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1
  },
  listViewCategory: {
    padding: 20,
  },
  modalBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,

  },
  changeCategoryList: {
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
