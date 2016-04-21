export const loadMixedEntities = async ({id}) => {
    const response = await fetch(`http://localhost:9999/x/mixed/${id}`);
    const data = await response.json();
    return data;
}

export const saveMixedEntities = async ({user, address}) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 1500);
    });
    return {user, address};
}
