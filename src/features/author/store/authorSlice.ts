import { createSlice } from "@reduxjs/toolkit";
import { AuthorProfile } from "../types";
const authorSlice = createSlice({
  name: "author",
  initialState: {} as AuthorProfile,
  reducers: {
    setAuthor: (state, action) => {
      return action.payload;
    },
    resetAuthor: () => {
      return {} as AuthorProfile;
    },
  },
});

export const { setAuthor, resetAuthor } = authorSlice.actions;
export const authorReducer = authorSlice.reducer;
