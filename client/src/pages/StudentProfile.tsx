import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../services/authService';
import ProfileHeader from '../components/profile/ProfileHeader/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs/ProfileTabs';
import AboutTab from '../components/profile/TabContent/AboutTab';
import ContactLinksTab from '../components/profile/TabContent/ContactLinksTab';
import ReviewsGivenTab from '../components/profile/TabContent/ReviewsGivenTab';

const STUDENT_TABS = [
  { id: 'about', label: 'About' },
  { id: 'reviews', label: 'Reviews Given' },
  { id: 'contact', label: 'Contact & Links' },
];

const userToStudentAdapter = (user: User): User => {
  return {
    ...user,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    role: user.role || 'student',
    isMentor: false,
    title: user.title || '',
    company: user.company || '',
    experience: user.experience || '',
    location: user.location || '',
    bio: user.bio || '',
    about: user.about || '',
    hourlyRate: user.hourlyRate || '',
    skills: user.skills || [],
    avatar: user.avatar || undefined,
    linkedin: user.linkedin || '',
    website: user.website || '',
    github: user.github || '',
    twitter: user.twitter || ''
  };
};

const prepareUserForProfileHeader = (user: User): User => {
  return {
    ...user,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    role: user.role || 'student',
    isMentor: false,
    title: user.title || '',
    company: user.company || '',
    experience: user.experience || '',
    location: user.location || '',
    bio: user.bio || '',
    about: user.about || '',
    hourlyRate: user.hourlyRate || '',
    skills: user.skills || [],
    avatar: user.avatar || undefined,
    linkedin: user.linkedin || '',
    website: user.website || '',
    github: user.github || '',
    twitter: user.twitter || ''
  };
};

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser } = useAuth();
  const { openChat } = useChat();

  const [student, setStudent] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'about');

  useEffect(() => {
    if (currentUser && id && currentUser._id === id) {
      navigate('/profile', { replace: true });
    }
  }, [currentUser, id, navigate]);

  useEffect(() => {
    if (currentUser && id && currentUser._id === id) {
      const tabParam = searchParams.get('tab');
      navigate(tabParam ? `/profile?tab=${tabParam}` : '/profile', { replace: true });
    }
  }, [currentUser, id, navigate, searchParams]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id || (currentUser && currentUser._id === id)) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await userService.getUserById(id);

        const studentData = userToStudentAdapter(userData);
        const profileUserData = prepareUserForProfileHeader(userData);

        setStudent(studentData);
        setUser(profileUserData);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load student profile';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id, currentUser]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    const studentData = userToStudentAdapter(updatedUser);
    setStudent(studentData);
  };

  const handleContact = () => {
    if (student) {
      const chatStudent = {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        title: student.title || 'Student',
        avatar: student.avatar?.url || '',
        isAvailable: true,
        lastMessage: undefined,
        unreadCount: 0,
      };

      openChat(chatStudent);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading student profile...</div>
      </div>
    );
  }

  if (error || !student || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">{error || 'Student not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ProfileHeader
        user={user}
        onUpdate={handleUserUpdate}
        onContact={handleContact}
      />

      <ProfileTabs
        tabs={STUDENT_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'about' && (
          <AboutTab user={user} isEditable={false} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsGivenTab userId={user._id} />
        )}
        {activeTab === 'contact' && (
          <ContactLinksTab user={user} isEditable={false} />
        )}
      </div>
    </div>
  );
};

export default StudentProfile;