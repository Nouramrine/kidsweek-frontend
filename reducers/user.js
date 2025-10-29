import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

const signInAsync = createAsyncThunk(
  "user/signInAsync",
  async (payload, { dispatch }) => {
    const { email, password } = payload;
    try {
      const response = await fetch(`${BACKEND_URL}/members/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.result) {
        dispatch(
          login({
            token: data.member.token,
            firstName: data.member.firstName,
            lastName: data.member.lastName,
            email: data.member.email,
          })
        );
        return { result: true }
      } else {
        return { result: false, error: data.error }
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  }
);

const signUpAsync = createAsyncThunk(
  "user/signUpAsync",
  async (payload, { dispatch }) => {
    const { firstName, lastName, email, password } = payload;

    try {
      const response = await fetch(`${BACKEND_URL}/members/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await response.json();
      if (data.result) {
        dispatch(
          login({
            token: data.member.token,
            firstName: data.member.firstName,
            lastName: data.member.lastName,
            email: data.member.email,
          })
        );
        return { result: true }
      } else {
        return { result: false, error: data.error}
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  }
);

const initialState = {
  value: {
    token: null,
    firstName: null,
    lastName: null,
    email: null,
    isLogged: false,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = {
        token: action.payload.token,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        isLogged: true,
      };
    },
    logout: (state) => {
      state.value = {
        token: null,
        firstName: null,
        lastName: null,
        email: null,
        isLogged: false,
      };
    },
  },
});

export const { login, logout } = userSlice.actions;
export { signInAsync, signUpAsync };
export default userSlice.reducer;
