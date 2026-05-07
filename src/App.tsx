import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RidesPage } from './pages/RidesPage';
import { BalancesPage } from './pages/BalancesPage';
import { SettlementsPage } from './pages/SettlementsPage';
import { UsersPage } from './pages/UsersPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <RidesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/saldos"
          element={
            <ProtectedRoute>
              <AppLayout>
                <BalancesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fechamento"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SettlementsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pessoas"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UsersPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
