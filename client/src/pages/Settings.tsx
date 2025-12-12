import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authService, type User } from '@/services/authService';
import { FaEdit, FaSave, FaTimes, FaUser, FaLock, FaCog } from 'react-icons/fa';

interface SettingsForm {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}

type UpdateSection = 'profile' | 'password' | 'all';

const Settings = () => {
  const currentUser = authService.getCurrentUser();

  const [form, setForm] = useState<SettingsForm>({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const [originalForm, setOriginalForm] = useState<SettingsForm>({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      const initialForm = {
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        currentPassword: '',
        newPassword: '',
      };
      setForm(initialForm);
      setOriginalForm(initialForm);
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelProfile = () => {
    setForm(prev => ({
      ...prev,
      firstName: originalForm.firstName,
      lastName: originalForm.lastName,
      email: originalForm.email,
    }));
    setIsEditingProfile(false);
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };

  const handleCancelPassword = () => {
    setForm(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
    }));
    setIsEditingPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent, section: UpdateSection) => {
    e.preventDefault();
    
    const { firstName, lastName, email, currentPassword, newPassword } = form;

    try {
      const token = authService.getToken();
      if (!token) {
        toast.error('You are not authenticated.');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;
      let profileUpdated = false;
      let passwordUpdated = false;

      if (section === 'profile' || section === 'all') {
        setProfileLoading(true);
      }
      if (section === 'password' || section === 'all') {
        setPasswordLoading(true);
      }

      if (section === 'profile' || section === 'all') {
        if (!firstName || !lastName || !email) {
          toast.error('Please fill out all personal details fields.');
          setProfileLoading(false);
          setPasswordLoading(false);
          return;
        }

        const profileBody: Partial<User> = { firstName, lastName, email };

        const profileRes = await fetch(`${API_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileBody),
        });

        if (!profileRes.ok) {
          const errorData = await profileRes.json().catch(() => ({ message: profileRes.statusText }));
          toast.error(errorData.message || 'Failed to update profile.');
          setProfileLoading(false);
          setPasswordLoading(false);
          return;
        }
        profileUpdated = true;
      }

      if (section === 'password' || section === 'all') {
        if (!currentPassword || !newPassword) {
          toast.error('To change your password, you must provide both current and new passwords.');
          setProfileLoading(false);
          setPasswordLoading(false);
          return;
        }

        const passwordRes = await fetch(`${API_URL}/users/change-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (!passwordRes.ok) {
          const errorData = await passwordRes.json().catch(() => ({ message: passwordRes.statusText }));
          toast.error(errorData.message || 'Failed to update password.');
          setProfileLoading(false);
          setPasswordLoading(false);
          return;
        }
        passwordUpdated = true;
        setForm(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      }
      
      if (profileUpdated && passwordUpdated) {
          toast.success('Profile and Password updated successfully!');
      } else if (profileUpdated) {
          toast.success('Profile updated successfully!');
      } else if (passwordUpdated) {
          toast.success('Password updated successfully!');
      }

      if (profileUpdated) {
          const updatedUserRes = await fetch(`${API_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
          });
          const updatedUser: User = await updatedUserRes.json();
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Update original form and exit edit mode
          setOriginalForm(prev => ({
            ...prev,
            firstName: updatedUser.firstName || '',
            lastName: updatedUser.lastName || '',
            email: updatedUser.email || '',
          }));
          setIsEditingProfile(false);
      }

      if (passwordUpdated) {
        setIsEditingPassword(false);
      }

    } catch (error: unknown) {
      console.error(error);
      const errorMsg = error instanceof Error ? error.message : 'Server error.';
      toast.error(errorMsg);
    } finally {
      if (section === 'profile' || section === 'all') {
        setProfileLoading(false);
      }
      if (section === 'password' || section === 'all') {
        setPasswordLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <header className="mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
              <FaCog className="text-white" size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Account Settings
            </h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base ml-13">
            Manage your account information and security settings
          </p>
        </header>

        <div className="space-y-10 sm:space-y-12">
          {/* Personal Details Section */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                  <FaUser className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                    Personal Details
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Update your name and email address
                  </p>
                </div>
              </div>
              {!isEditingProfile ? (
                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 text-sm sm:text-base whitespace-nowrap w-full sm:w-auto justify-center h-fit"
                >
                  <FaEdit size={14} />
                  Edit
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCancelProfile}
                    disabled={profileLoading}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <FaTimes size={14} />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'profile')}
                    disabled={profileLoading}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                  >
                    <FaSave size={14} />
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={(e) => handleSubmit(e, 'profile')} className="pt-6 border-t border-slate-200">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-900 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      required
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
                        isEditingProfile
                          ? 'border-slate-200 focus:ring-slate-900 focus:border-slate-900 bg-white text-slate-900 placeholder-slate-400'
                          : 'border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-900 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      disabled={!isEditingProfile}
                      required
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
                        isEditingProfile
                          ? 'border-slate-200 focus:ring-slate-900 focus:border-slate-900 bg-white text-slate-900 placeholder-slate-400'
                          : 'border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!isEditingProfile}
                    required
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
                      isEditingProfile
                        ? 'border-slate-200 focus:ring-slate-900 focus:border-slate-900 bg-white text-slate-900 placeholder-slate-400'
                        : 'border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>
              <button type="submit" hidden disabled={profileLoading} aria-hidden="true"></button>
            </form>
          </section>

          {/* Change Password Section */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                  <FaLock className="text-white" size={18} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                    Change Password
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>
              {!isEditingPassword ? (
                <button
                  type="button"
                  onClick={handleEditPassword}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 text-sm sm:text-base whitespace-nowrap w-full sm:w-auto justify-center h-fit"
                >
                  <FaEdit size={14} />
                  Edit
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleCancelPassword}
                    disabled={passwordLoading}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <FaTimes size={14} />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'password')}
                    disabled={passwordLoading}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
                  >
                    <FaSave size={14} />
                    {passwordLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={(e) => handleSubmit(e, 'password')} className="pt-6 border-t border-slate-200">
              <div className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-semibold text-slate-900 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    disabled={!isEditingPassword}
                    placeholder="Enter your current password"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
                      isEditingPassword
                        ? 'border-slate-200 focus:ring-slate-900 focus:border-slate-900 bg-white text-slate-900 placeholder-slate-400'
                        : 'border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed placeholder-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-900 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    disabled={!isEditingPassword}
                    placeholder="Enter your new password"
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm ${
                      isEditingPassword
                        ? 'border-slate-200 focus:ring-slate-900 focus:border-slate-900 bg-white text-slate-900 placeholder-slate-400'
                        : 'border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>
              <button type="submit" hidden disabled={passwordLoading} aria-hidden="true"></button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;