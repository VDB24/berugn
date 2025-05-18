
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import Header from '@/components/Header';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  ListFilter, 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// Import types and new components
import { TableName, ProfileData, WorkExperience, Education, Project, Certificate } from '@/components/profile/types';
import ProfileHeader from '@/components/profile/ProfileHeader';
import WorkExperienceSection from '@/components/profile/WorkExperienceSection';
import EducationSection from '@/components/profile/EducationSection';
import ProjectsSection from '@/components/profile/ProjectsSection';
import CertificatesSection from '@/components/profile/CertificatesSection';

// Import form data types
import { WorkExperienceFormData } from '@/components/profile/WorkExperienceForm';
import { EducationFormData } from '@/components/profile/EducationForm';
import { ProjectFormData } from '@/components/profile/ProjectForm';
import { CertificateFormData } from '@/components/profile/CertificateForm';

const ExtendedProfile = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for profile data and other sections
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  console.log("ExtendedProfile rendered, currentUser:", currentUser);
  console.log("isLoading:", isLoading, "hasError:", hasError);
  
  // Fetch all profile data when component mounts
  useEffect(() => {
    if (currentUser) {
      console.log('Current user found:', currentUser.id);
      fetchAllProfileData();
    } else {
      console.log('No current user found');
      // Set a timeout to allow for auth to initialize if it's just taking time
      const timer = setTimeout(() => {
        if (!currentUser) {
          console.log('Still no current user after timeout');
          setIsLoading(false);
          setHasError(true);
          toast({
            title: 'Authentication Error',
            description: 'Please login to view your profile.',
            variant: 'destructive',
          });
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser]);
  
  // Simulated progressive loading for better UX
  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + 20;
          if (newProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return newProgress;
        });
      }, 500);
      
      return () => clearInterval(timer);
    }
  }, [isLoading]);
  
  // Fetch all profile sections
  const fetchAllProfileData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      console.log('Fetching profile data for user:', currentUser.id);
      
      // Fetch profile info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // If no profile exists yet, create a minimal one
        if (profileError.code === 'PGRST116') {
          console.log('No profile found, creating minimal profile');
          const minimal: ProfileData = {
            name: currentUser.email?.split('@')[0] || 'New User',
            job_title: null,
            company: null,
            bio: null,
            linkedin_url: null,
            profile_image: null,
            experience: null,
            industry: null,
            skills: []
          };
          setProfileData(minimal);
          
          // Try to create a minimal profile in the database
          try {
            await supabase
              .from('profiles')
              .insert({
                user_id: currentUser.id,
                name: minimal.name,
                skills: []
              });
            console.log('Created minimal profile');
          } catch (insertError) {
            console.error('Error creating minimal profile:', insertError);
          }
        } else {
          throw profileError;
        }
      } else {
        console.log('Profile data fetched:', profileData);
        setProfileData(profileData as ProfileData);
      }
      
      // Fetch work experience
      const { data: workData, error: workError } = await supabase
        .from('work_experience')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('start_date', { ascending: false });
      
      if (workError) {
        console.error('Error fetching work experience:', workError);
        toast({
          title: 'Error',
          description: 'Failed to load work experience data.',
          variant: 'destructive',
        });
      } else {
        console.log('Work experience data fetched:', workData?.length || 0, 'items');
        setWorkExperience(workData as WorkExperience[]);
      }
      
      // Fetch education
      const { data: eduData, error: eduError } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('start_date', { ascending: false });
      
      if (eduError) {
        console.error('Error fetching education:', eduError);
        toast({
          title: 'Error',
          description: 'Failed to load education data.',
          variant: 'destructive',
        });
      } else {
        console.log('Education data fetched:', eduData?.length || 0, 'items');
        setEducation(eduData as Education[]);
      }
      
      // Fetch projects
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('start_date', { ascending: false });
      
      if (projectError) {
        console.error('Error fetching projects:', projectError);
        toast({
          title: 'Error',
          description: 'Failed to load projects data.',
          variant: 'destructive',
        });
      } else {
        console.log('Projects data fetched:', projectData?.length || 0, 'items');
        setProjects(projectData as Project[]);
      }
      
      // Fetch certificates
      const { data: certData, error: certError } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('issue_date', { ascending: false });
      
      if (certError) {
        console.error('Error fetching certificates:', certError);
        toast({
          title: 'Error',
          description: 'Failed to load certificates data.',
          variant: 'destructive',
        });
      } else {
        console.log('Certificates data fetched:', certData?.length || 0, 'items');
        setCertificates(certData as Certificate[]);
      }
      
      console.log('All profile data loaded successfully');
    } catch (error) {
      console.error('Error loading profile data:', error);
      setHasError(true);
      toast({
        title: 'Error',
        description: 'Failed to load profile data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      // Ensure we exit the loading state even if there are errors
      setTimeout(() => {
        setIsLoading(false);
        setLoadingProgress(100);
      }, 800); // Short delay for smoother transition
    }
  };
  
  // Handle adding work experience
  const handleAddWorkExperience = async (data: WorkExperienceFormData) => {
    setIsSaving(true);
    
    try {
      const formattedData = {
        user_id: currentUser.id,
        company: data.company,
        position: data.position,
        location: data.location || null,
        description: data.description || null,
        current: data.current || false,
        start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      };
      
      const { data: newWork, error } = await supabase
        .from('work_experience')
        .insert(formattedData)
        .select()
        .single();
        
      if (error) throw error;
      
      setWorkExperience(prev => [newWork as WorkExperience, ...prev]);
      
      toast({
        title: 'Work experience added',
        description: 'Your work experience has been added successfully.',
      });
    } catch (error) {
      console.error('Error saving work experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to save work experience. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle updating work experience
  const handleUpdateWorkExperience = async (id: string, data: WorkExperienceFormData) => {
    setIsSaving(true);
    
    try {
      const formattedData = {
        company: data.company,
        position: data.position,
        location: data.location || null,
        description: data.description || null,
        current: data.current || false,
        start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      };
      
      const { data: updatedWork, error } = await supabase
        .from('work_experience')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      setWorkExperience(prev => 
        prev.map(item => item.id === id ? (updatedWork as WorkExperience) : item)
      );
      
      toast({
        title: 'Work experience updated',
        description: 'Your work experience has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating work experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to update work experience. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle adding education
  const handleAddEducation = async (data: EducationFormData) => {
    setIsSaving(true);
    
    try {
      const formattedData = {
        user_id: currentUser.id,
        institution: data.institution,
        degree: data.degree,
        field_of_study: data.field_of_study || null,
        description: data.description || null,
        start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      };
      
      const { data: newEdu, error } = await supabase
        .from('education')
        .insert(formattedData)
        .select()
        .single();
        
      if (error) throw error;
      
      setEducation(prev => [newEdu as Education, ...prev]);
      
      toast({
        title: 'Education added',
        description: 'Your education has been added successfully.',
      });
    } catch (error) {
      console.error('Error saving education:', error);
      toast({
        title: 'Error',
        description: 'Failed to save education. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle updating education
  const handleUpdateEducation = async (id: string, data: EducationFormData) => {
    setIsSaving(true);
    
    try {
      const formattedData = {
        institution: data.institution,
        degree: data.degree,
        field_of_study: data.field_of_study || null,
        description: data.description || null,
        start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      };
      
      const { data: updatedEdu, error } = await supabase
        .from('education')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      setEducation(prev => 
        prev.map(item => item.id === id ? (updatedEdu as Education) : item)
      );
      
      toast({
        title: 'Education updated',
        description: 'Your education has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating education:', error);
      toast({
        title: 'Error',
        description: 'Failed to update education. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle adding project
  const handleAddProject = async (data: ProjectFormData) => {
    setIsSaving(true);
    
    try {
      const formattedData = {
        user_id: currentUser.id,
        title: data.title,
        description: data.description || null,
        url: data.url || null,
        image_url: data.image_url || null,
        current: data.current || false,
        start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      };
      
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert(formattedData)
        .select()
        .single();
        
      if (error) throw error;
      
      setProjects(prev => [newProject as Project, ...prev]);
      
      toast({
        title: 'Project added',
        description: 'Your project has been added successfully.',
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle updating project
  const handleUpdateProject = async (id: string, data: ProjectFormData) => {
    setIsSaving(true);
    
    try {
      const formattedData = {
        title: data.title,
        description: data.description || null,
        url: data.url || null,
        image_url: data.image_url || null,
        current: data.current || false,
        start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      };
      
      const { data: updatedProject, error } = await supabase
        .from('projects')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      setProjects(prev => 
        prev.map(item => item.id === id ? (updatedProject as Project) : item)
      );
      
      toast({
        title: 'Project updated',
        description: 'Your project has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle adding certificate
  const handleAddCertificate = async (data: CertificateFormData) => {
    setIsSaving(true);
    
    try {
      const formattedData = {
        user_id: currentUser.id,
        name: data.name,
        issuing_organization: data.issuing_organization,
        credential_id: data.credential_id || null,
        credential_url: data.credential_url || null,
        issue_date: data.issue_date ? format(data.issue_date, 'yyyy-MM-dd') : null,
        expiration_date: data.expiration_date ? format(data.expiration_date, 'yyyy-MM-dd') : null,
      };
      
      const { data: newCert, error } = await supabase
        .from('certificates')
        .insert(formattedData)
        .select()
        .single();
        
      if (error) throw error;
      
      setCertificates(prev => [newCert as Certificate, ...prev]);
      
      toast({
        title: 'Certificate added',
        description: 'Your certificate has been added successfully.',
      });
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to save certificate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle updating certificate
  const handleUpdateCertificate = async (id: string, data: CertificateFormData) => {
    setIsSaving(true);
    
    try {
      const formattedData = {
        name: data.name,
        issuing_organization: data.issuing_organization,
        credential_id: data.credential_id || null,
        credential_url: data.credential_url || null,
        issue_date: data.issue_date ? format(data.issue_date, 'yyyy-MM-dd') : null,
        expiration_date: data.expiration_date ? format(data.expiration_date, 'yyyy-MM-dd') : null,
      };
      
      const { data: updatedCert, error } = await supabase
        .from('certificates')
        .update(formattedData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      setCertificates(prev => 
        prev.map(item => item.id === id ? (updatedCert as Certificate) : item)
      );
      
      toast({
        title: 'Certificate updated',
        description: 'Your certificate has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to update certificate. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle item deletion
  const handleDelete = async (type: TableName, id: string) => {
    try {
      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update state based on deleted item type
      switch (type) {
        case 'work_experience':
          setWorkExperience(prev => prev.filter(item => item.id !== id));
          toast({
            title: 'Work experience deleted',
            description: 'Work experience has been deleted successfully.',
          });
          break;
          
        case 'education':
          setEducation(prev => prev.filter(item => item.id !== id));
          toast({
            title: 'Education deleted',
            description: 'Education has been deleted successfully.',
          });
          break;
          
        case 'projects':
          setProjects(prev => prev.filter(item => item.id !== id));
          toast({
            title: 'Project deleted',
            description: 'Project has been deleted successfully.',
          });
          break;
          
        case 'certificates':
          setCertificates(prev => prev.filter(item => item.id !== id));
          toast({
            title: 'Certificate deleted',
            description: 'Certificate has been deleted successfully.',
          });
          break;
      }
      
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let score = 0;
    let total = 5; // Base sections to complete
    
    // Check profile data
    if (profileData) {
      if (profileData.name) score++;
      if (profileData.job_title) score++;
      if (profileData.bio) score++;
      if (profileData.skills && profileData.skills.length > 0) score++;
      if (profileData.industry) score++;
    }
    
    // Check other sections
    if (workExperience.length > 0) score++;
    if (education.length > 0) score++;
    if (projects.length > 0) score++;
    if (certificates.length > 0) score++;
    
    total += 4; // Add the other sections
    
    return Math.round((score / total) * 100);
  };
  
  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Render a fallback when there's no auth
  if (!currentUser && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container max-w-5xl px-4 py-8 mt-12">
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Authentication Required</h2>
            <p>Please log in to view your profile.</p>
            <Button onClick={handleLoginRedirect}>Log In</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-5xl px-4 py-8 mt-12">
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4">Loading your profile...</h2>
              <Progress value={loadingProgress} className="w-full max-w-md h-2" />
            </div>
            <div className="space-y-4 mt-8">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ) : hasError ? (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-destructive">Error Loading Profile</h2>
            <p>There was an error loading your profile data. Please try refreshing the page.</p>
            <Button 
              onClick={() => fetchAllProfileData()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {profileData ? (
              <>
                <ProfileHeader 
                  profileData={profileData} 
                  completionPercentage={calculateProfileCompletion()} 
                />
                
                {profileData?.bio && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">About</h2>
                    <p className="text-muted-foreground">{profileData.bio}</p>
                  </div>
                )}
                
                {profileData?.skills && profileData.skills.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Separator className="my-8" />
                
                <Accordion type="single" collapsible className="w-full" defaultValue="work">
                  {/* Work Experience Section */}
                  <AccordionItem value="work">
                    <AccordionTrigger className="text-xl font-semibold">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        Work Experience
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <WorkExperienceSection 
                        items={workExperience}
                        onAdd={handleAddWorkExperience}
                        onUpdate={handleUpdateWorkExperience}
                        onDelete={(id) => handleDelete('work_experience', id)}
                        isSaving={isSaving}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Education Section */}
                  <AccordionItem value="education">
                    <AccordionTrigger className="text-xl font-semibold">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Education
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <EducationSection 
                        items={education}
                        onAdd={handleAddEducation}
                        onUpdate={handleUpdateEducation}
                        onDelete={(id) => handleDelete('education', id)}
                        isSaving={isSaving}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Projects Section */}
                  <AccordionItem value="projects">
                    <AccordionTrigger className="text-xl font-semibold">
                      <div className="flex items-center">
                        <ListFilter className="h-5 w-5 mr-2" />
                        Projects
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ProjectsSection 
                        items={projects}
                        onAdd={handleAddProject}
                        onUpdate={handleUpdateProject}
                        onDelete={(id) => handleDelete('projects', id)}
                        isSaving={isSaving}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Certificates Section */}
                  <AccordionItem value="certificates">
                    <AccordionTrigger className="text-xl font-semibold">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Certificates
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CertificatesSection 
                        items={certificates}
                        onAdd={handleAddCertificate}
                        onUpdate={handleUpdateCertificate}
                        onDelete={(id) => handleDelete('certificates', id)}
                        isSaving={isSaving}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <div className="text-center py-8">
                <p>No profile data found. Please create a profile.</p>
                <Button 
                  onClick={() => fetchAllProfileData()} 
                  className="mt-4"
                >
                  Retry Loading Profile
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ExtendedProfile;
