import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export const PublicRoute = ({ children }) => {
  const token = useSelector(state => state.auth.token)

  if (token) {
    return <Navigate to="/" replace />
  }
  return children
}
