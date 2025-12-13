import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LoginBanner } from './components/LoginBanner';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Mentors } from './pages/Mentors';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-background">
                <Header />
                <LoginBanner />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/mentors"
                      element={
                        <ProtectedRoute>
                          <Mentors />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
