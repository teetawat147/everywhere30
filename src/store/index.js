import React from "react";
import globalHook from "use-global-hook";
import * as actions from "./actions";

const initialState = {
  currentUser: {},
  userRole: 'noRole',
  loginStatus: false,
  isLineLogin: false,
  anchorEl: null,
  drawerOpen: false,
  mobileView: false
};

const useGlobal = globalHook(React, initialState, actions);

export default useGlobal;
