
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Briefcase, Users, Zap, ArrowRight, CheckCircle, ArrowDownCircle, Mail } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would send this to your backend
    toast({
      title: "Success!",
      description: "You're on the waitlist! We'll notify you when we launch.",
      variant: "default"
    });
    setEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent -z-10"></div>
        
        {/* Grid background effect */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptLTE4IDE4di02aC02djZoNnptNiAwdjZoNnYtNmgtNnptMTIgMGg2di02aC02djZ6TTEyIDEydjZoNnYtNmgtNnptMCAwdi02SDZ2Nmg2em02IDB2LTZoLTZ2Nmg2eiIvPjwvZz48L2c+PC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptLTE4IDE4di02aC02djZoNnptNiAwdjZoNnYtNmgtNnptMTIgMGg2di02aC02djZ6TTEyIDEydjZoNnYtNmgtNnptMCAwdi02SDZ2Nmg2em02IDB2LTZoLTZ2Nmg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="container px-4 md:px-6 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl animate-fade-in">
              Make connections <span className="text-gradient">like a PRO</span>
            </h1>
            
            <p className="text-muted-foreground md:text-xl max-w-[800px] mt-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Innovative design solutions for technology firms and emerging businesses weary of the typical aesthetic methodology. Arriving shortly.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Input
                type="email"
                placeholder="name@email.com"
                className="h-12 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" size="lg" className="h-12 px-6 gap-2 premium-button whitespace-nowrap">
                <span>Get notified</span>
                <Mail size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Network across your favorite apps
            </p>
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ArrowDownCircle className="text-muted-foreground h-8 w-8" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 md:py-28 bg-muted/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent h-20 top-0 left-0 right-0"></div>
        <div className="container px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Berugn makes professional networking intuitive and efficient
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center rounded-2xl bg-card text-card-foreground p-8 premium-card transform transition-all duration-500 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Create Your Profile</h3>
              <p className="text-muted-foreground">
                Showcase your professional experience, skills, and goals to find the right connections
              </p>
              <ul className="mt-4 text-left space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Highlight your key skills</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Set your networking preferences</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <span className="text-sm">Share your professional goals</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center rounded-2xl bg-card text-card-foreground p-8 premium-card transform transition-all duration-500 hover:-translate-y-2">
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
            <div className="flex flex-col items-center text-center rounded-2xl bg-card text-card-foreground p-8 premium-card transform transition-all duration-500 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 transition-all duration-300 hover:scale-110">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Connect & Grow</h3>
              <p className="text-muted-foreground">
                When you match, connect on LinkedIn to start a meaningful professional relationship
              </p>
              <ul className="mt-4 text-left space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                  <span className="text-sm">Seamless LinkedIn integration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                  <span className="text-sm">Real-time chat notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                  <span className="text-sm">Industry event recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background h-20 top-0 left-0 right-0"></div>
        <div className="container px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              Everything you need to know about Berugn
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "When will Berugn be available?",
                answer: "We're currently in closed beta. Sign up to join our waitlist and be one of the first to try Berugn when we launch publicly."
              },
              {
                question: "How does Berugn match professionals?",
                answer: "Our AI-powered algorithm analyzes your profile, preferences, and networking goals to find the most relevant connections for your professional growth."
              },
              {
                question: "Is Berugn free to use?",
                answer: "Berugn will offer both free and premium tiers. The free tier includes all essential features, while premium unlocks advanced matching and networking tools."
              },
              {
                question: "How is Berugn different from LinkedIn?",
                answer: "While LinkedIn focuses on maintaining a professional network, Berugn is designed specifically for discovering new, relevant connections through an intuitive interface."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-muted/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 -z-10"></div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to revolutionize your networking?
            </h2>
            <p className="text-muted-foreground md:text-xl mb-10 max-w-[600px]">
              Join Berugn today and be the first to experience a new way of professional networking when we launch.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Input
                type="email"
                placeholder="name@email.com"
                className="h-12 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" size="lg" className="h-12 px-6 gap-2 premium-button whitespace-nowrap">
                Get notified
                <Mail size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
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
              <Link to="/features" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/about" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/login" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                Log in
              </Link>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-sm text-foreground/80 hover:text-primary transition-colors"
              >
                Back to top
              </button>
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
