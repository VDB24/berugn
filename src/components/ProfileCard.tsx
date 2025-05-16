
import { useState, useRef, useEffect } from 'react';
import { type Profile } from '@/context/ProfileContext';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Star, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileCode,
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

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

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  onSuperConnect?: () => void;
  isActive?: boolean;
  showFullProfile?: boolean;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' }).format(date);
};

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onSwipe, 
  onSuperConnect,
  isActive = true,
  showFullProfile = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [swipeIndicator, setSwipeIndicator] = useState<'left' | 'right' | null>(null);
  const [isExpanded, setIsExpanded] = useState(showFullProfile);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch additional profile data if expanded
  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!profile.userId || !isExpanded) return;
      
      setLoading(true);
      try {
        // Fetch work experience
        const { data: workData, error: workError } = await supabase
          .from('work_experience')
          .select('*')
          .eq('user_id', profile.userId)
          .order('current', { ascending: false })
          .order('end_date', { ascending: false });
        
        if (workError) throw workError;
        setWorkExperience(workData || []);
        
        // Fetch education
        const { data: eduData, error: eduError } = await supabase
          .from('education')
          .select('*')
          .eq('user_id', profile.userId)
          .order('end_date', { ascending: false });
        
        if (eduError) throw eduError;
        setEducation(eduData || []);
        
        // Fetch projects
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', profile.userId)
          .order('current', { ascending: false })
          .order('end_date', { ascending: false });
        
        if (projectError) throw projectError;
        setProjects(projectData || []);
        
        // Fetch certificates
        const { data: certData, error: certError } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', profile.userId);
        
        if (certError) throw certError;
        setCertificates(certData || []);
        
      } catch (error) {
        console.error('Error fetching profile details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileDetails();
  }, [isExpanded, profile.userId]);

  // Handle left swipe button click
  const handleLeftClick = () => {
    if (!isActive) return;
    
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(-100%) rotate(-12deg)';
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease-out';
    }
    
    setTimeout(() => {
      onSwipe('left');
      // Reset card style for next profile
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(0) rotate(0)';
        cardRef.current.style.opacity = '1';
      }
    }, 300);
  };

  // Handle right swipe button click
  const handleRightClick = () => {
    if (!isActive) return;
    
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(100%) rotate(12deg)';
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease-out';
    }
    
    setTimeout(() => {
      onSwipe('right');
      // Reset card style for next profile
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(0) rotate(0)';
        cardRef.current.style.opacity = '1';
      }
    }, 300);
  };

  // Handle super connect button click
  const handleSuperConnectClick = () => {
    if (!isActive || !onSuperConnect) return;
    onSuperConnect();
  };

  return (
    <div className="card-swipe-container w-full max-w-sm mx-auto">
      <div
        ref={cardRef}
        className="card-shadow bg-white dark:bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl"
      >
        {/* Swipe indicators */}
        {swipeIndicator === 'left' && (
          <div className="absolute left-4 top-4 z-10 bg-destructive text-white font-bold py-1 px-3 rounded-full transform -rotate-12 animate-pulse border-2 border-white">
            PASS
          </div>
        )}
        {swipeIndicator === 'right' && (
          <div className="absolute right-4 top-4 z-10 bg-success text-white font-bold py-1 px-3 rounded-full transform rotate-12 animate-pulse border-2 border-white">
            CONNECT
          </div>
        )}

        {/* Profile image */}
        <div className="relative h-72 w-full bg-gray-100 overflow-hidden">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
              className="h-full w-full object-cover transform transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <span className="text-2xl font-bold text-muted-foreground">
                {profile.name.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Berugn branding watermark */}
          <div className="absolute bottom-2 right-2 text-xs font-semibold bg-black/20 text-white px-2 py-1 rounded-full backdrop-blur-sm">
            Berugn
          </div>
        </div>

        {/* Profile info */}
        <div className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold hover-lift">{profile.name}</h2>
            {profile.linkedInUrl && (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors hover:scale-110 transform transition-transform"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>

          <p className="text-muted-foreground mb-3">
            {profile.jobTitle}{profile.company ? ` at ${profile.company}` : ''}
          </p>

          <div className="mb-4">
            <Badge variant="outline" className="mr-2 mb-2 hover-lift">
              {profile.industry}
            </Badge>
            <Badge variant="outline" className="mr-2 mb-2 hover-lift">
              {profile.experience}
            </Badge>
          </div>

          <div className="mb-4 flex flex-wrap gap-1">
            {profile.skills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="mr-1 mb-1 hover-lift">
                {skill.name}
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>

          {/* Expand/collapse button */}
          <Button 
            variant="ghost"
            size="sm"
            className="w-full mt-4 flex items-center justify-center"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Expanded profile information */}
          {isExpanded && (
            <div className="mt-4 space-y-6 animate-in fade-in duration-300">
              {loading ? (
                <div className="py-8 text-center text-muted-foreground">
                  <div className="animate-pulse">Loading profile details...</div>
                </div>
              ) : (
                <>
                  {/* Work Experience Section */}
                  {workExperience.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">Work Experience</h3>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        {workExperience.map((work) => (
                          <div key={work.id} className="space-y-1">
                            <h4 className="font-medium">{work.position}</h4>
                            <p className="text-sm">{work.company}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                              <p className="text-xs mt-1 text-muted-foreground">{work.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Section */}
                  {education.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">Education</h3>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        {education.map((edu) => (
                          <div key={edu.id} className="space-y-1">
                            <h4 className="font-medium">{edu.institution}</h4>
                            <p className="text-sm">{edu.degree}{edu.field_of_study ? `, ${edu.field_of_study}` : ''}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                              </span>
                            </div>
                            {edu.description && (
                              <p className="text-xs mt-1 text-muted-foreground">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects Section */}
                  {projects.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileCode className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">Projects</h3>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <div key={project.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{project.title}</h4>
                              {project.url && (
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {formatDate(project.start_date)} - {project.current ? 'Present' : formatDate(project.end_date)}
                              </span>
                            </div>
                            {project.image_url && (
                              <div className="h-28 w-full overflow-hidden rounded-md">
                                <img 
                                  src={project.image_url} 
                                  alt={project.title} 
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            {project.description && (
                              <p className="text-xs mt-1 text-muted-foreground">{project.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certificates Section */}
                  {certificates.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">Certificates</h3>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        {certificates.map((cert) => (
                          <div key={cert.id} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{cert.name}</h4>
                              {cert.credential_url && (
                                <a
                                  href={cert.credential_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                            <p className="text-sm">{cert.issuing_organization}</p>
                            {cert.issue_date && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  Issued {formatDate(cert.issue_date)}
                                  {cert.expiration_date && ` • Expires ${formatDate(cert.expiration_date)}`}
                                </span>
                              </div>
                            )}
                            {cert.credential_id && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Credential ID: {cert.credential_id}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No data message */}
                  {workExperience.length === 0 && 
                   education.length === 0 && 
                   projects.length === 0 && 
                   certificates.length === 0 && (
                    <div className="py-4 text-center text-muted-foreground">
                      <p>No additional profile information available</p>
                      <Button 
                        variant="link" 
                        className="text-primary mt-2"
                        onClick={() => window.open('/extended-profile', '_blank')}
                      >
                        Add details to your own profile
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {isActive && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handleLeftClick}
            className="h-14 w-14 flex items-center justify-center rounded-full bg-destructive/10 text-destructive transition-all duration-300 hover:scale-110 hover:bg-destructive/20 active:scale-95"
            aria-label="Pass"
          >
            <XCircle size={30} />
          </button>

          {onSuperConnect && (
            <button
              onClick={handleSuperConnectClick}
              className="h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary transition-all duration-300 hover:scale-110 hover:bg-secondary/20 active:scale-95"
              aria-label="Super Connect"
            >
              <Star size={26} />
            </button>
          )}

          <button
            onClick={handleRightClick}
            className="h-14 w-14 flex items-center justify-center rounded-full bg-success/10 text-success transition-all duration-300 hover:scale-110 hover:bg-success/20 active:scale-95"
            aria-label="Connect"
          >
            <CheckCircle size={30} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
