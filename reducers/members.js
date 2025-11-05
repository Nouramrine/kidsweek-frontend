import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

// Fetch tous les membres
export const fetchMembersAsync = createAsyncThunk(
  "members/fetchMembersAsync",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/members`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (!data.result) {
        return rejectWithValue(data.error || "Erreur lors de la récupération des membres");
      }
      
      return data.members;
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

// Créer un membre
export const createMemberAsync = createAsyncThunk(
  "members/createMemberAsync",
  async (memberData, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberData),
      });
      const data = await res.json();
      
      if (!data.result) {
        return rejectWithValue(data.error || "Erreur lors de la création du membre");
      }
      
      return data.member;
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

// Mettre à jour un membre
export const updateMemberAsync = createAsyncThunk(
  "members/updateMemberAsync",
  async (memberData, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/members/${memberData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberData),
      });
      const data = await res.json();
      
      if (!data.result) {
        return rejectWithValue(data.error || "Erreur lors de la mise à jour du membre");
      }
      
      return data.member;
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

// Supprimer un membre
export const deleteMemberAsync = createAsyncThunk(
  "members/deleteMemberAsync",
  async (memberId, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.value.token;
      const res = await fetch(`${BACKEND_URL}/members/${memberId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (!data.result) {
        return rejectWithValue(data.error || "Erreur lors de la suppression du membre");
      }
      
      return memberId;
    } catch (error) {
      return rejectWithValue(error.message || "Erreur réseau");
    }
  }
);

const initialState = { value: [], loading: false, error: null };

export const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers: (state, action) => {
      state.value = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMembersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
        state.error = null;
      })
      .addCase(fetchMembersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Create
      .addCase(createMemberAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMemberAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value.push(action.payload);
        state.error = null;
      })
      .addCase(createMemberAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Update
      .addCase(updateMemberAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMemberAsync.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.value.findIndex((m) => m._id === action.payload._id);
        if (idx !== -1) state.value[idx] = action.payload;
        state.error = null;
      })
      .addCase(updateMemberAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Delete
      .addCase(deleteMemberAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMemberAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value = state.value.filter((m) => m._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteMemberAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setMembers, clearError } = membersSlice.actions;
export default membersSlice.reducer;