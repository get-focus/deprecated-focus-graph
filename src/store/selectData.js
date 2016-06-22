const SELECT_DATA = 'SELECT_DATA';


const selectData = name => (state ={}) => {
  if( !state.dataset[name]) return console.warm(`SELECT_DATA : there is no ${name} in the dataset of the state`)
  return state.dataset[name]
}

export default selectData;
