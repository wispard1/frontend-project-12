// src/pages/LoginPage.jsx
import { useFormik } from 'formik';
import avatar from '../assets/form-avatar.jpg';
import { Navbar } from '../components/Navbar';
import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Убираем Container, будем использовать container-fluid
import { Form, Button, Card, Alert } from 'react-bootstrap';

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
      <Navbar />
      {/* Заменяем Container на div с классом container-fluid */}
      <div
        className='container-fluid d-flex justify-content-center align-items-center'
        style={{ minHeight: '100vh', paddingTop: '80px' }}
      >
        {/* Добавляем div с классами для ширины, как в примере */}
        <div className='col-12 col-md-8 col-xxl-6'>
          {/* Убираем inline стиль maxWidth */}
          <Card className='shadow-sm' style={{ padding: 0 }}>
            {' '}
            {/* Убираем padding у Card, если он мешает, как выяснили ранее */}
            <Card.Body className='row p-5'>
              {' '}
              {/* Сохраняем p-5 как в примере */}
              <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
                <img
                  src={avatar}
                  className='rounded-circle img-fluid'
                  alt='Войти'
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              </div>
              {/* Добавляем mt-3 mt-md-0 как в примере */}
              <Form onSubmit={formik.handleSubmit} className='col-12 col-md-6 mt-3 mt-md-0'>
                <h1 className='text-center mb-4'>Войти</h1> {/* Изменил h1 на h2 для соответствия примеру */}
                {error && <Alert variant='danger'>{error}</Alert>}
                {/* Используем form-floating как в примере */}
                <div className='form-floating mb-3'>
                  <input
                    name='username'
                    id='username'
                    type='text'
                    className='form-control'
                    placeholder='Ваш ник'
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor='username'>Ваш ник</label>
                </div>
                <div className='form-floating mb-4'>
                  <input
                    name='password'
                    id='password'
                    type='password'
                    className='form-control'
                    placeholder='Пароль'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor='password'>Пароль</label>
                </div>
                <Button type='submit' className='w-100 mb-3'>
                  {' '}
                  {/* Добавил mb-3 и outline-primary как в примере */}
                  Войти
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className='p-4 text-center'>
              {' '}
              {/* Сохраняем стили футера */}
              <span>Нет аккаунта?</span> <a href='/signup'>Регистрация</a>
            </Card.Footer>
          </Card>
        </div>
      </div>
    </>
  );
};
