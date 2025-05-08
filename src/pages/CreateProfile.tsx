
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Plus, X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CreateProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { createProfile, userProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form state
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState('');
  const [bio, setBio] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  // Check if user already has a profile
  useEffect(() => {
    const checkProfile = async () => {
      if (userProfile) {
        console.log('User already has a profile:', userProfile);
        // Make sure the currentUser profile status is updated
        if (currentUser && !currentUser.profileCompleted) {
          await updateUserProfile({ profileCompleted: true });
        }
        setIsCheckingProfile(false);
      } else {
        setIsCheckingProfile(false);
      }
    };
    
    checkProfile();
  }, [currentUser, userProfile, updateUserProfile]);

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user already has a profile (after checking), redirect to browse page
  if (!isCheckingProfile && (currentUser.profileCompleted || userProfile)) {
    return <Navigate to="/browse" />;
  }

  // Handle adding a skill
  const handleAddSkill = () => {
    if (skillInput.trim() !== '') {
      setSkills([...skills, { id: `skill_${Date.now()}`, name: skillInput.trim() }]);
      setSkillInput('');
    }
  };

  // Handle removing a skill
  const handleRemoveSkill = (skillId: string) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (name.trim() === '' || jobTitle.trim() === '' || industry === '' || experience === '') {
        throw new Error('Please fill in all required fields');
      }
      
      if (skills.length === 0) {
        throw new Error('Please add at least one skill');
      }
      
      // Create profile
      await createProfile({
        name,
        jobTitle,
        company,
        industry,
        experience,
        bio,
        linkedInUrl,
        skills,
      });
      
      // Update user profile status
      await updateUserProfile({ profileCompleted: true, name });
      
      toast({
        title: 'Profile created',
        description: 'Your professional profile has been created successfully.',
      });
      
      // Redirect to preferences page
      navigate('/preferences');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Industry options
  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Marketing',
    'Design',
    'Engineering',
    'Sales',
    'Consulting',
    'Human Resources',
    'Legal',
    'Media',
    'Non-profit',
    'Retail',
    'Manufacturing',
    'Other',
  ];

  // Experience level options
  const experienceLevels = [
    'Entry level',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years',
    'Executive',
  ];

  // Display loading state while checking profile
  if (isCheckingProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-3xl px-4 py-12 mt-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Loading profile information...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-3xl px-4 py-12 mt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Professional Profile</h1>
          <p className="text-gray-600">
            Tell us about your professional background to help us find the right connections
          </p>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}
            
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedInUrl">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedInUrl"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    type="url"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Professional Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Senior Software Engineer"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Google"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select 
                    value={industry} 
                    onValueChange={setIndustry}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level *</Label>
                  <Select 
                    value={experience} 
                    onValueChange={setExperience}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((exp) => (
                        <SelectItem key={exp} value={exp}>
                          {exp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Skills */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Skills *</h2>
              
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="skill">Add a skill</Label>
                    <Input
                      id="skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="JavaScript"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAddSkill}
                    variant="outline"
                    size="icon"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group flex items-center gap-1 rounded-full bg-secondary/10 text-secondary px-3 py-1"
                    >
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="text-secondary/70 hover:text-secondary"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm text-gray-500">
                      Add skills to help us match you with relevant professionals
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Bio */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Professional Bio</h2>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Tell us about yourself</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="I'm a software engineer with 5 years of experience..."
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  This will be visible to potential connections
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateProfile;
