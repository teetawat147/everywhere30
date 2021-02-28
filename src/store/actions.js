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
const setDrawerOpen = (store,open) => {
  store.setState({ drawerOpen : open });
};
const setAnchorEl = (store,open) => {
  store.setState({ anchorEl : open });
};
const setMobileView = (store,view) => {
  store.setState({ movileView : view });
};
export {
  changeLoginStatus,
  setIsLineLogin,
  setCurrentUser,
  setUserRole,
  setDrawerOpen,
  setAnchorEl,
  setMobileView
}