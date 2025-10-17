import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      if (token) {
        localStorage.setItem('token', token); // <-- Убедитесь, что это есть
        console.log('Токен записан в localStorage из authSlice:', token); // <-- Лог
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
