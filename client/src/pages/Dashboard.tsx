import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-lg text-slate-600">
              You're now signed in and can access all features.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Account Information</h2>
            <div className="space-y-2 text-slate-600">
              <p><span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Role:</span> {user?.role}</p>
              {user?.isMentor && (
                <p><span className="font-medium">Status:</span> Mentor</p>
              )}
            </div>
          </div>

          <Button
            onClick={logout}
            variant="outline"
            className="mt-4"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

