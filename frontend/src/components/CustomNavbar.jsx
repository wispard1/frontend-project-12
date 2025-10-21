import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { Navbar, Button, Container } from 'react-bootstrap';

export const CustomNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar bg='light' expand='lg' className='shadow-sm' fixed='top'>
      <Container className='d-flex justify-content-between align-items-center w-100'>
        <Navbar.Brand href='/'>Hexlet Chat</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          {token && (
            <Button className='btn btn-primary' onClick={handleLogout}>
              {' '}
              Выйти
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
