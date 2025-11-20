import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserProfileHeader from '../components/profile/ProfileHeader/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs/ProfileTabs';
import AboutTab from '../components/profile/TabContent/AboutTab';
import ReviewsGivenTab from '../components/profile/TabContent/ReviewsGivenTab';
import ReviewsTab from '../components/profile/TabContent/ReviewsTab';
import ContactLinksTab from '../components/profile/TabContent/ContactLinksTab';
import type { User } from '../services/authService';

const PROFILE_TABS = [
  { id: 'about', label: 'About' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact & Links' },
];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'about');

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && PROFILE_TABS.some(t => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleUserUpdate = async (updatedUser: User) => {
    try {
      updateUser(updatedUser);
      window.dispatchEvent(new CustomEvent('profileUpdated'));
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <AboutTab 
            user={user} 
            onUpdate={handleUserUpdate} 
            isEditable={true} 
          />
        );
      
      case 'reviews':
        if (user.role === 'student') {
          return <ReviewsGivenTab userId={user._id} />;
        } else {
          return <ReviewsTab mentorId={user._id} />;
        }
      
      case 'contact':
        return (
          <ContactLinksTab 
            user={user} 
            onUpdate={handleUserUpdate} 
            isEditable={true} 
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <UserProfileHeader 
        user={user} 
        onUpdate={handleUserUpdate} 
      />
      
      <ProfileTabs 
        tabs={PROFILE_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange} 
      />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Profile;