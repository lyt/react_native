/**
 * 顶部搜索栏.
 * 所有关于交接单列表顶部搜索都可以使用，
 * 包含普通搜索和三种快捷筛选两种样式
 * @author wei-spring
 * @Date 2017-04-11
 * @Email:weichsh@edaixi.com
 */
'use strict';

import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native'
import AppDataConfig from '.././config/AppDataConfig'

export default class OrderSearchView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortArray: [{
        text: '预约最早',
        isSelect: true
      }, {
        text: '距离最近',
        isSelect: false
      }, {
        text: '当天订单',
        isSelect: false
      }],
      sortIndex: 0,
      searchText: '',
    }

  }

  static propTypes = {
    /**
     * 订单总数
     * @type {[type]}
     */
    countText: PropTypes.string,
    /**
     * 默认搜索提示文字
     * @type {[type]}
     */
    searchHolderText: PropTypes.string,
    /**
     * 是否显示三种快捷筛选条件，默认不显示
     * @type {[type]}
     */
    isShowQuickSearch: PropTypes.bool,
    /**
     * 三种快捷筛选选中回调，执行搜索逻辑
     * @type {[type]}
     */
    onQuickSearch: PropTypes.func,
    /**
     * 普通输入搜索回调，执行搜索逻辑
     * @type {[type]}
     */
    onCommonSearch: PropTypes.func,

    /**
     * 当前选中的index
     * @type {[type]}
     */
    selectIndex: PropTypes.number,

  };

  static defaultProps = {
    isShowQuickSearch: false,
    countText: "总数 0",
    selectIndex: 0,
  };

  /**
   * @Author      wei-spring
   * @DateTime    2017-04-11
   * @Email       [weichsh@edaixi.com]
   * @Description 更新筛选条件选中状态
   * @param       {[type]}             index [description]
   * @return      {[type]}                   [description]
   */
  updateSortBtn(index) {
    this.state.sortArray.map((item, kk) => {
      if (kk === index) {
        this.state.sortArray[kk].isSelect = true;
      } else {
        this.state.sortArray[kk].isSelect = false;
      }
    });
    this.setState({
      sortIndex: index,
      sortArray: this.state.sortArray,
    });
    this.props.onQuickSearch(index);
  }

  componentWillMount() {
    this.updateSortBtn(this.props.selectIndex)
  }

  render() {
    if (this.props.isShowQuickSearch) {
      return (
        <View style={{flexDirection: 'column',justifyContent: 'flex-start',}}>
          <View style={styles.searchContain}>
              <Text style={{backgroundColor: 'transparent',color: '#343941'}}>
                {this.props.countText}
              </Text>
              <View style={styles.inputContain}>
                <TextInput
                  ref={'textInput'}
                  underlineColorAndroid='transparent'
                  placeholder={this.props.searchHolderText}
                  style= {styles.inputStyle}
                  returnKeyType="search"
                  onChangeText={(searchText) => this.setState({searchText})}
                  onSubmitEditing={(event) => this.props.onCommonSearch(event.nativeEvent.text)}
                />
                <TouchableOpacity onPress={() => {
                this.refs['textInput'].setNativeProps({text: ''});
                this.setState({searchText:''});
                }}>
                { this.state.searchText.length > 0 &&
                <Image
                  style={{width: 18,height:18,marginRight: 10}}
                  source={require('.././images/send/search_clear_icon.png')}/>
                }
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={this.props.onCommonSearch.bind(this,this.state.searchText)}>
                <Image
                    style={{width: 20,height:20}}
                    source={require('.././images/send/icon_search.png')}/>
              </TouchableOpacity>
          </View>
          <View style={{height: 1,backgroundColor:'#ecf3ff'}}/>
          <View style={styles.sortContain}>
            <TouchableOpacity onPress={this.updateSortBtn.bind(this,0)} activeOpacity={0.7}>
               <Text
                style={this.state.sortArray[0].isSelect ? styles.textSelect : styles.textNoSelect}>
                {this.state.sortArray[0].text}
               </Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={this.updateSortBtn.bind(this,1)} activeOpacity={0.7}>
               <Text
                style={this.state.sortArray[1].isSelect ? styles.textSelect : styles.textNoSelect}>
                {this.state.sortArray[1].text}
               </Text>
             </TouchableOpacity>
             <TouchableOpacity onPress={this.updateSortBtn.bind(this,2)} activeOpacity={0.7}>

               <Text
                style={this.state.sortArray[2].isSelect ? styles.textSelect : styles.textNoSelect}>
                {this.state.sortArray[2].text}
               </Text>
            </TouchableOpacity>
          </View>

        </View>
      );
    } else {
      return (
        <View style={styles.searchContain}>
            <Text style={{backgroundColor: 'transparent',color: '#343941'}}>
              {this.props.countText}
            </Text>
            <View style={styles.inputContain}>
              <TextInput
                ref={'textInput'}
                underlineColorAndroid='transparent'
                placeholder={this.props.searchHolderText}
                style= {styles.inputStyle}
                returnKeyType="search"
                onChangeText={(searchText) => this.setState({searchText})}
                onSubmitEditing={(event) => this.props.onCommonSearch(event.nativeEvent.text)}
              />
              <TouchableOpacity onPress={() => {
                this.refs['textInput'].setNativeProps({text: ''});
                this.setState({searchText:''});
                }}>
                { this.state.searchText.length > 0 &&
                <Image
                  style={{width: 18,height:18,marginRight: 10}}
                  source={require('.././images/send/search_clear_icon.png')}/>
                }
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={this.props.onCommonSearch.bind(this,this.state.searchText)}>
            <Image
                style={{width: 20,height:20}}
                source={require('.././images/send/icon_search.png')}/>
            </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  searchContain: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  inputContain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f4f8ff',
    borderRadius: 20,
    flexGrow: 1,
    height: 38,
    overflow: 'hidden',
    marginLeft: 10, //20
    marginRight: 20,
  },
  inputStyle: {
    flex: 1,
    height: 40,
    fontSize: 13,
    paddingLeft: 10,
  },
  sortContain: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  textCount: {
    color: '#343941',
    paddingLeft: 10,
    fontSize: 14,
  },
  textSelect: {
    color: '#343941',
    fontSize: 14,
    width: AppDataConfig.DEVICE_WIDTH_Dp / 4,
    textAlign: 'center'
  },
  textNoSelect: {
    color: '#6b727e',
    fontSize: 12,
    width: AppDataConfig.DEVICE_WIDTH_Dp / 4,
    textAlign: 'center'
  }
})
