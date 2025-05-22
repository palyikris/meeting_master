import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id: string;
  email: string;
  role: "admin" | "company_admin";
  company_id?: string;
}

const initialState: UserState | null = null;

// ✅ Explicitly declare state type here
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<UserState>) => action.payload,
    clearUser: () => null
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
