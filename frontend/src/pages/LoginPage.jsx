// src/pages/LoginPage.jsx
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useLoginMutation } from '../api/chatApi';
import { setCredentials } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Button, Container, Row, Col, Card } from 'react-bootstrap';
import avatar from '../assets/form-avatar.jpg';

const loginSchema = yup.object().shape({
  username: yup.string().required('Обязательное поле'),
  password: yup.string().required('Обязательное поле'),
});

export const LoginPage = () => {
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await login({ username: values.username, password: values.password }).unwrap();
      dispatch(setCredentials({ token: response.token, user: { username: response.username } }));
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 bg-light'>
      <Container className='col-12 col-md-8 col-xxl-6'>
        <Card className='shadow-sm login-form'>
          <Card.Body className='row p-5'>
            {/* --- Левая колонка с изображением --- */}
            <div className='col-12 col-md-6 d-flex align-items-center justify-content-center'>
              <img src={avatar} className='rounded-circle img-fluid' alt='Войти' />
            </div>
            {/* --- Правая колонка с формой --- */}
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className='col-12 col-md-6 mt-3 mt-md-0'>
                  <h2 className='text-center mb-4'>Войти</h2>
                  {error && (
                    <Alert variant='danger'>
                      {error.status === 401 ? 'Неверный логин или пароль' : 'Ошибка входа'}
                    </Alert>
                  )}

                  <div className='form-floating mb-3'>
                    <Field name='username' type='text' className='form-control' id='username' placeholder='Ваш ник' />
                    <label htmlFor='username'>Ваш ник</label>
                    <ErrorMessage name='username' component='div' className='text-danger small' />
                  </div>

                  <div className='form-floating mb-4'>
                    <Field
                      name='password'
                      type='password'
                      className='form-control'
                      id='password'
                      placeholder='Пароль'
                    />
                    <label htmlFor='password'>Пароль</label>
                    <ErrorMessage name='password' component='div' className='text-danger small' />
                  </div>

                  {/* --- Кнопка отправки --- */}
                  <Button
                    type='submit'
                    variant='outline-primary'
                    className='w-100'
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? 'Вход...' : 'Войти'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
          {/* --- Footer с ссылкой на регистрацию --- */}
          <Card.Footer className='p-4 text-center'>
            <span>Нет аккаунта? </span>
            <Link to='/signup'>Регистрация</Link>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};
