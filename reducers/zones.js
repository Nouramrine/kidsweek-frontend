import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

// Fetch toutes les zones
export const fetchZonesAsync = createAsyncThunk(
  "zones/fetchZonesAsync",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/zones`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (!res.ok) {
        return rejectWithValue(data.error || "Erreur lors de la récupération des zones");
      }
      
      return data.zones || [];
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

// Créer une zone
export const createZoneAsync = createAsyncThunk(
  "zones/createZoneAsync",
  async (zoneData, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/zones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(zoneData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        return rejectWithValue(data.error || "Erreur lors de la création de la zone");
      }
      
      return data.zones[0];
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

// Mettre à jour une zone
export const updateZoneAsync = createAsyncThunk(
  "zones/updateZoneAsync",
  async (zoneData, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/zones/${zoneData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: zoneData.name, color: zoneData.color }),
      });
      const data = await res.json();
      
      if (!data.result) {
        return rejectWithValue(data.error || "Erreur lors de la mise à jour de la zone");
      }
      
      return data.zones[0];
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

// Supprimer une zone
export const deleteZoneAsync = createAsyncThunk(
  "zones/deleteZoneAsync",
  async (zoneId, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/zones/${zoneId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (!data.result) {
        return rejectWithValue(data.error || "Erreur lors de la suppression de la zone");
      }
      
      return zoneId;
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

// Ajouter un membre
export const addMemberToZoneAsync = createAsyncThunk(
  "zones/addMemberToZoneAsync",
  async ({ zoneId, memberId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/zones/${zoneId}/add-member`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memberId }),
      });
      const data = await res.json();
      
      if (!data.result) {
        return rejectWithValue(data.error || "Erreur lors de l'ajout du membre");
      }
      
      return data.zones[0];
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

// Retirer un membre
export const removeMemberFromZoneAsync = createAsyncThunk(
  "zones/removeMemberFromZoneAsync",
  async ({ zoneId, memberId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/zones/${zoneId}/remove-member`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memberId }),
      });
      const data = await res.json();
      
      if (!data.result) {
        return rejectWithValue(data.error || "Erreur lors du retrait du membre");
      }
      
      return data.zones[0];
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

const initialState = { value: [], loading: false, error: null };

export const zonesSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {
    setZones: (state, action) => {
      state.value = action.payload;
    },
    clearError: (state) => {
      state.error = null;
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
        state.error = null;
      })
      .addCase(fetchZonesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Create
      .addCase(createZoneAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createZoneAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value.push(action.payload);
        state.error = null;
      })
      .addCase(createZoneAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Update
      .addCase(updateZoneAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateZoneAsync.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.value.findIndex((z) => z._id === action.payload._id);
        if (idx !== -1) state.value[idx] = action.payload;
        state.error = null;
      })
      .addCase(updateZoneAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Delete
      .addCase(deleteZoneAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteZoneAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value = state.value.filter((z) => z._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteZoneAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Add member
      .addCase(addMemberToZoneAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToZoneAsync.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.value.findIndex((z) => z._id === action.payload._id);
        if (idx !== -1) state.value[idx] = action.payload;
        state.error = null;
      })
      .addCase(addMemberToZoneAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Remove member
      .addCase(removeMemberFromZoneAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMemberFromZoneAsync.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.value.findIndex((z) => z._id === action.payload._id);
        if (idx !== -1) state.value[idx] = action.payload;
        state.error = null;
      })
      .addCase(removeMemberFromZoneAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setZones, clearError } = zonesSlice.actions;
export default zonesSlice.reducer;