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
      <h3 className="text-lg font-semibold text-slate-900 mb-3">Bio</h3>
      
      {isEditing ? (
        <>
          <textarea
            name="bio"
            value={bio}
            onChange={onChange}
            rows={4}
            maxLength={MAX_BIO_LENGTH}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none bg-white text-slate-900 placeholder-slate-400 transition-all"
            placeholder={`Tell us about yourself (max ${MAX_BIO_LENGTH} characters)...`}
          />
          <p className="text-sm text-slate-500 mt-2 text-right">
            {bio.length} / {MAX_BIO_LENGTH} characters
          </p>
        </>
      ) : (
        <>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-6">
            {bio || <span className="text-slate-400 italic">No bio provided.</span>}
          </p>
          
          {readOnly && onContact && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button 
                onClick={onContact}
                className="group px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
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