import React from "react";
import useGlobalHook from "use-global-hook";
import * as actions from "./actions";

const initialState = {
  currentUser:{},
  userRole:'noRole',
  loginStatus: false,
  isLineLogin:false,
  anchorEl:null
};

const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;