
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase, Users, MessageSquare, Filter, Bell, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Features = () => {
  const { currentUser } = useAuth();
  
  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: "Professional Profiles",
      description: "Create a detailed profile showcasing your professional experience, skills, and career goals to attract the right connections."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Intuitive Matching",
      description: "Our card-swiping interface makes it easy to browse potential connections - swipe right to connect, left to pass."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Direct Messaging",
      description: "Once matched, communicate directly with your new connections to establish a professional relationship."
    },
    {
      icon: <Filter className="h-8 w-8 text-primary" />,
      title: "Advanced Filters",
      description: "Set preferences for industry, experience level, location, and more to find the most relevant connections."
    },
    {
      icon: <Bell className="h-8 w-8 text-primary" />,
      title: "Smart Notifications",
      description: "Stay updated with timely alerts about new matches, messages, and network opportunities."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Privacy Controls",
      description: "Robust privacy settings let you control who sees your profile and how much information is shared."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero section */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Features that make networking <span className="text-gradient">effortless</span>
              </h1>
              
              <p className="text-muted-foreground md:text-xl">Berugn offers a comprehensive set of tools designed to revolutionize your professional networking experience.</p>
              
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Intuitive card-swiping interface</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Advanced filtering and matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Direct messaging with matches</span>
                </div>
              </div>
              
              <div className="pt-4">
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
                      Try it free
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="rounded-xl bg-card p-8 shadow-lg border">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Feature preview image</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Professional Networking</h2>
            <p className="text-muted-foreground md:text-lg max-w-[800px] mx-auto">
              Everything you need to build meaningful professional connections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col p-6 rounded-xl bg-card shadow-sm border">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm flex-1">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Comparison section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Berugn?</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
              See how Berugn compares to traditional networking platforms
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left">Features</th>
                  <th className="p-4 text-center bg-primary/10 rounded-tl-lg">Berugn</th>
                  <th className="p-4 text-center">Traditional Platforms</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Intuitive Interface</td>
                  <td className="p-4 text-center bg-primary/10"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center">Limited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Quality Connections</td>
                  <td className="p-4 text-center bg-primary/10"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center">Mixed</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Advanced Filtering</td>
                  <td className="p-4 text-center bg-primary/10"><CheckCircle2 className="h-5 w-5 text-primary mx-auto" /></td>
                  <td className="p-4 text-center">Basic</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Connection Rate</td>
                  <td className="p-4 text-center bg-primary/10">High</td>
                  <td className="p-4 text-center">Low</td>
                </tr>
                <tr>
                  <td className="p-4">Spam & Irrelevant Content</td>
                  <td className="p-4 text-center bg-primary/10 rounded-bl-lg">Minimal</td>
                  <td className="p-4 text-center">Frequent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to experience better networking?
            </h2>
            <p className="text-muted-foreground md:text-lg mb-8">
              Join thousands of professionals who are building meaningful connections on Berugn.
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
                  Sign up free
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
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-2">Berugn</span>
            <p className="text-sm text-muted-foreground mb-4">
              Professional networking reimagined
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                Home
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                About
              </Link>
              <Link to="/features" className="text-sm text-muted-foreground hover:text-primary">
                Features
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
