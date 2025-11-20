import { useState } from 'react';
import { FaEnvelope, FaLinkedin, FaGlobe, FaGithub, FaTwitter, FaSave, FaEdit, FaTimes } from 'react-icons/fa';
import { userService } from '../../../services/userService';
import type { User } from '../../../services/authService';

interface ContactLinksTabProps {
  user: User | null;
  onUpdate?: (updatedUser: User) => void;
  isEditable?: boolean;
}

const ensureProtocol = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

const ContactLinksTab = ({ 
  user, 
  onUpdate, 
  isEditable = false 
}: ContactLinksTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [contactData, setContactData] = useState({
    email: user?.email || '',
    linkedin: user?.linkedin || '',
    website: user?.website || '',
    github: user?.github || '',
    twitter: user?.twitter || '',
  });

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await userService.updateProfile({
        linkedin: contactData.linkedin,
        website: contactData.website,
        github: contactData.github,
        twitter: contactData.twitter,
      });
      
      if (onUpdate) {
        onUpdate(updatedUser);
      }
      setIsEditing(false);
    } catch {
      setError('Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContactData({
      email: user?.email || '',
      linkedin: user?.linkedin || '',
      website: user?.website || '',
      github: user?.github || '',
      twitter: user?.twitter || '',
    });
    setIsEditing(false);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Contact & Links</h2>
        
        {isEditable && (
          <>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto"
              >
                <FaEdit size={14} />
                Edit Links
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-0"
                >
                  <FaSave size={14} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-100 disabled:cursor-not-allowed w-full sm:w-auto order-2 sm:order-0"
                >
                  <FaTimes size={14} />
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
        </div>
      )}

      <div className="max-w-3xl space-y-3 sm:space-y-4">
        
        <div className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-linear-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white shrink-0">
            <FaEnvelope size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Email</div>
            <div className="text-gray-600 text-sm break-all">
              {contactData.email || 'No email provided'}
            </div>
          </div>
        </div>

        <div className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-linear-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white shrink-0">
            <FaLinkedin size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">LinkedIn</div>
            {isEditing ? (
              <input
                type="url"
                name="linkedin"
                value={contactData.linkedin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            ) : contactData.linkedin ? (
              <a href={ensureProtocol(contactData.linkedin)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm transition-colors break-all">
                {contactData.linkedin}
              </a>
            ) : (
              <div className="text-gray-500 text-sm">No LinkedIn provided</div>
            )}
          </div>
        </div>

        <div className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-linear-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white shrink-0">
            <FaGlobe size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Website</div>
            {isEditing ? (
              <input
                type="url"
                name="website"
                value={contactData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                placeholder="https://yourwebsite.com"
              />
            ) : contactData.website ? (
              <a href={ensureProtocol(contactData.website)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm transition-colors break-all">
                {contactData.website}
              </a>
            ) : (
              <div className="text-gray-500 text-sm">No website provided</div>
            )}
          </div>
        </div>

        <div className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-linear-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white shrink-0">
            <FaGithub size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">GitHub</div>
            {isEditing ? (
              <input
                type="url"
                name="github"
                value={contactData.github}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                placeholder="https://github.com/yourusername"
              />
            ) : contactData.github ? (
              <a href={ensureProtocol(contactData.github)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm transition-colors break-all">
                {contactData.github}
              </a>
            ) : (
              <div className="text-gray-500 text-sm">No GitHub provided</div>
            )}
          </div>
        </div>

        <div className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-linear-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white shrink-0">
            <FaTwitter size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Twitter</div>
            {isEditing ? (
              <input
                type="url"
                name="twitter"
                value={contactData.twitter}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                placeholder="https://twitter.com/yourusername"
              />
            ) : contactData.twitter ? (
              <a href={ensureProtocol(contactData.twitter)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm transition-colors break-all">
                {contactData.twitter}
              </a>
            ) : (
              <div className="text-gray-500 text-sm">No Twitter provided</div>
            )}
          </div>
        </div>
      </div>

      {isEditable && !isEditing && (
        <div className="mt-6 sm:mt-8 max-w-3xl p-4 sm:p-6 bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">Share your profile</h3>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Keep your contact information up to date so other members can connect with you.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactLinksTab;