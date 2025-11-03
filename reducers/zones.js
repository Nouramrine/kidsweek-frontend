import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

// 🔹 Fetch toutes les zones
export const fetchZonesAsync = createAsyncThunk(
  "zones/fetchZonesAsync",
  async (_, { getState }) => {
    const token = getState().user.value.token;
    const res = await fetch(`${BACKEND_URL}/zones`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!data.result) throw console.log("Zones reducer fetch :", data.error);
    return data.zones || [];
  }
);

// 🔹 Créer une zone
export const createZoneAsync = createAsyncThunk(
  "zones/createZoneAsync",
  async (zoneData, { getState }) => {
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
    if (!res.ok) throw console.log("Zones reducer create :", data.error);
    return data.zones[0];
  }
);

// 🔹 Mettre à jour une zone
export const updateZoneAsync = createAsyncThunk(
  "zones/updateZoneAsync",
  async (zoneData, { getState }) => {
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
    if (!data.result) throw console.log("Zones reducer update :", data.error);
    return data.zones[0];
  }
);

// 🔹 Supprimer une zone
export const deleteZoneAsync = createAsyncThunk(
  "zones/deleteZoneAsync",
  async (zoneId, { getState }) => {
    const token = getState().user.value.token;
    const res = await fetch(`${BACKEND_URL}/zones/${zoneId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!data.result) throw console.log("Zones reducer delete :", data.error);
    return zoneId; // 🔹 retourne l’ID supprimé
  }
);

// 🔹 Ajouter un membre
export const addMemberToZoneAsync = createAsyncThunk(
  "zones/addMemberToZoneAsync",
  async ({ zoneId, memberId }, { getState }) => {
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
    if (!data.result)
      throw console.log("Zones reducer add member :", data.error);
    return data.zones[0];
  }
);

// 🔹 Retirer un membre
export const removeMemberFromZoneAsync = createAsyncThunk(
  "zones/removeMemberFromZoneAsync",
  async ({ zoneId, memberId }, { getState }) => {
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
    if (!data.result)
      throw console.log("Zones reducer remove member :", data.error);
    return data.zones[0];
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
        const idx = state.value.findIndex((z) => z._id === action.payload._id);
        if (idx !== -1) state.value[idx] = action.payload;
      })
      // Delete
      .addCase(deleteZoneAsync.fulfilled, (state, action) => {
        state.value = state.value.filter((z) => z._id !== action.payload);
      })
      // Add member
      .addCase(addMemberToZoneAsync.fulfilled, (state, action) => {
        const idx = state.value.findIndex((z) => z._id === action.payload._id);
        if (idx !== -1) state.value[idx] = action.payload;
      })
      // Remove member
      .addCase(removeMemberFromZoneAsync.fulfilled, (state, action) => {
        const idx = state.value.findIndex((z) => z._id === action.payload._id);
        if (idx !== -1) state.value[idx] = action.payload;
      });
  },
});

export const { setZones } = zonesSlice.actions;
export default zonesSlice.reducer;
