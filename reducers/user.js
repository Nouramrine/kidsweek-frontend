import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

// 🔹 Charger le tutorialStep depuis AsyncStorage
export const loadTutorialStepAsync = createAsyncThunk(
  "user/loadTutorialStepAsync",
  async (email) => {
    try {
      const storedStep = await AsyncStorage.getItem(`tutorialStep_${email}`);
      return storedStep ? parseInt(storedStep) : 0;
    } catch (error) {
      console.error("Erreur chargement tutorialStep:", error);
      return 0;
    }
  }
);

// 🔹 Sauvegarder le tutorialStep dans AsyncStorage
export const saveTutorialStepAsync = createAsyncThunk(
  "user/saveTutorialStepAsync",
  async ({ email, step }) => {
    try {
      await AsyncStorage.setItem(`tutorialStep_${email}`, step.toString());
      return step;
    } catch (error) {
      console.error("Erreur sauvegarde tutorialStep:", error);
      return step;
    }
  }
);

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
        // Charger le tutorialStep depuis AsyncStorage
        const tutorialStep = await dispatch(
          loadTutorialStepAsync(email)
        ).unwrap();

        dispatch(
          login({
            token: data.member.token,
            firstName: data.member.firstName,
            lastName: data.member.lastName,
            email: data.member.email,
            tutorialStep,
          })
        );
        return { result: true };
      } else {
        return { result: false, error: data.error };
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  }
);

export const signUpAsync = createAsyncThunk(
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
        // Nouveau compte = tutorialStep à 0
        dispatch(
          login({
            token: data.member.token,
            firstName: data.member.firstName,
            lastName: data.member.lastName,
            email: data.member.email,
            tutorialStep: 0,
          })
        );
        return { result: true };
      } else {
        return { result: false, error: data.error };
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
    tutorialStep: 0,
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
        tutorialStep: action.payload.tutorialStep || 0,
      };
    },
    logout: (state) => {
      state.value = {
        token: null,
        firstName: null,
        lastName: null,
        email: null,
        isLogged: false,
        tutorialStep: 0,
      };
    },
    advanceTutorial: (state) => {
      state.value.tutorialStep += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTutorialStepAsync.fulfilled, (state, action) => {
        state.value.tutorialStep = action.payload;
      })
      .addCase(saveTutorialStepAsync.fulfilled, (state, action) => {
        state.value.tutorialStep = action.payload;
      });
  },
});

export const { login, logout, advanceTutorial } = userSlice.actions;
export default userSlice.reducer;
