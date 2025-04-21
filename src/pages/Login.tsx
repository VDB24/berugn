
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Linkedin } from 'lucide-react';
import { Provider } from '@supabase/supabase-js';

const Login = () => {
  const { currentUser, isLoading, signInWithProvider } = useAuth();
  const { toast } = useToast();

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
            title: 'Login failed',
            description: 'Failed to sign in with social provider. Please try again.',
          });
        }
      }, 300);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Failed to sign in with social provider. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/50">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gradient">Welcome back</h1>
            <p className="text-muted-foreground text-lg">
              Log in to continue your professional networking journey
            </p>
          </div>

          <div className="bg-card border rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <div className="mt-0">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">
                    Continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full h-12 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="mr-2"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin('linkedin_oidc')}
                  disabled={isLoading}
                  className="w-full h-12 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Linkedin className="mr-2 h-5 w-5 text-[#0A66C2]" />
                  LinkedIn
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
