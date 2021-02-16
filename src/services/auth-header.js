const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  if (user && user.id) {
    return { Authorization: 'Bearer ' + user.id }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('EW30')) || {};
  return { Authorization: user.id };
}

const API_URL = process.env.REACT_APP_API_URL;
export {
  authHeader,
  getToken,
  API_URL
};