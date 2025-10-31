import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const token = useSelector(state => state.auth.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children ? children : <Outlet />
}
