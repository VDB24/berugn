
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import Header from '@/components/Header';
import { 
  CalendarIcon, 
  BadgeCheck, 
  Building, 
  GraduationCap, 
  Award, 
  Briefcase, 
  Calendar, 
  ListFilter, 
  Plus, 
  Edit, 
  Trash2,
  User,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the types for our data
type WorkExperience = {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
  location: string | null;
  description: string | null;
};

type Education = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  current: boolean;
};

type Certificate = {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string | null;
  expiration_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
};

type ProfileData = {
  name: string;
  job_title: string | null;
  company: string | null;
  bio: string | null;
  linkedin_url: string | null;
  profile_image: string | null;
  experience: string | null;
  industry: string | null;
  skills: string[];
};

// Define the database table names as a type
type TableName = 'work_experience' | 'education' | 'projects' | 'certificates';

// Form schemas
const workExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  description: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().optional(),
  image_url: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  current: z.boolean().default(false),
});

const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuing_organization: z.string().min(1, "Issuing organization is required"),
  issue_date: z.date().optional(),
  expiration_date: z.date().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().optional(),
});

const ExtendedProfile = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // State for profile data and other sections
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  // Dialog open states
  const [dialogOpen, setDialogOpen] = useState<{
    type: string;
    action: string;
    data?: any;
  } | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Fetch all profile data when component mounts
  useEffect(() => {
    if (currentUser) {
      fetchAllProfileData();
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
    try {
      // Fetch profile info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();
      
      setProfileData(profileData as ProfileData);
      
      // Fetch work experience
      const { data: workData } = await supabase
        .from('work_experience')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('start_date', { ascending: false });
      
      setWorkExperience(workData as WorkExperience[]);
      
      // Fetch education
      const { data: eduData } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('start_date', { ascending: false });
      
      setEducation(eduData as Education[]);
      
      // Fetch projects
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('start_date', { ascending: false });
      
      setProjects(projectData as Project[]);
      
      // Fetch certificates
      const { data: certData } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('issue_date', { ascending: false });
      
      setCertificates(certData as Certificate[]);
      
      console.log('All profile data loaded successfully');
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create work experience form
  const workExperienceForm = useForm<z.infer<typeof workExperienceSchema>>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company: '',
      position: '',
      location: '',
      current: false,
      description: '',
    },
  });
  
  // Create education form
  const educationForm = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      field_of_study: '',
      description: '',
    },
  });
  
  // Create project form
  const projectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      url: '',
      image_url: '',
      current: false,
    },
  });
  
  // Create certificate form
  const certificateForm = useForm<z.infer<typeof certificateSchema>>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: '',
      issuing_organization: '',
      credential_id: '',
      credential_url: '',
    },
  });
  
  // Open dialog to add new item or edit existing
  const openDialog = (type: string, action: string, data?: any) => {
    setDialogOpen({ type, action, data });
    
    // Reset forms
    switch (type) {
      case 'work_experience':
        workExperienceForm.reset(
          action === 'edit' ? {
            company: data.company,
            position: data.position,
            location: data.location || '',
            description: data.description || '',
            current: data.current || false,
            ...(data.start_date && { start_date: new Date(data.start_date) }),
            ...(data.end_date && { end_date: new Date(data.end_date) }),
          } : {
            company: '',
            position: '',
            location: '',
            description: '',
            current: false,
          }
        );
        break;
        
      case 'education':
        educationForm.reset(
          action === 'edit' ? {
            institution: data.institution,
            degree: data.degree,
            field_of_study: data.field_of_study || '',
            description: data.description || '',
            ...(data.start_date && { start_date: new Date(data.start_date) }),
            ...(data.end_date && { end_date: new Date(data.end_date) }),
          } : {
            institution: '',
            degree: '',
            field_of_study: '',
            description: '',
          }
        );
        break;
        
      case 'project':
        projectForm.reset(
          action === 'edit' ? {
            title: data.title,
            description: data.description || '',
            url: data.url || '',
            image_url: data.image_url || '',
            current: data.current || false,
            ...(data.start_date && { start_date: new Date(data.start_date) }),
            ...(data.end_date && { end_date: new Date(data.end_date) }),
          } : {
            title: '',
            description: '',
            url: '',
            image_url: '',
            current: false,
          }
        );
        break;
        
      case 'certificate':
        certificateForm.reset(
          action === 'edit' ? {
            name: data.name,
            issuing_organization: data.issuing_organization,
            credential_id: data.credential_id || '',
            credential_url: data.credential_url || '',
            ...(data.issue_date && { issue_date: new Date(data.issue_date) }),
            ...(data.expiration_date && { expiration_date: new Date(data.expiration_date) }),
          } : {
            name: '',
            issuing_organization: '',
            credential_id: '',
            credential_url: '',
          }
        );
        break;
    }
  };
  
  // Close dialog
  const closeDialog = () => {
    setDialogOpen(null);
    workExperienceForm.reset();
    educationForm.reset();
    projectForm.reset();
    certificateForm.reset();
  };
  
  // Handle form submission for work experience
  const handleWorkExperienceSubmit = async (data: z.infer<typeof workExperienceSchema>) => {
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
      
      if (dialogOpen?.action === 'add') {
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
      } else if (dialogOpen?.action === 'edit' && dialogOpen.data) {
        const { data: updatedWork, error } = await supabase
          .from('work_experience')
          .update(formattedData)
          .eq('id', dialogOpen.data.id)
          .select()
          .single();
          
        if (error) throw error;
        
        setWorkExperience(prev => 
          prev.map(item => item.id === dialogOpen.data.id ? (updatedWork as WorkExperience) : item)
        );
        
        toast({
          title: 'Work experience updated',
          description: 'Your work experience has been updated successfully.',
        });
      }
      
      closeDialog();
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
  
  // Handle form submission for education
  const handleEducationSubmit = async (data: z.infer<typeof educationSchema>) => {
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
      
      if (dialogOpen?.action === 'add') {
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
      } else if (dialogOpen?.action === 'edit' && dialogOpen.data) {
        const { data: updatedEdu, error } = await supabase
          .from('education')
          .update(formattedData)
          .eq('id', dialogOpen.data.id)
          .select()
          .single();
          
        if (error) throw error;
        
        setEducation(prev => 
          prev.map(item => item.id === dialogOpen.data.id ? (updatedEdu as Education) : item)
        );
        
        toast({
          title: 'Education updated',
          description: 'Your education has been updated successfully.',
        });
      }
      
      closeDialog();
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
  
  // Handle form submission for project
  const handleProjectSubmit = async (data: z.infer<typeof projectSchema>) => {
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
      
      if (dialogOpen?.action === 'add') {
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
      } else if (dialogOpen?.action === 'edit' && dialogOpen.data) {
        const { data: updatedProject, error } = await supabase
          .from('projects')
          .update(formattedData)
          .eq('id', dialogOpen.data.id)
          .select()
          .single();
          
        if (error) throw error;
        
        setProjects(prev => 
          prev.map(item => item.id === dialogOpen.data.id ? (updatedProject as Project) : item)
        );
        
        toast({
          title: 'Project updated',
          description: 'Your project has been updated successfully.',
        });
      }
      
      closeDialog();
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
  
  // Handle form submission for certificate
  const handleCertificateSubmit = async (data: z.infer<typeof certificateSchema>) => {
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
      
      if (dialogOpen?.action === 'add') {
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
      } else if (dialogOpen?.action === 'edit' && dialogOpen.data) {
        const { data: updatedCert, error } = await supabase
          .from('certificates')
          .update(formattedData)
          .eq('id', dialogOpen.data.id)
          .select()
          .single();
          
        if (error) throw error;
        
        setCertificates(prev => 
          prev.map(item => item.id === dialogOpen.data.id ? (updatedCert as Certificate) : item)
        );
        
        toast({
          title: 'Certificate updated',
          description: 'Your certificate has been updated successfully.',
        });
      }
      
      closeDialog();
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

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    return format(new Date(dateString), 'MMM yyyy');
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

  // Render work experience item
  const renderWorkExperienceItem = (item: WorkExperience) => (
    <Card key={item.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.position}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building className="h-4 w-4 mr-1" />
              {item.company}
              {item.location && ` • ${item.location}`}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => openDialog('work_experience', 'edit', item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete('work_experience', item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(item.start_date)} - {item.current ? 'Present' : formatDate(item.end_date)}
        </div>
        {item.description && <p className="text-sm mt-2">{item.description}</p>}
      </CardContent>
    </Card>
  );

  // Render education item
  const renderEducationItem = (item: Education) => (
    <Card key={item.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.degree}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <GraduationCap className="h-4 w-4 mr-1" />
              {item.institution}
              {item.field_of_study && ` • ${item.field_of_study}`}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => openDialog('education', 'edit', item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete('education', item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(item.start_date)} - {formatDate(item.end_date)}
        </div>
        {item.description && <p className="text-sm mt-2">{item.description}</p>}
      </CardContent>
    </Card>
  );

  // Render project item
  const renderProjectItem = (item: Project) => (
    <Card key={item.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            {item.url && (
              <CardDescription className="flex items-center mt-1">
                <ExternalLink className="h-4 w-4 mr-1" />
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Project Link
                </a>
              </CardDescription>
            )}
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => openDialog('project', 'edit', item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete('projects', item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(item.start_date)} - {item.current ? 'Present' : formatDate(item.end_date)}
        </div>
        {item.description && <p className="text-sm mt-2">{item.description}</p>}
      </CardContent>
    </Card>
  );

  // Render certificate item
  const renderCertificateItem = (item: Certificate) => (
    <Card key={item.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <BadgeCheck className="h-4 w-4 mr-1" />
              {item.issuing_organization}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => openDialog('certificate', 'edit', item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleDelete('certificates', item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {item.issue_date ? `Issued: ${formatDate(item.issue_date)}` : 'No issue date'}
          {item.expiration_date && ` • Expires: ${formatDate(item.expiration_date)}`}
        </div>
        {item.credential_id && (
          <div className="text-sm mt-2">
            <span className="font-medium">Credential ID:</span> {item.credential_id}
          </div>
        )}
        {item.credential_url && (
          <div className="text-sm mt-1">
            <a 
              href={item.credential_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Credential
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Render work experience form
  const renderWorkExperienceForm = () => (
    <Form {...workExperienceForm}>
      <form onSubmit={workExperienceForm.handleSubmit(handleWorkExperienceSubmit)} className="space-y-4">
        <FormField
          control={workExperienceForm.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={workExperienceForm.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="Job title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={workExperienceForm.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={workExperienceForm.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={workExperienceForm.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                        disabled={workExperienceForm.watch("current")}
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={workExperienceForm.control}
          name="current"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      workExperienceForm.setValue("end_date", undefined);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Current Position</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={workExperienceForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your responsibilities and achievements" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  // Render education form
  const renderEducationForm = () => (
    <Form {...educationForm}>
      <form onSubmit={educationForm.handleSubmit(handleEducationSubmit)} className="space-y-4">
        <FormField
          control={educationForm.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution</FormLabel>
              <FormControl>
                <Input placeholder="University or school name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={educationForm.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input placeholder="Bachelor's, Master's, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={educationForm.control}
          name="field_of_study"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field of Study</FormLabel>
              <FormControl>
                <Input placeholder="Computer Science, Business, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={educationForm.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={educationForm.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={educationForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Activities, achievements, etc." 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  // Render project form
  const renderProjectForm = () => (
    <Form {...projectForm}>
      <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-4">
        <FormField
          control={projectForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={projectForm.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={projectForm.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={projectForm.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={projectForm.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && "text-muted-foreground"
                        }`}
                        disabled={projectForm.watch("current")}
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={projectForm.control}
          name="current"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    if (checked) {
                      projectForm.setValue("end_date", undefined);
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Current Project</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={projectForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your project" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  // Render certificate form
  const renderCertificateForm = () => (
    <Form {...certificateForm}>
      <form onSubmit={certificateForm.handleSubmit(handleCertificateSubmit)} className="space-y-4">
        <FormField
          control={certificateForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate Name</FormLabel>
              <FormControl>
                <Input placeholder="Certificate title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={certificateForm.control}
          name="issuing_organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issuing Organization</FormLabel>
              <FormControl>
                <Input placeholder="Organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={certificateForm.control}
            name="issue_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Issue Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={certificateForm.control}
            name="expiration_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expiration Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        {field.value ? (
                          format(field.value, "MMM yyyy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={certificateForm.control}
          name="credential_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credential ID</FormLabel>
              <FormControl>
                <Input placeholder="Certificate ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={certificateForm.control}
          name="credential_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credential URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );

  // Render profile header
  const renderProfileHeader = () => (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
      <Avatar className="h-24 w-24">
        {profileData?.profile_image ? (
          <AvatarImage src={profileData.profile_image} alt={profileData.name} />
        ) : (
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold">{profileData?.name || 'Your Name'}</h1>
        <p className="text-xl text-muted-foreground mt-1">
          {profileData?.job_title || 'Job Title'} 
          {profileData?.company && ` at ${profileData.company}`}
        </p>
        
        {profileData?.industry && (
          <Badge variant="outline" className="mt-2">
            {profileData.industry}
          </Badge>
        )}
        
        {profileData?.linkedin_url && (
          <div className="mt-3">
            <a 
              href={profileData.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center justify-center md:justify-start"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              LinkedIn Profile
            </a>
          </div>
        )}
      </div>
      
      <div className="w-full md:w-auto">
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-medium">{calculateProfileCompletion()}%</span>
          </div>
          <Progress value={calculateProfileCompletion()} className="h-2" />
        </div>
      </div>
    </div>
  );

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
          </div>
        ) : (
          <>
            {renderProfileHeader()}
            
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
                  <div className="pt-4 pb-2">
                    <Button 
                      onClick={() => openDialog('work_experience', 'add')}
                      className="mb-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Work Experience
                    </Button>
                    
                    {workExperience.length > 0 ? (
                      <div className="space-y-4">
                        {workExperience.map(item => renderWorkExperienceItem(item))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No work experience added yet. Add your professional history to enhance your profile.
                      </p>
                    )}
                  </div>
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
                  <div className="pt-4 pb-2">
                    <Button 
                      onClick={() => openDialog('education', 'add')}
                      className="mb-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                    
                    {education.length > 0 ? (
                      <div className="space-y-4">
                        {education.map(item => renderEducationItem(item))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No education added yet. Add your educational background to complete your profile.
                      </p>
                    )}
                  </div>
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
                  <div className="pt-4 pb-2">
                    <Button 
                      onClick={() => openDialog('project', 'add')}
                      className="mb-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                    
                    {projects.length > 0 ? (
                      <div className="space-y-4">
                        {projects.map(item => renderProjectItem(item))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No projects added yet. Showcase your work by adding projects to your profile.
                      </p>
                    )}
                  </div>
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
                  <div className="pt-4 pb-2">
                    <Button 
                      onClick={() => openDialog('certificate', 'add')}
                      className="mb-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certificate
                    </Button>
                    
                    {certificates.length > 0 ? (
                      <div className="space-y-4">
                        {certificates.map(item => renderCertificateItem(item))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No certificates added yet. Add your certifications to highlight your skills and qualifications.
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </main>
      
      {/* Dialogs for adding/editing items */}
      <Dialog open={!!dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogOpen?.action === 'add' ? 'Add' : 'Edit'} {' '}
              {dialogOpen?.type === 'work_experience' && 'Work Experience'}
              {dialogOpen?.type === 'education' && 'Education'}
              {dialogOpen?.type === 'project' && 'Project'}
              {dialogOpen?.type === 'certificate' && 'Certificate'}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="pr-4">
            {dialogOpen?.type === 'work_experience' && renderWorkExperienceForm()}
            {dialogOpen?.type === 'education' && renderEducationForm()}
            {dialogOpen?.type === 'project' && renderProjectForm()}
            {dialogOpen?.type === 'certificate' && renderCertificateForm()}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExtendedProfile;
