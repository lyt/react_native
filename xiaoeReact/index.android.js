/**
 * 小e助手React版本
 * https://github.com/rongchang/react_delivery
 * @flow
 */
import React, {
	Component
} from 'react';
import {
	AppRegistry
} from 'react-native';
import AppRouter from './js/page/Router'

AppRegistry.registerComponent('xiaoeReact', () => AppRouter);
