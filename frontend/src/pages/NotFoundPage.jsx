import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import notFound from '../assets/notFound-avatar.svg'

export const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <img src={notFound} className='img-fluid h-25' alt={t('notFoundPage.altText')} />
        <h1 className='h4 text-muted'> {t('notFoundPage.title')}</h1>
      </div>
      <p className='text-muted'>
        {t('notFoundPage.description')} <Link to='/'>{t('notFoundPage.homeLink')}</Link>
      </p>
    </>
  )
}
