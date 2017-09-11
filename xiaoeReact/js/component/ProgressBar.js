'use strict'

import Style from './ProgressBarStyle.js'

var React = require('react')
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  LayoutAnimation,
} = require('react-native')

export default class ProgressBar extends React.Component {
  constructor() {
    super()
    this.state = {
      progressValue: 0,
      progress: 0,
    }
  }

  componentDidMount() {
    //LayoutAnimation.spring()
    setTimeout(() => {
      this.setState({
        progressValue: this.props.progressValue,
        progress: this.props.progress
      })
    }, 0)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      progressValue: nextProps.progressValue,
      progress: nextProps.progress
    })
  }

  componentWillUpdate() {
    //LayoutAnimation.spring()
  }

  render() {
    var valueBalloon = false
    var marginTop = 30
    valueBalloon = (
      <View style={Style.flexBox}>
        <View style={[{flex:this.state.progress}]}>
          <View style={[Style.progressBar__balloonArrow,{borderTopColor:this.props.bgColor}]}></View>
          <View style={[Style.progressBar__balloon,{backgroundColor:this.props.bgColor}]}>
            <Text style={Style.progressBar__balloonVal}>{this.state.progressValue}</Text>
          </View>
        </View>
        <View style={[{flex:100 - this.state.progress}]}></View>
      </View>
    )

    var chart = (
      <View>
        {valueBalloon}
        <View style={[Style.flexBox, Style.progressBar, {marginTop: marginTop}]}>
          <View style={[{backgroundColor:this.props.bgColor}, {flex:this.state.progress}]}>

          </View>
          <View style={[Style.progressBar_right, {flex:100 - this.state.progress}]}></View>
        </View>

      </View>
    )
    return chart
  }
}

ProgressBar.defaultProps = {
  progress: 0,
}
