import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: null,
};

if (localStorage.getItem("jwtToken")) {
  const token = localStorage.getItem("jwtToken");
  const decodeData = jwtDecode(token);
  const exp = decodeData.exp * 1000 < Date.now();

  if (exp) {
    localStorage.removeItem("jwtToken");
    initialState.user = null;
  } else {
    initialState.user = decodeData;
  }
}

export const authSlice = createSlice({
  name: "authuser",
  initialState,
  reducers: {
    login: (state, action) => {
      localStorage.setItem("jwtToken", action.payload.token);
      state.user = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("jwtToken");
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
