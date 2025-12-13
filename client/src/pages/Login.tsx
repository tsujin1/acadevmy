import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import avatarImage from '@/assets/justin-avatar.svg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-white">

      {/* --- LEFT SIDE (White Theme - Left Aligned Layout) --- */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-50 border-r border-slate-200 p-10 xl:p-12 h-full">

        {/* 1. Header: Logo (Aligned Left) */}
        <div className="flex items-center text-lg font-bold tracking-tight text-slate-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white mr-2 shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          Acadevmy
        </div>

        {/* 2. Main: Avatar & Quote (Aligned Left) */}
        {/* Changed 'items-center text-center' to 'items-start text-left' */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-lg space-y-8">
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl ring-1 ring-slate-100">
            <AvatarImage
              src={avatarImage}
              alt="Justin Dimaandal"
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-2xl">JD</AvatarFallback>
          </Avatar>

          <blockquote className="space-y-2">
            <p className="text-2xl font-medium leading-relaxed text-slate-900 text-left">
              &ldquo;Mentorship is the cheat code to a successful engineering career.
              We built this platform to help you skip the mistakes and build real software faster.&rdquo;
            </p>
          </blockquote>
        </div>

        {/* 3. Footer: Name & Title (Aligned Left) */}
        <div className="flex flex-col items-start">
          <div className="font-bold text-slate-900 text-lg">Justin Dimaandal</div>
          <div className="text-sm font-medium text-slate-500">Founder & Developer of Acadevmy</div>
        </div>
      </div>

      {/* --- RIGHT SIDE (Form) --- */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-8 bg-white h-full">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">

          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex flex-col space-y-2 text-center">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-11 bg-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-11 bg-white"
                />
              </div>

              <Button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-medium shadow-sm transition-all">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => navigate('/')}
              className="w-full h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-medium"
            >
              Continue as Guest
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-500 hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};