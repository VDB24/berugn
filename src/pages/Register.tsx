
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Link, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Linkedin } from 'lucide-react';
import { Provider } from '@supabase/supabase-js';
import { useState } from 'react';

const Register = () => {
  const { currentUser, isLoading, signInWithProvider, signUpWithEmail } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  if (currentUser) {
    return <Navigate to="/browse" />;
  }

  const handleSocialLogin = async (provider: Provider) => {
    try {
      toast({
        title: 'Redirecting',
        description: `Redirecting to ${provider} for authentication...`,
      });
      setTimeout(async () => {
        try {
          const { error } = await signInWithProvider(provider);
          if (error) {
            throw error;
          }
        } catch (err) {
          toast({
            variant: 'destructive',
            title: 'Sign up failed',
            description: 'Failed to sign up with social provider. Please try again.',
          });
        }
      }, 300);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: 'Failed to sign up with social provider. Please try again.',
      });
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in all fields.',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Password mismatch',
        description: 'Passwords do not match.',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }

    setEmailLoading(true);
    try {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Sign up failed',
          description: error.message || 'Failed to create account. Please try again.',
        });
      } else {
        toast({
          title: 'Account created',
          description: 'Your account has been created successfully! You can now log in.',
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary/10 via-accent/10 to-background dark:from-background dark:via-background/90 dark:to-background">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Subtle animated illustration */}
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-gradient-to-tr from-secondary/30 to-primary/30 dark:from-secondary/20 dark:to-primary/20 p-3 animate-float shadow-lg">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48" className="block">
                <circle cx="24" cy="24" r="19" fill="#68D391" fillOpacity="0.28" />
                <rect x="14" y="18" width="20" height="14" rx="5" fill="#0A66C2" fillOpacity="0.13"/>
                <rect x="17" y="21" width="14" height="8" rx="3" fill="#0A66C2" fillOpacity="0.25"/>
              </svg>
            </div>
          </div>
          <div className="text-center mb-7">
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight animate-fade-in dark:text-foreground">Create your account</h1>
            <p className="text-gray-600 dark:text-muted-foreground animate-fade-in" style={{ animationDelay: ".1s" }}>
              Join SwipeConnect and start building your professional network today.
            </p>
          </div>

          <div className="bg-white/90 dark:bg-background/60 shadow-xl border border-border rounded-2xl p-8 animate-scale-up transition-all duration-500 ease-in-out">
            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <RainbowButton 
                type="submit" 
                className="w-full" 
                disabled={emailLoading || isLoading}
              >
                {emailLoading ? 'Creating account...' : 'Create account'}
              </RainbowButton>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-secondary/20 dark:border-secondary/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-background px-2 text-muted-foreground font-semibold tracking-wide">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full group bg-background/80 dark:bg-background/40 border border-border rounded-lg px-0 py-3 flex items-center justify-center gap-1 font-medium text-sm shadow-sm 
                hover:bg-secondary/10 dark:hover:bg-background/60 hover:-translate-y-0.5 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                style={{ transition: 'box-shadow 0.2s, transform 0.2s' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 24 24" width="22" className="mr-2">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialLogin('linkedin_oidc')}
                disabled={isLoading}
                className="w-full group bg-background/80 dark:bg-background/40 border border-border rounded-lg px-0 py-3 flex items-center justify-center gap-1 font-medium text-sm shadow-sm
                  hover:bg-secondary/10 dark:hover:bg-background/60 hover:-translate-y-0.5 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                style={{ transition: 'box-shadow 0.2s, transform 0.2s' }}
              >
                <Linkedin className="mr-2 h-5 w-5 text-[#0A66C2]" />
                LinkedIn
              </Button>
            </div>
            {/* Smooth loading state */}
            {isLoading && (
              <div className="w-full flex justify-center mt-4">
                <span className="animate-pulse text-primary dark:text-secondary text-sm">Processing...</span>
              </div>
            )}

            <div className="mt-8 text-center text-sm">
              <p className="text-gray-600 dark:text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary dark:text-secondary font-medium hover:underline transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
