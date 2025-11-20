import { FaComments, FaArrowRight } from 'react-icons/fa';

interface BioSectionProps {
  bio: string;
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
  onContact?: () => void;
}

const BioSection = ({
  bio,
  isEditing,
  onChange,
  readOnly = false,
  onContact
}: BioSectionProps) => {
  const MAX_BIO_LENGTH = 150;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Bio</h3>
      
      {isEditing ? (
        <>
          <textarea
            name="bio"
            value={bio}
            onChange={onChange}
            rows={4}
            maxLength={MAX_BIO_LENGTH}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder={`Tell us about yourself (max ${MAX_BIO_LENGTH} characters)...`}
          />
          <p className="text-sm text-gray-500 mt-1 text-right">
            {bio.length} / {MAX_BIO_LENGTH} characters
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
            {bio || 'No bio provided.'}
          </p>
          
          {readOnly && onContact && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button 
                onClick={onContact}
                className="group px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <FaComments size={18} />
                <span>Send Message</span>
                <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BioSection;