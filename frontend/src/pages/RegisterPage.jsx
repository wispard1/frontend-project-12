// src/pages/RegisterPage.jsx
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import signupAvatar from '../assets/signup-avatar.jpg';
import { useSignupMutation } from '../api/chatApi';
import { setCredentials } from '../store/authSlice';
import { useDispatch } from 'react-redux';

const SignupSchema = yup.object().shape({
  username: yup.string().required('Обязательное поле').min(3, 'Не менее 3 символов').max(20, 'Не более 20 символов'),
  password: yup.string().required('Обязательное поле').min(6, 'Не менее 6 символов'),
  passwordConfirmation: yup
    .string()
    .required('Обязательное поле')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
});

export const RegisterPage = () => {
  const [signup, { isLoading, error }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await signup({ username: values.username, password: values.password }).unwrap();
      dispatch(setCredentials({ token: response.token, user: { username: response.username } }));
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 bg-light'>
      <Container className='col-12 col-md-8 col-xxl-6'>
        <Card className='shadow-sm login-form'>
          <Card.Body className='row p-5'>
            <div className='col-12 col-md-6 d-flex align-items-center justify-content-center px-2'>
              <img src={signupAvatar} className='rounded-circle img-fluid' alt='Регистрация' />
            </div>
            <Formik
              initialValues={{ username: '', password: '', passwordConfirmation: '' }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className='col-12 col-md-6 mt-3 mt-md-0'>
                  <h2 className='text-center mb-4'>Регистрация</h2>
                  {error && (
                    <Alert variant='danger'>
                      {error.status === 409 ? 'Пользователь уже существует' : 'Ошибка регистрации'}
                    </Alert>
                  )}

                  <div className='form-floating mb-3'>
                    <Field
                      name='username'
                      type='text'
                      className='form-control'
                      id='username'
                      placeholder='Введите имя пользователя'
                    />
                    <label htmlFor='username'>Имя пользователя</label>
                    <ErrorMessage name='username' component='div' className='text-danger small' />
                  </div>

                  <div className='form-floating mb-3'>
                    <Field
                      name='password'
                      type='password'
                      className='form-control'
                      id='password'
                      placeholder='Введите пароль'
                    />
                    <label htmlFor='password'>Пароль</label>
                    <ErrorMessage name='password' component='div' className='text-danger small' />
                  </div>

                  <div className='form-floating mb-4'>
                    <Field
                      name='passwordConfirmation'
                      type='password'
                      className='form-control'
                      id='passwordConfirmation'
                      placeholder='Подтвердите пароль'
                    />
                    <label htmlFor='passwordConfirmation'>Подтвердите пароль</label>
                    <ErrorMessage name='passwordConfirmation' component='div' className='text-danger small' />
                  </div>

                  <Button
                    type='submit'
                    variant='outline-primary'
                    className='w-100'
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
          <Card.Footer className='p-4 text-center'>
            <span>Есть аккаунт? </span>
            <Link to='/login'>Войти</Link>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};
