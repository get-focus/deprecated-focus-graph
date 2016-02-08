function buildLoadAction({name}){
  const REQUEST_ENTITY = `REQUEST_ENTITY_${name}`;
  const loadAction = (criteria, options) => ({type: REQUEST_ENTITY, payload: criteria});
  return {name: REQUEST_ENTITY, action: loadAction};
}
function buildReceiveAction({name}){
  const RECEIVE_ENTITY = `RECEIVE_ENTITY_${name}`;

}
