import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

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

      // console.log("📬 Notifications reçues:", {
      //   invitations: data.invitations?.length || 0,
      //   reminders: data.reminders?.length || 0,
      // });

      if (!response.ok) throw new Error(data.message || "Erreur serveur");

      return {
        invitations: data.invitations || [],
        reminders: data.reminders || [],
      };
    } catch (err) {
      // console.error("❌ Erreur de fetch notifications:", err);
      throw err;
    }
  }
);

export const respondToInvitationAsync = createAsyncThunk(
  "notifications/respondToInvitationAsync",
  async ({ token, activityId, validate }) => {
    try {
      // console.log("📤 Réponse à l'invitation:", { activityId, validate });

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

      if (!response.ok) {
        throw new Error(data.message || "Erreur serveur");
      }

      // console.log("✅ Réponse enregistrée:", data);

      return { activityId, validate };
    } catch (err) {
      console.error("❌ Erreur réponse invitation:", err);
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
      .addCase(respondToInvitationAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(respondToInvitationAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { activityId } = action.payload;

        // ✅ Filtrer par activityId._id dans les invitations
        state.invitations = state.invitations.filter(
          (inv) => inv.activityId?._id !== activityId
        );

        // console.log(
        //   "✅ Invitation supprimée du state, reste:",
        //   state.invitations.length
        // );
      })
      .addCase(respondToInvitationAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
