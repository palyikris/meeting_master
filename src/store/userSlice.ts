import { UserProfile } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserProfile = {
  id: "",
  email: "",
  role: "user",
  company_id: undefined
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      return action.payload;
    },
    clearUser: () => {
      return initialState;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
