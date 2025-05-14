
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Briefcase, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const Index = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section - Improved background */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        {/* Replace the gray background with a more appealing gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-background to-background/80 -z-10"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)] -z-10"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary/10 text-secondary mb-4 transition-transform animate-float">
              Professional networking reimagined
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-3xl animate-fade-in">
              Connect with professionals <span className="text-gradient">who matter</span>
            </h1>
            
            <p className="text-muted-foreground md:text-xl max-w-[700px] mt-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Berugn helps you discover valuable professional connections through an intuitive card-swiping interface.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {currentUser ? (
                <Link to="/browse">
                  <Button size="lg" className="gap-2 premium-button">
                    Start browsing
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="gap-2 premium-button">
                      Sign up free
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="transition-all duration-300 hover:border-primary">
                      Log in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section - Also improve this background */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background -z-10"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.15),transparent_70%)] -z-10"></div>
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Berugn makes professional networking intuitive and efficient
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center rounded-2xl bg-card/80 backdrop-blur-sm text-card-foreground p-8 premium-card transform transition-all duration-500 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110">
                <Briefcase className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Showcase your professional experience, skills, and goals to find the right connections
              </p>
              <ul className="mt-4 text-left space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  <span className="text-sm">Highlight your key skills</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  <span className="text-sm">Set your networking preferences</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  <span className="text-sm">Share your professional goals</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center rounded-2xl bg-card/80 backdrop-blur-sm text-card-foreground p-8 premium-card transform transition-all duration-500 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Swipe Through Profiles</h3>
              <p className="text-muted-foreground">
                Browse potential connections with our intuitive swipe interface - right to connect, left to pass
              </p>
              <ul className="mt-4 text-left space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  <span className="text-sm">AI-powered matching algorithm</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  <span className="text-sm">Detailed professional profiles</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  <span className="text-sm">Personalized recommendations</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center rounded-2xl bg-card/80 backdrop-blur-sm text-card-foreground p-8 premium-card transform transition-all duration-500 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Connect & Grow</h3>
              <p className="text-muted-foreground">
                When you match, connect on LinkedIn to start a meaningful professional relationship
              </p>
              <ul className="mt-4 text-left space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  <span className="text-sm">Seamless LinkedIn integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  <span className="text-sm">Real-time chat notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                  <span className="text-sm">Industry event recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Improve this background too */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-background to-primary/5 -z-10"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.2),transparent_50%)] -z-10"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to build your professional network?
            </h2>
            <p className="text-muted-foreground md:text-xl mb-10 max-w-[600px]">
              Join Berugn today and discover connections that can help advance your career.
            </p>
            
            {currentUser ? (
              <Link to="/browse">
                <Button size="lg" className="gap-2 px-8 py-6 text-lg premium-button">
                  Start browsing
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="gap-2 px-8 py-6 text-lg premium-button">
                  Get started
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-12 mt-auto bg-card/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-4">Berugn</span>
            <p className="text-sm text-muted-foreground mb-6">
              Professional networking reimagined
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
              <Link to="/" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/features" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/login" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                Log in
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Berugn. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
