export const CREATE_FORM = 'CREATE_FORM';
export const DESTROY_FORM ='DESTROY_FORM';

export const SYNC_FORMS_ENTITY = 'SYNC_FORMS_ENTITY';
export const SYNC_FORM_ENTITIES = 'SYNC_FORM_ENTITIES';

export const TOGGLE_FORM_EDITING = 'TOGGLE_FORM_EDITING';
export const SET_FORM_TO_SAVING = 'SET_FORM_TO_SAVING';

export const VALIDATE_FORM = 'VALIDATE_FORM';
export const CLEAR_FORM = 'CLEAR_FORM';

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
  * Form clear action
  * Removes all the data in the form.
  * Usage: destroyForm('movieForm');
  * @param  {string} formKey} the form key
  * @return {object}          the action itself
  */
 export const clearForm = formKey => ({
     type: CLEAR_FORM,
     formKey
 });


/**
 * Sync multiple forms with a single entity
 * Synchronises the forms state with the dataset state
 * No usage example since it's not called by the user itself but only by the form middleware
 * @param  {string} entityPath the target entity path. All forms listening to this entity path will be updated
 * @param  {array} fields      the updated fields objects
 * @return {object}            the action
 */
export const syncFormsEntity = (entityPath, fields, formKey) => ({
    type: SYNC_FORMS_ENTITY,
    entityPath,
    fields,
    formKey
});

/**
 * Sync a single form with multiple entities
 * Synchronises the forms state with the dataset state
 * No usage example since it's not called by the user itself but only by the form middleware
 * @param  {string} formKey    the target form
 * @return {object}            the action
 */
export const syncFormEntities = formKey => ({
    type: SYNC_FORM_ENTITIES,
    formKey
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

/**
 * Set form to saving state
 * Usage: setFormToSaving('movieForm');
 * @param  {string} formKey    the target form key
 * @return {object}            the action
 */
export const setFormToSaving = formKey => ({
    type: SET_FORM_TO_SAVING,
    formKey
});

export const validateForm = (formKey, nonValidatedFields, saveAction) => ({
    type: VALIDATE_FORM,
    formKey,
    nonValidatedFields,
    saveAction
});
