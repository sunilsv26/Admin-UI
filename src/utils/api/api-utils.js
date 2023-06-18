//Call API to get data from remote
export const getDataAPICall = async (url) => {
  let response;
  try {
    response = await fetch(url);
    response = await response.json();
    return response;
  } catch (error) {
    console.error(error);
  }
};
