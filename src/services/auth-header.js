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

export default {
  authHeader,
  getToken
};