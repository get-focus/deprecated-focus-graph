import React from 'react';
const paramExtractor = (Component, paramExtractionFunction = p => p) => ({params, ...otherProps}) => <Component {...paramExtractionFunction(params)} {...otherProps}/>


export default paramExtractor;
