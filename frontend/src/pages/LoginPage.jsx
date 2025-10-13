import { useFormik } from 'formik';
import avatar from '../assets/form-avatar.jpg';
import { Navbar } from '../components/Navbar';
import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setError(null);
      try {
        await dispatch(login(values)).unwrap();
        console.log('Успешный вход! Редирект на /');
        navigate('/');
      } catch (err) {
        setError(err);
      }
    },
  });

  return (
    <>
      {/* Навигация */}
      <Navbar />
      <div className='d-flex justify-content-center align-items-center h-100 p-3' style={{ paddingTop: '80px' }}>
        <div className='card shadow-sm w-100' style={{ maxWidth: '1100px' }}>
          <div className='card-body row p-5'>
            {/* левая часть */}
            <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
              <img src={avatar} className='rounded-circle img-fluid' alt='Войти' />
            </div>
            {/* правая часть */}
            <form onSubmit={formik.handleSubmit} className='col-12 col-md-6 mt-3 mt-md-0'>
              <h2 className='text-center mb-4'>Войти</h2>

              {error && (
                <div className='alert alert-danger' role='alert'>
                  {error}
                </div>
              )}

              <div className='form-floating mb-3'>
                <input
                  name='username'
                  id='username'
                  className='form-control'
                  placeholder='Ваш ник'
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
                <label htmlFor='username'>Ваш ник</label>
              </div>
              <div className='form-floating mb-4'>
                <input
                  type='password'
                  name='password'
                  id='password'
                  className='form-control'
                  placeholder='Пароль'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <label htmlFor='password'>Пароль</label>
              </div>
              <button type='submit' className='w-100 btn btn-outline-primary'>
                Войти
              </button>
            </form>
          </div>
          <div className='card-footer p-4 text-center'>
            <span>Нет аккаунта?</span> <a href='/signup'>Регистрация</a>
          </div>
        </div>
      </div>
    </>
  );
};
