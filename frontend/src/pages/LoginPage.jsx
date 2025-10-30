import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useLoginMutation } from '../api/chatApi'
import { setCredentials } from '../store/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Alert, Button, Container, Card } from 'react-bootstrap'
import avatar from '../assets/form-avatar.jpg'
import { useTranslation } from 'react-i18next'

export const LoginPage = () => {
  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const loginSchema = yup.object().shape({
    username: yup.string().required(t('loginPage.errors.usernameRequired')),
    password: yup.string().required(t('loginPage.errors.passwordRequired')),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await login({
        username: values.username,
        password: values.password,
      }).unwrap()
      dispatch(setCredentials({ token: response.token, user: { username: response.username } }))
      console.log('User dispatched to setCredentials:', { username: response.username })
      navigate('/')
    }
    catch (err) {
      console.error('Login failed:', err)
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Container className="col-12 col-md-8 col-xxl-6">
        <Card className="shadow-sm login-form">
          <Card.Body className="row p-5">
            <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
              <img src={avatar} className="rounded-circle img-fluid" alt={t('loginPage.title')} />
            </div>
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="col-12 col-md-6 mt-3 mt-md-0">
                  <h2 className="text-center mb-4">
                    {t('loginPage.title')}
                  </h2>
                  {error && (
                    <Alert variant="danger">
                      {t(
                        error.status === 401
                          ? 'loginPage.errors.invalidCredentials'
                          : 'loginPage.errors.loginFailed',
                      )}
                    </Alert>
                  )}

                  <div className="form-floating mb-3">
                    <Field
                      name="username"
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder={t('loginPage.usernameLabel')}
                    />
                    <label htmlFor="username">
                      {t('loginPage.usernameLabel')}
                    </label>
                    <ErrorMessage name="username">
                      {msg => (
                        <div className="text-danger small">
                          {t(msg)}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>

                  <div className="form-floating mb-4">
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder={t('loginPage.passwordLabel')}
                    />
                    <label htmlFor="password">
                      {t('loginPage.passwordLabel')}
                    </label>
                    <ErrorMessage name="password">
                      {msg => (
                        <div className="text-danger small">
                          {t(msg)}
                        </div>
                      )}
                    </ErrorMessage>
                  </div>

                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-100"
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? `${t('loginPage.loginButton')}...` : t('loginPage.loginButton')}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card.Body>
          <Card.Footer className="p-4 text-center">
            <span>
              {` ${t('loginPage.noAccount')}`}
              {' '}
            </span>
            <Link to="/signup">
              {t('loginPage.registerLink')}
            </Link>
          </Card.Footer>
        </Card>
      </Container>
    </div>
  )
}