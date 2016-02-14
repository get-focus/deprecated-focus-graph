export const loadUserSvc = async ({id})=> {
  const response = await fetch(`http://localhost:9999/x/entity/${id}`)
  const data = await response.json();
  return data;
}
