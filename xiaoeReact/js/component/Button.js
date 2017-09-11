/**
 * 自定义兼容Android和iOS的Button
 * 参见：https://github.com/ide/react-native-button/edit/master/Button.js
 *
 * @providesComponent Button
 * @flow
 */
'use strict';
import React,
{Children,
  Component,
  PropTypes
}from 'react';
import{
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
}from 'react-native';

const systemButtonOpacity = 0.2;

export default class Button extends Component {
  static propTypes = {
    ...TouchableOpacity.propTypes,
    allowFontScaling: Text.propTypes.allowFontScaling,
    containerStyle: View.propTypes.style,
    disabled: PropTypes.bool,
    style: Text.propTypes.style,
    styleDisabled: Text.propTypes.style,
  };

  render() {
    let touchableProps = {
      activeOpacity: this._computeActiveOpacity(),
    };
    if (!this.props.disabled) {
      touchableProps.onPress = this.props.onPress;
      touchableProps.onPressIn = this.props.onPressIn;
      touchableProps.onPressOut = this.props.onPressOut;
      touchableProps.onLongPress = this.props.onLongPress;
    }

    return (
      <TouchableOpacity
        {...touchableProps}
        testID={this.props.testID}
        style={this.props.containerStyle}
        accessibilityTraits="button"
        activeOpacity={0.7}
        accessibilityComponentType="button">
        {this._renderGroupedChildren()}
      </TouchableOpacity>
    );
  }

  _renderGroupedChildren() {
    let { disabled } = this.props;
    let style = [
      styles.text,
      disabled ? styles.disabledText : null,
      this.props.style,
      disabled ? this.props.styleDisabled : null,
    ];

    let children = coalesceNonElementChildren(this.props.children, (children, index) => {
      return (
        <Text key={index} style={style} allowFontScaling={this.props.allowFontScaling}>
          {children}
        </Text>
      );
    });

    switch (children.length) {
      case 0:
        return null;
      case 1:
        return children[0];
      default:
        return <View style={styles.group}>{children}</View>;
    }
  }

  _computeActiveOpacity() {
    if (this.props.disabled) {
      return 1;
    }
    return this.props.activeOpacity != null ?
      this.props.activeOpacity :
      systemButtonOpacity;
  }
}

function coalesceNonElementChildren(children, coalesceNodes) {
  var coalescedChildren = [];
  var contiguousNonElements = [];
  Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      contiguousNonElements.push(child);
      return;
    }

    if (contiguousNonElements.length) {
      coalescedChildren.push(
        coalesceNodes(contiguousNonElements, coalescedChildren.length)
      );
      contiguousNonElements = [];
    }
    coalescedChildren.push(child);
  });

  if (contiguousNonElements.length) {
    coalescedChildren.push(
      coalesceNodes(contiguousNonElements, coalescedChildren.length)
    );
  }

  return coalescedChildren;
}

const styles = StyleSheet.create({
  text: {
    color: '#007aff',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  disabledText: {
    color: '#dcdcdc',
  },
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
