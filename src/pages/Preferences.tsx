
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Design',
  'Engineering',
  'Sales',
  'Customer Service',
  'Human Resources'
];

const EXPERIENCE_LEVELS = [
  'Entry Level (0-1 years)',
  'Junior (1-3 years)',
  'Mid-Level (3-5 years)',
  'Senior (5-10 years)',
  'Expert (10+ years)'
];

const CONNECTION_PURPOSES = [
  'Mentorship',
  'Job Opportunities',
  'Networking',
  'Collaboration',
  'Industry Insights',
  'Career Advice'
];

const Preferences = () => {
  const { currentUser } = useAuth();
  const { preferences, updatePreferences } = useProfile();
  const { toast } = useToast();
  
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([]);
  const [selectedConnectionPurposes, setSelectedConnectionPurposes] = useState<string[]>([]);
  const [locationRange, setLocationRange] = useState<number>(50);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved preferences
  useEffect(() => {
    if (preferences) {
      setSelectedIndustries(preferences.industries || []);
      setSelectedExperienceLevels(preferences.experienceLevels || []);
      setSelectedConnectionPurposes(preferences.connectionPurposes || []);
    }
  }, [preferences]);

  // Handle redirects if not logged in
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updatePreferences({
        industries: selectedIndustries,
        experienceLevels: selectedExperienceLevels,
        connectionPurposes: selectedConnectionPurposes
      });
      
      toast({
        title: "Preferences updated",
        description: "Your connection preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle selection for checkboxes
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const toggleExperience = (level: string) => {
    setSelectedExperienceLevels(prev => 
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const togglePurpose = (purpose: string) => {
    setSelectedConnectionPurposes(prev => 
      prev.includes(purpose)
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl px-4 py-12 mt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Connection Preferences</h1>
          <p className="text-muted-foreground">
            Customize who you'd like to connect with
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Industries</CardTitle>
                <CardDescription>
                  Select industries you're interested in connecting with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {INDUSTRIES.map(industry => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`industry-${industry}`} 
                        checked={selectedIndustries.includes(industry)}
                        onCheckedChange={() => toggleIndustry(industry)}
                      />
                      <Label htmlFor={`industry-${industry}`}>{industry}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Experience Levels</CardTitle>
                <CardDescription>
                  Select experience levels you'd like to connect with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {EXPERIENCE_LEVELS.map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`experience-${level}`} 
                        checked={selectedExperienceLevels.includes(level)}
                        onCheckedChange={() => toggleExperience(level)}
                      />
                      <Label htmlFor={`experience-${level}`}>{level}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connection Purposes</CardTitle>
                <CardDescription>
                  What are you looking to gain from connections?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {CONNECTION_PURPOSES.map(purpose => (
                    <div key={purpose} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`purpose-${purpose}`} 
                        checked={selectedConnectionPurposes.includes(purpose)}
                        onCheckedChange={() => togglePurpose(purpose)}
                      />
                      <Label htmlFor={`purpose-${purpose}`}>{purpose}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Future Features</CardTitle>
                <CardDescription>
                  These features will be available soon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="location">Location Range (Miles)</Label>
                    <span>{locationRange} miles</span>
                  </div>
                  <Slider
                    id="location"
                    disabled
                    min={5}
                    max={100}
                    step={5}
                    value={[locationRange]}
                    onValueChange={(value) => setLocationRange(value[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Location matching coming soon
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-2 opacity-50">
                  <Checkbox id="premium" disabled />
                  <Label htmlFor="premium" className="text-muted-foreground">
                    Premium matching features
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button type="submit" size="lg" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Preferences;
