const changeLoginStatus = (store,status) => {
  store.setState({ loginStatus: status });
};
const setIsLineLogin = (store,status) => {
  store.setState({ isLineLogin: status });
};
const setCurrentUser = (store,userinfo) => {
  store.setState({ currentUser : userinfo });
};
const setUserRole = (store,role) => {
  store.setState({ userRole : role });
};
export {
  changeLoginStatus,
  setIsLineLogin,
  setCurrentUser,
  setUserRole
}