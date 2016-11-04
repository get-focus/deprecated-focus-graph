export const loadUser = async ({id}) => {
    const response = await fetch(`http://localhost:9999/x/entity/${id}`)
    const data = await response.json();
    return data;
}

export const loadError= async () => {
    const response = await fetch(`http://localhost:9999/x/error`)
    const data = await response.json();
    return data;
}

export const saveUser = async (data) => {
    const user = data['user.information']
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 1500);
    });
    return {};
}
