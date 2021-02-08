const authHeader=()=> {
  const user = JSON.parse(localStorage.getItem('user'))||{};

  if (user && user.id) {
    return { Authorization: 'Bearer ' + user.id }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}

const getToken=()=> {
  const user = JSON.parse(localStorage.getItem('user'))||{};
  return { Authorization: user.id }; 
}

const API_URL = "https://cloud1.r8way.moph.go.th:3099/api/";
//------------

export default {
  authHeader,
  getToken,
  API_URL
};