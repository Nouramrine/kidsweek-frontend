import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

// fetch des notifications

export const fetchNotificationsAsync = createAsyncThunk(
  "notifications/fetchNotificationsAsync",
  async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/activities/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur serveur");

      return {
        invitations: data.invitations || [],
        reminders: data.reminders || [],
      };
    } catch (err) {
      console.error("Erreur de fetch notifications", err);
      throw err;
    }
  }
);

// Accepter ou refuser invitation

export const respondToInvitationAsync = createAsyncThunk(
  "notifications/respondToInvitationAsync",
  async ({ token, activityId, validate }) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/activities/${activityId}/validate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ validate }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur serveur");
      return { activityId, validate };
    } catch (err) {
      console.error("Erreur réponse invitation:", err);
      throw err;
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    invitations: [],
    reminders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.invitations = [];
      state.reminders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.invitations = action.payload.invitations;
        state.reminders = action.payload.reminders;
      })
      .addCase(fetchNotificationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(respondToInvitationAsync.fulfilled, (state, action) => {
        const { activityID } = action.payload;
        state.invitations = state.invitations.filter(
          (inv) => inv._id !== activityID
        );
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
