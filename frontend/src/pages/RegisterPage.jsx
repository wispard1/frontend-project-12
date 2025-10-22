import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container, Card, Alert } from 'react-bootstrap';
import signupAvatar from '../assets/signup-avatar.jpg';
import { useSignupMutation } from '../api/chatApi';
import { setCredentials } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const SignupSchema = yup.object().shape({
  username: yup
    .string()
    .required('registerPage.errors.usernameRequired')
    .min(3, 'registerPage.errors.usernameMin')
    .max(20, 'registerPage.errors.usernameMax'),
  password: yup.string().required('registerPage.errors.passwordRequired').min(6, 'registerPage.errors.passwordMin'),
  passwordConfirmation: yup
    .string()
    .required('registerPage.errors.passwordRequired')
    .oneOf([yup.ref('password')], 'registerPage.errors.passwordMismatch'),
});

export const RegisterPage = () => {
  const [signup, { isLoading, error }] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await signup({ username: values.username, password: values.password }).unwrap();
      localStorage.setItem('token', response.token);
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
              <img src={signupAvatar} className='rounded-circle img-fluid' alt={t('registerPage.title')} />
            </div>
            <Formik
              initialValues={{ username: '', password: '', passwordConfirmation: '' }}
              validationSchema={SignupSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className='col-12 col-md-6 mt-3 mt-md-0'>
                  <h2 className='text-center mb-4'>{t('registerPage.title')}</h2>
                  {error && (
                    <Alert variant='danger'>
                      {error.status === 409
                        ? t('registerPage.errors.userExists')
                        : t('registerPage.errors.registrationFailed')}
                    </Alert>
                  )}

                  <div className='form-floating mb-3'>
                    <Field
                      name='username'
                      type='text'
                      className='form-control'
                      id='username'
                      placeholder={t('registerPage.usernamePlaceholder')}
                    />
                    <label htmlFor='username'>{t('registerPage.usernameLabel')}</label>
                    <ErrorMessage name='username' component='div' className='text-danger small' />
                  </div>

                  <div className='form-floating mb-3'>
                    <Field
                      name='password'
                      type='password'
                      className='form-control'
                      id='password'
                      placeholder={t('registerPage.passwordPlaceholder')}
                    />
                    <label htmlFor='password'>{t('registerPage.passwordLabel')}</label>
                    <ErrorMessage name='password' component='div' className='text-danger small' />
                  </div>

                  <div className='form-floating mb-4'>
                    <Field
                      name='passwordConfirmation'
                      type='password'
                      className='form-control'
                      id='passwordConfirmation'
                      placeholder={t('registerPage.passwordConfirmPlaceholder')}
                    />
                    <label htmlFor='passwordConfirmation'>{t('registerPage.passwordConfirmLabel')}</label>
                    <ErrorMessage name='passwordConfirmation' component='div' className='text-danger small' />
                  </div>

                  <Button
                    type='submit'
                    variant='outline-primary'
                    className='w-100'
                    disabled={isSubmitting || isLoading}
                    aria-label={t('registerPage.registerButton')}
                    data-testid='register-button'
                  >
                    <span className='visually-hidden'>{t('registerPage.registerButton')}</span>
                    {isLoading ? t('registerPage.registerButtonSubmitting') : 'Готово'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
          <Card.Footer className='p-4 text-center'>
            <span>{t('registerPage.hasAccount')} </span>
            <Link to='/login'>{t('registerPage.loginLink')}</Link>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  );
};