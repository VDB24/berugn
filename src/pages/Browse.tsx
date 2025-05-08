import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Star, RefreshCw, Container } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Browse = () => {
  const { currentUser } = useAuth();
  const { potentialConnections, swipeProfile, loadMoreProfiles } = useProfile();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [dailyLimit, setDailyLimit] = useState({ total: 20, remaining: 20 });
  const [profilesRemaining, setProfilesRemaining] = useState(0);

  // Initial load effect
  useEffect(() => {
    if (currentUser) {
      const loadProfiles = async () => {
        try {
          await loadMoreProfiles();
          console.log("Initial profile load complete");
        } catch (error) {
          console.error("Error loading initial profiles:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadProfiles();
      
      // Get daily limit from localStorage or set default
      const savedLimit = localStorage.getItem('swipe_connect_daily_limit');
      if (savedLimit) {
        try {
          setDailyLimit(JSON.parse(savedLimit));
        } catch (error) {
          console.error("Error parsing saved limit:", error);
        }
      }
    }
  }, [currentUser, loadMoreProfiles]);

  // This effect will run whenever potentialConnections changes
  useEffect(() => {
    // Update profiles remaining whenever potentialConnections changes
    setProfilesRemaining(potentialConnections.length);
    console.log(`Total profiles available: ${potentialConnections.length}`);
    
    // Load more profiles if running low, but avoid loading on initial render
    if (potentialConnections.length < 3 && !isLoading && currentUser) {
      console.log("Running low on profiles, loading more from effect...");
      loadMoreProfiles()
        .then(() => console.log("Successfully loaded more profiles"))
        .catch(error => console.error("Failed to load more profiles:", error));
    }
  }, [potentialConnections, loadMoreProfiles, isLoading, currentUser]);

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
    if (potentialConnections.length === 0) {
      console.log("No profiles to swipe");
      return;
    }
    
    // Deduct from daily limit
    if (dailyLimit.remaining <= 0) {
      toast({
        title: 'Daily limit reached',
        description: 'You\'ve reached your daily browsing limit. Refill your view capacity to continue!',
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
      // Get the first profile in the array - always use index 0
      const profile = potentialConnections[0];
      
      if (!profile) {
        console.error("No profile available to swipe");
        return;
      }
      
      console.log(`Swiping profile: ${profile.id}, ${profile.name}`);
      
      // Process swipe - this will update potentialConnections in the context
      await swipeProfile(profile.id, direction);
      
      // Show toast for right swipe (connect)
      if (direction === 'right') {
        toast({
          title: 'Connection request sent',
          description: `You've requested to connect with ${profile.name}`,
        });
      }
      
    } catch (error) {
      console.error("Swipe error:", error);
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

  // Handle refresh of profiles
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log("Manually refreshing profiles...");
      await loadMoreProfiles();
      
      toast({
        title: 'Profiles refreshed',
        description: 'New potential connections loaded',
      });
    } catch (error) {
      console.error("Refresh error:", error);
      toast({
        title: 'Error',
        description: 'Failed to refresh profiles. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle refill of view capacity
  const handleRefillCapacity = () => {
    setIsRefilling(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const refillAmount = dailyLimit.total;
      const updatedLimit = {
        total: dailyLimit.total,
        remaining: dailyLimit.total
      };
      
      setDailyLimit(updatedLimit);
      localStorage.setItem('swipe_connect_daily_limit', JSON.stringify(updatedLimit));
      
      toast({
        title: 'View capacity refilled!',
        description: `You can now view ${refillAmount} more profiles today.`,
        variant: 'default',
      });
      
      setIsRefilling(false);
    }, 1200); // Simulate API delay
  };

  // Always use the first profile in the array
  const currentProfile = potentialConnections[0] || null;
  console.log("Current profile displayed:", currentProfile?.id, currentProfile?.name);

  // Calculate progress percentage
  const viewsUsedPercentage = ((dailyLimit.total - dailyLimit.remaining) / dailyLimit.total) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl px-4 py-12 mt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Professionals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find and connect with professionals in your field
          </p>
          
          {/* Daily capacity progress bar */}
          <div className="mt-6 mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Daily view capacity</span>
              <span>{dailyLimit.remaining} of {dailyLimit.total} remaining</span>
            </div>
            <Progress value={100 - viewsUsedPercentage} className="h-2" />
          </div>
          
          {/* Refill button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefillCapacity}
            disabled={isRefilling || dailyLimit.remaining === dailyLimit.total}
            className="mt-2 bg-secondary/10 hover:bg-secondary/20 border-secondary/30"
          >
            {isRefilling ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refilling...
              </>
            ) : (
              <>
                <Container className="mr-2 h-4 w-4" />
                Refill View Capacity
              </>
            )}
          </Button>
          
          {/* Profiles count indicator */}
          <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm mt-4 ml-3">
            <span>{profilesRemaining} profiles available</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          {isLoading ? (
            <div className="w-full max-w-sm">
              <Skeleton className="h-72 w-full rounded-t-xl" />
              <div className="p-6 space-y-2 bg-card rounded-b-xl border">
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
              {currentProfile ? (
                <ProfileCard
                  profile={currentProfile}
                  onSwipe={handleSwipe}
                  onSuperConnect={handleSuperConnect}
                />
              ) : (
                <div className="text-center bg-card p-8 rounded-xl shadow-lg max-w-md">
                  <div className="flex justify-center">
                    <Star className="h-16 w-16 text-secondary mb-6" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
                  <p className="text-muted-foreground mb-6">
                    You've viewed all available profiles for now. Check back later for new connections!
                  </p>
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="w-full"
                    >
                      {isRefreshing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh Profiles
                        </>
                      )}
                    </Button>
                  </div>
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
