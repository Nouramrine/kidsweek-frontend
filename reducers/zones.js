import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

// Fetch toutes les zones du membre connecté

export const fetchZonesAsync = createAsyncThunk(
  "zones/fetchZonesAsync",
  async (_, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/zones`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Erreur lors du fetch des zones");
    return data.zones;
  }
);

// Créer une nouvelle zone
// Envoi attendu : name, members[]

export const createZoneAsync = createAsyncThunk(
  "zones/createZoneAsync",
  async (zoneData, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/zones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(zoneData), 
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Erreur lors de la création de la zone");
    return data.zone || [];
  }
);

//Mettre à jour une zone

export const updateZoneAsync = createAsyncThunk(
  "zones/updateZoneAsync",
  async (zoneData, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/zones`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(zoneData),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.message || "Erreur lors de la mise à jour de la zone"
      );
    return data.zone || [];
  }
);

//Supprimer une zone

export const deleteZoneAsync = createAsyncThunk(
  "zones/deleteZoneAsync",
  async ({ token, zoneId }) => {
    const response = await fetch(`${BACKEND_URL}/zones/${zoneId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.message || "Erreur lors de la suppression de la zone"
      );
    return zoneId || '';
  }
);

//Ajouter un memebre à une zone

export const addMemberToZoneAsync = createAsyncThunk(
  "zones/addMemberToZoneAsync",
  async ({ token, zoneId, memberId }) => {
    const response = await fetch(`${BACKEND_URL}/zones/${zoneId}/add-member`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ memberId }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.message || "Erreur lors de l'ajout du membre à la zone"
      );
    return data.zone;
  }
);

//Retirer un membre d'une zone

export const removeMemberFromZoneAsync = createAsyncThunk(
  "zones/removeMemberFromZoneAsync",
  async ({ token, zoneId, memberId }) => {
    const response = await fetch(
      `${BACKEND_URL}/zones/${zoneId}/remove-member`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memberId }),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.message || "Erreur lors du retrait du membre de la zone"
      );
    return data.zone;
  }
);

// Slice

const initialState = {
  value: [],
  loading: false,
  error: null,
};

export const zonesSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    setZones: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchZonesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchZonesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(fetchZonesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(createZoneAsync.fulfilled, (state, action) => {
        state.value.push(action.payload);
      })
      // Update
      .addCase(updateZoneAsync.fulfilled, (state, action) => {
        const index = state.value.findIndex(
          (zone) => zone._id === action.payload._id
        );
        if (index !== -1) {
          state.value[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteZoneAsync.fulfilled, (state, action) => {
        state.value = state.value.filter((zone) => zone._id !== action.payload);
      })
      // Add Member
      .addCase(addMemberToZoneAsync.fulfilled, (state, action) => {
        const index = state.value.findIndex(
          (zone) => zone._id === action.payload._id
        );
        if (index !== -1) {
          state.value[index] = action.payload;
        }
      })
      // Remove Member
      .addCase(removeMemberFromZoneAsync.fulfilled, (state, action) => {
        const index = state.value.findIndex(
          (zone) => zone._id === action.payload._id
        );
        if (index !== -1) {
          state.value[index] = action.payload;
        }
      });
  },
});

export const { setZones } = zonesSlice.actions;

export default zonesSlice.reducer;
