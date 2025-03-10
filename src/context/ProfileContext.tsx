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
  loadMoreProfiles: () => Promise<void>;
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
  },
  {
    id: '6',
    userId: '6',
    name: 'Jennifer Lee',
    jobTitle: 'Full Stack Developer',
    company: 'TechFusion',
    industry: 'Technology',
    experience: '3-5 years',
    bio: 'Full stack developer specializing in React and Node.js. Passionate about creating efficient, scalable applications and mentoring junior developers.',
    skills: [
      { id: '16', name: 'React' },
      { id: '17', name: 'Node.js' },
      { id: '18', name: 'TypeScript' }
    ],
    linkedInUrl: 'https://linkedin.com/in/jenniferlee',
    profileImage: 'https://randomuser.me/api/portraits/women/15.jpg'
  },
  {
    id: '7',
    userId: '7',
    name: 'Robert Garcia',
    jobTitle: 'Cybersecurity Analyst',
    company: 'SecureNet',
    industry: 'Information Security',
    experience: '5-10 years',
    bio: 'Cybersecurity professional with a focus on threat detection and incident response. Committed to building robust security systems for organizations.',
    skills: [
      { id: '19', name: 'Network Security' },
      { id: '20', name: 'Penetration Testing' },
      { id: '21', name: 'Incident Response' }
    ],
    linkedInUrl: 'https://linkedin.com/in/robertgarcia',
    profileImage: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    id: '8',
    userId: '8',
    name: 'Priya Patel',
    jobTitle: 'Product Designer',
    company: 'DesignIQ',
    industry: 'Design',
    experience: '3-5 years',
    bio: 'Product designer with a background in UX research and visual design. Passionate about creating user-centered products that solve real problems.',
    skills: [
      { id: '22', name: 'UX/UI Design' },
      { id: '23', name: 'Prototyping' },
      { id: '24', name: 'User Research' }
    ],
    linkedInUrl: 'https://linkedin.com/in/priyapatel',
    profileImage: 'https://randomuser.me/api/portraits/women/29.jpg'
  },
  {
    id: '9',
    userId: '9',
    name: 'David Kim',
    jobTitle: 'AI Research Scientist',
    company: 'InnovateAI',
    industry: 'Artificial Intelligence',
    experience: '5-10 years',
    bio: 'AI researcher specializing in natural language processing and machine learning. Focused on developing ethical AI solutions that enhance human capabilities.',
    skills: [
      { id: '25', name: 'Machine Learning' },
      { id: '26', name: 'Natural Language Processing' },
      { id: '27', name: 'Python' }
    ],
    linkedInUrl: 'https://linkedin.com/in/davidkim',
    profileImage: 'https://randomuser.me/api/portraits/men/36.jpg'
  },
  {
    id: '10',
    userId: '10',
    name: 'Sophia Martinez',
    jobTitle: 'Digital Marketing Specialist',
    company: 'GrowthHackers',
    industry: 'Marketing',
    experience: '1-3 years',
    bio: 'Digital marketing specialist with expertise in SEO, content marketing, and social media strategy. Passionate about data-driven marketing approaches.',
    skills: [
      { id: '28', name: 'SEO' },
      { id: '29', name: 'Content Strategy' },
      { id: '30', name: 'Social Media Marketing' }
    ],
    linkedInUrl: 'https://linkedin.com/in/sophiamartinez',
    profileImage: 'https://randomuser.me/api/portraits/women/42.jpg'
  }
];

