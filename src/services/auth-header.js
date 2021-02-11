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
const PORT = 3000;
const API_URL = "https://cloud1.r8way.moph.go.th:3999/api/";
const LINE = {
  api: 'https://api.line.me/oauth2/v2.1/',
  client_id: '1655591732',
  client_secret: 'f801ca079698c589ec57284d3a3ae0fe',
  redirect_uri: 'http://localhost:' + PORT + '/linelogin',
  state: 'b41c8fd15b895f0fc28bf3b9d7da89054d931e7s'
};

export {
  authHeader,
  getToken,
  API_URL,
  LINE
};