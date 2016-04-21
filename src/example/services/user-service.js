export const loadUserSvc = async ({id}) => {
    const response = await fetch(`http://localhost:9999/x/entity/${id}`)
    const data = await response.json();
    return data;
}

export const loadMixedEntities =  async({id}) => {
  const response = await fetch(`http://localhost:9999/x/mixed/${id}`);
  const data = await response.json();
  return data;
}

export const saveUserSvc = async (user) => {
    const response = await fetch(`http://localhost:9999/x/entity/${user.uuid}`)
    const data = await response.json();
    return {...data, firstName: 'Name changed by the server mwahaha'};
}
