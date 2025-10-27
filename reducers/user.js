import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: { token: null, firstName: null, lastName: null, email: null },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.firstName = action.payload.firstName;
      state.value.lastName = action.payload.lastName;
      state.value.email = action.payload.email;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.firstName = null;
      state.value.lastName = null;
      state.value.email = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
