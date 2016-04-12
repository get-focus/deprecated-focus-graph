export const loadCivility = () => {
  console.log('called')
  return Promise.resolve([{code: 'MR', label: 'Mr'}, {code: 'Mme', label: 'Mme'}])
};
