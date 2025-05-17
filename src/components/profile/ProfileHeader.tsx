
import { User, ExternalLink } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export interface ProfileData {
  name: string;
  job_title: string | null;
  company: string | null;
  bio: string | null;
  linkedin_url: string | null;
  profile_image: string | null;
  experience: string | null;
  industry: string | null;
  skills: string[];
}

interface ProfileHeaderProps {
  profileData: ProfileData | null;
  completionPercentage: number;
}

const ProfileHeader = ({ profileData, completionPercentage }: ProfileHeaderProps) => {
  return (
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
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
