import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/chatPage';
import { NotFoundPage } from './pages/notFoundPage';
import { store } from './store';
import { Provider as ReduxProvider } from 'react-redux';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CustomNavbar } from './components/CustomNavbar';
import { PublicRoute } from './components/PublicRoute';
import { RegisterPage } from './pages/RegisterPage';
import { ToastContainer, Slide } from 'react-toastify';

const rollbarConfig = {
  accessToken: '1979b38ee0e8485b945ac8d2a68a62b8',
  environment: 'production',
};

function AppContent() {
  return (
    <>
      <CustomNavbar />
      <Routes>
        <Route
          path='/login'
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary
        fallbackUI={() => <div>Something went wrong. We're looking into it.</div>}
        onError={(err, errInfo) => {
          console.error('Rollbar caught an error:', err, errInfo);
        }}
      >
        <ReduxProvider store={store}>
          <BrowserRouter>
            <AppContent />
            <ToastContainer
              position='top-center'
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme='light'
              transition={Slide}
            />
          </BrowserRouter>
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
}

export default App;
