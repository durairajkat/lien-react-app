import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    active_projects?: any[];
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    active_projects: [],
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string, active_projects?: any[] }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.active_projects = action.payload.active_projects || [];
            localStorage.setItem("token", action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.active_projects = [];
            localStorage.removeItem("token");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
