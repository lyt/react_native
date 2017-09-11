/**
 * **************************************
 * ## 全局弹框，可以设置多选条目
 *
  使用示例:
  <CloseModal
    visible={true}
    titleColor={"#000"}
    title={"请选择要拨打电话"}
    btnTextColor={"#1aa4f2"}
    onCloseClick={this.onCloseClick.bind(this)}
    onBtnClick={this.onBtnClick.bind(this)}
    btnText={["交接电话","客户电话"]}/>
 * **************************************
 */
'use strict';
import React, {
  Component,
  PropTypes
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  Modal,
  Image,
  TouchableOpacity,
  ListView
} from 'react-native';
import AppDataConfig from '.././config/AppDataConfig';
const statueBarHeightDp = (Platform.OS === 'ios' ? 20 : 25)
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;

export default class CloseModal extends React.Component {

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.btnText),
    };
  }

  static propTypes = {
    /**
     * 是否显示
     * @type {[type]}
     */
    visible: React.PropTypes.bool,
    /**
     * 弹窗的标题
     * @type {[type]}
     */
    title: React.PropTypes.string,
    /**
     * 弹窗的标题颜色
     * @type {[type]}
     */
    titleColor: React.PropTypes.string,
    /**
     * 弹窗按钮的文字描述
     * @type {[type]}
     */
    btnText: React.PropTypes.array,
    /**
     * 弹窗的按钮文字颜色
     * @type {[type]}
     */
    btnTextColor: React.PropTypes.string,
    /**
     * 按钮点击回调
     * @type {[type]}
     */
    onBtnClick: PropTypes.func,
    /**
     * 按钮点击回调
     * @type {[type]}
     */
    onCloseClick: PropTypes.func,
  };

  static defaultProps = {
    title: '重要提示',
    titleColor: '#000',
    btnTextColor: '#00dbf5',
    btnText: ['确定'],
  };


  render() {
    const {
      //标题样式
      titleColor,
      //按钮样式
      btnTextColor
    } = this.props;
    return (
      <View>
        <Modal
          animationType='none'
          transparent={true}
          backgroundColor={'rgba(0, 0, 0, 0.8)'}
          visible={this.props.visible}
          onShow={() => {}}
          onRequestClose={() => {}} >
          <View style={styles.modalStyle}>
            <View style={styles.outerView}>
                <TouchableOpacity style={styles.CloseView} onPress={this.props.onCloseClick.bind(this)}>
                  <Image style={styles.CloseStyle} source={require('.././images/more/close_btn.png')} />
                </TouchableOpacity>
              <View style={styles.subView}>
                <View style={styles.topView}><Text style={[styles.titleStyle,{color:titleColor}]}>{this.props.title}</Text></View>
                  <View style={styles.bottomBtn}>
                    <ListView
                      dataSource={this.state.dataSource}
                      renderRow={(rowData,sectionID,rowID) =>
                        <TouchableOpacity style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} onPress={this.props.onBtnClick.bind(this,rowID)}>
                        <Text style={[styles.btnStyle,{color:btnTextColor}]}>
                          {rowData}
                        </Text>
                        </TouchableOpacity>
                      }/>
                  </View>
              </View>
            </View>
          </View>
        </Modal>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: 'rgba( 0, 0, 0, .7)',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  outerView: {
    width: AppDataConfig.DEVICE_WIDTH_Dp,
    padding: 18,
    backgroundColor: 'rgba( 0, 0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subView: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#ccc',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 100,
  },
  CloseView: {
    height: 36,
    position: 'absolute',
    zIndex: 55555,
    top: 0,
    left: AppDataConfig.DEVICE_WIDTH_Dp - 100 + 18 + 14,
  },
  CloseStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  titleStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: AppDataConfig.Font_Default_Size + 2,
  },
  bottomBtn: {
    paddingTop: 13,
    paddingBottom: 13,
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    width: AppDataConfig.DEVICE_WIDTH_Dp - 102,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: AppDataConfig.Font_Default_Size + 2,
    textAlign: 'center',
  }

});