// Additional profiles to load when refreshing
const ADDITIONAL_PROFILES: Profile[] = [
  {
    id: '11',
    userId: '11',
    name: 'Alex Rivera',
    jobTitle: 'Frontend Developer',
    company: 'WebSolutions',
    industry: 'Technology',
    experience: '1-3 years',
    bio: 'Frontend developer specializing in React and Vue. Passionate about creating beautiful and accessible user interfaces.',
    skills: [
      { id: '31', name: 'React' },
      { id: '32', name: 'Vue' },
      { id: '33', name: 'CSS' }
    ],
    linkedInUrl: 'https://linkedin.com/in/alexrivera',
    profileImage: 'https://randomuser.me/api/portraits/men/10.jpg'
  },
  {
    id: '12',
    userId: '12',
    name: 'Sophia Kim',
    jobTitle: 'Project Manager',
    company: 'GlobalTech',
    industry: 'Technology',
    experience: '3-5 years',
    bio: 'Project manager with a technical background, focused on delivering software products on time and within budget.',
    skills: [
      { id: '34', name: 'Agile' },
      { id: '35', name: 'Scrum' },
      { id: '36', name: 'JIRA' }
    ],
    linkedInUrl: 'https://linkedin.com/in/sophiakim',
    profileImage: 'https://randomuser.me/api/portraits/women/10.jpg'
  },
  {
    id: '13',
    userId: '13',
    name: 'Marcus Johnson',
    jobTitle: 'DevOps Engineer',
    company: 'CloudNative',
    industry: 'Technology',
    experience: '3-5 years',
    bio: 'DevOps engineer specializing in cloud infrastructure, CI/CD pipelines, and containerization technologies.',
    skills: [
      { id: '37', name: 'Docker' },
      { id: '38', name: 'Kubernetes' },
      { id: '39', name: 'AWS' }
    ],
    linkedInUrl: 'https://linkedin.com/in/marcusjohnson',
    profileImage: 'https://randomuser.me/api/portraits/men/15.jpg'
  },
  {
    id: '14',
    userId: '14',
    name: 'Olivia Taylor',
    jobTitle: 'Blockchain Developer',
    company: 'ChainInnovate',
    industry: 'Technology',
    experience: '1-3 years',
    bio: 'Blockchain developer with expertise in smart contracts and decentralized applications. Passionate about the future of Web3 technologies.',
    skills: [
      { id: '40', name: 'Solidity' },
      { id: '41', name: 'Ethereum' },
      { id: '42', name: 'Smart Contracts' }
    ],
    linkedInUrl: 'https://linkedin.com/in/oliviataylor',
    profileImage: 'https://randomuser.me/api/portraits/women/23.jpg'
  },
  {
    id: '15',
    userId: '15',
    name: 'Jason Park',
    jobTitle: 'Mobile App Developer',
    company: 'AppWorks',
    industry: 'Technology',
    experience: '3-5 years',
    bio: 'Mobile app developer specializing in React Native and Swift. Focused on creating seamless cross-platform experiences.',
    skills: [
      { id: '43', name: 'React Native' },
      { id: '44', name: 'Swift' },
      { id: '45', name: 'Mobile UX' }
    ],
    linkedInUrl: 'https://linkedin.com/in/jasonpark',
    profileImage: 'https://randomuser.me/api/portraits/men/28.jpg'
  },
  {
    id: '16',
    userId: '16',
    name: 'Emma Rodriguez',
    jobTitle: 'UI/UX Researcher',
    company: 'UserFirst',
    industry: 'Design',
    experience: '1-3 years',
    bio: 'UI/UX researcher focused on understanding user behaviors and needs through qualitative and quantitative methods.',
    skills: [
      { id: '46', name: 'User Testing' },
      { id: '47', name: 'Usability Studies' },
      { id: '48', name: 'Data Analysis' }
    ],
    linkedInUrl: 'https://linkedin.com/in/emmarodriguez',
    profileImage: 'https://randomuser.me/api/portraits/women/33.jpg'
  },
  {
    id: '17',
    userId: '17',
    name: 'Tyler Jackson',
    jobTitle: 'Game Developer',
    company: 'GameCraft',
    industry: 'Gaming',
    experience: '3-5 years',
    bio: 'Game developer with experience in Unity and Unreal Engine. Passionate about creating immersive gaming experiences.',
    skills: [
      { id: '49', name: 'Unity' },
      { id: '50', name: 'C#' },
      { id: '51', name: 'Game Design' }
    ],
    linkedInUrl: 'https://linkedin.com/in/tylerjackson',
    profileImage: 'https://randomuser.me/api/portraits/men/45.jpg'
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
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);

  // Load user profile when currentUser changes
  useEffect(() => {
    if (currentUser) {
      // Find user profile in mock data
      const profile = DEMO_PROFILES.find(p => p.userId === currentUser.id);
      
      if (profile) {
        setUserProfile(profile);
      }

      // Get potential connections (excluding the current user) and store all profiles
      const connections = DEMO_PROFILES.filter(p => p.userId !== currentUser.id);
      setAllProfiles(connections);
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
      setAllProfiles([]);
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

    // Remove swiped profile from potential connections but don't remove from allProfiles
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

  // New function to load more profiles (refresh)
  const loadMoreProfiles = async () => {
    if (!currentUser) throw new Error('No user is logged in');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, fetch new profiles from API
    // For demo, reset the potential connections to include all profiles and add additional ones
    const newProfiles = [...allProfiles, ...ADDITIONAL_PROFILES];
    setAllProfiles(newProfiles);
    setPotentialConnections(newProfiles);
  };

  const value = {
    userProfile,
    potentialConnections,
    matches,
    preferences,
    createProfile,
    updateProfile,
    swipeProfile,
    updatePreferences,
    loadMoreProfiles
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
