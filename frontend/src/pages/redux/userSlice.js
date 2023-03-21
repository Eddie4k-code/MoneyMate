import { createSlice } from "@reduxjs/toolkit";

//User Slice for Logging in along with the reducers
const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        isFetching: false,
        error: false,
        loggedIn: false,
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
            state.loggedIn = true;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
            state.loggedIn = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure } = userSlice.actions;
export default userSlice.reducer;