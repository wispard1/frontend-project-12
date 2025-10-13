import { Navbar } from '../components/Navbar';
import notFound from '../assets/notFound-avatar.svg';

export const NotFoundPage = () => {
  return (
    <>
      <Navbar />
      <div>
        <img src={notFound} class='img-fluid h-25' alt='Страница не найдена' />
        <h1 class='h4 text-muted'> Страница не найдена</h1>
      </div>
      <p class='text-muted'>
        Но вы можете перейти <a href='/'>на главную страницу</a>
      </p>
    </>
  );
};
