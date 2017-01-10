export const INPUT_CHANGE = 'INPUT_CHANGE';
export const INPUT_BLUR = 'INPUT_BLUR';
export const INPUT_ERROR = 'INPUT_ERROR';
export const INPUT_BLUR_LIST = 'INPUT_BLUR_LIST';
export const INPUT_ERROR_LIST = 'INPUT_ERROR_LIST';
export const INPUT_ERROR_CHANGE_LIST = 'INPUT_ERROR_CHANGE_LIST';
export const INPUT_CHANGE_ERROR = 'INPUT_CHANGE_ERROR';

/**
 * Input error action
 * Triggers an error on the target field
 * @param  {string} formKey    the target form key
 * @param  {string} fieldName  the field name
 * @param  {string} entityPath the field entity path
 * @param  {string} error      the error message
 * @return {object}            the action
 */
export const inputErrorList = (formKey, fieldName, entityPath, error, propertyNameLine, index) => ({
    type: INPUT_ERROR_LIST,
    formKey,
    fieldName,
    entityPath,
    error,
    propertyNameLine,
    index
});


export const inputErrorChangeList = (formKey, fieldName, entityPath, error, propertyNameLine, index) => ({
    type: INPUT_ERROR_CHANGE_LIST,
    formKey,
    fieldName,
    entityPath,
    error,
    propertyNameLine,
    index
});

/**
 * Input blur of a list field
 * @param  {string} formKey               the target form key
 * @param  {string} fieldName             the field name
 * @param  {string} entityPath            the field entity path
 * @param  {object} rawValue              the new value
 * @param  {string} propertyNameLine      the line name
 * @param  {number} index                 position of the field on the list
 * @return {object}                       the action
 */
export const inputBlurList = (formKey, fieldName, entityPath, rawValue, propertyNameLine, index) => ({
    type: INPUT_BLUR_LIST,
    formKey,
    fieldName,
    entityPath,
    rawValue,
    propertyNameLine,
    index


})

/**
 * Input change action
 * Triggers a change on the input value
 * Usage: inputChange('movieForm', 'title', 'movie', 'Chicken run');
 * @param  {string} formKey    the target form key
 * @param  {string} fieldName  the field name
 * @param  {string} entityPath  the field entity path
 * @param  {object} rawValue    the new value
 * @return {object}            the action
 */
export const inputChange = (formKey, fieldName, entityPath, rawValue) => ({
    type: INPUT_CHANGE,
    formKey,
    fieldName,
    entityPath,
    rawValue
});

/**
 * Input blur action
 * Usage: inputBlur('movieForm', 'title', 'movie');
 * @param  {string} formKey    the target form key
 * @param  {string} fieldName  the field name
 * @param  {string} entityPath  the field entity path
 * @param  {object} rawValue    the new value
 * @return {object}            the action
 */
export const inputBlur = (formKey, fieldName, entityPath, rawValue) => ({
    type: INPUT_BLUR,
    formKey,
    fieldName,
    entityPath,
    rawValue
});

/**
 * Input error action
 * Triggers an error on the target field
 * @param  {string} formKey    the target form key
 * @param  {string} fieldName  the field name
 * @param  {string} entityPath the field entity path
 * @return {object}            the action
 */
export const inputChangeError = (formKey, fieldName, entityPath, error) => ({
    type: INPUT_CHANGE_ERROR,
    formKey,
    fieldName,
    entityPath
  });


/**
 * Input error action
 * Triggers an error on the target field
 * @param  {string} formKey    the target form key
 * @param  {string} fieldName  the field name
 * @param  {string} entityPath the field entity path
 * @param  {string} error      the error message
 * @return {object}            the action
 */
export const inputError = (formKey, fieldName, entityPath, error) => ({
    type: INPUT_ERROR,
    formKey,
    fieldName,
    entityPath,
    error
});
