
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  GraduationCap, 
  FileCode, 
  Award, 
  Calendar, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schemas
const workExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional()
});

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional()
});

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  current: z.boolean().default(false),
  url: z.string().optional(),
  image_url: z.string().optional()
});

const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuing_organization: z.string().min(1, "Issuing organization is required"),
  issue_date: z.string().optional(),
  expiration_date: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().optional()
});

type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>;
type EducationFormValues = z.infer<typeof educationSchema>;
type ProjectFormValues = z.infer<typeof projectSchema>;
type CertificateFormValues = z.infer<typeof certificateSchema>;

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  description?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
  url?: string;
  image_url?: string;
}

interface Certificate {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date?: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
}

// Format date for display
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
};

const ExtendedProfile = () => {
  const { currentUser } = useAuth();
  const { userProfile } = useProfile();
  const { toast } = useToast();
  
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  
  // Initialize forms
  const workForm = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: ''
    }
  });
  
  const educationForm = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      description: ''
    }
  });
  
  const projectForm = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      current: false,
      url: '',
      image_url: ''
    }
  });
  
  const certificateForm = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiration_date: '',
      credential_id: '',
      credential_url: ''
    }
  });
  
  // Reset form when dialog changes
  useEffect(() => {
    if (!activeDialog) return;
    
    workForm.reset();
    educationForm.reset();
    projectForm.reset();
    certificateForm.reset();
    
    if (itemToEdit) {
      if (activeDialog === 'work') {
        workForm.reset({
          company: itemToEdit.company || '',
          position: itemToEdit.position || '',
          location: itemToEdit.location || '',
          start_date: itemToEdit.start_date || '',
          end_date: itemToEdit.end_date || '',
          current: itemToEdit.current || false,
          description: itemToEdit.description || ''
        });
      } else if (activeDialog === 'education') {
        educationForm.reset({
          institution: itemToEdit.institution || '',
          degree: itemToEdit.degree || '',
          field_of_study: itemToEdit.field_of_study || '',
          start_date: itemToEdit.start_date || '',
          end_date: itemToEdit.end_date || '',
          description: itemToEdit.description || ''
        });
      } else if (activeDialog === 'project') {
        projectForm.reset({
          title: itemToEdit.title || '',
          description: itemToEdit.description || '',
          start_date: itemToEdit.start_date || '',
          end_date: itemToEdit.end_date || '',
          current: itemToEdit.current || false,
          url: itemToEdit.url || '',
          image_url: itemToEdit.image_url || ''
        });
      } else if (activeDialog === 'certificate') {
        certificateForm.reset({
          name: itemToEdit.name || '',
          issuing_organization: itemToEdit.issuing_organization || '',
          issue_date: itemToEdit.issue_date || '',
          expiration_date: itemToEdit.expiration_date || '',
          credential_id: itemToEdit.credential_id || '',
          credential_url: itemToEdit.credential_url || ''
        });
      }
    }
  }, [activeDialog, itemToEdit]);
  
  // Load user's profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        // Fetch work experience
        const { data: workData, error: workError } = await supabase
          .from('work_experience')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('current', { ascending: false })
          .order('end_date', { ascending: false });
        
        if (workError) throw workError;
        setWorkExperiences(workData || []);
        
        // Fetch education
        const { data: eduData, error: eduError } = await supabase
          .from('education')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('end_date', { ascending: false });
        
        if (eduError) throw eduError;
        setEducations(eduData || []);
        
        // Fetch projects
        const { data: projData, error: projError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('current', { ascending: false })
          .order('end_date', { ascending: false });
        
        if (projError) throw projError;
        setProjects(projData || []);
        
        // Fetch certificates
        const { data: certData, error: certError } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', currentUser.id);
        
        if (certError) throw certError;
        setCertificates(certData || []);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [currentUser]);
  
  // Handle form submissions
  const handleWorkSubmit = async (data: WorkExperienceFormValues) => {
    if (!currentUser) return;
    
    try {
      if (itemToEdit) {
        // Update existing work experience
        const { error } = await supabase
          .from('work_experience')
          .update(data)
          .eq('id', itemToEdit.id);
          
        if (error) throw error;
        
        setWorkExperiences(prev => 
          prev.map(item => item.id === itemToEdit.id ? { ...item, ...data } : item)
        );
        
        toast({
          title: 'Success',
          description: 'Work experience updated successfully',
        });
      } else {
        // Add new work experience
        const { data: newData, error } = await supabase
          .from('work_experience')
          .insert({
            ...data,
            user_id: currentUser.id
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setWorkExperiences(prev => [...prev, newData]);
        
        toast({
          title: 'Success',
          description: 'Work experience added successfully',
        });
      }
      
      setActiveDialog(null);
    } catch (error) {
      console.error('Error saving work experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to save work experience. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleEducationSubmit = async (data: EducationFormValues) => {
    if (!currentUser) return;
    
    try {
      if (itemToEdit) {
        // Update existing education
        const { error } = await supabase
          .from('education')
          .update(data)
          .eq('id', itemToEdit.id);
          
        if (error) throw error;
        
        setEducations(prev => 
          prev.map(item => item.id === itemToEdit.id ? { ...item, ...data } : item)
        );
        
        toast({
          title: 'Success',
          description: 'Education updated successfully',
        });
      } else {
        // Add new education
        const { data: newData, error } = await supabase
          .from('education')
          .insert({
            ...data,
            user_id: currentUser.id
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setEducations(prev => [...prev, newData]);
        
        toast({
          title: 'Success',
          description: 'Education added successfully',
        });
      }
      
      setActiveDialog(null);
    } catch (error) {
      console.error('Error saving education:', error);
      toast({
        title: 'Error',
        description: 'Failed to save education. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleProjectSubmit = async (data: ProjectFormValues) => {
    if (!currentUser) return;
    
    try {
      if (itemToEdit) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', itemToEdit.id);
          
        if (error) throw error;
        
        setProjects(prev => 
          prev.map(item => item.id === itemToEdit.id ? { ...item, ...data } : item)
        );
        
        toast({
          title: 'Success',
          description: 'Project updated successfully',
        });
      } else {
        // Add new project
        const { data: newData, error } = await supabase
          .from('projects')
          .insert({
            ...data,
            user_id: currentUser.id
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setProjects(prev => [...prev, newData]);
        
        toast({
          title: 'Success',
          description: 'Project added successfully',
        });
      }
      
      setActiveDialog(null);
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleCertificateSubmit = async (data: CertificateFormValues) => {
    if (!currentUser) return;
    
    try {
      if (itemToEdit) {
        // Update existing certificate
        const { error } = await supabase
          .from('certificates')
          .update(data)
          .eq('id', itemToEdit.id);
          
        if (error) throw error;
        
        setCertificates(prev => 
          prev.map(item => item.id === itemToEdit.id ? { ...item, ...data } : item)
        );
        
        toast({
          title: 'Success',
          description: 'Certificate updated successfully',
        });
      } else {
        // Add new certificate
        const { data: newData, error } = await supabase
          .from('certificates')
          .insert({
            ...data,
            user_id: currentUser.id
          })
          .select()
          .single();
          
        if (error) throw error;
        
        setCertificates(prev => [...prev, newData]);
        
        toast({
          title: 'Success',
          description: 'Certificate added successfully',
        });
      }
      
      setActiveDialog(null);
    } catch (error) {
      console.error('Error saving certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to save certificate. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle item deletion
  const handleDelete = async (type: string, id: string) => {
    try {
      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      switch (type) {
        case 'work_experience':
          setWorkExperiences(prev => prev.filter(item => item.id !== id));
          break;
        case 'education':
          setEducations(prev => prev.filter(item => item.id !== id));
          break;
        case 'projects':
          setProjects(prev => prev.filter(item => item.id !== id));
          break;
        case 'certificates':
          setCertificates(prev => prev.filter(item => item.id !== id));
          break;
      }
      
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Reset when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setActiveDialog(null);
      setItemToEdit(null);
    }
  };
  
  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-4xl px-4 py-12 mt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Professional Profile</h1>
          <p className="text-muted-foreground">
            Complete your professional profile to stand out to potential connections
          </p>
        </div>
        
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading your profile...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Basic Info */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                  <span className="font-medium w-32">Name:</span>
                  <span>{userProfile?.name || 'Not specified'}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                  <span className="font-medium w-32">Job Title:</span>
                  <span>{userProfile?.jobTitle || 'Not specified'}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                  <span className="font-medium w-32">Company:</span>
                  <span>{userProfile?.company || 'Not specified'}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                  <span className="font-medium w-32">Industry:</span>
                  <span>{userProfile?.industry || 'Not specified'}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
                  <span className="font-medium w-32">Bio:</span>
                  <span className="flex-1">{userProfile?.bio || 'Not specified'}</span>
                </div>
              </div>
              
              <Button variant="outline" className="mt-6" onClick={() => {
                window.location.href = "/create-profile?edit=true";
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Basic Info
              </Button>
            </Card>
            
            {/* Work Experience */}
            <Accordion type="single" collapsible defaultValue="work" className="w-full">
              <AccordionItem value="work">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Work Experience</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-6">
                    {workExperiences.length > 0 ? (
                      <div className="space-y-6">
                        {workExperiences.map((work) => (
                          <div key={work.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{work.position}</h3>
                                <p className="text-muted-foreground">{work.company}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {formatDate(work.start_date)} - {work.current ? 'Present' : formatDate(work.end_date)}
                                  </span>
                                  {work.location && (
                                    <>
                                      <span>•</span>
                                      <MapPin className="h-3 w-3" />
                                      <span>{work.location}</span>
                                    </>
                                  )}
                                </div>
                                {work.description && (
                                  <p className="text-sm mt-2">{work.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setItemToEdit(work);
                                    setActiveDialog('work');
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete('work_experience', work.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">No work experience added yet</p>
                      </div>
                    )}
                    
                    <Dialog open={activeDialog === 'work'} onOpenChange={handleDialogChange}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-4" onClick={() => {
                          setItemToEdit(null);
                          setActiveDialog('work');
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Work Experience
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{itemToEdit ? 'Edit' : 'Add'} Work Experience</DialogTitle>
                          <DialogDescription>
                            Enter the details about your work experience
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...workForm}>
                          <form onSubmit={workForm.handleSubmit(handleWorkSubmit)} className="space-y-4">
                            <FormField
                              control={workForm.control}
                              name="company"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Company name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={workForm.control}
                              name="position"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Position*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Job title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={workForm.control}
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
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={workForm.control}
                                name="start_date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={workForm.control}
                                name="end_date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="date" 
                                        {...field} 
                                        disabled={workForm.watch('current')}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={workForm.control}
                              name="current"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>I currently work here</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={workForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Describe your role and responsibilities"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <Button type="submit">Save</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              
              {/* Education */}
              <AccordionItem value="education">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Education</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-6">
                    {educations.length > 0 ? (
                      <div className="space-y-6">
                        {educations.map((education) => (
                          <div key={education.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">{education.institution}</h3>
                                <p className="text-muted-foreground">
                                  {education.degree}{education.field_of_study ? `, ${education.field_of_study}` : ''}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {formatDate(education.start_date)} - {formatDate(education.end_date)}
                                  </span>
                                </div>
                                {education.description && (
                                  <p className="text-sm mt-2">{education.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setItemToEdit(education);
                                    setActiveDialog('education');
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete('education', education.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">No education added yet</p>
                      </div>
                    )}
                    
                    <Dialog open={activeDialog === 'education'} onOpenChange={handleDialogChange}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-4" onClick={() => {
                          setItemToEdit(null);
                          setActiveDialog('education');
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Education
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{itemToEdit ? 'Edit' : 'Add'} Education</DialogTitle>
                          <DialogDescription>
                            Enter the details about your education
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...educationForm}>
                          <form onSubmit={educationForm.handleSubmit(handleEducationSubmit)} className="space-y-4">
                            <FormField
                              control={educationForm.control}
                              name="institution"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Institution*</FormLabel>
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
                                  <FormLabel>Degree*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Bachelor's" {...field} />
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
                                    <Input placeholder="e.g. Computer Science" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={educationForm.control}
                                name="start_date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={educationForm.control}
                                name="end_date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
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
                                      placeholder="Any additional details about your education"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <Button type="submit">Save</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              
              {/* Projects */}
              <AccordionItem value="projects">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-3">
                    <FileCode className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Projects</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-6">
                    {projects.length > 0 ? (
                      <div className="space-y-6">
                        {projects.map((project) => (
                          <div key={project.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                            <div className="flex justify-between items-start">
                              <div className="w-full pr-8">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-lg">{project.title}</h3>
                                  {project.url && (
                                    <a
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:text-primary/80 transition-colors"
                                    >
                                      <ExternalLink size={16} />
                                    </a>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {formatDate(project.start_date)} - {project.current ? 'Present' : formatDate(project.end_date)}
                                  </span>
                                </div>
                                
                                {project.image_url && (
                                  <div className="h-40 w-full mt-2 overflow-hidden rounded-md">
                                    <img 
                                      src={project.image_url} 
                                      alt={project.title} 
                                      className="h-full w-full object-cover"
                                      loading="lazy"
                                    />
                                  </div>
                                )}
                                
                                {project.description && (
                                  <p className="text-sm mt-2">{project.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setItemToEdit(project);
                                    setActiveDialog('project');
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete('projects', project.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">No projects added yet</p>
                      </div>
                    )}
                    
                    <Dialog open={activeDialog === 'project'} onOpenChange={handleDialogChange}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-4" onClick={() => {
                          setItemToEdit(null);
                          setActiveDialog('project');
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{itemToEdit ? 'Edit' : 'Add'} Project</DialogTitle>
                          <DialogDescription>
                            Enter the details about your project
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...projectForm}>
                          <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="space-y-4">
                            <FormField
                              control={projectForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Project name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={projectForm.control}
                                name="start_date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={projectForm.control}
                                name="end_date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="date" 
                                        {...field} 
                                        disabled={projectForm.watch('current')}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={projectForm.control}
                              name="current"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>This is an ongoing project</FormLabel>
                                  </div>
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
                                  <FormDescription>
                                    Add a screenshot or cover image for your project
                                  </FormDescription>
                                  <FormMessage />
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
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <Button type="submit">Save</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              
              {/* Certificates */}
              <AccordionItem value="certificates">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Certificates</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card className="p-6">
                    {certificates.length > 0 ? (
                      <div className="space-y-6">
                        {certificates.map((certificate) => (
                          <div key={certificate.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-lg">{certificate.name}</h3>
                                  {certificate.credential_url && (
                                    <a
                                      href={certificate.credential_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:text-primary/80 transition-colors"
                                    >
                                      <ExternalLink size={16} />
                                    </a>
                                  )}
                                </div>
                                <p className="text-muted-foreground">{certificate.issuing_organization}</p>
                                
                                {certificate.issue_date && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      Issued {formatDate(certificate.issue_date)}
                                      {certificate.expiration_date && ` • Expires ${formatDate(certificate.expiration_date)}`}
                                    </span>
                                  </div>
                                )}
                                
                                {certificate.credential_id && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Credential ID: {certificate.credential_id}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setItemToEdit(certificate);
                                    setActiveDialog('certificate');
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDelete('certificates', certificate.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">No certificates added yet</p>
                      </div>
                    )}
                    
                    <Dialog open={activeDialog === 'certificate'} onOpenChange={handleDialogChange}>
                      <DialogTrigger asChild>
                        <Button className="w-full mt-4" onClick={() => {
                          setItemToEdit(null);
                          setActiveDialog('certificate');
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Certificate
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{itemToEdit ? 'Edit' : 'Add'} Certificate</DialogTitle>
                          <DialogDescription>
                            Enter the details about your certificate
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...certificateForm}>
                          <form onSubmit={certificateForm.handleSubmit(handleCertificateSubmit)} className="space-y-4">
                            <FormField
                              control={certificateForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Certificate Name*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. AWS Certified Developer" {...field} />
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
                                  <FormLabel>Issuing Organization*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Amazon Web Services" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={certificateForm.control}
                                name="issue_date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Issue Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={certificateForm.control}
                                name="expiration_date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiration Date</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
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
                                    <Input placeholder="e.g. ABC123XYZ" {...field} />
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
                              <Button type="submit">Save</Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExtendedProfile;
