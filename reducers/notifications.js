import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Récupère les notifications (invitations et rappels) depuis le backend
 */
export const fetchNotificationsAsync = createAsyncThunk(
  "notifications/fetchNotificationsAsync",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/activities/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Erreur serveur");
      }

      return {
        invitations: data.invitations || [],
        reminders: data.reminders || [],
      };
    } catch (err) {
      return rejectWithValue(err.message || "Erreur réseau");
    }
  },
);

/**
 * Répond à une invitation d'activité (accepter ou refuser)
 */
export const respondToInvitationAsync = createAsyncThunk(
  "notifications/respondToInvitationAsync",
  async ({ token, activityId, validate }, { rejectWithValue }) => {
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Erreur serveur");
      }

      return { activityId, validate };
    } catch (err) {
      return rejectWithValue(err.message || "Erreur réseau");
    }
  },
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
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotificationsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.invitations = action.payload.invitations;
        state.reminders = action.payload.reminders;
        state.error = null;
      })
      .addCase(fetchNotificationsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Répondre à une invitation
      .addCase(respondToInvitationAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToInvitationAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { activityId } = action.payload;
        // Retirer l'invitation de la liste
        state.invitations = state.invitations.filter(
          (inv) => inv.activityId?._id !== activityId,
        );
        state.error = null;
      })
      .addCase(respondToInvitationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearNotifications, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
