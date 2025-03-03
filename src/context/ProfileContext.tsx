
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'connected';
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
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Mock data
const DEMO_PROFILES: Profile[] = [
  {
    id: '1',
    userId: '1',
    name: 'John Doe',
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp',
    industry: 'Technology',
    experience: '5-10 years',
    bio: 'Passionate about building scalable web applications and mentoring junior developers.',
    skills: [
      { id: '1', name: 'JavaScript' },
      { id: '2', name: 'React' },
      { id: '3', name: 'Node.js' }
    ],
    linkedInUrl: 'https://linkedin.com/in/johndoe',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    userId: '2',
    name: 'Sarah Johnson',
    jobTitle: 'Product Manager',
    company: 'InnovateCo',
    industry: 'Technology',
    experience: '3-5 years',
    bio: 'Driven product manager with a background in UX design and a passion for user-centric products.',
    skills: [
      { id: '4', name: 'Product Strategy' },
      { id: '5', name: 'Agile' },
      { id: '6', name: 'User Research' }
    ],
    linkedInUrl: 'https://linkedin.com/in/sarahjohnson',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    userId: '3',
    name: 'Michael Chen',
    jobTitle: 'Data Scientist',
    company: 'DataDriven',
    industry: 'Data & Analytics',
    experience: '1-3 years',
    bio: 'Data scientist specializing in machine learning models for business applications.',
    skills: [
      { id: '7', name: 'Python' },
      { id: '8', name: 'Machine Learning' },
      { id: '9', name: 'SQL' }
    ],
    linkedInUrl: 'https://linkedin.com/in/michaelchen',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    userId: '4',
    name: 'Emily Davis',
    jobTitle: 'Marketing Director',
    company: 'BrandBuilders',
    industry: 'Marketing',
    experience: '10+ years',
    bio: 'Creative marketing professional with expertise in digital strategy and brand development.',
    skills: [
      { id: '10', name: 'Digital Marketing' },
      { id: '11', name: 'Brand Strategy' },
      { id: '12', name: 'Content Creation' }
    ],
    linkedInUrl: 'https://linkedin.com/in/emilydavis',
    profileImage: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    userId: '5',
    name: 'James Wilson',
    jobTitle: 'UX Designer',
    company: 'DesignHub',
    industry: 'Design',
    experience: '3-5 years',
    bio: 'User experience designer passionate about creating intuitive and accessible digital products.',
    skills: [
      { id: '13', name: 'User Research' },
      { id: '14', name: 'Wireframing' },
      { id: '15', name: 'Figma' }
    ],
    linkedInUrl: 'https://linkedin.com/in/jameswilson',
    profileImage: 'https://randomuser.me/api/portraits/men/5.jpg'
  }
];

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

  // Load user profile when currentUser changes
  useEffect(() => {
    if (currentUser) {
      // Find user profile in mock data
      const profile = DEMO_PROFILES.find(p => p.userId === currentUser.id);
      
      if (profile) {
        setUserProfile(profile);
      }

      // Get potential connections (excluding the current user)
      const connections = DEMO_PROFILES.filter(p => p.userId !== currentUser.id);
      setPotentialConnections(connections);

      // Load saved preferences from localStorage
      const savedPreferences = localStorage.getItem(`swipe_connect_preferences_${currentUser.id}`);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }

      // Load saved matches from localStorage
      const savedMatches = localStorage.getItem(`swipe_connect_matches_${currentUser.id}`);
      if (savedMatches) {
        setMatches(JSON.parse(savedMatches));
      }
    } else {
      // Clear state when user logs out
      setUserProfile(null);
      setPotentialConnections([]);
      setMatches([]);
      setPreferences({
        industries: [],
        experienceLevels: [],
        connectionPurposes: []
      });
    }
  }, [currentUser]);

  const createProfile = async (profileData: Omit<Profile, 'id' | 'userId'>) => {
    if (!currentUser) throw new Error('No user is logged in');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create new profile
    const newProfile: Profile = {
      id: `profile_${Date.now()}`,
      userId: currentUser.id,
      ...profileData
    };

    // Update user profile in state
    setUserProfile(newProfile);

    // In a real app, this would be saved to a database
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!currentUser || !userProfile) throw new Error('No user profile found');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update profile
    const updatedProfile = { ...userProfile, ...profileData };

    // Update profile in state
    setUserProfile(updatedProfile);

    // In a real app, this would update the database
  };

  const swipeProfile = async (profileId: string, direction: 'left' | 'right') => {
    if (!currentUser) throw new Error('No user is logged in');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (direction === 'right') {
      // Create new connection
      const newConnection: Connection = {
        id: `connection_${Date.now()}`,
        userId: currentUser.id,
        connectedUserId: profileId,
        status: 'pending', // Would be 'connected' if matched
        createdAt: new Date().toISOString()
      };

      // In a real app, we would check if this creates a match

      // For demo purposes, randomly create matches ~30% of the time
      if (Math.random() > 0.7) {
        newConnection.status = 'connected';
        
        // Add to matches
        const updatedMatches = [...matches, newConnection];
        setMatches(updatedMatches);
        
        // Save to localStorage
        localStorage.setItem(`swipe_connect_matches_${currentUser.id}`, JSON.stringify(updatedMatches));
      }
    }

    // Remove swiped profile from potential connections
    const updatedConnections = potentialConnections.filter(p => p.id !== profileId);
    setPotentialConnections(updatedConnections);
  };

  const updatePreferences = async (newPreferences: Partial<Preference>) => {
    if (!currentUser) throw new Error('No user is logged in');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update preferences
    const updatedPreferences = { ...preferences, ...newPreferences };
    
    // Update in state
    setPreferences(updatedPreferences);
    
    // Save to localStorage
    localStorage.setItem(`swipe_connect_preferences_${currentUser.id}`, JSON.stringify(updatedPreferences));
  };

  const value = {
    userProfile,
    potentialConnections,
    matches,
    preferences,
    createProfile,
    updateProfile,
    swipeProfile,
    updatePreferences
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
