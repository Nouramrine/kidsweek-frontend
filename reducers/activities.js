import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  value: [],
};

export const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    setAvtivities: (state, action) => {
      state.value = action.payload;
    },
    addActivity: (state, action) => {
      state.value.push(action.payload);
    },
    updateActivity: (state, action) => {
      const index = state.value.findIndex(
        (act) => act._id === action.payload._id
      );
      if (index !== -1) {
        state.value[index] = action.payload;
      }
    },
    removeActivity: (state, action) => {
      state.value = state.value.filter((act) => act._id !== action.payload);
    },
  },
});

export const { setAvtivities, addActivity, updateActivity, removeActivity } =
  activitiesSlice.actions;
export default activitiesSlice.reducer;
