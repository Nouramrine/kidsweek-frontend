import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

// 🔹 Fetch tous les membres
export const fetchMembersAsync = createAsyncThunk(
  "members/fetchMembersAsync",
  async (_, { getState }) => {
    const token = getState().user.value.token;
    const res = await fetch(`${BACKEND_URL}/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!data.result) throw console.log("Members reducer fetch :", data.error);
    return data.members;
  }
);

// 🔹 Créer un membre
export const createMemberAsync = createAsyncThunk(
  "members/createMemberAsync",
  async (memberData, { getState }) => {
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
    if (!data.result) throw console.log("Members reducer create :", data.error);
    return data.member;
  }
);

// 🔹 Mettre à jour un membre
export const updateMemberAsync = createAsyncThunk(
  "members/updateMemberAsync",
  async (memberData, { getState }) => {
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
    if (!data.result) throw console.log("Members reducer update :", data.error);
    return data.member;
  }
);

// 🔹 Supprimer un membre
export const deleteMemberAsync = createAsyncThunk(
  "members/deleteMemberAsync",
  async (memberId, { getState }) => {
    const token = getState().user.value.token;
    const res = await fetch(`${BACKEND_URL}/members/${memberId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!data.result) throw console.log("Members reducer delete :", data.error);
    return memberId; // 🔹 retourne l’ID supprimé
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value = action.payload;
      })
      .addCase(fetchMembersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createMemberAsync.fulfilled, (state, action) => {
        state.value.push(action.payload);
      })
      .addCase(updateMemberAsync.fulfilled, (state, action) => {
        const idx = state.value.findIndex((m) => m._id === action.payload._id);
        if (idx !== -1) state.value[idx] = action.payload;
      })
      .addCase(deleteMemberAsync.fulfilled, (state, action) => {
        state.value = state.value.filter((m) => m._id !== action.payload);
      });
  },
});

export const { setMembers } = membersSlice.actions;
export default membersSlice.reducer;
