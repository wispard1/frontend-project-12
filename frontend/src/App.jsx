import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/chatPage';
import { NotFoundPage } from './pages/notFoundPage';
import { store } from './store';
import { Provider } from 'react-redux';
import { ProtectedRoute } from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CustomNavbar } from './components/CustomNavbar';
import { PublicRoute } from './components/PublicRoute';
import { RegisterPage } from './pages/RegisterPage';

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
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
