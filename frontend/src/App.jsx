import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/chatPage';
import { NotFoundPage } from './pages/notFoundPage';
import { store } from './store';
import { Provider } from 'react-redux';
import { ProtectedRoute } from './components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<ChatPage />} />
          </Route>

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
