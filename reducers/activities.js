import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

// Fetch toutes les activités

export const fetchActivitiesAsync = createAsyncThunk(
  "activities/fetchActivitiesAsync",
  async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/activities`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Fetch activities response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du fetch");
      }

      return data.activities;
    } catch (error) {
      console.error("Erreur réseau:", error);
      throw error;
    }
  }
);

// Créer une nouvelle activité
export const createActivityAsync = createAsyncThunk(
  "activities/createActivityAsync",
  async (payload, { dispatch }) => {
    const {
      name,
      place,
      dateBegin,
      dateEnd,
      reminder,
      task,
      note,
      recurrence,
      token,
    } = payload;
    try {
      const response = await fetch(`${BACKEND_URL}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          place,
          dateBegin,
          dateEnd,
          reminder,
          task,
          note,
          recurrence,
        }),
      });

      const data = await response.json();
      console.log("Create activity response:", data.activity);
      if (data.activity) {
        dispatch(
          login({
            name: data.name,
            place: data.place,
            dateBegin: data.dateBegin,
            dateEnd: data.dateEnd,
            reminder: data.reminder,
            task: data.task,
            note: data.note,
            recurrence: data.recurrence,
          })
        );
      } else {
        console.warn("Erreur signin :", data);
      }

      return data.activity;
    } catch (error) {
      console.error("Erreur réseau :", error);
      throw error;
    }
  }
);

// Mettre à jour une activité
export const updateActivityAsync = createAsyncThunk(
  "activities/updateActivityAsync",
  async ({ token, activityId, activityData }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/activities/${activityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityData),
      });
      const data = await response.json();
      console.log("Update activity response:", data);
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }
      return data.activity;
    } catch (error) {
      console.error("Erreur réseau:", error);
      throw error;
    }
  }
);
// Supprimer une activité
export const deleteActivityAsync = createAsyncThunk(
  "activities/deleteActivityAsync",
  async ({ token, activityId }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/activities/${activityId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Delete activity response:", data);
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la suppression");
      }
      return activityId;
    } catch (error) {
      console.error("Erreur réseau:", error);
      throw error;
    }
  }
);

const initialState = {
  value: [],
  loading: false,
  error: null,
};

export const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    setActivities: (state, action) => {
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
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchActivitiesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivitiesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(fetchActivitiesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createActivityAsync.fulfilled, (state, action) => {
        state.value.push(action.payload);
      })
      // Update
      .addCase(updateActivityAsync.fulfilled, (state, action) => {
        const index = state.value.findIndex(
          (act) => act._id === action.payload._id
        );
        if (index !== -1) {
          state.value[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteActivityAsync.fulfilled, (state, action) => {
        state.value = state.value.filter((act) => act._id !== action.payload);
      });
  },
});

export const { setActivities, addActivity, updateActivity, removeActivity } =
  activitiesSlice.actions;
export default activitiesSlice.reducer;
