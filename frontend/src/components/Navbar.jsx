import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className='shadow-sm navbar navbar-expand-lg navbar-light bg-white fixed-top'>
      <div className='container d-flex justify-content-between align-items-center'>
        <a className='navbar-brand' href='/'>
          Hexlet Chat
        </a>
        <button onClick={handleLogout} type='button' className='btn btn-primary'>
          Выйти
        </button>
      </div>
    </nav>
  );
};
