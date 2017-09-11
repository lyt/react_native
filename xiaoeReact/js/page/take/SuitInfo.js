/**
 * 自定义Listview实现Gridview的布局效果
 */
'use strict';

import React, {Component} from 'react';
import ReactNative,
{
   Image,
   ListView,
   TouchableOpacity,
   StyleSheet,
   Text,
   View,
   Dimensions,
} from 'react-native';

const deviceHeightDp = Dimensions.get('window').height;
const deviceWidthDp = Dimensions.get('window').width;

export default class TipsInfo extends Component{
  constructor(props){
      super(props);
      const ds = new ListView.DataSource({
         rowHasChanged: (r1, r2) => r1 !== r2
      });


      this.state = {
          ds: ds,
      }
  }

  renderItem(rowData, sectionID, rowID){

      return(
          <View style={styles.changeCategoryList}>
            <Text style={[styles.text]}>
              {rowData.title}
            </Text>
            <Text style={[styles.text]}>
              {rowData.count + rowData.unit}
            </Text>
          </View>
      )
    }



  render(){
      return(
        <View style={styles.modalView}>
          <View style={styles.modalStyle}>
            <ListView
              style={styles.listViewCategory}
              dataSource={ this.state.ds.cloneWithRows(this.props.clothes) }
              renderRow={this.renderItem.bind(this)}
              showsVerticalScrollIndicator={false}
              enableEmptySections={true}
            />

          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width:deviceWidthDp,
              height:deviceHeightDp,
              backgroundColor:'rgba(0, 0, 0, 0.6)',
              position: 'absolute',
              top: 0,
              zIndex: 1
            }}
            onPress={()=>{
              this.props.callback()
            }}
          >
          </TouchableOpacity>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  modalStyle: {
    overflow: 'hidden',
    // width: windowW - 60,
    height: 260,
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 6,
    borderRadius: 4,
    marginTop: 90,
  },
  modalView: {
    position: 'absolute',
    top: 0,zIndex: 4,
    padding: 50,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    height: deviceHeightDp,
    width: deviceWidthDp
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10
  },
  listViewCategory: {
    padding: 15
  },
  changeCategoryList: {
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})
