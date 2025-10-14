import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk('auth/login', async (credential, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/v1/login', credential);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        return rejectWithValue('Неверный логин или пароль');
      }
      const message = error.response.data.message || 'Ошибка аутентификации';
      return rejectWithValue(message);
    }
    return rejectWithValue('Не удалось подключиться к серверу');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      (state.token = null), localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
