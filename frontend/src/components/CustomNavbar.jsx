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
      {/* Используем стандартный Container без fluid, чтобы он имел max-width (как 1140px в демо) */}
      {/* Container из Bootstrap по умолчанию имеет d-flex, align-items-center и padding */}
      {/* Добавляем w-100, чтобы Container растягивался на всю ширину Navbar */}
      <Container className='d-flex justify-content-between align-items-center w-100'>
        <Navbar.Brand href='/'>Hexlet Chat</Navbar.Brand>
        {/* Toggle и Collapse остаются вне основного выравнивания Container */}
        {/* Они будут управляться стандартной логикой Bootstrap для Navbar */}
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          {token && (
            <Button className='btn btn-primary' onClick={handleLogout}>
              {' '}
              {/* size="sm" для соответствия размеру в демо */}
              Выйти
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
    // <nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white'>
    //   <div className='container-fluid d-flex justify-content-between align-items-center'>
    //     <a className='navbar-brand ms-4' href='/'>
    //       {' '}
    //       Hexlet Chat
    //     </a>
    //     <button onClick={handleLogout} type='button' className='btn btn-primary me-4'>
    //       {' '}
    //       Выйти
    //     </button>
    //   </div>
    // </nav>
  );
};
