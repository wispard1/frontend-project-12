import { createSlice } from '@reduxjs/toolkit'

const getInitialUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const initialState = {
  token: localStorage.getItem('token'),
  user: getInitialUser(),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload
      state.token = token
      state.user = user
      if (token && user) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        console.log('✅ Credentials saved to localStorage:', { username: user.username })
      }
    },
    logout: state => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      console.log('✅ Logout completed')
    },
  },
})

export const { logout, setCredentials } = authSlice.actions
export default authSlice.reducer
