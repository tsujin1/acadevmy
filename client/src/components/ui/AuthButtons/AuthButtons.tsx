import { Link } from 'react-router-dom';

interface AuthButtonsProps {
  vertical?: boolean;
  variant?: 'default' | 'hero' | 'mentor' | 'cta';
  className?: string;
}

const AuthButtons = ({ 
  vertical = false, 
  variant = 'default',
  className = ''
}: AuthButtonsProps) => {
  const baseClasses = 'flex';
  const layoutClasses = vertical ? 'flex-col space-y-3' : 'flex-row space-x-3';
  const justifyClass = variant === 'cta' ? 'justify-center' : '';
  const containerClasses = `${baseClasses} ${layoutClasses} ${justifyClass} ${className}`.trim();
  
  const styles = {
    default: {
      login: 'text-black px-4 py-2 hover:text-gray-700 transition-colors',
      signup: 'bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition-colors'
    },
    hero: {
      login: 'border border-white/30 text-white px-5 py-2.5 rounded-lg hover:bg-white/10 transition',
      signup: 'bg-white text-black px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition'
    },
    mentor: {
      findMentor: 'px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 hover:shadow-lg'
    },
    cta: {
      login: 'border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors',
      signup: 'bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
    }
  };

  if (variant === 'mentor') {
    return (
      <div className={containerClasses}>
        <Link to="/mentors" className={styles.mentor.findMentor}>
          More Mentors {'>'}
        </Link>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <Link
        to="/login"
        className={`${styles[variant].login} ${vertical ? 'text-center' : ''}`}
      >
        Log In
      </Link>
      <Link
        to="/signup"
        className={`${styles[variant].signup} ${vertical ? 'text-center' : ''}`}
      >
        {variant === 'hero' || variant === 'cta' ? 'Sign Up' : 'Get Started'}
      </Link>
    </div>
  );
};

export default AuthButtons;