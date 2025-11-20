import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SocketProvider from './contexts/SocketContext';
import ChatProvider from './contexts/ChatProvider';
import AuthProvider from './contexts/AuthProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Mentors from '@/pages/Mentors';
import MentorProfile from '@/pages/MentorProfile';
import StudentProfile from '@/pages/StudentProfile';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ChatBox from '@/components/profile/ChatBox/ChatBox';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/mentors" element={<Mentors />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/mentor/:id" element={
                    <ProtectedRoute><MentorProfile /></ProtectedRoute>
                  } />
                  <Route path="/student/:id" element={<StudentProfile />} />

                  <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                  } />
                  <Route path="/profile/settings" element={
                    <ProtectedRoute><Settings /></ProtectedRoute>
                  } />

                  <Route path="/settings" element={<Navigate to="/profile/settings" replace />} />
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