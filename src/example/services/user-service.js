export const loadUserSvc = async ({id}) => {
    const response = await fetch(`http://localhost:99099/x/entity/${id}`)
    const data = await response.json();
    return data;
}

export const saveUserSvc = async (user) => {
    // const response = await fetch(`http://localhost:9999/x/entity/${user.id}`)
    // const data = await response.json();
    // return data;
    return {...user, firstName: 'Name changed by the server mwahaha'};
}
