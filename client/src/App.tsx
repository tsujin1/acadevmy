import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SocketProvider from './contexts/SocketContext';
import ChatProvider from './contexts/ChatProvider';
import AuthProvider from './contexts/AuthProvider';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

import Home from './pages/Home';
import Mentors from './pages/Mentors';
import MentorProfile from './pages/MentorProfile';
import StudentProfile from './pages/StudentProfile';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Contact from './pages/Contact';

import ChatBox from './components/profile/ChatBox/ChatBox';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/mentors" element={<Mentors />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/student/:id" element={<StudentProfile />} />

                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <PublicRoute>
                        <Signup />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicRoute>
                        <ForgotPassword />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <PublicRoute>
                        <ResetPassword />
                      </PublicRoute>
                    }
                  />

                  <Route
                    path="/mentor/:id"
                    element={
                      <ProtectedRoute>
                        <MentorProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>

              <Footer />
              <ChatBox />

              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </BrowserRouter>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;