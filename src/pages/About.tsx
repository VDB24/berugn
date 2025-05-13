
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Star, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const About = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-20">
        {/* Hero section */}
        <section className="py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-8">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                About Berugn
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-[700px]">
                We're revolutionizing professional networking by helping people build meaningful connections.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">
                  At Berugn, we believe that professional networking should be intuitive, focused, and valuable. Our mission 
                  is to connect professionals who can truly help each other grow in their careers.
                </p>
                <p className="text-muted-foreground mb-4">
                  Traditional networking platforms are cluttered with noise and irrelevant connections. We've created 
                  a streamlined experience that helps you find the right connections faster.
                </p>
                {!currentUser && (
                  <Link to="/register">
                    <Button size="lg" className="gap-2 mt-4">
                      Join Berugn today
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                )}
              </div>
              <div className="rounded-xl bg-card p-6 shadow-lg border">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Why Berugn Works</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Quality Over Quantity</h4>
                        <p className="text-sm text-muted-foreground">We focus on matching professionals who can provide mutual value</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Intuitive Interface</h4>
                        <p className="text-sm text-muted-foreground">Our card-swiping approach makes networking feel natural</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Global Community</h4>
                        <p className="text-sm text-muted-foreground">Connect with professionals from around the world</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder section */}
        <section className="py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Founder</h2>
              <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
                The visionary behind Berugn
              </p>
            </div>

            <Card className="max-w-4xl mx-auto p-6 md:p-8 glass-card hover-lift">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3">
                  <AspectRatio ratio={1/1} className="bg-muted rounded-xl overflow-hidden">
                    <Avatar className="h-full w-full rounded-none">
                      <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">VB</AvatarFallback>
                    </Avatar>
                  </AspectRatio>
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-1">Vashisht D. Brahmbhatt</h3>
                    <p className="text-primary font-medium text-lg">CEO & Founder</p>
                  </div>
                  <p className="text-muted-foreground">
                    A tech visionary who recognized the need for a better way to connect professionals in our increasingly digital world. With extensive experience in both technology and professional networking, Vashisht founded Berugn to create meaningful connections that drive career growth and opportunity.
                  </p>
                  <p className="text-muted-foreground">
                    "I believe that the right connection at the right time can change your career trajectory. Berugn is built to make those connections happen more easily and more meaningfully than ever before."
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Team section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
                We're a team of passionate professionals dedicated to improving how people network
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team member 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl glass-card hover-lift">
                <div className="h-24 w-24 rounded-full bg-muted mb-4"></div>
                <h3 className="text-xl font-bold">Alex Morgan</h3>
                <p className="text-primary mb-2">CTO</p>
                <p className="text-muted-foreground text-sm">
                  Former tech recruiter who saw the need for a better way to connect professionals.
                </p>
              </div>
              
              {/* Team member 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl glass-card hover-lift">
                <div className="h-24 w-24 rounded-full bg-muted mb-4"></div>
                <h3 className="text-xl font-bold">Jamie Chen</h3>
                <p className="text-primary mb-2">Head of Product</p>
                <p className="text-muted-foreground text-sm">
                  Software architect with 15+ years experience building social platforms.
                </p>
              </div>
              
              {/* Team member 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-xl glass-card hover-lift">
                <div className="h-24 w-24 rounded-full bg-muted mb-4"></div>
                <h3 className="text-xl font-bold">Sam Peterson</h3>
                <p className="text-primary mb-2">Head of Design</p>
                <p className="text-muted-foreground text-sm">
                  UX expert focused on creating intuitive and engaging user experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to transform your professional network?
              </h2>
              <p className="text-muted-foreground md:text-lg mb-8">
                Join Berugn today and discover connections that can help advance your career.
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
      </div>
      
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

export default About;
