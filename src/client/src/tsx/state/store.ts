import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import slicePeople from "./slices/tasksSlice";

export const store = configureStore({
	reducer: {
		tasksAndPeople: slicePeople,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
