/**
* 自定义全局加载进度条
*
* @providesComponent CommonLoading
* @flow
*/
'use strict';
import React from 'react';
import {
   StyleSheet,
   View,
   Text,
   Platform,
   ActivityIndicator,
   Dimensions,
   Alert,
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
const statueBarHeightDp = (Platform.OS === 'ios' ? 20 : 25)
const deviceWidthDp = Dimensions.get('window').width;
const deviceHeightDp = Dimensions.get('window').height;
const SIZES = ['small', 'normal', 'large'];

export default class CommonLoading extends React.Component {

     constructor(props) {
         super(props);
         this.state = {
             visible: this.props.visible,
             textContent: this.props.textContent
         };
     }

     static propTypes = {
         visible: React.PropTypes.bool,
         textContent: React.PropTypes.string,
         color: React.PropTypes.string,
         size: React.PropTypes.oneOf(SIZES),
         overlayColor: React.PropTypes.string
     };

     static defaultProps = {
         visible: false,
         textContent: "加载中...",
         color: 'white',
         size: 'large', // 'normal',
         overlayColor: 'rgba(0, 0, 0, 0.25)'
     };


     static showLoading = (message) => {
         return new RootSiblings(
             <CommonLoading
               visible={true}
               textContent={message}
             />);
     };

     show() {
       this.setState({
           visible: true
       });
     }

     hide() {
       this.setState({
           visible: false
       });
     }

     render() {
         return (
             <View style={styles.container}>
             <ActivityIndicator
                 color = {this.props.color}
                 style = {styles.centering}
                 size = {this.props.size}
                 animating={this.state.visible}/>
             <Text style={{textAlign:'center',color:'#fff',fontSize: 12}}>
                 {this.state.textContent}
             </Text>
           </View>
         );
     }
 }

 const styles = StyleSheet.create({
     container: {
         height: 80,
         width: 80,
         backgroundColor: 'black',
         justifyContent: 'center',
         alignItems: "center",
         position: 'absolute',
         left: deviceWidthDp / 2 - 40,
         top: (deviceHeightDp - statueBarHeightDp) / 2 - 40,
         opacity: 0.7,
         borderRadius: 6,
     },
     centering: {
         alignItems: 'center',
         justifyContent: 'center',
     }
 });
