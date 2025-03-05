
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Briefcase, Users, Zap, ArrowRight } from 'lucide-react';

const Index = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary/10 text-secondary mb-4 transition-transform animate-float">
              Professional networking reimagined
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-3xl animate-fade-in">
              Connect with professionals <span className="text-gradient">who matter</span>
            </h1>
            
            <p className="text-gray-600 md:text-xl max-w-[700px] mt-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              SyncIn helps you discover valuable professional connections through an intuitive card-swiping interface.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {currentUser ? (
                <Link to="/browse">
                  <Button size="lg" className="gap-2">
                    Start browsing
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="gap-2">
                      Sign up free
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Log in
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 md:text-lg max-w-[700px] mx-auto">
              SyncIn makes professional networking intuitive and efficient
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center rounded-xl bg-white p-8 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Showcase your professional experience, skills, and goals to find the right connections
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center rounded-xl bg-white p-8 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Swipe Through Profiles</h3>
              <p className="text-gray-600">
                Browse potential connections with our intuitive swipe interface - right to connect, left to pass
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center rounded-xl bg-white p-8 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect & Grow</h3>
              <p className="text-gray-600">
                When you match, connect on LinkedIn to start a meaningful professional relationship
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to build your professional network?
            </h2>
            <p className="text-gray-600 md:text-lg mb-8">
              Join SyncIn today and discover connections that can help advance your career.
            </p>
            
            {currentUser ? (
              <Link to="/browse">
                <Button size="lg" className="gap-2">
                  Start browsing
                  <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Get started
                  <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-2">SyncIn</span>
            <p className="text-sm text-gray-600 mb-4">
              Professional networking reimagined
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm text-gray-600 hover:text-primary">
                Home
              </Link>
              <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                About
              </Link>
              <Link to="/features" className="text-sm text-gray-600 hover:text-primary">
                Features
              </Link>
              <Link to="/login" className="text-sm text-gray-600 hover:text-primary">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
