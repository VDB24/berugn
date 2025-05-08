
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import MatchCard from '@/components/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users, UserCheck, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Profile } from '@/context/ProfileContext';
import PendingRequestCard from '@/components/PendingRequestCard';

const Matches = () => {
  const { currentUser } = useAuth();
  const { getPendingRequests, getActiveConnections } = useProfile();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConnections, setActiveConnections] = useState<{connection: any, profile: Profile}[]>([]);
  const [pendingRequests, setPendingRequests] = useState<{connection: any, profile: Profile}[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState<string>('connections');

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user hasn't completed profile, redirect to create profile page
  if (!currentUser.profileCompleted) {
    return <Navigate to="/create-profile" />;
  }

  // Load connections and requests
  useEffect(() => {
    const timer = setTimeout(() => {
      // Get active connections
      const connections = getActiveConnections();
      setActiveConnections(connections);
      
      // Get pending requests
      const requests = getPendingRequests();
      setPendingRequests(requests);
      
      // Set initial filtered profiles to connections
      const connectionProfiles = connections.map(conn => conn.profile);
      setFilteredProfiles(connectionProfiles);
      
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [getActiveConnections, getPendingRequests]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'connections') {
      setFilteredProfiles(activeConnections.map(conn => conn.profile));
    } else if (value === 'requests') {
      setFilteredProfiles(pendingRequests.map(req => req.profile));
    }
    
    setSearchQuery('');
  };

  // Filter profiles based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Reset to current tab's default profiles
      if (activeTab === 'connections') {
        setFilteredProfiles(activeConnections.map(conn => conn.profile));
      } else if (activeTab === 'requests') {
        setFilteredProfiles(pendingRequests.map(req => req.profile));
      }
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    if (activeTab === 'connections') {
      const filtered = activeConnections
        .map(conn => conn.profile)
        .filter(profile => 
          profile.name.toLowerCase().includes(query) ||
          profile.jobTitle.toLowerCase().includes(query) ||
          profile.company?.toLowerCase().includes(query) ||
          profile.industry.toLowerCase().includes(query) ||
          profile.skills.some(skill => skill.name.toLowerCase().includes(query))
        );
      
      setFilteredProfiles(filtered);
    } else if (activeTab === 'requests') {
      const filtered = pendingRequests
        .map(req => req.profile)
        .filter(profile => 
          profile.name.toLowerCase().includes(query) ||
          profile.jobTitle.toLowerCase().includes(query) ||
          profile.company?.toLowerCase().includes(query) ||
          profile.industry.toLowerCase().includes(query) ||
          profile.skills.some(skill => skill.name.toLowerCase().includes(query))
        );
      
      setFilteredProfiles(filtered);
    }
  }, [searchQuery, activeTab, activeConnections, pendingRequests]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl px-4 py-12 mt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Network</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your professional connections
          </p>
        </div>
        
        <Tabs 
          defaultValue="connections" 
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>Connections</span>
              {activeConnections.length > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                  {activeConnections.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span>Requests</span>
              {pendingRequests.length > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
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
          
          <TabsContent value="connections" className="mt-0">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col md:flex-row bg-card rounded-xl overflow-hidden shadow-sm">
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {activeConnections.length > 0 ? (
                  <div className="space-y-6">
                    {activeConnections
                      .filter(conn => filteredProfiles.some(p => p.id === conn.profile.id))
                      .map(({ connection, profile }) => (
                        <MatchCard key={connection.id} profile={profile} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center bg-card p-8 rounded-xl shadow-lg">
                    <div className="flex justify-center">
                      <Users className="h-16 w-16 text-muted mb-6" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No connections yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Continue browsing profiles to find meaningful professional connections.
                    </p>
                    <Button variant="default" onClick={() => window.location.href = '/browse'}>
                      Browse Profiles
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="requests" className="mt-0">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col md:flex-row bg-card rounded-xl overflow-hidden shadow-sm">
                    <Skeleton className="w-full md:w-40 h-44" />
                    <div className="p-5 flex-1 space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <Skeleton className="h-6 w-32 mb-2" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex space-x-2">
                          <Skeleton className="h-10 w-24" />
                          <Skeleton className="h-10 w-24" />
                        </div>
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {pendingRequests.length > 0 ? (
                  <div className="space-y-6">
                    {pendingRequests
                      .filter(req => filteredProfiles.some(p => p.id === req.profile.id))
                      .map(({ connection, profile }) => (
                        <PendingRequestCard 
                          key={connection.id} 
                          profile={profile} 
                          connectionId={connection.id} 
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center bg-card p-8 rounded-xl shadow-lg">
                    <div className="flex justify-center">
                      <UserPlus className="h-16 w-16 text-muted mb-6" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No pending requests</h2>
                    <p className="text-muted-foreground mb-6">
                      When professionals want to connect with you, you'll see their requests here.
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Matches;
