import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../store/authSlice"
import { Navbar, Button, Container } from "react-bootstrap"
import { useTranslation } from "react-i18next"

export const CustomNavbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(state => state.auth.token)
  const { t } = useTranslation()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <Navbar bg="light" className="shadow-sm" fixed="top">
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/">{t("navbar.brand")}</Navbar.Brand>

        {token && (
          <Button variant="primary" onClick={handleLogout}>
            {t("navbar.logoutButton")}
          </Button>
        )}
      </Container>
    </Navbar>
  )
}
