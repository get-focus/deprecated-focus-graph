import React, {Component, PropTypes} from 'react';
import {connect as connectToReduxStore } from 'react-redux';
import get from 'lodash/get';

const defaultMapStateToPropsBuilder = entityPathArray => ({dataset}) => entityPathArray.reduce((acc, entityPath) => ({...acc, fields: {...acc.fields, [entityPath]: get(dataset, entityPath)}}), {fields: {}});
const defaultMapDispatchToProps = dispatch => ({dispatch});

export const connect = (entityPathArray, {mapStateToProps, mapDispatchToProps = defaultMapDispatchToProps}) => connectToReduxStore(mapStateToProps || defaultMapStateToPropsBuilder(entityPathArray), mapDispatchToProps);
