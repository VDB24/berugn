import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

interface Skill {
  id: string;
  name: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  jobTitle: string;
  company?: string;
  industry: string;
  skills: Skill[];
  experience: string;
  bio: string;
  linkedInUrl?: string;
  profileImage?: string;
}

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'connected' | 'rejected';
  createdAt: string;
}

interface Preference {
  industries: string[];
  experienceLevels: string[];
  connectionPurposes: string[];
}

interface ProfileContextType {
  userProfile: Profile | null;
  potentialConnections: Profile[];
  matches: Connection[];
  preferences: Preference;
  createProfile: (profileData: Omit<Profile, 'id' | 'userId'>) => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
  swipeProfile: (profileId: string, direction: 'left' | 'right') => Promise<void>;
  updatePreferences: (newPreferences: Partial<Preference>) => Promise<void>;
  loadMoreProfiles: () => Promise<void>;
  respondToRequest: (connectionId: string, accept: boolean) => Promise<void>;
  removeConnection: (connectionId: string) => Promise<void>;
  getSentRequests: () => Connection[];
  getPendingRequests: () => {connection: Connection, profile: Profile}[];
  getActiveConnections: () => {connection: Connection, profile: Profile}[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PREFERENCES: 'swipe_connect_preferences_',
  SWIPED: 'swipe_connect_swiped_',
  CREATED_PROFILE: 'swipe_connect_profile_created_',
};

// Helper function to map Supabase profile data to our Profile interface
const mapSupabaseProfile = (profile: any): Profile => ({
  id: profile.id,
  userId: profile.user_id,
  name: profile.name || 'Anonymous User',
  jobTitle: profile.job_title || 'Not specified',
  company: profile.company,
  industry: profile.industry || 'Not specified',
  skills: Array.isArray(profile.skills) ? profile.skills : 
          (typeof profile.skills === 'string' ? JSON.parse(profile.skills) : 
          (profile.skills ? JSON.parse(JSON.stringify(profile.skills)) : [])),
  experience: profile.experience || 'Not specified',
  bio: profile.bio || 'No bio provided',
  linkedInUrl: profile.linkedin_url,
  profileImage: profile.profile_image
});

// Helper function to map Supabase connection data to our Connection interface
const mapSupabaseConnection = (connection: any): Connection => ({
  id: connection.id,
  userId: connection.user_id,
  connectedUserId: connection.connected_user_id,
  status: connection.status as 'pending' | 'connected' | 'rejected',
  createdAt: connection.created_at
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [potentialConnections, setPotentialConnections] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Connection[]>([]);
  const [preferences, setPreferences] = useState<Preference>({
    industries: [],
    experienceLevels: [],
    connectionPurposes: []
  });
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [swipedProfileIds, setSwipedProfileIds] = useState<Set<string>>(new Set());
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  // Track profiles that have already been requested
  const [requestedProfileIds, setRequestedProfileIds] = useState<Set<string>>(new Set());

  // Fetch ALL profiles from Supabase (not filtered by auth method)
  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        // Get all profiles from Supabase - this includes profiles created via any auth method
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          throw error;
        }

        if (profilesData) {
          // Map Supabase profiles to our Profile interface
          const mappedProfiles: Profile[] = profilesData.map(mapSupabaseProfile);
          setAllProfiles(mappedProfiles);
          console.log('Loaded all profiles from Supabase (email + OAuth):', mappedProfiles.length);
        }
      } catch (error) {
        console.error('Error fetching profiles from Supabase:', error);
        toast({
          title: "Error loading profiles",
          description: "Could not load profiles. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsInitialDataLoaded(true);
      }
    };
    
    fetchAllProfiles();
  }, []);

  // Load swiped profiles and requested profiles from localStorage
  useEffect(() => {
    if (!currentUser) return;
    
    const savedSwipedIds = localStorage.getItem(`${STORAGE_KEYS.SWIPED}${currentUser.id}`);
    if (savedSwipedIds) {
      try {
        const parsedIds = new Set<string>(JSON.parse(savedSwipedIds));
        setSwipedProfileIds(parsedIds);
        console.log('Loaded swiped profiles:', parsedIds.size);
      } catch (error) {
        console.error("Error parsing saved swiped IDs:", error);
      }
    }
    
    // Load requested profile IDs from localStorage
    const savedRequestedIds = localStorage.getItem(`requested_profiles_${currentUser.id}`);
    if (savedRequestedIds) {
      try {
        const parsedIds = new Set<string>(JSON.parse(savedRequestedIds));
        setRequestedProfileIds(parsedIds);
        console.log('Loaded requested profiles:', parsedIds.size);
      } catch (error) {
        console.error("Error parsing saved requested IDs:", error);
      }
    }
  }, [currentUser]);

  const loadMoreProfiles = useCallback(async () => {
    if (!currentUser) throw new Error('No user is logged in');
    if (isLoadingProfiles) {
      console.log("Already loading profiles, skipping request");
      return;
    }

    try {
      setIsLoadingProfiles(true);
      console.log("Loading more profiles...");
      
      // Get connection IDs that the current user has already interacted with
      const { data: connectionsData, error } = await supabase
        .from('connections')
        .select('*')
        .or(`user_id.eq.${currentUser.id},connected_user_id.eq.${currentUser.id}`);
      
      if (error) throw error;
      
      // Extract all user IDs that the current user has already connected with
      let connectedUserIds: string[] = [];
      if (connectionsData) {
        connectedUserIds = connectionsData.flatMap(conn => {
          if (conn.user_id === currentUser.id) return [conn.connected_user_id];
          if (conn.connected_user_id === currentUser.id) return [conn.user_id];
          return [];
        });
      }
      
      console.log("Already connected with users:", connectedUserIds.length);
      
      // Combine with tracked swiped profile IDs and requested profile IDs
      const swipedIds = Array.from(swipedProfileIds);
      const requestedIds = Array.from(requestedProfileIds);
      
      // Get all profiles excluding:
      // 1. Current user's profile
      // 2. Profiles that have been swiped
      // 3. Profiles that the user has already connected with
      // 4. Profiles that the user has already requested
      // Note: Now includes profiles from ALL auth methods (email + OAuth)
      const availableProfiles = allProfiles.filter(p => 
        p.userId !== currentUser.id && 
        !swipedIds.includes(p.id) &&
        !requestedIds.includes(p.userId) &&
        !connectedUserIds.includes(p.userId)
      );
      
      console.log(`Found ${availableProfiles.length} available profiles after filtering (includes all auth methods)`);
      
      setPotentialConnections(prevConnections => {
        if (prevConnections.length === 0) {
          return availableProfiles;
        }
        
        const existingIds = new Set(prevConnections.map(p => p.id));
        
        const newProfiles = availableProfiles.filter(p => !existingIds.has(p.id));
        console.log(`Adding ${newProfiles.length} new profiles to existing ${prevConnections.length}`);
        
        return [...prevConnections, ...newProfiles];
      });
    } catch (error) {
      console.error("Error loading profiles:", error);
      toast({
        title: "Error loading profiles",
        description: "Could not load potential connections. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingProfiles(false);
    }
  }, [currentUser, isLoadingProfiles, swipedProfileIds, allProfiles, requestedProfileIds]);

  useEffect(() => {
    if (!currentUser || !isInitialDataLoaded) {
      return;
    }
    
    console.log('Loading user data for:', currentUser.id);
    
    // Find user's profile
    const fetchUserData = async () => {
      try {
        // Fetch user's profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
          throw profileError;
        }
        
        if (profileData) {
          console.log('Found existing profile for user:', currentUser.id);
          setUserProfile(mapSupabaseProfile(profileData));
        }
        
        // Fetch connections
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('connections')
          .select('*')
          .or(`user_id.eq.${currentUser.id},connected_user_id.eq.${currentUser.id}`);
        
        if (connectionsError) {
          throw connectionsError;
        }
        
        if (connectionsData && connectionsData.length > 0) {
          // Map Supabase connections to our Connection interface
          const mappedConnections: Connection[] = connectionsData.map(mapSupabaseConnection);
          setMatches(mappedConnections);
          console.log('Loaded connections from Supabase:', mappedConnections.length);
          
          // Get IDs of users who have already been requested/connected
          const requestedUserIds = mappedConnections
            .filter(m => m.userId === currentUser.id)
            .map(m => m.connectedUserId);
            
          // Filter potential connections to exclude users who have already been requested/connected
          const availableProfiles = allProfiles.filter(p => 
            p.userId !== currentUser.id &&
            !requestedUserIds.includes(p.userId) && 
            !swipedProfileIds.has(p.id)
          );
          
          setPotentialConnections(availableProfiles);
        } else {
          // If no connections, set all profiles (except current user) as potential connections
          const availableProfiles = allProfiles.filter(p => 
            p.userId !== currentUser.id && 
            !swipedProfileIds.has(p.id)
          );
          
          setPotentialConnections(availableProfiles);
        }
        
        // Load preferences from localStorage
        const savedPreferences = localStorage.getItem(`${STORAGE_KEYS.PREFERENCES}${currentUser.id}`);
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: "Error loading data",
          description: "Could not load your profile data. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    fetchUserData();
  }, [currentUser, allProfiles, isInitialDataLoaded, swipedProfileIds]);

  const createProfile = async (profileData: Omit<Profile, 'id' | 'userId'>) => {
    if (!currentUser) throw new Error('No user is logged in');

    try {
      // Convert skills array to a format compatible with Supabase JSON column
      const skillsJson = profileData.skills as unknown as Json;

      // Create profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: currentUser.id,
          name: profileData.name,
          job_title: profileData.jobTitle,
          company: profileData.company,
          industry: profileData.industry,
          skills: skillsJson,
          experience: profileData.experience,
          bio: profileData.bio,
          linkedin_url: profileData.linkedInUrl,
          profile_image: profileData.profileImage
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newProfile: Profile = mapSupabaseProfile(data);
      setUserProfile(newProfile);
      
      // Update local profiles list
      setAllProfiles(prevProfiles => [...prevProfiles.filter(p => p.userId !== currentUser.id), newProfile]);
      
      // Save created profile flag to localStorage
      localStorage.setItem(`${STORAGE_KEYS.CREATED_PROFILE}${currentUser.id}`, 'true');
      
      toast({
        title: "Profile Created",
        description: "Your profile has been created successfully",
      });
      
      console.log("Profile created and saved to Supabase:", newProfile);
    } catch (error) {
      console.error("Error creating profile in Supabase:", error);
      toast({
        title: "Error creating profile",
        description: "Could not create your profile. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!currentUser || !userProfile) throw new Error('No user profile found');

    try {
      // Convert skills array to a format compatible with Supabase JSON column if present
      const skillsJson = profileData.skills ? (profileData.skills as unknown as Json) : undefined;

      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name || userProfile.name,
          job_title: profileData.jobTitle || userProfile.jobTitle,
          company: profileData.company || userProfile.company,
          industry: profileData.industry || userProfile.industry,
          skills: skillsJson,
          experience: profileData.experience || userProfile.experience,
          bio: profileData.bio || userProfile.bio,
          linkedin_url: profileData.linkedInUrl || userProfile.linkedInUrl,
          profile_image: profileData.profileImage || userProfile.profileImage
        })
        .eq('user_id', currentUser.id);
      
      if (error) {
        throw error;
      }
      
      const updatedProfile = { ...userProfile, ...profileData };
      setUserProfile(updatedProfile);
      
      // Update local profiles list
      setAllProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.userId === currentUser.id ? updatedProfile : profile
        )
      );
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      
      console.log("Profile updated in Supabase:", updatedProfile);
    } catch (error) {
      console.error("Error updating profile in Supabase:", error);
      toast({
        title: "Error updating profile",
        description: "Could not update your profile. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const swipeProfile = async (profileId: string, direction: 'left' | 'right') => {
    if (!currentUser) throw new Error('No user is logged in');
    
    console.log(`Starting swipe for profile ${profileId} in direction ${direction}`);
    
    try {
      // Track swiped profile
      const newSwipedIds = new Set(swipedProfileIds);
      newSwipedIds.add(profileId);
      setSwipedProfileIds(newSwipedIds);
      
      localStorage.setItem(`${STORAGE_KEYS.SWIPED}${currentUser.id}`, JSON.stringify([...newSwipedIds]));

      // Get the profile to swipe
      const profileToSwipe = allProfiles.find(p => p.id === profileId);
      
      if (direction === 'right' && profileToSwipe) {
        // Check if we've already requested this user
        if (requestedProfileIds.has(profileToSwipe.userId)) {
          console.log(`Already requested connection with ${profileToSwipe.name}, skipping...`);
          
          // Still remove from potential connections
          setPotentialConnections(prevConnections => {
            return prevConnections.filter(p => p.id !== profileId);
          });
          
          return;
        }
        
        // Add to requested profiles
        const newRequestedIds = new Set(requestedProfileIds);
        newRequestedIds.add(profileToSwipe.userId);
        setRequestedProfileIds(newRequestedIds);
        localStorage.setItem(`requested_profiles_${currentUser.id}`, JSON.stringify([...newRequestedIds]));
        
        // Create connection in Supabase
        try {
          const { data, error } = await supabase
            .from('connections')
            .insert({
              user_id: currentUser.id,
              connected_user_id: profileToSwipe.userId,
              status: 'pending',
            })
            .select()
            .single();
          
          if (error) {
            throw error;
          }
          
          // Map Supabase connection to our Connection interface
          const newConnection: Connection = mapSupabaseConnection(data);
          
          // Check if the other user has already sent a request to create a match
          const existingRequest = matches.find(
            m => m.userId === profileToSwipe.userId && 
                 m.connectedUserId === currentUser.id && 
                 m.status === 'pending'
          );
          
          if (existingRequest) {
            // Update existing request to 'connected' in Supabase
            const { error: updateError } = await supabase
              .from('connections')
              .update({ status: 'connected' })
              .eq('id', existingRequest.id);
            
            if (updateError) {
              throw updateError;
            }
            
            // Update local matches
            const updatedExistingRequest: Connection = {
              ...existingRequest,
              status: 'connected'
            };
            
            const updatedMatches = matches.map(m => 
              m.id === existingRequest.id ? updatedExistingRequest : m
            );
            
            updatedMatches.push(newConnection);
            setMatches(updatedMatches);
            
            toast({
              title: "New Connection!",
              description: `You and ${profileToSwipe.name} are now connected`,
            });
          } else {
            // Simply add the new connection if no match
            const updatedMatches = [...matches, newConnection];
            setMatches(updatedMatches);
            
            toast({
              title: "Request Sent",
              description: `Connection request sent to ${profileToSwipe.name}`,
            });
          }
        } catch (error) {
          console.error("Error creating connection in Supabase:", error);
          toast({
            title: "Error",
            description: "Could not process your connection request",
            variant: "destructive"
          });
        }
      }
      
      setPotentialConnections(prevConnections => {
        const swipedProfileIndex = prevConnections.findIndex(p => p.id === profileId);
        
        if (swipedProfileIndex === -1) {
          console.error(`Profile ${profileId} not found in potentialConnections`);
          return prevConnections;
        }
        
        const updatedConnections = [...prevConnections];
        updatedConnections.splice(swipedProfileIndex, 1);
        
        console.log(`Removed profile ${profileId} from potentialConnections`);
        console.log(`Profiles remaining: ${updatedConnections.length}`);
        
        if (updatedConnections.length < 3) {
          console.log("Running low on profiles, loading more immediately...");
          loadMoreProfiles();
        }
        
        return updatedConnections;
      });
    } catch (error) {
      console.error("Error during swipe operation:", error);
      toast({
        title: "Error",
        description: "Could not process your action",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePreferences = async (newPreferences: Partial<Preference>) => {
    if (!currentUser) throw new Error('No user is logged in');

    const updatedPreferences = { ...preferences, ...newPreferences };
    
    setPreferences(updatedPreferences);
    localStorage.setItem(`${STORAGE_KEYS.PREFERENCES}${currentUser.id}`, JSON.stringify(updatedPreferences));
    
    console.log("Preferences saved:", updatedPreferences);
  };

  const respondToRequest = async (connectionId: string, accept: boolean) => {
    if (!currentUser) throw new Error('No user is logged in');
    
    try {
      // Update connection status in Supabase
      const { error } = await supabase
        .from('connections')
        .update({ status: accept ? 'connected' : 'rejected' })
        .eq('id', connectionId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      const updatedMatches = matches.map(match => {
        if (match.id === connectionId) {
          return {
            ...match,
            status: accept ? 'connected' as const : 'rejected' as const
          };
        }
        return match;
      });
      
      setMatches(updatedMatches);
      
      // Find the connection and associated profile for a better toast message
      const connection = matches.find(m => m.id === connectionId);
      if (connection) {
        const profile = allProfiles.find(p => p.userId === connection.userId);
        
        if (accept) {
          toast({
            title: "Connection Accepted",
            description: profile ? `You are now connected with ${profile.name}` : "Connection request accepted",
          });
        } else {
          toast({
            title: "Connection Declined",
            description: "Connection request declined",
          });
        }
      }
      
      console.log(`Connection ${connectionId} updated to ${accept ? 'connected' : 'rejected'}`);
    } catch (error) {
      console.error("Error updating connection in Supabase:", error);
      toast({
        title: "Error",
        description: "Could not process your response to the connection request",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removeConnection = async (connectionId: string) => {
    if (!currentUser) throw new Error('No user is logged in');
    
    try {
      // Delete connection from Supabase
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId);
      
      if (error) {
        throw error;
      }
      
      // Update local state - remove the connection
      const updatedMatches = matches.filter(match => match.id !== connectionId);
      setMatches(updatedMatches);
      
      toast({
        title: "Connection Removed",
        description: "The connection has been removed successfully",
      });
      
      console.log(`Connection ${connectionId} removed`);
    } catch (error) {
      console.error("Error removing connection from Supabase:", error);
      toast({
        title: "Error",
        description: "Could not remove the connection. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getSentRequests = () => {
    if (!currentUser) return [];
    
    return matches.filter(m => 
      m.userId === currentUser.id && m.status === 'pending'
    );
  };

  const getPendingRequests = () => {
    if (!currentUser) return [];
    
    const pendingRequests = matches.filter(m => 
      m.connectedUserId === currentUser.id && m.status === 'pending'
    );
    
    return pendingRequests.map(connection => {
      const profile = allProfiles.find(p => p.userId === connection.userId);
      return {
        connection,
        profile: profile!
      };
    }).filter(item => item.profile); // Filter out any undefined profiles
  };

  const getActiveConnections = () => {
    if (!currentUser) return [];
    
    // Get connections where the current user is either the requester or the requested
    const activeConnections = matches.filter(m => 
      ((m.userId === currentUser.id) || 
       (m.connectedUserId === currentUser.id)) && 
      m.status === 'connected'
    );
    
    return activeConnections.map(connection => {
      // Find the profile of the other person in the connection
      const otherPersonId = connection.userId === currentUser.id ? 
        connection.connectedUserId : connection.userId;
      
      const profile = allProfiles.find(p => p.userId === otherPersonId);
      return {
        connection,
        profile: profile!
      };
    }).filter(item => item.profile); // Filter out any undefined profiles
  };

  const value: ProfileContextType = {
    userProfile,
    potentialConnections,
    matches,
    preferences,
    createProfile,
    updateProfile,
    swipeProfile,
    updatePreferences,
    loadMoreProfiles,
    respondToRequest,
    removeConnection,
    getSentRequests,
    getPendingRequests,
    getActiveConnections
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
