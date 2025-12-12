import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { userService } from '@/services/userService';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/services/authService';
import type { Mentor } from '@/types/mentor';
import ProfileHeader from '@/components/profile/ProfileHeader/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs/ProfileTabs';
import ReviewsTab from '@/components/profile/TabContent/ReviewsTab';
import AboutTab from '@/components/profile/TabContent/AboutTab';
import ContactLinksTab from '@/components/profile/TabContent/ContactLinksTab';
import RelatedMentors from '@/components/profile/RelatedMentors';

interface UserWithStats extends User {
  rating?: number;
  reviewCount?: number;
}

const MENTOR_TABS = [
  { id: 'about', label: 'About' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'contact', label: 'Contact & Links' },
];

const userToMentorAdapter = (user: User): Mentor => {
  const userWithStats = user as UserWithStats;

  let hourlyRateString = '0';
  if (user.hourlyRate !== undefined && user.hourlyRate !== null) {
    const rate = user.hourlyRate;
    hourlyRateString = typeof rate === 'number' ? String(rate) : rate;
  }

  return {
    id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    title: user.title || 'Mentor',
    company: user.company || 'Not specified',
    experience: user.experience || '0 years',
    location: user.location || 'Not specified',
    hourlyRate: hourlyRateString,
    rating: userWithStats.rating || 0,
    reviewCount: userWithStats.reviewCount || 0,
    skills: user.skills || [],
    bio: user.bio || 'No bio available',
    about: user.about || 'No about information available',
    isAvailable: true,
    email: user.email,
    linkedin: user.linkedin || '',
    website: user.website || '',
    reviews: [],
    github: user.github || '',
    twitter: user.twitter || '',
    avatar: user.avatar?.url || ''
  };
};

const prepareUserForProfileHeader = (user: User): User => {
  let hourlyRateString = '0';

  if (user.hourlyRate !== undefined && user.hourlyRate !== null) {
    const rate = user.hourlyRate;
    hourlyRateString = typeof rate === 'number' ? String(rate) : rate;
  }

  return {
    ...user,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    role: user.role || 'mentor',
    isMentor: user.isMentor || true,
    title: user.title || '',
    company: user.company || '',
    experience: user.experience || '',
    location: user.location || '',
    bio: user.bio || '',
    about: user.about || '',
    hourlyRate: hourlyRateString,
    skills: user.skills || [],
    avatar: user.avatar || undefined,
    linkedin: user.linkedin || '',
    website: user.website || '',
    github: user.github || '',
    twitter: user.twitter || ''
  };
};

const MentorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { user: currentUser } = useAuth();
  const { openChat } = useChat();


  const [mentor, setMentor] = useState<Mentor | null>(null);
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
    const fetchMentorData = async () => {
      if (!id || (currentUser && currentUser._id === id)) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await userService.getUserById(id);

        const mentorData = userToMentorAdapter(userData);
        const profileUserData = prepareUserForProfileHeader(userData);

        setMentor(mentorData);
        setUser(profileUserData);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load mentor profile';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();
  }, [id, currentUser]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    const mentorData = userToMentorAdapter(updatedUser);
    setMentor(mentorData);
  };

  const handleContact = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (mentor) {
      const chatMentor = {
        id: mentor.id,
        name: mentor.name,
        title: mentor.title,
        avatar: mentor.avatar,
        isAvailable: mentor.isAvailable,
        lastMessage: undefined,
        unreadCount: 0,
      };

      openChat(chatMentor);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading mentor profile...</div>
      </div>
    );
  }

  if (error || !mentor || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">{error || 'Mentor not found'}</div>
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
        tabs={MENTOR_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'about' && (
              <AboutTab user={user} isEditable={false} />
            )}
            {activeTab === 'reviews' && (
              <ReviewsTab mentorId={mentor.id} />
            )}
            {activeTab === 'contact' && (
              <ContactLinksTab user={user} isEditable={false} />
            )}
          </div>
          <div className="lg:col-span-1">
            <RelatedMentors currentMentorId={mentor.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;