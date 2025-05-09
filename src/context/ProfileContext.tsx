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

  // Load user profiles from Supabase
  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        // In a real app, this would fetch from Supabase
        // For now, we'll simulate fetching profiles that would be in the database
        const mockProfiles: Profile[] = [
          {
            id: `profile_1`,
            userId: 'user_1',
            name: 'Alex Johnson',
            jobTitle: 'Software Engineer',
            company: 'Tech Solutions Inc.',
            industry: 'Technology',
            skills: [
              { id: 'skill_1', name: 'JavaScript' },
              { id: 'skill_2', name: 'React' },
              { id: 'skill_3', name: 'Node.js' }
            ],
            experience: '5-10 years',
            bio: 'Passionate about building scalable web applications and mentoring junior developers.',
            profileImage: 'https://i.pravatar.cc/300?img=11'
          },
          {
            id: `profile_2`,
            userId: 'user_2',
            name: 'Jamie Smith',
            jobTitle: 'Product Manager',
            company: 'InnovateCo',
            industry: 'Product Management',
            skills: [
              { id: 'skill_4', name: 'Agile' },
              { id: 'skill_5', name: 'User Research' },
              { id: 'skill_6', name: 'Roadmapping' }
            ],
            experience: '3-5 years',
            bio: 'Focused on delivering user-centric products that solve real problems.',
            profileImage: 'https://i.pravatar.cc/300?img=12'
          },
          {
            id: `profile_3`,
            userId: 'user_3',
            name: 'Jordan Lee',
            jobTitle: 'UI/UX Designer',
            company: 'Design Forward',
            industry: 'Design',
            skills: [
              { id: 'skill_7', name: 'Figma' },
              { id: 'skill_8', name: 'User Testing' },
              { id: 'skill_9', name: 'Wireframing' }
            ],
            experience: '1-3 years',
            bio: 'Creating delightful digital experiences through thoughtful design solutions.',
            profileImage: 'https://i.pravatar.cc/300?img=13'
          }
        ];
        
        setAllProfiles(mockProfiles);
        console.log('Loaded profiles:', mockProfiles.length);
        
        // Save to localStorage for persistence across refreshes
        localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(mockProfiles));
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };
    
    // Only load mock data if there are no profiles in localStorage yet
    const storedProfiles = localStorage.getItem(STORAGE_KEYS.USER_PROFILES);
    if (!storedProfiles) {
      fetchAllProfiles();
    } else {
      try {
        const parsedProfiles = JSON.parse(storedProfiles);
        setAllProfiles(parsedProfiles);
        console.log('Loaded profiles from storage:', parsedProfiles.length);
      } catch (error) {
        console.error('Error parsing stored profiles:', error);
      }
    }
    
    setIsInitialDataLoaded(true);
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
    
    // Check if user has created a profile before
    const hasCreatedProfile = localStorage.getItem(`${STORAGE_KEYS.CREATED_PROFILE}${currentUser.id}`);
    
    // Find user's profile in all profiles
    const userProfileData = allProfiles.find(p => p.userId === currentUser.id);
    
    if (userProfileData) {
      console.log('Found existing profile for user:', currentUser.id);
      setUserProfile(userProfileData);
    } else if (hasCreatedProfile) {
      console.log('User has created a profile before, but profile not found');
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

    const savedMatches = localStorage.getItem(`${STORAGE_KEYS.MATCHES}${currentUser.id}`);
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }
  }, [currentUser, allProfiles, isInitialDataLoaded]);

  const createProfile = async (profileData: Omit<Profile, 'id' | 'userId'>) => {
    if (!currentUser) throw new Error('No user is logged in');

    await new Promise(resolve => setTimeout(resolve, 500)); // Shorter delay for better UX

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
    
    console.log("Profile created and saved:", newProfile);
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!currentUser || !userProfile) throw new Error('No user profile found');

    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedProfile = { ...userProfile, ...profileData };

    setUserProfile(updatedProfile);
    
    const updatedProfiles = allProfiles.map(profile => 
      profile.userId === currentUser.id ? updatedProfile : profile
    );
    setAllProfiles(updatedProfiles);
    
    localStorage.setItem(STORAGE_KEYS.USER_PROFILES, JSON.stringify(updatedProfiles));
  };

  const swipeProfile = async (profileId: string, direction: 'left' | 'right') => {
    if (!currentUser) throw new Error('No user is logged in');
    
    console.log(`Starting swipe for profile ${profileId} in direction ${direction}`);
    
    try {
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

        // Check if other user has already requested a connection to simulate match
        const existingRequest = matches.find(
          m => m.userId === profileToSwipe.userId && m.connectedUserId === currentUser.id && m.status === 'pending'
        );
        
        if (existingRequest) {
          // Update existing request to 'connected'
          const updatedExistingRequest: Connection = {
            ...existingRequest,
            status: 'connected'
          };
          
          const finalMatches = updatedMatches.map(m => 
            m.id === existingRequest.id ? updatedExistingRequest : m
          );
          
          setMatches(finalMatches);
          localStorage.setItem(`${STORAGE_KEYS.MATCHES}${currentUser.id}`, JSON.stringify(finalMatches));
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

    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedPreferences = { ...preferences, ...newPreferences };
    
    setPreferences(updatedPreferences);
    localStorage.setItem(`${STORAGE_KEYS.PREFERENCES}${currentUser.id}`, JSON.stringify(updatedPreferences));
    
    console.log("Preferences saved:", updatedPreferences);
  };

  const respondToRequest = async (connectionId: string, accept: boolean) => {
    if (!currentUser) throw new Error('No user is logged in');
    
    try {
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
    } catch (error) {
      console.error("Error responding to connection request:", error);
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
