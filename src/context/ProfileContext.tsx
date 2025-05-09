
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  getSentRequests: () => Connection[];
  getPendingRequests: () => {connection: Connection, profile: Profile}[];
  getActiveConnections: () => {connection: Connection, profile: Profile}[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_PROFILES: 'swipe_connect_user_profiles',
  PREFERENCES: 'swipe_connect_preferences_',
  MATCHES: 'swipe_connect_matches_',
  SWIPED: 'swipe_connect_swiped_',
  CREATED_PROFILE: 'swipe_connect_profile_created_',
  REQUESTED_USERS: 'swipe_connect_requested_users_',
};

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
  const [requestedUserIds, setRequestedUserIds] = useState<Set<string>>(new Set());
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  // Fetch real user profiles from Supabase
  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        // Get all profiles from Supabase
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          throw error;
        }

        // Map Supabase profiles to our Profile interface
        const mappedProfiles: Profile[] = profiles.map((profile: any) => ({
          id: profile.id,
          userId: profile.user_id || profile.id, // Use user_id if available, fallback to id
          name: profile.name || profile.full_name || 'Anonymous User',
          jobTitle: profile.job_title || 'Not specified',
          company: profile.company,
          industry: profile.industry || 'Not specified',
          skills: profile.skills || [],
          experience: profile.experience || 'Not specified',
          bio: profile.bio || 'No bio provided',
          linkedInUrl: profile.linkedin_url,
          profileImage: profile.profile_image
        }));
        
        setAllProfiles(mappedProfiles);
        console.log('Loaded profiles from Supabase:', mappedProfiles.length);
      } catch (error) {
        console.error('Error fetching profiles from Supabase:', error);
        
        // Fallback to localStorage if Supabase fetch fails
        const storedProfiles = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
        if (storedProfiles) {
          try {
            const parsedProfiles = JSON.parse(storedProfiles);
            setAllProfiles(parsedProfiles);
            console.log('Loaded profiles from localStorage fallback:', parsedProfiles.length);
          } catch (error) {
            console.error('Error parsing stored profiles:', error);
          }
        }
      } finally {
        setIsInitialDataLoaded(true);
      }
    };
    
    fetchAllProfiles();
  }, []);

  // Load requested users from localStorage
  useEffect(() => {
    if (!currentUser) return;
    
    const savedRequestedUserIds = localStorage.getItem(`${STORAGE_KEYS.REQUESTED_USERS}${currentUser.id}`);
    if (savedRequestedUserIds) {
      try {
        const parsedIds = new Set<string>(JSON.parse(savedRequestedUserIds));
        setRequestedUserIds(parsedIds);
        console.log('Loaded requested users:', parsedIds.size);
      } catch (error) {
        console.error("Error parsing saved requested user IDs:", error);
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
      
      // Get already requested user IDs
      const requestedUserIdsFromMatches = matches
        .filter(m => m.userId === currentUser.id)
        .map(m => m.connectedUserId);
      
      // Combine with tracked requested users
      const allRequestedIds = [...requestedUserIdsFromMatches, ...requestedUserIds];
      
      console.log("Already requested users:", allRequestedIds.length);
      
      // Get all profiles excluding current user, already swiped profiles, and already requested users
      const availableProfiles = allProfiles
        .filter(p => p.userId !== currentUser.id && 
                  !swipedProfileIds.has(p.id) &&
                  !allRequestedIds.includes(p.userId));
      
      console.log(`Found ${availableProfiles.length} available profiles after filtering swiped and requested ones`);
      
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
    } finally {
      setIsLoadingProfiles(false);
    }
  }, [currentUser, isLoadingProfiles, swipedProfileIds, allProfiles, matches, requestedUserIds]);

  useEffect(() => {
    if (!currentUser || !isInitialDataLoaded) {
      return;
    }
    
    console.log('Loading user data for:', currentUser.id);
    
    // Find user's profile in all profiles
    const userProfileData = allProfiles.find(p => p.userId === currentUser.id);
    
    if (userProfileData) {
      console.log('Found existing profile for user:', currentUser.id);
      setUserProfile(userProfileData);
    }

    // Get all connections except current user
    const connections = allProfiles.filter(p => p.userId !== currentUser.id);
    
    const savedSwipedIds = localStorage.getItem(`${STORAGE_KEYS.SWIPED}${currentUser.id}`);
    if (savedSwipedIds) {
      try {
        const parsedIds = new Set<string>(JSON.parse(savedSwipedIds));
        setSwipedProfileIds(parsedIds);
        const filteredConnections = connections.filter(p => !parsedIds.has(p.id));
        setPotentialConnections(filteredConnections);
      } catch (error) {
        console.error("Error parsing saved swiped IDs:", error);
        setPotentialConnections(connections);
      }
    } else {
      setPotentialConnections(connections);
    }

    const savedPreferences = localStorage.getItem(`${STORAGE_KEYS.PREFERENCES}${currentUser.id}`);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }

    // Load connections from Supabase
    const fetchConnections = async () => {
      try {
        // Get all connections where the current user is either the requester or the requested
        const { data, error } = await supabase
          .from('connections')
          .select('*')
          .or(`userId.eq.${currentUser.id},connectedUserId.eq.${currentUser.id}`);
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Map Supabase connections to our Connection interface
          const mappedConnections: Connection[] = data.map((conn: any) => ({
            id: conn.id,
            userId: conn.user_id,
            connectedUserId: conn.connected_user_id,
            status: conn.status,
            createdAt: conn.created_at
          }));
          
          setMatches(mappedConnections);
          console.log('Loaded connections from Supabase:', mappedConnections.length);
        } else {
          // Fallback to localStorage if no connections in Supabase
          const savedMatches = localStorage.getItem(`${STORAGE_KEYS.MATCHES}${currentUser.id}`);
          if (savedMatches) {
            setMatches(JSON.parse(savedMatches));
            console.log('Loaded connections from localStorage fallback');
          }
        }
      } catch (error) {
        console.error('Error fetching connections from Supabase:', error);
        
        // Fallback to localStorage if Supabase fetch fails
        const savedMatches = localStorage.getItem(`${STORAGE_KEYS.MATCHES}${currentUser.id}`);
        if (savedMatches) {
          setMatches(JSON.parse(savedMatches));
          console.log('Loaded connections from localStorage fallback');
        }
      }
    };
    
    fetchConnections();
  }, [currentUser, allProfiles, isInitialDataLoaded]);

  const createProfile = async (profileData: Omit<Profile, 'id' | 'userId'>) => {
    if (!currentUser) throw new Error('No user is logged in');

    try {
      // Create profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: currentUser.id,
          name: profileData.name,
          job_title: profileData.jobTitle,
          company: profileData.company,
          industry: profileData.industry,
          skills: profileData.skills,
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
      
      const newProfile: Profile = {
        id: data.id,
        userId: currentUser.id,
        name: profileData.name,
        jobTitle: profileData.jobTitle,
        company: profileData.company,
        industry: profileData.industry,
        skills: profileData.skills,
        experience: profileData.experience,
        bio: profileData.bio,
        linkedInUrl: profileData.linkedInUrl,
        profileImage: profileData.profileImage
      };

      setUserProfile(newProfile);
      
      // Update local profiles list
      const updatedProfiles = allProfiles.filter(p => p.userId !== currentUser.id);
      updatedProfiles.push(newProfile);
      setAllProfiles(updatedProfiles);
      
      // Save to localStorage as backup
      localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updatedProfiles));
      localStorage.setItem(`${STORAGE_KEYS.CREATED_PROFILE}${currentUser.id}`, 'true');
      
      console.log("Profile created and saved to Supabase:", newProfile);
    } catch (error) {
      console.error("Error creating profile in Supabase:", error);
      
      // Fallback to local storage if Supabase fails
      const newProfile: Profile = {
        id: `profile_${Date.now()}`,
        userId: currentUser.id,
        ...profileData
      };

      setUserProfile(newProfile);
      
      // Store in local profiles
      const updatedProfiles = allProfiles.filter(p => p.userId !== currentUser.id);
      updatedProfiles.push(newProfile);
      setAllProfiles(updatedProfiles);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updatedProfiles));
      localStorage.setItem(`${STORAGE_KEYS.CREATED_PROFILE}${currentUser.id}`, 'true');
      
      console.log("Profile created and saved locally (Supabase failed):", newProfile);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!currentUser || !userProfile) throw new Error('No user profile found');

    try {
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name || userProfile.name,
          job_title: profileData.jobTitle || userProfile.jobTitle,
          company: profileData.company || userProfile.company,
          industry: profileData.industry || userProfile.industry,
          skills: profileData.skills || userProfile.skills,
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
      const updatedProfiles = allProfiles.map(profile => 
        profile.userId === currentUser.id ? updatedProfile : profile
      );
      setAllProfiles(updatedProfiles);
      
      // Update localStorage as backup
      localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updatedProfiles));
      
      console.log("Profile updated in Supabase:", updatedProfile);
    } catch (error) {
      console.error("Error updating profile in Supabase:", error);
      
      // Fallback to localStorage if Supabase update fails
      const updatedProfile = { ...userProfile, ...profileData };
      setUserProfile(updatedProfile);
      
      const updatedProfiles = allProfiles.map(profile => 
        profile.userId === currentUser.id ? updatedProfile : profile
      );
      setAllProfiles(updatedProfiles);
      
      localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updatedProfiles));
      
      console.log("Profile updated locally (Supabase failed):", updatedProfile);
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

      // Get the profile to update requested users tracking
      const profileToSwipe = allProfiles.find(p => p.id === profileId);
      
      if (direction === 'right' && profileToSwipe) {
        // Track requested user
        const newRequestedIds = new Set(requestedUserIds);
        newRequestedIds.add(profileToSwipe.userId);
        setRequestedUserIds(newRequestedIds);
        
        localStorage.setItem(
          `${STORAGE_KEYS.REQUESTED_USERS}${currentUser.id}`, 
          JSON.stringify([...newRequestedIds])
        );

        // Create connection in Supabase
        try {
          const { data, error } = await supabase
            .from('connections')
            .insert({
              user_id: currentUser.id,
              connected_user_id: profileToSwipe.userId,
              status: 'pending',
              created_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (error) {
            throw error;
          }
          
          // Map Supabase connection to our Connection interface
          const newConnection: Connection = {
            id: data.id,
            userId: currentUser.id,
            connectedUserId: profileToSwipe.userId,
            status: 'pending',
            createdAt: data.created_at
          };
          
          // Check if the other user has already sent a request to create a match
          const existingRequest = matches.find(
            m => m.userId === profileToSwipe.userId && m.connectedUserId === currentUser.id && m.status === 'pending'
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
            localStorage.setItem(`${STORAGE_KEYS.MATCHES}${currentUser.id}`, JSON.stringify(updatedMatches));
          } else {
            // Simply add the new connection if no match
            const updatedMatches = [...matches, newConnection];
            setMatches(updatedMatches);
            localStorage.setItem(`${STORAGE_KEYS.MATCHES}${currentUser.id}`, JSON.stringify(updatedMatches));
          }
        } catch (error) {
          console.error("Error creating connection in Supabase:", error);
          
          // Fallback to localStorage if Supabase fails
          const newConnection: Connection = {
            id: `connection_${Date.now()}`,
            userId: currentUser.id,
            connectedUserId: profileToSwipe.userId,
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          
          const updatedMatches = [...matches, newConnection];
          setMatches(updatedMatches);
          localStorage.setItem(`${STORAGE_KEYS.MATCHES}${currentUser.id}`, JSON.stringify(updatedMatches));
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
      localStorage.setItem(`${STORAGE_KEYS.MATCHES}${currentUser.id}`, JSON.stringify(updatedMatches));
      console.log(`Connection ${connectionId} updated to ${accept ? 'connected' : 'rejected'}`);
    } catch (error) {
      console.error("Error updating connection in Supabase:", error);
      
      // Fallback to localStorage if Supabase fails
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
      localStorage.setItem(`${STORAGE_KEYS.MATCHES}${currentUser.id}`, JSON.stringify(updatedMatches));
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
