import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, // This component has the default border
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LockKeyhole } from 'lucide-react';

interface LoginAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginAlertDialog = ({ open, onOpenChange }: LoginAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* FIX APPLIED: 
         1. Added 'border-0' to remove the hard outline.
         2. Added 'shadow-2xl' for a deeper, cleaner float effect.
      */}
      <AlertDialogContent className="sm:max-w-[425px] p-6 gap-0 overflow-hidden border-0 shadow-2xl">

        <div className="flex gap-4">
          <div className="shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
              <LockKeyhole className="h-5 w-5" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-0.5">
            <AlertDialogHeader className="space-y-0 text-left">
              <AlertDialogTitle className="text-lg font-semibold text-slate-900 leading-none tracking-tight">
                Account Required
              </AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogDescription className="text-slate-500 leading-relaxed text-sm">
              This content is exclusive to our community members. Please sign in or create an account to unlock this feature.
            </AlertDialogDescription>
          </div>
        </div>

        <AlertDialogFooter className="mt-6 sm:justify-end gap-2">
          <AlertDialogCancel className="mt-0 border-slate-200 hover:bg-slate-50 hover:text-slate-900">
            Maybe later
          </AlertDialogCancel>
          <AlertDialogAction
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
          >
            <Link to="/login">
              Sign In
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
};