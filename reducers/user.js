import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

const signinAsync = createAsyncThunk(
  "user/signinAsync",
  async (payload, { dispatch }) => {
    const { email, password } = payload;

    try {
      const response = await fetch(`${BACKEND_URL}/members/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      //const data = dataReponse.member;
      console.log("Signin response data:", data);
      if (data && data.member.token) {
        dispatch(
          login({
            token: data.member.token,
            firstName: data.member.firstName,
            lastName: data.member.lastName,
            email: data.member.email,
          })
        );
      } else {
        console.warn("Erreur signin :", data);
      }

      return data;
    } catch (error) {
      console.error("Erreur réseau :", error);
      throw error;
    }
  }
);

const SignupAsync = createAsyncThunk(
  "user/SignupAsync",
  async (payload, { dispatch }) => {
    const { firstName, lastName, email, password } = payload;

    try {
      const response = await fetch(`${BACKEND_URL}/members/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      //const data = dataReponse.member;
      console.log("Signup response data:", data.member.token);
      if (data && data.member.token) {
        dispatch(
          login({
            token: data.member.token,
            firstName: data.member.firstName,
            lastName: data.member.lastName,
            email: data.member.email,
          })
        );
      } else {
        console.warn("Erreur signup :", data);
      }

      return data;
    } catch (error) {
      console.error("Erreur réseau :", error);
      throw error;
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
export { signinAsync, SignupAsync };
export default userSlice.reducer;
