import * as Yup from 'yup'

export const channelSchema = t =>
  Yup.object({
    name: Yup.string()
      .trim()
      .required(t('chatPage.modals.addChannel.form.errors.required'))
      .min(3, t('registerPage.errors.usernameMin'))
      .max(20, t('registerPage.errors.usernameMax')),
  })

export const loginSchema = t =>
  Yup.object().shape({
    username: Yup.string().required(t('loginPage.errors.usernameRequired')),
    password: Yup.string().required(t('loginPage.errors.passwordRequired')),
  })

export const signupSchema = t =>
  Yup.object().shape({
    username: Yup.string()
      .required(t('registerPage.errors.usernameRequired'))
      .min(3, t('registerPage.errors.usernameMin'))
      .max(20, t('registerPage.errors.usernameMax')),
    password: Yup.string()
      .required(t('registerPage.errors.passwordRequired'))
      .min(6, t('registerPage.errors.passwordMin')),
    passwordConfirmation: Yup.string()
      .required(t('registerPage.errors.passwordRequired'))
      .oneOf([Yup.ref('password')], t('registerPage.errors.passwordMismatch')),
  })
