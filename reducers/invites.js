import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export const sendInviteAsync = createAsyncThunk(
  "Invites/sendInviteAsync",
  async ({ invite, url }, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/invites/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ invite, url }),
    });
    const data = await response.json();
    if (!data.result)
      throw new Error(data.error || "Erreur lors de l'envoi de l'invitation");
    return data.result;
  },
);

// Fetch toutes les Invites du membre connecté

export const fetchInvitesAsync = createAsyncThunk(
  "Invites/fetchInivtesAsync",
  async (_, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/invites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log("retour back: ", data);
    if (!data.result)
      throw new Error(data.error || "Erreur lors du fetch des invitations");
    return data.invites || [];
  },
);

// Créer une nouvelle Invite

export const createInviteAsync = createAsyncThunk(
  "Invites/createInviteAsync",
  async (InviteData, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(InviteData),
    });
    const data = await response.json();
    if (!data.result)
      throw new Error(
        data.error || "Erreur lors de la création de l'invitation",
      );
    return data.invites || [];
  },
);

//Mettre à jour une Invite

export const updateInviteAsync = createAsyncThunk(
  "Invites/updateInviteAsync",
  async (inviteData, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/invites/${inviteData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: inviteData.name, color: inviteData.color }),
    });
    const data = await response.json();
    if (!data.result)
      throw new Error(
        data.error || "Erreur lors de la mise à jour de l'invitation",
      );
    return data.invites[0] || [];
  },
);

//Supprimer une Invite

export const deleteInviteAsync = createAsyncThunk(
  "Invites/deleteInviteAsync",
  async (InviteId, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/invites/${InviteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!data.result)
      throw new Error(
        data.error || "Erreur lors de la suppression de l'invitation",
      );
    return data.invites[0] || "";
  },
);

// Slice

const initialState = {
  value: [],
  loading: false,
  error: null,
};

export const InvitesSlice = createSlice({
  name: "Invites",
  initialState,
  reducers: {
    setInvites: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchInvitesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvitesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(fetchInvitesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createInviteAsync.fulfilled, (state, action) => {
        state.value.push(action.payload);
      })
      // Update
      .addCase(updateInviteAsync.fulfilled, (state, action) => {
        const index = state.value.findIndex(
          (invite) => invite._id === action.payload._id,
        );
        if (index !== -1) {
          state.value[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteInviteAsync.fulfilled, (state, action) => {
        state.value = state.value.filter(
          (invite) => invite._id !== action.payload._id,
        );
      });
  },
});

export const { setInvites } = InvitesSlice.actions;

export default InvitesSlice.reducer;
