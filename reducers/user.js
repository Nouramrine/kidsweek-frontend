import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

//  Dismiss un tooltip
export const dismissTutorialAsync = createAsyncThunk(
  "user/dismissTutorialAsync",
  async ({ token, tooltipId }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/members/tutorial/dismiss`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tooltipId }),
      });
      const data = await response.json();

      if (data.result) {
        return data.tutorialState;
      } else {
        console.error("Erreur dismiss tooltip:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Erreur dismiss tooltip:", error);
      return null;
    }
  }
);

//  signInAsync récupère tutorialState
export const signInAsync = createAsyncThunk(
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
            tutorialState: data.member.tutorialState || {
              dismissedTooltips: [],
            },
          })
        );
        return { result: true };
      } else {
        return { result: false, error: data.error };
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      return { result: false, error: "Erreur réseau" };
    }
  }
);

// signUpAsync récupère tutorialState
export const signUpAsync = createAsyncThunk(
  "user/signUpAsync",
  async (payload, { dispatch }) => {
    const { firstName, lastName, email, inviteToken, password } = payload;

    try {
      const response = await fetch(`${BACKEND_URL}/members/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          inviteToken,
          password,
        }),
      });
      const data = await response.json();

      if (data.result) {
        dispatch(
          login({
            token: data.member.token,
            firstName: data.member.firstName,
            lastName: data.member.lastName,
            email: data.member.email,
            tutorialState: data.member.tutorialState || {
              dismissedTooltips: [],
            },
          })
        );
        return { result: true };
      } else {
        return { result: false, error: data.error };
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      return { result: false, error: "Erreur réseau" };
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
    tutorialState: {
      dismissedTooltips: [],
    },
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
        tutorialState: action.payload.tutorialState || {
          dismissedTooltips: [],
        },
      };
    },
    logout: (state) => {
      state.value = {
        token: null,
        firstName: null,
        lastName: null,
        email: null,
        isLogged: false,
        tutorialState: {
          dismissedTooltips: [],
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(dismissTutorialAsync.fulfilled, (state, action) => {
      if (action.payload) {
        state.value.tutorialState = action.payload;
      }
    });
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
