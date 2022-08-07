import { createSlice } from "@reduxjs/toolkit";

interface InitalState {
  value: string;
}
const initialState: InitalState = {
  value: "",
};

const slice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    actions: (state) => {},
  },
});

export const { actions } = slice.actions;
export const sliceReducer = slice.reducer;
