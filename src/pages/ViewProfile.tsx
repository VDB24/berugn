
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import ProfileView from '@/components/ProfileView';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { type Profile } from '@/context/ProfileContext';

const ViewProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const { getAllProfiles } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      if (!profileId) {
        toast({
          title: 'Error',
          description: 'Profile ID is required',
          variant: 'destructive',
        });
        navigate('/matches');
        return;
      }

      const profiles = getAllProfiles();
      const foundProfile = profiles.find(p => p.id === profileId);
      
      if (!foundProfile) {
        toast({
          title: 'Profile not found',
          description: 'The requested profile could not be found',
          variant: 'destructive',
        });
        navigate('/matches');
        return;
      }
      
      setProfile(foundProfile);
      setIsLoading(false);
    };

    // Add a small delay for better UX
    const timer = setTimeout(loadProfile, 500);
    
    return () => clearTimeout(timer);
  }, [profileId, getAllProfiles, toast, navigate]);

  const handleBack = () => {
    navigate('/matches');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-4xl px-4 py-8 mt-12">
          <div className="space-y-6">
            <Skeleton className="h-10 w-32" />
            <div className="bg-card rounded-xl shadow-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-64" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-4xl px-4 py-8 mt-12">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Profile Not Found</h2>
            <p className="text-muted-foreground">The profile you're looking for doesn't exist.</p>
            <Button onClick={handleBack}>Back to Matches</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 py-8 mt-12">
        <ProfileView 
          profile={profile} 
          onBack={handleBack}
          showBackButton={true}
        />
      </main>
    </div>
  );
};

export default ViewProfile;
