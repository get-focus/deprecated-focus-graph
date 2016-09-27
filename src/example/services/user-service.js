export const loadUser = async ({id}) => {
    const response = await fetch(`http://localhost:9999/x/entity/${id}`)
    const data = await response.json();
    return data;
}

export const loadError= async () => {
    const response = await fetch(`http://localhost:9999/x/error`)
    const data = await response.json();
    console.log(data)
    return data;
}

export const saveUser = async ({user}) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 1500);
    });
    return {...user, firstName: 'Name changed by the server mwahaha'};
}
