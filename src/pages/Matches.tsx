
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Profile } from '@/context/ProfileContext';

const Matches = () => {
  const { currentUser } = useAuth();
  const { matches, potentialConnections } = useProfile();
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedProfiles, setMatchedProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user hasn't completed profile, redirect to create profile page
  if (!currentUser.profileCompleted) {
    return <Navigate to="/create-profile" />;
  }

  // Load matched profiles
  useEffect(() => {
    const timer = setTimeout(() => {
      // Find profiles that match with the connected user IDs
      const profileMatches = potentialConnections.filter(profile => 
        matches.some(match => match.connectedUserId === profile.id && match.status === 'connected')
      );
      
      setMatchedProfiles(profileMatches);
      setFilteredProfiles(profileMatches);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [matches, potentialConnections]);

  // Filter profiles based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProfiles(matchedProfiles);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = matchedProfiles.filter(profile => 
      profile.name.toLowerCase().includes(query) ||
      profile.jobTitle.toLowerCase().includes(query) ||
      profile.company?.toLowerCase().includes(query) ||
      profile.industry.toLowerCase().includes(query) ||
      profile.skills.some(skill => skill.name.toLowerCase().includes(query))
    );
    
    setFilteredProfiles(filtered);
  }, [searchQuery, matchedProfiles]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl px-4 py-12 mt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
          <p className="text-gray-600">
            Professionals who want to connect with you
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search by name, job title, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow-sm">
                <Skeleton className="w-full md:w-40 h-44" />
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredProfiles.length > 0 ? (
              <div className="space-y-6">
                {filteredProfiles.map((profile) => (
                  <MatchCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-center">
                  <Users className="h-16 w-16 text-muted mb-6" />
                </div>
                {searchQuery ? (
                  <>
                    <h2 className="text-2xl font-bold mb-2">No matching results</h2>
                    <p className="text-gray-600">
                      We couldn't find any matches for your search. Try different keywords.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">No matches yet</h2>
                    <p className="text-gray-600">
                      Continue browsing profiles to find meaningful professional connections.
                    </p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Matches;
