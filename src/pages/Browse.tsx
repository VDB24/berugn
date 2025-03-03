
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const Browse = () => {
  const { currentUser } = useAuth();
  const { potentialConnections, swipeProfile } = useProfile();
  const { toast } = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyLimit, setDailyLimit] = useState({ total: 20, remaining: 20 });

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Get daily limit from localStorage or set default
      const savedLimit = localStorage.getItem('swipe_connect_daily_limit');
      if (savedLimit) {
        setDailyLimit(JSON.parse(savedLimit));
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user hasn't completed profile, redirect to create profile page
  if (!currentUser.profileCompleted) {
    return <Navigate to="/create-profile" />;
  }

  // Handle swipe action
  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= potentialConnections.length) {
      return;
    }
    
    // Deduct from daily limit
    if (dailyLimit.remaining <= 0) {
      toast({
        title: 'Daily limit reached',
        description: 'You\'ve reached your daily browsing limit. Come back tomorrow!',
        variant: 'destructive',
      });
      return;
    }
    
    const newRemaining = dailyLimit.remaining - 1;
    setDailyLimit({ ...dailyLimit, remaining: newRemaining });
    localStorage.setItem('swipe_connect_daily_limit', JSON.stringify({ 
      ...dailyLimit, 
      remaining: newRemaining 
    }));
    
    try {
      // Get current profile being swiped
      const profile = potentialConnections[currentIndex];
      
      // Process swipe
      await swipeProfile(profile.id, direction);
      
      // Show toast for right swipe (connect)
      if (direction === 'right') {
        toast({
          title: 'Connection request sent',
          description: `You've requested to connect with ${profile.name}`,
        });
      }
      
      // Move to next profile
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process your action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle super connect
  const handleSuperConnect = () => {
    // In a real app, this would give the connection a higher priority
    
    toast({
      title: 'Super Connect!',
      description: 'You used a Super Connect to highlight your interest!',
      variant: 'default',
    });
    
    // Then process as a normal right swipe
    handleSwipe('right');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl px-4 py-12 mt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Professionals</h1>
          <p className="text-gray-600">
            Swipe right to connect, left to pass
          </p>
          
          {/* Daily limit indicator */}
          <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm mt-4">
            <span>{dailyLimit.remaining} of {dailyLimit.total} views remaining today</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          {isLoading ? (
            <div className="w-full max-w-sm">
              <Skeleton className="h-72 w-full rounded-t-xl" />
              <div className="p-6 space-y-2 bg-white rounded-b-xl border">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex flex-wrap gap-1 mt-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <Skeleton className="h-16 w-full mt-2" />
              </div>
              
              <div className="flex justify-center items-center gap-4 mt-6">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-14 w-14 rounded-full" />
              </div>
            </div>
          ) : (
            <>
              {potentialConnections.length > 0 && currentIndex < potentialConnections.length ? (
                <ProfileCard
                  profile={potentialConnections[currentIndex]}
                  onSwipe={handleSwipe}
                  onSuperConnect={handleSuperConnect}
                />
              ) : (
                <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
                  <div className="flex justify-center">
                    <Star className="h-16 w-16 text-secondary mb-6" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
                  <p className="text-gray-600 mb-6">
                    You've viewed all available profiles for now. Check back later for new connections!
                  </p>
                  <Button variant="outline" onClick={() => setCurrentIndex(0)}>
                    Start over
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
