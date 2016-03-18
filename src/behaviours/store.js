import React, {Component, PropTypes} from 'react';
import {connect as connectToReduxStore } from 'react-redux';
import get from 'lodash/get';

// TODO : review this one
const defaultMapStateToPropsBuilder = entityPathArray => ({dataset}) => entityPathArray.reduce((acc, entityPath) => ({...acc, fields: {...acc.fields, [entityPath]: get(dataset, entityPath)}}), {fields: {}});

export const connect = (entityPathArray, {mapStateToProps, mapDispatchToProps}) => connectToReduxStore(mapStateToProps || defaultMapStateToPropsBuilder(entityPathArray), mapDispatchToProps);
