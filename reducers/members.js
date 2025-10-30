import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

// Fetch tous les membres
export const fetchMembersAsync = createAsyncThunk(
  "members/fetchMembersAsync",
  async (_, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/members`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!data.result)
      console.log( "Create member : ", data.error || "Erreur lors du fetch des membres");
    return data.members;
  }
);

// Créer un membre
export const createMemberAsync = createAsyncThunk(
  "members/createMemberAsync",
  async (memberData, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    });
    const data = await response.json();
    if (!data.result)
      console.log( "Create member : ", data.error || "Erreur lors de la création du membre");
    return data.member;
  }
);

// Mettre à jour un membre
export const updateMemberAsync = createAsyncThunk(
  "members/updateMemberAsync",
  async (memberData, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/members/${memberData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    });
    const data = await response.json();
    if (!data.result)
      console.log( "Update member : ", data.message || "Erreur lors de la mise à jour du membre");
    return data.member || [];
  }
);

// Supprimer un membre
export const deleteMemberAsync = createAsyncThunk(
  "members/deleteMemberAsync",
  async (memberId, { getState }) => {
    const token = getState().user.value.token;
    const response = await fetch(`${BACKEND_URL}/members/${memberId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!data.result)
      console.log( "Delete member : ", data.error || "Erreur lors de la suppression du membre");
    return data.member || '';
  }
);

// Slice
const initialState = {
  value: [],
  loading: false,
  error: null,
};

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
      // Fetch
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
      // Create
      .addCase(createMemberAsync.fulfilled, (state, action) => {
        state.value.push(action.payload);
      })
      // Update
      .addCase(updateMemberAsync.fulfilled, (state, action) => {
        const index = state.value.findIndex(
          (member) => member._id === action.payload._id
        );
        if (index !== -1) {
          state.value[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteMemberAsync.fulfilled, (state, action) => {
        state.value = state.value.filter(
          (member) => member._id !== action.payload._id
        );
      });
  },
});

export const { setMembers } = membersSlice.actions;

export default membersSlice.reducer;
