export const CREATE_FORM = 'CREATE_FORM';
export const DESTROY_FORM ='DESTROY_FORM';

export const INPUT_CHANGE = 'INPUT_CHANGE';
export const INPUT_ERROR = 'INPUT_ERROR';

export const createForm = (key, entityPathArray) => ({
    type: CREATE_FORM,
    key,
    entityPathArray
});

export const destroyForm = key => ({
    type: DESTROY_FORM,
    key
});
