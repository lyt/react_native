/**
 * 海报源文件下载页面
 * @author wei-spring
 * @Date 2017-03-13
 * @Email:weichsh@edaixi.com
 */
import React, {PropTypes} from 'react';
import ReactNative, {
    Text, 
    View, 
    StyleSheet, 
    Platform, 
    Dimensions,
    ScrollView,
    Clipboard
} from 'react-native';
import Toast from '../.././component/Toast';
import AppColorConfig from '../.././config/AppColorConfig'

export default class PosterDownloadPage extends React.Component{

render(){

    return(
        <ScrollView>
            <View style={styles.contain}>
                <Text style={styles.titleText}>打印地址:</Text>
                <Text style={styles.titleText}>正面:</Text>
                <Text style={styles.sourceText} onPress={() => { 
                    Clipboard.setString(this.props.front_side_source);
                    Toast.show('复制成功!');
                }}>
                    {this.props.front_side_source}
                </Text>
                <Text style={styles.titleText}>反面:</Text>
                 <Text style={styles.sourceText} onPress={() => { 
                    Clipboard.setString(this.props.back_side_source);
                    Toast.show('复制成功!');
                }}>
                    {this.props.back_side_source}
                </Text>
                <Text style={styles.titleText}>使用说明:</Text>
                <Text>{this.props.download_descriptions}</Text>
            </View>
        </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
  contain:{
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems:'flex-start',
    paddingLeft:10,
    paddingRight:10,
   },
   titleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
   sourceText: {
    fontSize: 13,
    color: AppColorConfig.commonColor,
  },
});
