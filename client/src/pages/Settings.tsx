import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authService, type User } from '@/services/authService';
import { FaEdit } from 'react-icons/fa';

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

  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Account Settings
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500">
          Manage your profile and update your credentials.
        </p>
      </header>

      <div className="max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Personal Details
              </h2>
              <button
                type="button"
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'profile')}
                disabled={profileLoading}
                className="
                  inline-flex items-center gap-2 px-4 py-2.5 
                  border border-gray-300 rounded-lg font-medium 
                  text-gray-700 hover:bg-gray-50 active:bg-gray-100 
                  transition-colors disabled:opacity-50
                  w-full sm:w-auto justify-center
                  whitespace-nowrap
                "
              >
                <FaEdit size={14} />
                {profileLoading ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
            <form onSubmit={(e) => handleSubmit(e, 'profile')} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none transition duration-150 ease-in-out bg-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none transition duration-150 ease-in-out bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none transition duration-150 ease-in-out bg-transparent"
                />
              </div>
              <button type="submit" hidden disabled={profileLoading} aria-hidden="true"></button>
            </form>
          </section>

          <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Change Password
              </h2>
              <button
                type="button"
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'password')}
                disabled={passwordLoading}
                className="
                  inline-flex items-center gap-2 px-4 py-2.5 
                  border border-gray-300 rounded-lg font-medium 
                  text-gray-700 hover:bg-gray-50 active:bg-gray-100 
                  transition-colors disabled:opacity-50
                  w-full sm:w-auto justify-center
                  whitespace-nowrap
                "
              >
                <FaEdit size={14} />
                {passwordLoading ? 'Saving...' : 'Update Password'}
              </button>
            </div>
            <form onSubmit={(e) => handleSubmit(e, 'password')} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none transition duration-150 ease-in-out bg-transparent"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-300 focus:border-gray-500 focus:outline-none transition duration-150 ease-in-out bg-transparent"
                />
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