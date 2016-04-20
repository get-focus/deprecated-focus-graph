export const CREATE_FORM = 'CREATE_FORM';
export const DESTROY_FORM ='DESTROY_FORM';

export const SYNC_FORM_ENTITY = 'SYNC_FORM_ENTITY';

export const TOGGLE_FORM_EDITING = 'TOGGLE_FORM_EDITING';

export const VALIDATE_FORM = 'VALIDATE_FORM';

/**
 * Form creation action
 * Creates a new form in the 'forms' key in the state.
 * Usage: createForm('movieForm', ['movie', 'movieCasting']);
 * @param  {string} formKey         the form key
 * @param  {array} entityPathArray  entityPathArray, an array of entity paths to connect the form to
 * @return {object}                 the action itself
 */
export const createForm = (formKey, entityPathArray) => ({
    type: CREATE_FORM,
    formKey,
    entityPathArray
});

/**
 * Form destruction action
 * Removes a form from the state.
 * Usage: destroyForm('movieForm');
 * @param  {string} formKey} the form key
 * @return {object}          the action itself
 */
export const destroyForm = formKey => ({
    type: DESTROY_FORM,
    formKey
});

/**
 * Sync form action
 * Synchronises the form's state with the dataset state
 * No usage example since it's not called by the user itself but only by the form middleware
 * @param  {string} entityPath the target entity path. All forms listening to this entity path will be updated
 * @param  {array} fields      the updated fields objects
 * @return {object}            the action
 */
export const syncFormEntity = (entityPath, fields) => ({
    type: SYNC_FORM_ENTITY,
    entityPath,
    fields
});

/**
 * Form editing state toggling action
 * Toggles the target form between editing and consulting
 * Usage: toggleFormEditing('movieForm', true);
 * @param  {string} formKey    the target form key
 * @param  {boolean} editing   the editing state (true or false)
 * @return {object}            the action
 */
export const toggleFormEditing = (formKey, editing) => ({
    type: TOGGLE_FORM_EDITING,
    formKey,
    editing
});

export const validateForm = (formKey, nonValidatedFields, saveAction) => ({
    type: VALIDATE_FORM,
    formKey,
    nonValidatedFields,
    saveAction
});
