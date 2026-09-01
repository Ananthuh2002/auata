import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employeeId:
    typeof window !== "undefined"
      ? localStorage.getItem("currentEmployee") || ""
      : "",
  role:
    typeof window !== "undefined"
      ? localStorage.getItem("currentRole") || ""
      : "",
  total:
    typeof window !== "undefined"
      ? Number(localStorage.getItem("currentTotal")) || ""
      : "",
  name:
    typeof window !== "undefined"
      ? localStorage.getItem("currentName") || ""
      : "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.employeeId = action.payload.employeeId;
      state.role = action.payload.role;
      state.total = action.payload.total;
      state.name = action.payload.name;

      if (typeof window !== "undefined") {
        localStorage.setItem("currentEmployee", action.payload.employeeId);
        localStorage.setItem("currentRole", action.payload.role);
        localStorage.setItem("currentTotal", action.payload.total);
        localStorage.setItem("currentName", action.payload.name);
      }
    },
    logout: (state) => {
      state.employeeId = "";
      state.role = "";
      state.total = "";
      state.name = "";

      if (typeof window !== "undefined") {
        localStorage.removeItem("currentEmployee");
        localStorage.removeItem("currentRole");
        localStorage.removeItem("currentTotal");
        localStorage.removeItem("currentName");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
